using SocialGraph.Application.Contracts;
using SocialGraph.Application.Ports;
using SocialGraph.Domain.Entities;

namespace SocialGraph.Application.Services;

public sealed class GraphService(
    IEntityRepository entities,
    IRelationshipEdgeRepository relationshipEdges)
{
    public async Task<GraphSnapshotDto?> GetSnapshotAsync(string? entityId, CancellationToken cancellationToken)
    {
        var normalizedEntityId = entityId?.Trim();
        if (!string.IsNullOrWhiteSpace(normalizedEntityId) &&
            await entities.GetAsync(normalizedEntityId, cancellationToken) is null)
        {
            return null;
        }

        var allEntities = await entities.ListAsync(null, cancellationToken);
        var selectedEdges = await relationshipEdges.ListAsync(normalizedEntityId, cancellationToken);
        var includedEntityIds = BuildIncludedEntityIds(normalizedEntityId, selectedEdges, allEntities);

        var nodes = allEntities
            .Where(entity => includedEntityIds.Contains(entity.Id))
            .OrderBy(entity => entity.Name, StringComparer.OrdinalIgnoreCase)
            .Select(ToNodeDto)
            .ToArray();

        var links = selectedEdges
            .Where(edge => includedEntityIds.Contains(edge.SourceEntityId) &&
                           includedEntityIds.Contains(edge.TargetEntityId))
            .OrderBy(edge => edge.SourceEntityId, StringComparer.OrdinalIgnoreCase)
            .ThenBy(edge => edge.TargetEntityId, StringComparer.OrdinalIgnoreCase)
            .ThenBy(edge => edge.Kind, StringComparer.OrdinalIgnoreCase)
            .Select(ToLinkDto)
            .ToArray();

        return new GraphSnapshotDto(nodes, links);
    }

    private static HashSet<string> BuildIncludedEntityIds(
        string? entityId,
        IReadOnlyList<RelationshipEdgeRecord> selectedEdges,
        IReadOnlyList<EntityRecord> allEntities)
    {
        if (string.IsNullOrWhiteSpace(entityId))
        {
            return allEntities.Select(entity => entity.Id).ToHashSet(StringComparer.OrdinalIgnoreCase);
        }

        var ids = new HashSet<string>(StringComparer.OrdinalIgnoreCase) { entityId };
        foreach (var edge in selectedEdges)
        {
            ids.Add(edge.SourceEntityId);
            ids.Add(edge.TargetEntityId);
        }

        return ids;
    }

    private static GraphNodeDto ToNodeDto(EntityRecord entity) =>
        new(entity.Id, entity.Name, entity.Note);

    private static GraphLinkDto ToLinkDto(RelationshipEdgeRecord edge) =>
        new(edge.Id, edge.SourceEntityId, edge.TargetEntityId, edge.Kind, edge.Kind, edge.Note);
}
