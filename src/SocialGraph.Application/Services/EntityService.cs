using SocialGraph.Application.Contracts;
using SocialGraph.Application.Ports;

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
        CancellationToken cancellationToken)
    {
        var error = Validate(request);
        if (error is not null)
        {
            return (null, error);
        }

        var record = await repository.CreateAsync(request.Name.Trim(), request.Note.Trim(), cancellationToken);
        return (ToDto(record), null);
    }

    public async Task<(EntityDto? Entity, string? Error)> UpdateAsync(
        string id,
        UpsertEntityRequest request,
        CancellationToken cancellationToken)
    {
        var error = Validate(request);
        if (error is not null)
        {
            return (null, error);
        }

        var record = await repository.UpdateAsync(id, request.Name.Trim(), request.Note.Trim(), cancellationToken);
        return record is null ? (null, null) : (ToDto(record), null);
    }

    public Task<bool> DeleteAsync(string id, CancellationToken cancellationToken) =>
        repository.DeleteAsync(id, cancellationToken);

    private static string? Validate(UpsertEntityRequest request)
    {
        return string.IsNullOrWhiteSpace(request.Name) ? "validation:name is required" : null;
    }

    private static EntityDto ToDto(Domain.Entities.EntityRecord record) =>
        new(record.Id, record.Name, record.Note);
}
