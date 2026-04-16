namespace SocialGraph.Application.Contracts;

public sealed record GraphSnapshotDto(
    IReadOnlyList<GraphNodeDto> Nodes,
    IReadOnlyList<GraphLinkDto> Links);
