namespace SocialGraph.Application.Contracts;

public sealed record QaModelAValidationSourceDocument(
    string MetricSourceIssue,
    DateOnly ObservationWindowStart,
    DateOnly? ObservationWindowEnd,
    DateOnly EarliestCheckpointDate,
    DateTimeOffset PreparedAt,
    string EvidenceNote,
    string? RequiredFieldsSignOffStatus,
    string? RequiredFieldsSignOffBy,
    DateTimeOffset? RequiredFieldsSignOffAt,
    string? RequiredFieldsSignOffNote,
    decimal? AcknowledgementSlaPercent,
    int? AcknowledgementMetCount,
    int? AcknowledgementSampleCount,
    decimal? CompletionSlaPercent,
    int? CompletionMetCount,
    int? CompletionSampleCount,
    decimal? MedianReviewBusinessHours,
    decimal? MedianDeliveryLeadTimeHours,
    int? EscapedDefectsCurrent30DayCount,
    int? EscapedDefectsPrior30DayCount,
    IReadOnlyList<string>? MissingFields);
