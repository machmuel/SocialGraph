namespace SocialGraph.Application.Contracts;

public sealed record QaModelAValidationReportDto(
    string OverallStatus,
    string RecommendedDecision,
    string MetricSourceIssue,
    string MetricSourcePath,
    DateOnly ObservationWindowStart,
    DateOnly? ObservationWindowEnd,
    DateOnly EarliestCheckpointDate,
    DateTimeOffset GeneratedAt,
    string Summary,
    IReadOnlyList<QaModelAValidationMetricDto> Metrics,
    IReadOnlyList<string> HardGateBreaches,
    IReadOnlyList<string> DataQualityConcerns,
    string EvidenceNote);

public sealed record QaModelAValidationMetricDto(
    string Key,
    string Label,
    string Baseline,
    string Measured,
    string Status,
    string EvidenceNote);
