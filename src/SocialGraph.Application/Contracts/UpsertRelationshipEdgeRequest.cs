namespace SocialGraph.Application.Contracts;

public sealed class UpsertRelationshipEdgeRequest
{
    public string SourceEntityId { get; init; } = string.Empty;

    public string TargetEntityId { get; init; } = string.Empty;

    public string? Kind { get; init; }

    public string? Type { get; init; }

    public string? Label { get; init; }

    public string Note { get; init; } = string.Empty;
}
