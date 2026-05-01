using SocialGraph.Application.Contracts;
using SocialGraph.Application.Ports;

namespace SocialGraph.Application.Services;

public sealed class QaModelAValidationReportService
{
    private const decimal AcknowledgementThresholdPercent = 95m;
    private const decimal CompletionThresholdPercent = 90m;
    private const decimal MedianReviewThresholdHours = 8m;
    private const decimal MedianLeadTimeFailCeilingHours = 66m;

    private readonly IQaModelAValidationReportSource _source;

    public QaModelAValidationReportService(IQaModelAValidationReportSource source)
    {
        _source = source;
    }

    public async Task<QaModelAValidationReportDto> GetAsync(CancellationToken cancellationToken)
    {
        var document = await _source.GetAsync(cancellationToken);
        var dataQualityConcerns = new List<string>();
        var instrumentationConcerns = new List<string>();
        if (document.MissingFields is { Count: > 0 })
        {
            instrumentationConcerns.Add($"Missing required fields: {string.Join(", ", document.MissingFields)}");
        }

        var requiredFieldsSignOffComplete = string.Equals(
            document.RequiredFieldsSignOffStatus,
            "complete",
            StringComparison.OrdinalIgnoreCase);
        if (!requiredFieldsSignOffComplete ||
            string.IsNullOrWhiteSpace(document.RequiredFieldsSignOffBy) ||
            document.RequiredFieldsSignOffAt is null)
        {
            instrumentationConcerns.Add("Required-fields sign-off is missing or incomplete.");
        }

        dataQualityConcerns.AddRange(instrumentationConcerns);

        if (document.ObservationWindowEnd is null)
        {
            dataQualityConcerns.Add("Observation window end date is missing.");
        }
        else if (document.ObservationWindowEnd.Value < document.EarliestCheckpointDate)
        {
            dataQualityConcerns.Add(
                $"Observation window is incomplete through {document.ObservationWindowEnd:yyyy-MM-dd}; earliest checkpoint date is {document.EarliestCheckpointDate:yyyy-MM-dd}.");
        }

        var metrics = new List<QaModelAValidationMetricDto>();
        var hardGateBreaches = new List<string>();

        var acknowledgement = EvaluatePercentMetric(
            key: "qa_acknowledgement_sla_attainment",
            label: "QA acknowledgement SLA attainment",
            baseline: ">=95%",
            value: document.AcknowledgementSlaPercent,
            threshold: AcknowledgementThresholdPercent,
            numerator: document.AcknowledgementMetCount,
            denominator: document.AcknowledgementSampleCount,
            hardGateBreaches,
            breachLabel: "QA acknowledgement SLA below 95%");
        metrics.Add(acknowledgement);

        var completion = EvaluatePercentMetric(
            key: "qa_completion_sla_attainment",
            label: "QA completion SLA attainment",
            baseline: ">=90%",
            value: document.CompletionSlaPercent,
            threshold: CompletionThresholdPercent,
            numerator: document.CompletionMetCount,
            denominator: document.CompletionSampleCount,
            hardGateBreaches,
            breachLabel: "QA completion SLA below 90%");
        metrics.Add(completion);

        var turnaround = EvaluateMaxMetric(
            key: "median_review_turnaround",
            label: "Median review turnaround",
            baseline: "<=8 business hours",
            value: document.MedianReviewBusinessHours,
            threshold: MedianReviewThresholdHours,
            unit: "business hours",
            hardGateBreaches,
            breachLabel: "Median review turnaround exceeded 8 business hours");
        metrics.Add(turnaround);

        var escapedDefects = EvaluateTrendMetric(
            key: "escaped_defects_trend_vs_prior_30d",
            label: "Escaped defects trend vs prior 30d",
            baseline: "current <= prior",
            current: document.EscapedDefectsCurrent30DayCount,
            prior: document.EscapedDefectsPrior30DayCount,
            hardGateBreaches,
            breachLabel: "Escaped defects trend worsened versus prior 30 days");
        metrics.Add(escapedDefects);

        var leadTime = EvaluateMaxMetric(
            key: "delivery_lead_time_impact",
            label: "Delivery lead-time impact",
            baseline: "<=66h median (60h frozen baseline)",
            value: document.MedianDeliveryLeadTimeHours,
            threshold: MedianLeadTimeFailCeilingHours,
            unit: "hours",
            hardGateBreaches,
            breachLabel: "Median delivery lead time exceeded 66 hours");
        metrics.Add(leadTime);

        var instrumentationStatus = instrumentationConcerns.Count == 0 ? "PASS" : "NO_READOUT";
        var signOffEvidence = requiredFieldsSignOffComplete &&
                              !string.IsNullOrWhiteSpace(document.RequiredFieldsSignOffBy) &&
                              document.RequiredFieldsSignOffAt is not null
            ? $" Required-fields sign-off: {document.RequiredFieldsSignOffBy} at {document.RequiredFieldsSignOffAt:yyyy-MM-ddTHH:mm:sszzz}."
            : string.Empty;
        var signOffNote = string.IsNullOrWhiteSpace(document.RequiredFieldsSignOffNote)
            ? string.Empty
            : $" {document.RequiredFieldsSignOffNote}";
        metrics.Add(new QaModelAValidationMetricDto(
            "instrumentation_completeness",
            "Instrumentation completeness",
            "all required fields present",
            instrumentationStatus == "PASS" ? "All required fields present" : "Material gaps detected",
            instrumentationStatus,
            instrumentationConcerns.Count == 0
                ? $"Required checkpoint fields are present for the measured window.{signOffEvidence}{signOffNote}".Trim()
                : string.Join(" ", instrumentationConcerns)));

        var overallStatus = dataQualityConcerns.Count > 0
            ? "NO_READOUT"
            : hardGateBreaches.Count > 0
                ? "FAIL"
                : "PASS";

        var recommendedDecision = overallStatus switch
        {
            "PASS" => "continue model A",
            "FAIL" => "transition to option C",
            _ => "no readout - evidence incomplete"
        };

        var summary = overallStatus switch
        {
            "PASS" => "Checkpoint thresholds are satisfied and the report is complete.",
            "FAIL" => "At least one hard-gate KPI breached the checkpoint threshold.",
            _ => "Checkpoint evidence is incomplete; do not make a keep-vs-replace decision yet."
        };
        var explanation = BuildExplanation(overallStatus, hardGateBreaches, dataQualityConcerns);

        return new QaModelAValidationReportDto(
            overallStatus,
            recommendedDecision,
            explanation,
            document.MetricSourceIssue,
            "/api/cto/weekly-monitor/qa-model-a-validation",
            document.ObservationWindowStart,
            document.ObservationWindowEnd,
            document.EarliestCheckpointDate,
            document.PreparedAt,
            summary,
            metrics,
            hardGateBreaches,
            dataQualityConcerns,
            document.EvidenceNote);
    }

    private static string BuildExplanation(
        string overallStatus,
        IReadOnlyCollection<string> hardGateBreaches,
        IReadOnlyCollection<string> dataQualityConcerns)
    {
        return overallStatus switch
        {
            "PASS" => "All checkpoint thresholds passed and no data-quality blockers remain.",
            "FAIL" => $"Checkpoint failed because {JoinClauses(hardGateBreaches)}.",
            _ => $"Checkpoint cannot be scored yet because {JoinClauses(dataQualityConcerns)}."
        };
    }

    private static string JoinClauses(IReadOnlyCollection<string> clauses)
    {
        if (clauses.Count == 0)
        {
            return "required rationale details were not captured";
        }

        return string.Join("; ", clauses.Select(static clause => clause.TrimEnd('.', ';')));
    }

    private static QaModelAValidationMetricDto EvaluatePercentMetric(
        string key,
        string label,
        string baseline,
        decimal? value,
        decimal threshold,
        int? numerator,
        int? denominator,
        ICollection<string> hardGateBreaches,
        string breachLabel)
    {
        if (value is null)
        {
            return new QaModelAValidationMetricDto(
                key,
                label,
                baseline,
                "Unavailable",
                "NO_READOUT",
                "Metric value is not present in the source report.");
        }

        var status = value >= threshold ? "PASS" : "FAIL";
        if (status == "FAIL")
        {
            hardGateBreaches.Add(breachLabel);
        }

        var evidenceNote = numerator is not null && denominator is not null
            ? $"{numerator}/{denominator} requests met the SLA."
            : "Denominator details were not supplied.";

        return new QaModelAValidationMetricDto(
            key,
            label,
            baseline,
            $"{value:0.##}%",
            status,
            evidenceNote);
    }

    private static QaModelAValidationMetricDto EvaluateMaxMetric(
        string key,
        string label,
        string baseline,
        decimal? value,
        decimal threshold,
        string unit,
        ICollection<string> hardGateBreaches,
        string breachLabel)
    {
        if (value is null)
        {
            return new QaModelAValidationMetricDto(
                key,
                label,
                baseline,
                "Unavailable",
                "NO_READOUT",
                "Metric value is not present in the source report.");
        }

        var status = value <= threshold ? "PASS" : "FAIL";
        if (status == "FAIL")
        {
            hardGateBreaches.Add(breachLabel);
        }

        return new QaModelAValidationMetricDto(
            key,
            label,
            baseline,
            $"{value:0.##} {unit}",
            status,
            $"Measured median {label.ToLowerInvariant()} is {value:0.##} {unit}.");
    }

    private static QaModelAValidationMetricDto EvaluateTrendMetric(
        string key,
        string label,
        string baseline,
        int? current,
        int? prior,
        ICollection<string> hardGateBreaches,
        string breachLabel)
    {
        if (current is null || prior is null)
        {
            return new QaModelAValidationMetricDto(
                key,
                label,
                baseline,
                "Unavailable",
                "NO_READOUT",
                "Current or prior escaped-defect counts are missing.");
        }

        var status = current <= prior ? "PASS" : "FAIL";
        if (status == "FAIL")
        {
            hardGateBreaches.Add(breachLabel);
        }

        return new QaModelAValidationMetricDto(
            key,
            label,
            baseline,
            $"current={current}, prior={prior}",
            status,
            "Trend gate compares current escaped defects against the prior 30-day count without normalization.");
    }
}
