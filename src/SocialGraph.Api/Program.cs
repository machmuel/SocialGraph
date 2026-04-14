using SocialGraph.Application.Contracts;
using SocialGraph.Application.Ports;
using SocialGraph.Application.Services;
using SocialGraph.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<IEntityRepository, InMemoryEntityRepository>();
builder.Services.AddSingleton<EntityService>();

var app = builder.Build();

app.MapGet("/health", () => Results.Ok(new { status = "ok" }));

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

app.Run();

public partial class Program;
