namespace SocialGraph.Domain.Entities;

public sealed record EntityRecord(
    string Id,
    string Name,
    string Note,
    string Type,
    string OwnerUserId,
    string CreatedByUserId);
