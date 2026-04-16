namespace SocialGraph.Domain.Entities;

public sealed record RelationshipEdgeRecord(
    string Id,
    string SourceEntityId,
    string TargetEntityId,
    string Kind,
    string Note);
