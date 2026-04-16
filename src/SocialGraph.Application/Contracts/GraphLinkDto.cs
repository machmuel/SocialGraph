namespace SocialGraph.Application.Contracts;

public sealed record GraphLinkDto(
    string Id,
    string Source,
    string Target,
    string Kind,
    string Label,
    string Note);
