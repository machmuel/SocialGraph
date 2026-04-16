namespace SocialGraph.Application.Contracts;

public sealed record RelationshipEdgeDto(
    string Id,
    string SourceEntityId,
    string TargetEntityId,
    string Kind,
    string Type,
    string Label,
    string Note);
