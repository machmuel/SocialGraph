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

    public Task<EntityRecord> CreateAsync(
        string name,
        string note,
        string type,
        string ownerUserId,
        string createdByUserId,
        CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        lock (_gate)
        {
            var id = GenerateEntityId(name);
            var entity = new EntityRecord(id, name, note, type, ownerUserId, createdByUserId);
            _document.Entities.Add(entity);
            SaveLocked();
            return Task.FromResult(entity);
        }
    }

    public Task<EntityRecord?> UpdateAsync(
        string id,
        string name,
        string note,
        string type,
        string ownerUserId,
        string createdByUserId,
        CancellationToken cancellationToken)
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

            var updated = _document.Entities[index] with
            {
                Name = name,
                Note = note,
                Type = type,
                OwnerUserId = ownerUserId,
                CreatedByUserId = createdByUserId
            };
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
        return Normalize(document ?? GraphDataDocument.Seed());
    }

    private static GraphDataDocument Normalize(GraphDataDocument document)
    {
        for (var index = 0; index < document.Entities.Count; index++)
        {
            var entity = document.Entities[index];
            var type = string.IsNullOrWhiteSpace(entity.Type) ? GraphTaxonomy.Topic : entity.Type.Trim().ToLowerInvariant();
            var ownerUserId = entity.OwnerUserId ?? string.Empty;
            var createdByUserId = entity.CreatedByUserId ?? string.Empty;
            document.Entities[index] = entity with
            {
                Type = GraphTaxonomy.IsEntityTypeAllowed(type) ? type : GraphTaxonomy.Topic,
                OwnerUserId = ownerUserId,
                CreatedByUserId = createdByUserId
            };
        }

        return document;
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
                    new("Guido_Machmueller", "Guido Machmueller", string.Empty, GraphTaxonomy.Employee, "Guido_Machmueller", "system"),
                    new("Matthias_Schmidt", "Matthias Schmidt", string.Empty, GraphTaxonomy.Employee, "Matthias_Schmidt", "system"),
                    new("Christian_Jablonski", "Christian Jablonski", string.Empty, GraphTaxonomy.Employee, "Christian_Jablonski", "system"),
                    new("Sieglinde_Kehl", "Sieglinde Kehl", string.Empty, GraphTaxonomy.Employee, "Sieglinde_Kehl", "system"),
                    new("Sachin_Sharma", "Sachin Sharma", string.Empty, GraphTaxonomy.Employee, "Sachin_Sharma", "system"),
                    new("Sven_Schmidt", "Sven Schmidt", string.Empty, GraphTaxonomy.Employee, "Sven_Schmidt", "system"),
                    new("Daniel_Andersson", "Daniel Andersson", string.Empty, GraphTaxonomy.Employee, "Daniel_Andersson", "system"),
                    new("Vaibhav_Pandya", "Vaibhav Pandya", string.Empty, GraphTaxonomy.Employee, "Vaibhav_Pandya", "system"),
                    new("Marcus_Zurhorst", "Marcus Zurhorst", string.Empty, GraphTaxonomy.Employee, "Marcus_Zurhorst", "system"),
                    new("Sujaan_Fareed", "Sujaan Fareed", string.Empty, GraphTaxonomy.Employee, "Sujaan_Fareed", "system"),
                    new("Michael_Gallagher", "Michael Gallagher", string.Empty, GraphTaxonomy.Employee, "Michael_Gallagher", "system"),
                    new("Michele_Berner", "Michele Berner", string.Empty, GraphTaxonomy.Employee, "Michele_Berner", "system"),
                    new("Sebastian_Raffel", "Sebastian Raffel", string.Empty, GraphTaxonomy.Employee, "Sebastian_Raffel", "system"),
                    new("COMOS", "COMOS", string.Empty, GraphTaxonomy.Skill, string.Empty, "system"),
                    new("REST_API", "REST API", string.Empty, GraphTaxonomy.Skill, string.Empty, "system"),
                    new("SnapLogic", "SnapLogic", string.Empty, GraphTaxonomy.Skill, string.Empty, "system"),
                    new("Azure", "Azure", string.Empty, GraphTaxonomy.Skill, string.Empty, "system"),
                    new("SQL_Server", "SQL Server", string.Empty, GraphTaxonomy.Skill, string.Empty, "system"),
                    new("GenAI", "GenAI", string.Empty, GraphTaxonomy.Skill, string.Empty, "system"),
                    new("MCP", "MCP", string.Empty, GraphTaxonomy.Skill, string.Empty, "system"),
                    new("SE_DC_APB_PLM", "SE DC APB PLM", string.Empty, GraphTaxonomy.Department, string.Empty, "system"),
                    new("COMOS_Platform", "COMOS Platform", string.Empty, GraphTaxonomy.Department, string.Empty, "system"),
                    new("IT_Service_Operations", "IT Service Operations", string.Empty, GraphTaxonomy.Department, string.Empty, "system"),
                    new("COMOS_Integration", "COMOS Integration", string.Empty, GraphTaxonomy.Topic, string.Empty, "system"),
                    new("AI_Architecture", "AI Architecture", string.Empty, GraphTaxonomy.Topic, string.Empty, "system"),
                    new("Infrastructure_Operations", "Infrastructure Operations", string.Empty, GraphTaxonomy.Topic, string.Empty, "system"),
                    new("Incident_Problem_Management", "Incident Problem Management", string.Empty, GraphTaxonomy.Topic, string.Empty, "system")
                ],
                RelationshipEdges =
                [
                    new("Matthias_Schmidt-has-skill-COMOS", "Matthias_Schmidt", "COMOS", "has-skill", string.Empty),
                    new("Matthias_Schmidt-has-skill-REST_API", "Matthias_Schmidt", "REST_API", "has-skill", string.Empty),
                    new("Matthias_Schmidt-in-department-COMOS_Platform", "Matthias_Schmidt", "COMOS_Platform", "in-department", string.Empty),
                    new("Matthias_Schmidt-related-to-COMOS_Integration", "Matthias_Schmidt", "COMOS_Integration", "related-to", string.Empty),
                    new("Christian_Jablonski-related-to-Infrastructure_Operations", "Christian_Jablonski", "Infrastructure_Operations", "related-to", string.Empty),
                    new("Christian_Jablonski-has-skill-SQL_Server", "Christian_Jablonski", "SQL_Server", "has-skill", string.Empty),
                    new("Christian_Jablonski-in-department-IT_Service_Operations", "Christian_Jablonski", "IT_Service_Operations", "in-department", string.Empty),
                    new("Sachin_Sharma-has-skill-Azure", "Sachin_Sharma", "Azure", "has-skill", string.Empty),
                    new("Sachin_Sharma-related-to-Infrastructure_Operations", "Sachin_Sharma", "Infrastructure_Operations", "related-to", string.Empty),
                    new("Vaibhav_Pandya-related-to-Incident_Problem_Management", "Vaibhav_Pandya", "Incident_Problem_Management", "related-to", string.Empty),
                    new("Vaibhav_Pandya-in-department-IT_Service_Operations", "Vaibhav_Pandya", "IT_Service_Operations", "in-department", string.Empty),
                    new("Marcus_Zurhorst-interested-in-AI_Architecture", "Marcus_Zurhorst", "AI_Architecture", "interested-in", string.Empty),
                    new("Marcus_Zurhorst-in-department-SE_DC_APB_PLM", "Marcus_Zurhorst", "SE_DC_APB_PLM", "in-department", string.Empty),
                    new("Sujaan_Fareed-has-skill-SnapLogic", "Sujaan_Fareed", "SnapLogic", "has-skill", string.Empty),
                    new("Sujaan_Fareed-related-to-COMOS_Integration", "Sujaan_Fareed", "COMOS_Integration", "related-to", string.Empty),
                    new("Guido_Machmueller-has-skill-COMOS", "Guido_Machmueller", "COMOS", "has-skill", string.Empty),
                    new("Guido_Machmueller-has-skill-GenAI", "Guido_Machmueller", "GenAI", "has-skill", string.Empty),
                    new("Guido_Machmueller-has-skill-MCP", "Guido_Machmueller", "MCP", "has-skill", string.Empty),
                    new("Guido_Machmueller-interested-in-AI_Architecture", "Guido_Machmueller", "AI_Architecture", "interested-in", string.Empty)
                ]
            };
    }
}
