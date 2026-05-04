using SocialGraph.Domain.Entities;

namespace SocialGraph.Application.Ports;

public interface IEntityRepository
{
    Task<IReadOnlyList<EntityRecord>> ListAsync(string? query, CancellationToken cancellationToken);

    Task<EntityRecord?> GetAsync(string id, CancellationToken cancellationToken);

    Task<EntityRecord> CreateAsync(
        string name,
        string note,
        string type,
        string ownerUserId,
        string createdByUserId,
        CancellationToken cancellationToken);

    Task<EntityRecord?> UpdateAsync(
        string id,
        string name,
        string note,
        string type,
        string ownerUserId,
        string createdByUserId,
        CancellationToken cancellationToken);

    Task<bool> DeleteAsync(string id, CancellationToken cancellationToken);
}
