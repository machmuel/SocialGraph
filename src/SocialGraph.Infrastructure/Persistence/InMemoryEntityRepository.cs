using SocialGraph.Application.Ports;
using SocialGraph.Domain.Entities;

namespace SocialGraph.Infrastructure.Persistence;

public sealed class InMemoryEntityRepository : IEntityRepository
{
    private readonly Dictionary<string, EntityRecord> _entities = new(StringComparer.OrdinalIgnoreCase)
    {
        ["alpha"] = new("alpha", "Alpha", "Seed record"),
        ["beta"] = new("beta", "Beta", "Second record")
    };

    public Task<IReadOnlyList<EntityRecord>> ListAsync(string? query, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        var normalized = query?.Trim();
        var result = _entities.Values
            .Where(entity => string.IsNullOrWhiteSpace(normalized) ||
                             entity.Name.Contains(normalized, StringComparison.OrdinalIgnoreCase))
            .OrderBy(entity => entity.Name, StringComparer.OrdinalIgnoreCase)
            .ToArray();

        return Task.FromResult<IReadOnlyList<EntityRecord>>(result);
    }

    public Task<EntityRecord?> GetAsync(string id, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();
        _entities.TryGetValue(id, out var entity);
        return Task.FromResult(entity);
    }

    public Task<EntityRecord> CreateAsync(string name, string note, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        var id = GenerateId(name);
        var entity = new EntityRecord(id, name, note);
        _entities[id] = entity;
        return Task.FromResult(entity);
    }

    public Task<EntityRecord?> UpdateAsync(string id, string name, string note, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        if (!_entities.TryGetValue(id, out var current))
        {
            return Task.FromResult<EntityRecord?>(null);
        }

        var updated = current with { Name = name, Note = note };
        _entities[id] = updated;
        return Task.FromResult<EntityRecord?>(updated);
    }

    private string GenerateId(string name)
    {
        var baseId = ToSlug(name);
        var candidate = baseId;
        var suffix = 2;

        while (_entities.ContainsKey(candidate))
        {
            candidate = $"{baseId}-{suffix}";
            suffix++;
        }

        return candidate;
    }

    private static string ToSlug(string value)
    {
        var chars = value.Trim().ToLowerInvariant()
            .Select(ch => char.IsLetterOrDigit(ch) ? ch : '-')
            .ToArray();

        var slug = new string(chars);
        while (slug.Contains("--", StringComparison.Ordinal))
        {
            slug = slug.Replace("--", "-", StringComparison.Ordinal);
        }

        slug = slug.Trim('-');
        return string.IsNullOrWhiteSpace(slug) ? "entity" : slug;
    }
}
