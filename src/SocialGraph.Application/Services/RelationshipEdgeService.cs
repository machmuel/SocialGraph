using SocialGraph.Application.Contracts;
using SocialGraph.Application.Ports;
using SocialGraph.Domain.Entities;

namespace SocialGraph.Application.Services;

public sealed class RelationshipEdgeService(
    IRelationshipEdgeRepository relationshipEdges,
    IEntityRepository entities)
{
    public const string DuplicateRelationshipError = "conflict:relationship already exists";

    public async Task<IReadOnlyList<RelationshipEdgeDto>> ListAsync(string? entityId, CancellationToken cancellationToken)
    {
        var records = await relationshipEdges.ListAsync(entityId, cancellationToken);
        return records.Select(ToDto).ToArray();
    }

    public async Task<RelationshipEdgeDto?> GetAsync(string id, CancellationToken cancellationToken)
    {
        var record = await relationshipEdges.GetAsync(id, cancellationToken);
        return record is null ? null : ToDto(record);
    }

    public async Task<(RelationshipEdgeDto? Edge, string? Error)> CreateAsync(
        UpsertRelationshipEdgeRequest request,
        CancellationToken cancellationToken)
    {
        var normalized = await NormalizeAndValidateAsync(request, cancellationToken);
        if (normalized.Error is not null)
        {
            return (null, normalized.Error);
        }

        if (await relationshipEdges.ExistsAsync(
            normalized.SourceEntityId,
            normalized.TargetEntityId,
            normalized.Kind,
            cancellationToken))
        {
            return (null, DuplicateRelationshipError);
        }

        var edge = await relationshipEdges.CreateAsync(
            normalized.SourceEntityId,
            normalized.TargetEntityId,
            normalized.Kind,
            normalized.Note,
            cancellationToken);

        return (ToDto(edge), null);
    }

    public async Task<(RelationshipEdgeDto? Edge, string? Error)> UpdateAsync(
        string id,
        UpsertRelationshipEdgeRequest request,
        CancellationToken cancellationToken)
    {
        var existingEdge = await relationshipEdges.GetAsync(id, cancellationToken);
        if (existingEdge is null)
        {
            return (null, null);
        }

        var normalized = await NormalizeAndValidateAsync(request, cancellationToken);
        if (normalized.Error is not null)
        {
            return (null, normalized.Error);
        }

        var changesRelationshipIdentity =
            !string.Equals(existingEdge.SourceEntityId, normalized.SourceEntityId, StringComparison.OrdinalIgnoreCase) ||
            !string.Equals(existingEdge.TargetEntityId, normalized.TargetEntityId, StringComparison.OrdinalIgnoreCase) ||
            !string.Equals(existingEdge.Kind, normalized.Kind, StringComparison.OrdinalIgnoreCase);

        if (changesRelationshipIdentity)
        {
            var siblingEdges = await relationshipEdges.ListAsync(null, cancellationToken);
            var wouldDuplicate = siblingEdges.Any(edge =>
                !string.Equals(edge.Id, existingEdge.Id, StringComparison.OrdinalIgnoreCase) &&
                string.Equals(edge.SourceEntityId, normalized.SourceEntityId, StringComparison.OrdinalIgnoreCase) &&
                string.Equals(edge.TargetEntityId, normalized.TargetEntityId, StringComparison.OrdinalIgnoreCase) &&
                string.Equals(edge.Kind, normalized.Kind, StringComparison.OrdinalIgnoreCase));

            if (wouldDuplicate)
            {
                return (null, DuplicateRelationshipError);
            }
        }

        var edge = await relationshipEdges.UpdateAsync(
            id,
            normalized.SourceEntityId,
            normalized.TargetEntityId,
            normalized.Kind,
            normalized.Note,
            cancellationToken);

        return edge is null ? (null, null) : (ToDto(edge), null);
    }

    public Task<bool> DeleteAsync(string id, CancellationToken cancellationToken) =>
        relationshipEdges.DeleteAsync(id, cancellationToken);

    private async Task<NormalizedRelationshipEdgeRequest> NormalizeAndValidateAsync(
        UpsertRelationshipEdgeRequest request,
        CancellationToken cancellationToken)
    {
        var sourceEntityId = (request.SourceEntityId ?? string.Empty).Trim();
        var targetEntityId = (request.TargetEntityId ?? string.Empty).Trim();
        var kind = (request.Kind ?? request.Type ?? request.Label ?? string.Empty).Trim();
        var note = (request.Note ?? string.Empty).Trim();

        if (string.IsNullOrWhiteSpace(sourceEntityId))
        {
            return NormalizedRelationshipEdgeRequest.Invalid("validation:sourceEntityId is required");
        }

        if (string.IsNullOrWhiteSpace(targetEntityId))
        {
            return NormalizedRelationshipEdgeRequest.Invalid("validation:targetEntityId is required");
        }

        if (string.IsNullOrWhiteSpace(kind))
        {
            return NormalizedRelationshipEdgeRequest.Invalid("validation:kind is required");
        }

        if (await entities.GetAsync(sourceEntityId, cancellationToken) is null)
        {
            return NormalizedRelationshipEdgeRequest.Invalid("validation:sourceEntityId does not exist");
        }

        if (await entities.GetAsync(targetEntityId, cancellationToken) is null)
        {
            return NormalizedRelationshipEdgeRequest.Invalid("validation:targetEntityId does not exist");
        }

        return new NormalizedRelationshipEdgeRequest(sourceEntityId, targetEntityId, kind, note, null);
    }

    private static RelationshipEdgeDto ToDto(RelationshipEdgeRecord record) =>
        new(record.Id, record.SourceEntityId, record.TargetEntityId, record.Kind, record.Kind, record.Kind, record.Note);

    private sealed record NormalizedRelationshipEdgeRequest(
        string SourceEntityId,
        string TargetEntityId,
        string Kind,
        string Note,
        string? Error)
    {
        public static NormalizedRelationshipEdgeRequest Invalid(string error) =>
            new(string.Empty, string.Empty, string.Empty, string.Empty, error);
    }
}
