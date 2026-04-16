using SocialGraph.Domain.Entities;

namespace SocialGraph.Application.Ports;

public interface IRelationshipEdgeRepository
{
    Task<IReadOnlyList<RelationshipEdgeRecord>> ListAsync(string? entityId, CancellationToken cancellationToken);

    Task<RelationshipEdgeRecord?> GetAsync(string id, CancellationToken cancellationToken);

    Task<RelationshipEdgeRecord> CreateAsync(
        string sourceEntityId,
        string targetEntityId,
        string kind,
        string note,
        CancellationToken cancellationToken);

    Task<RelationshipEdgeRecord?> UpdateAsync(
        string id,
        string sourceEntityId,
        string targetEntityId,
        string kind,
        string note,
        CancellationToken cancellationToken);

    Task<bool> ExistsAsync(
        string sourceEntityId,
        string targetEntityId,
        string kind,
        CancellationToken cancellationToken);

    Task<bool> DeleteAsync(string id, CancellationToken cancellationToken);
}
