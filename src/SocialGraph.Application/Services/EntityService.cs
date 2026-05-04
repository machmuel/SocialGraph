using SocialGraph.Application.Contracts;
using SocialGraph.Application.Ports;
using SocialGraph.Domain.Entities;

namespace SocialGraph.Application.Services;

public sealed class EntityService(IEntityRepository repository)
{
    public async Task<IReadOnlyList<EntityDto>> ListAsync(string? query, CancellationToken cancellationToken)
    {
        var records = await repository.ListAsync(query, cancellationToken);
        return records.Select(ToDto).ToArray();
    }

    public async Task<EntityDto?> GetAsync(string id, CancellationToken cancellationToken)
    {
        var record = await repository.GetAsync(id, cancellationToken);
        return record is null ? null : ToDto(record);
    }

    public async Task<(EntityDto? Entity, string? Error)> CreateAsync(
        UpsertEntityRequest request,
        string currentUserId,
        CancellationToken cancellationToken)
    {
        var error = Validate(request, currentUserId);
        if (error is not null)
        {
            return (null, error);
        }

        var type = request.Type.Trim().ToLowerInvariant();
        var ownerUserId = type == GraphTaxonomy.Employee ? currentUserId.Trim() : string.Empty;
        var record = await repository.CreateAsync(
            request.Name.Trim(),
            request.Note.Trim(),
            type,
            ownerUserId,
            currentUserId.Trim(),
            cancellationToken);
        return (ToDto(record), null);
    }

    public async Task<(EntityDto? Entity, string? Error)> UpdateAsync(
        string id,
        UpsertEntityRequest request,
        string currentUserId,
        CancellationToken cancellationToken)
    {
        var error = Validate(request, currentUserId);
        if (error is not null)
        {
            return (null, error);
        }

        var existing = await repository.GetAsync(id, cancellationToken);
        if (existing is null)
        {
            return (null, null);
        }

        if (existing.Type == GraphTaxonomy.Employee &&
            !string.Equals(existing.OwnerUserId, currentUserId.Trim(), StringComparison.OrdinalIgnoreCase))
        {
            return (null, "forbidden:employee profile belongs to another user");
        }

        var type = request.Type.Trim().ToLowerInvariant();
        var ownerUserId = type == GraphTaxonomy.Employee ? currentUserId.Trim() : existing.OwnerUserId;
        var record = await repository.UpdateAsync(
            id,
            request.Name.Trim(),
            request.Note.Trim(),
            type,
            ownerUserId,
            string.IsNullOrWhiteSpace(existing.CreatedByUserId) ? currentUserId.Trim() : existing.CreatedByUserId,
            cancellationToken);
        return record is null ? (null, null) : (ToDto(record), null);
    }

    public async Task<(bool Deleted, string? Error)> DeleteAsync(string id, string currentUserId, CancellationToken cancellationToken)
    {
        var existing = await repository.GetAsync(id, cancellationToken);
        if (existing is null)
        {
            return (false, null);
        }

        if (existing.Type == GraphTaxonomy.Employee &&
            !string.Equals(existing.OwnerUserId, currentUserId.Trim(), StringComparison.OrdinalIgnoreCase))
        {
            return (false, "forbidden:employee profile belongs to another user");
        }

        if (existing.Type != GraphTaxonomy.Employee &&
            !string.IsNullOrWhiteSpace(existing.CreatedByUserId) &&
            !string.Equals(existing.CreatedByUserId, currentUserId.Trim(), StringComparison.OrdinalIgnoreCase))
        {
            return (false, "forbidden:entity was created by another user");
        }

        return (await repository.DeleteAsync(id, cancellationToken), null);
    }

    private static string? Validate(UpsertEntityRequest request, string currentUserId)
    {
        if (string.IsNullOrWhiteSpace(currentUserId))
        {
            return "validation:user is required";
        }

        if (string.IsNullOrWhiteSpace(request.Name))
        {
            return "validation:name is required";
        }

        if (string.IsNullOrWhiteSpace(request.Type))
        {
            return "validation:type is required";
        }

        return GraphTaxonomy.IsEntityTypeAllowed(request.Type.Trim())
            ? null
            : "validation:type is not allowed";
    }

    private static EntityDto ToDto(EntityRecord record) =>
        new(record.Id, record.Name, record.Note, record.Type, record.OwnerUserId, record.CreatedByUserId);
}
