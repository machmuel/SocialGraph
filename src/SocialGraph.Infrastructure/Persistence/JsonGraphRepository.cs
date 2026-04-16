using System.Text.Json;
using SocialGraph.Application.Ports;
using SocialGraph.Domain.Entities;

namespace SocialGraph.Infrastructure.Persistence;

public sealed class JsonGraphRepository : IEntityRepository, IRelationshipEdgeRepository
{
    private static readonly JsonSerializerOptions SerializerOptions = new(JsonSerializerDefaults.Web)
    {
        WriteIndented = true
    };

    private readonly object _gate = new();
    private readonly string _dataPath;
    private GraphDataDocument _document;

    public JsonGraphRepository(GraphStorageOptions options)
    {
        _dataPath = ResolvePath(options.DataPath);
        _document = LoadOrSeed();
    }

    public Task<IReadOnlyList<EntityRecord>> ListAsync(string? query, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        lock (_gate)
        {
            var normalized = query?.Trim();
            var result = _document.Entities
                .Where(entity => string.IsNullOrWhiteSpace(normalized) ||
                                 entity.Name.Contains(normalized, StringComparison.OrdinalIgnoreCase))
                .OrderBy(entity => entity.Name, StringComparer.OrdinalIgnoreCase)
                .ToArray();

            return Task.FromResult<IReadOnlyList<EntityRecord>>(result);
        }
    }

    public Task<EntityRecord?> GetAsync(string id, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        lock (_gate)
        {
            var entity = _document.Entities.FirstOrDefault(current =>
                string.Equals(current.Id, id, StringComparison.OrdinalIgnoreCase));

            return Task.FromResult(entity);
        }
    }

    public Task<EntityRecord> CreateAsync(string name, string note, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        lock (_gate)
        {
            var id = GenerateEntityId(name);
            var entity = new EntityRecord(id, name, note);
            _document.Entities.Add(entity);
            SaveLocked();
            return Task.FromResult(entity);
        }
    }

    public Task<EntityRecord?> UpdateAsync(string id, string name, string note, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        lock (_gate)
        {
            var index = _document.Entities.FindIndex(current =>
                string.Equals(current.Id, id, StringComparison.OrdinalIgnoreCase));
            if (index < 0)
            {
                return Task.FromResult<EntityRecord?>(null);
            }

            var updated = _document.Entities[index] with { Name = name, Note = note };
            _document.Entities[index] = updated;
            SaveLocked();
            return Task.FromResult<EntityRecord?>(updated);
        }
    }

    public Task<bool> DeleteAsync(string id, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        lock (_gate)
        {
            var entityIndex = _document.Entities.FindIndex(current =>
                string.Equals(current.Id, id, StringComparison.OrdinalIgnoreCase));
            if (entityIndex < 0)
            {
                return Task.FromResult(false);
            }

            var deletedEntityId = _document.Entities[entityIndex].Id;
            _document.Entities.RemoveAt(entityIndex);
            _document.RelationshipEdges.RemoveAll(edge =>
                string.Equals(edge.SourceEntityId, deletedEntityId, StringComparison.OrdinalIgnoreCase) ||
                string.Equals(edge.TargetEntityId, deletedEntityId, StringComparison.OrdinalIgnoreCase));

            SaveLocked();
            return Task.FromResult(true);
        }
    }

    Task<IReadOnlyList<RelationshipEdgeRecord>> IRelationshipEdgeRepository.ListAsync(
        string? entityId,
        CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        lock (_gate)
        {
            var normalized = entityId?.Trim();
            var result = _document.RelationshipEdges
                .Where(edge => string.IsNullOrWhiteSpace(normalized) ||
                               string.Equals(edge.SourceEntityId, normalized, StringComparison.OrdinalIgnoreCase) ||
                               string.Equals(edge.TargetEntityId, normalized, StringComparison.OrdinalIgnoreCase))
                .OrderBy(edge => edge.SourceEntityId, StringComparer.OrdinalIgnoreCase)
                .ThenBy(edge => edge.TargetEntityId, StringComparer.OrdinalIgnoreCase)
                .ThenBy(edge => edge.Kind, StringComparer.OrdinalIgnoreCase)
                .ToArray();

            return Task.FromResult<IReadOnlyList<RelationshipEdgeRecord>>(result);
        }
    }

    Task<RelationshipEdgeRecord?> IRelationshipEdgeRepository.GetAsync(string id, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        lock (_gate)
        {
            var relationshipEdge = _document.RelationshipEdges.FirstOrDefault(current =>
                string.Equals(current.Id, id, StringComparison.OrdinalIgnoreCase));

            return Task.FromResult(relationshipEdge);
        }
    }

    public Task<RelationshipEdgeRecord> CreateAsync(
        string sourceEntityId,
        string targetEntityId,
        string kind,
        string note,
        CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        lock (_gate)
        {
            var id = GenerateRelationshipEdgeId(sourceEntityId, targetEntityId, kind);
            var relationshipEdge = new RelationshipEdgeRecord(id, sourceEntityId, targetEntityId, kind, note);
            _document.RelationshipEdges.Add(relationshipEdge);
            SaveLocked();
            return Task.FromResult(relationshipEdge);
        }
    }

    public Task<RelationshipEdgeRecord?> UpdateAsync(
        string id,
        string sourceEntityId,
        string targetEntityId,
        string kind,
        string note,
        CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        lock (_gate)
        {
            var index = _document.RelationshipEdges.FindIndex(current =>
                string.Equals(current.Id, id, StringComparison.OrdinalIgnoreCase));
            if (index < 0)
            {
                return Task.FromResult<RelationshipEdgeRecord?>(null);
            }

            var updated = _document.RelationshipEdges[index] with
            {
                SourceEntityId = sourceEntityId,
                TargetEntityId = targetEntityId,
                Kind = kind,
                Note = note
            };

            _document.RelationshipEdges[index] = updated;
            SaveLocked();
            return Task.FromResult<RelationshipEdgeRecord?>(updated);
        }
    }

    public Task<bool> ExistsAsync(
        string sourceEntityId,
        string targetEntityId,
        string kind,
        CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        lock (_gate)
        {
            var exists = _document.RelationshipEdges.Any(edge =>
                string.Equals(edge.SourceEntityId, sourceEntityId, StringComparison.OrdinalIgnoreCase) &&
                string.Equals(edge.TargetEntityId, targetEntityId, StringComparison.OrdinalIgnoreCase) &&
                string.Equals(edge.Kind, kind, StringComparison.OrdinalIgnoreCase));

            return Task.FromResult(exists);
        }
    }

    Task<bool> IRelationshipEdgeRepository.DeleteAsync(string id, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        lock (_gate)
        {
            var index = _document.RelationshipEdges.FindIndex(current =>
                string.Equals(current.Id, id, StringComparison.OrdinalIgnoreCase));
            if (index < 0)
            {
                return Task.FromResult(false);
            }

            _document.RelationshipEdges.RemoveAt(index);
            SaveLocked();
            return Task.FromResult(true);
        }
    }

    private GraphDataDocument LoadOrSeed()
    {
        if (!File.Exists(_dataPath))
        {
            var seeded = GraphDataDocument.Seed();
            _document = seeded;
            SaveLocked();
            return seeded;
        }

        using var stream = File.OpenRead(_dataPath);
        var document = JsonSerializer.Deserialize<GraphDataDocument>(stream, SerializerOptions);
        return document ?? GraphDataDocument.Seed();
    }

    private void SaveLocked()
    {
        var directory = Path.GetDirectoryName(_dataPath);
        if (!string.IsNullOrWhiteSpace(directory))
        {
            Directory.CreateDirectory(directory);
        }

        var temporaryPath = $"{_dataPath}.tmp";
        var json = JsonSerializer.Serialize(_document, SerializerOptions);
        File.WriteAllText(temporaryPath, json);
        File.Move(temporaryPath, _dataPath, overwrite: true);
    }

    private string GenerateEntityId(string name) =>
        GenerateUniqueId(ToSlug(name), _document.Entities.Select(entity => entity.Id), "entity");

    private string GenerateRelationshipEdgeId(string sourceEntityId, string targetEntityId, string kind) =>
        GenerateUniqueId(
            ToSlug($"{sourceEntityId}-{kind}-{targetEntityId}"),
            _document.RelationshipEdges.Select(edge => edge.Id),
            "relationship-edge");

    private static string GenerateUniqueId(string baseId, IEnumerable<string> existingIds, string fallback)
    {
        var normalizedBaseId = string.IsNullOrWhiteSpace(baseId) ? fallback : baseId;
        var existing = existingIds.ToHashSet(StringComparer.OrdinalIgnoreCase);
        var candidate = normalizedBaseId;
        var suffix = 2;

        while (existing.Contains(candidate))
        {
            candidate = $"{normalizedBaseId}-{suffix}";
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

        return slug.Trim('-');
    }

    private static string ResolvePath(string dataPath)
    {
        var path = string.IsNullOrWhiteSpace(dataPath) ? "data/socialgraph.json" : dataPath;
        return Path.IsPathRooted(path) ? path : Path.GetFullPath(path, Directory.GetCurrentDirectory());
    }

    private sealed class GraphDataDocument
    {
        public List<EntityRecord> Entities { get; set; } = [];

        public List<RelationshipEdgeRecord> RelationshipEdges { get; set; } = [];

        public static GraphDataDocument Seed() =>
            new()
            {
                Entities =
                [
                    new("alpha", "Alpha", "Seed record"),
                    new("beta", "Beta", "Second record")
                ],
                RelationshipEdges =
                [
                    new("alpha-knows-beta", "alpha", "beta", "knows", "Seed relationship")
                ]
            };
    }
}
