namespace SocialGraph.Application.Contracts;

public sealed class UpsertEntityRequest
{
    public string Name { get; init; } = string.Empty;

    public string Note { get; init; } = string.Empty;

    public string Type { get; init; } = string.Empty;
}
