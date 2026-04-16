using SocialGraph.Application.Contracts;
using SocialGraph.Application.Ports;
using SocialGraph.Application.Services;
using SocialGraph.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

var storageOptions = new GraphStorageOptions();
var configuredStoragePath = Environment.GetEnvironmentVariable("SOCIALGRAPH_DATA_PATH")
                            ?? builder.Configuration["Storage:DataPath"];
if (!string.IsNullOrWhiteSpace(configuredStoragePath))
{
    storageOptions.DataPath = configuredStoragePath;
}

builder.Services.AddSingleton(storageOptions);
builder.Services.AddSingleton<JsonGraphRepository>();
builder.Services.AddSingleton<IEntityRepository>(provider => provider.GetRequiredService<JsonGraphRepository>());
builder.Services.AddSingleton<IRelationshipEdgeRepository>(provider => provider.GetRequiredService<JsonGraphRepository>());
builder.Services.AddSingleton<EntityService>();
builder.Services.AddSingleton<RelationshipEdgeService>();
builder.Services.AddSingleton<GraphService>();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapGet("/health", () => Results.Ok(new { status = "ok" }));

app.MapGet("/api/graph", async (string? entityId, GraphService service, CancellationToken cancellationToken) =>
{
    var graph = await service.GetSnapshotAsync(entityId, cancellationToken);
    return graph is null ? Results.NotFound(new { error = "not_found:entity" }) : Results.Ok(graph);
});

app.MapGet("/api/entities", async (string? q, EntityService service, CancellationToken cancellationToken) =>
{
    var entities = await service.ListAsync(q, cancellationToken);
    return Results.Ok(entities);
});

app.MapGet("/api/entities/{id}", async (string id, EntityService service, CancellationToken cancellationToken) =>
{
    var entity = await service.GetAsync(id, cancellationToken);
    return entity is null ? Results.NotFound() : Results.Ok(entity);
});

app.MapPost("/api/entities", async (UpsertEntityRequest request, EntityService service, CancellationToken cancellationToken) =>
{
    var result = await service.CreateAsync(request, cancellationToken);
    if (result.Error is not null)
    {
        return Results.BadRequest(new { error = result.Error });
    }

    return Results.Created($"/api/entities/{result.Entity!.Id}", result.Entity);
});

app.MapPut("/api/entities/{id}", async (string id, UpsertEntityRequest request, EntityService service, CancellationToken cancellationToken) =>
{
    var result = await service.UpdateAsync(id, request, cancellationToken);
    if (result.Error is not null)
    {
        return Results.BadRequest(new { error = result.Error });
    }

    return result.Entity is null ? Results.NotFound() : Results.Ok(result.Entity);
});

app.MapDelete("/api/entities/{id}", async (string id, EntityService service, CancellationToken cancellationToken) =>
{
    var deleted = await service.DeleteAsync(id, cancellationToken);
    return deleted ? Results.NoContent() : Results.NotFound();
});

app.MapGet("/api/relationship-edges", async (string? entityId, RelationshipEdgeService service, CancellationToken cancellationToken) =>
{
    var relationshipEdges = await service.ListAsync(entityId, cancellationToken);
    return Results.Ok(relationshipEdges);
});
app.MapGet("/api/relationships", async (string? entityId, RelationshipEdgeService service, CancellationToken cancellationToken) =>
{
    var relationshipEdges = await service.ListAsync(entityId, cancellationToken);
    return Results.Ok(relationshipEdges);
});

app.MapGet("/api/relationship-edges/{id}", async (string id, RelationshipEdgeService service, CancellationToken cancellationToken) =>
{
    var relationshipEdge = await service.GetAsync(id, cancellationToken);
    return relationshipEdge is null ? Results.NotFound() : Results.Ok(relationshipEdge);
});
app.MapGet("/api/relationships/{id}", async (string id, RelationshipEdgeService service, CancellationToken cancellationToken) =>
{
    var relationshipEdge = await service.GetAsync(id, cancellationToken);
    return relationshipEdge is null ? Results.NotFound() : Results.Ok(relationshipEdge);
});

app.MapPost("/api/relationship-edges", async (UpsertRelationshipEdgeRequest request, RelationshipEdgeService service, CancellationToken cancellationToken) =>
{
    var result = await service.CreateAsync(request, cancellationToken);
    if (result.Error is not null)
    {
        if (result.Error == RelationshipEdgeService.DuplicateRelationshipError)
        {
            return Results.Conflict(new { error = result.Error });
        }

        return Results.BadRequest(new { error = result.Error });
    }

    return Results.Created($"/api/relationship-edges/{result.Edge!.Id}", result.Edge);
});
app.MapPost("/api/relationships", async (UpsertRelationshipEdgeRequest request, RelationshipEdgeService service, CancellationToken cancellationToken) =>
{
    var result = await service.CreateAsync(request, cancellationToken);
    if (result.Error is not null)
    {
        if (result.Error == RelationshipEdgeService.DuplicateRelationshipError)
        {
            return Results.Conflict(new { error = result.Error });
        }

        return Results.BadRequest(new { error = result.Error });
    }

    return Results.Created($"/api/relationships/{result.Edge!.Id}", result.Edge);
});

app.MapPut("/api/relationship-edges/{id}", async (string id, UpsertRelationshipEdgeRequest request, RelationshipEdgeService service, CancellationToken cancellationToken) =>
{
    var result = await service.UpdateAsync(id, request, cancellationToken);
    if (result.Error is not null)
    {
        if (result.Error == RelationshipEdgeService.DuplicateRelationshipError)
        {
            return Results.Conflict(new { error = result.Error });
        }

        return Results.BadRequest(new { error = result.Error });
    }

    return result.Edge is null ? Results.NotFound() : Results.Ok(result.Edge);
});
app.MapPut("/api/relationships/{id}", async (string id, UpsertRelationshipEdgeRequest request, RelationshipEdgeService service, CancellationToken cancellationToken) =>
{
    var result = await service.UpdateAsync(id, request, cancellationToken);
    if (result.Error is not null)
    {
        if (result.Error == RelationshipEdgeService.DuplicateRelationshipError)
        {
            return Results.Conflict(new { error = result.Error });
        }

        return Results.BadRequest(new { error = result.Error });
    }

    return result.Edge is null ? Results.NotFound() : Results.Ok(result.Edge);
});

app.MapDelete("/api/relationship-edges/{id}", async (string id, RelationshipEdgeService service, CancellationToken cancellationToken) =>
{
    var deleted = await service.DeleteAsync(id, cancellationToken);
    return deleted ? Results.NoContent() : Results.NotFound();
});
app.MapDelete("/api/relationships/{id}", async (string id, RelationshipEdgeService service, CancellationToken cancellationToken) =>
{
    var deleted = await service.DeleteAsync(id, cancellationToken);
    return deleted ? Results.NoContent() : Results.NotFound();
});

app.Run();

public partial class Program;
