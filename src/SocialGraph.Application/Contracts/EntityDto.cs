namespace SocialGraph.Application.Contracts;

public sealed record EntityDto(
    string Id,
    string Name,
    string Note,
    string Type,
    string OwnerUserId,
    string CreatedByUserId);
