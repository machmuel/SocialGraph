using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace SocialGraph.Api.Tests;

public sealed class EntitiesApiTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public EntitiesApiTests(WebApplicationFactory<Program> factory)
    {
        var dataPath = Path.Combine(Path.GetTempPath(), "SocialGraph.Api.Tests", $"{Guid.NewGuid():N}.json");
        _client = factory
            .WithWebHostBuilder(builder => builder.UseSetting("Storage:DataPath", dataPath))
            .CreateClient();
    }

    [Fact]
    public async Task Health_ReturnsOk()
    {
        var response = await _client.GetAsync("/health");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task QaModelAValidationReport_DefaultSourceReturnsNoReadout()
    {
        var response = await _client.GetAsync("/api/cto/weekly-monitor/qa-model-a-validation");
        var body = await response.Content.ReadAsStringAsync();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Contains("\"overallStatus\":\"NO_READOUT\"", body, StringComparison.Ordinal);
        Assert.Contains("\"recommendedDecision\":\"no readout - evidence incomplete\"", body, StringComparison.Ordinal);
        Assert.Contains("\"metricSourcePath\":\"/api/cto/weekly-monitor/qa-model-a-validation\"", body, StringComparison.Ordinal);
        Assert.Contains("Observation window is incomplete", body, StringComparison.Ordinal);
    }

    [Fact]
    public async Task QaModelAValidationReport_CompleteFixtureReturnsPass()
    {
        var reportPath = Path.Combine(Path.GetTempPath(), "SocialGraph.Api.Tests", $"{Guid.NewGuid():N}-qa-validation.json");
        Directory.CreateDirectory(Path.GetDirectoryName(reportPath)!);
        await File.WriteAllTextAsync(
            reportPath,
            """
            {
              "metricSourceIssue": "GUI-92",
              "observationWindowStart": "2026-04-20",
              "observationWindowEnd": "2026-05-20",
              "earliestCheckpointDate": "2026-05-20",
              "preparedAt": "2026-05-20T09:00:00+02:00",
              "evidenceNote": "Synthetic passing fixture for API regression coverage.",
              "acknowledgementSlaPercent": 98.2,
              "acknowledgementMetCount": 55,
              "acknowledgementSampleCount": 56,
              "completionSlaPercent": 94.6,
              "completionMetCount": 53,
              "completionSampleCount": 56,
              "medianReviewBusinessHours": 6.5,
              "medianDeliveryLeadTimeHours": 61.0,
              "escapedDefectsCurrent30DayCount": 1,
              "escapedDefectsPrior30DayCount": 2,
              "missingFields": []
            }
            """);

        using var factory = new WebApplicationFactory<Program>()
            .WithWebHostBuilder(builder =>
            {
                builder.UseSetting("Storage:DataPath", Path.Combine(Path.GetTempPath(), "SocialGraph.Api.Tests", $"{Guid.NewGuid():N}.json"));
                builder.UseSetting("QaValidation:ReportPath", reportPath);
            });
        using var client = factory.CreateClient();

        var response = await client.GetAsync("/api/cto/weekly-monitor/qa-model-a-validation");
        var body = await response.Content.ReadAsStringAsync();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Contains("\"overallStatus\":\"PASS\"", body, StringComparison.Ordinal);
        Assert.Contains("\"recommendedDecision\":\"continue model A\"", body, StringComparison.Ordinal);
        Assert.Contains("\"key\":\"delivery_lead_time_impact\"", body, StringComparison.Ordinal);
        Assert.Contains("\"status\":\"PASS\"", body, StringComparison.Ordinal);
    }

    [Fact]
    public async Task List_FiltersByQuery()
    {
        var response = await _client.GetAsync("/api/entities?q=alp");
        var body = await response.Content.ReadAsStringAsync();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Contains("Alpha", body, StringComparison.Ordinal);
        Assert.DoesNotContain("Beta", body, StringComparison.Ordinal);
    }

    [Fact]
    public async Task Create_RejectsBlankName()
    {
        var response = await _client.PostAsJsonAsync("/api/entities", new { name = "", note = "" });
        var body = await response.Content.ReadAsStringAsync();

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Contains("validation:name is required", body, StringComparison.Ordinal);
    }

    [Fact]
    public async Task Update_PersistsChanges()
    {
        var update = await _client.PutAsJsonAsync("/api/entities/alpha", new { name = "Alpha Updated", note = "patched" });
        var detail = await _client.GetAsync("/api/entities/alpha");
        var body = await detail.Content.ReadAsStringAsync();

        Assert.Equal(HttpStatusCode.OK, update.StatusCode);
        Assert.Equal(HttpStatusCode.OK, detail.StatusCode);
        Assert.Contains("Alpha Updated", body, StringComparison.Ordinal);
        Assert.Contains("patched", body, StringComparison.Ordinal);
    }

    [Fact]
    public async Task Delete_RemovesEntityAndIncidentRelationships()
    {
        var delete = await _client.DeleteAsync("/api/entities/alpha");
        var entity = await _client.GetAsync("/api/entities/alpha");
        var relationship = await _client.GetAsync("/api/relationships/alpha-knows-beta");
        var graph = await _client.GetAsync("/api/graph");
        var graphBody = await graph.Content.ReadAsStringAsync();

        Assert.Equal(HttpStatusCode.NoContent, delete.StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, entity.StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, relationship.StatusCode);
        Assert.Equal(HttpStatusCode.OK, graph.StatusCode);
        Assert.DoesNotContain("\"id\":\"alpha\"", graphBody, StringComparison.Ordinal);
        Assert.DoesNotContain("\"id\":\"alpha-knows-beta\"", graphBody, StringComparison.Ordinal);
    }

    [Fact]
    public async Task Delete_ReturnsNotFoundForMissingEntity()
    {
        var response = await _client.DeleteAsync("/api/entities/missing");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task RelationshipEdges_List_FiltersByEntityId()
    {
        var response = await _client.GetAsync("/api/relationship-edges?entityId=alpha");
        var body = await response.Content.ReadAsStringAsync();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Contains("alpha-knows-beta", body, StringComparison.Ordinal);
        Assert.Contains("alpha", body, StringComparison.Ordinal);
        Assert.Contains("beta", body, StringComparison.Ordinal);
    }

    [Fact]
    public async Task RelationshipEdges_Get_ReturnsNotFoundForMissingEdge()
    {
        var response = await _client.GetAsync("/api/relationship-edges/missing-edge");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task RelationshipEdges_Create_RejectsMissingSourceEntity()
    {
        var response = await _client.PostAsJsonAsync(
            "/api/relationship-edges",
            new { sourceEntityId = "missing", targetEntityId = "beta", kind = "knows", note = "" });
        var body = await response.Content.ReadAsStringAsync();

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Contains("validation:sourceEntityId does not exist", body, StringComparison.Ordinal);
    }

    [Fact]
    public async Task RelationshipEdges_Create_RejectsMissingKind()
    {
        var response = await _client.PostAsJsonAsync(
            "/api/relationships",
            new { sourceEntityId = "alpha", targetEntityId = "beta", kind = "", note = "" });
        var body = await response.Content.ReadAsStringAsync();

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Contains("validation:kind is required", body, StringComparison.Ordinal);
    }

    [Fact]
    public async Task RelationshipEdges_Create_RejectsDuplicateRelationship()
    {
        var response = await _client.PostAsJsonAsync(
            "/api/relationships",
            new { sourceEntityId = "alpha", targetEntityId = "beta", kind = "knows", note = "duplicate" });
        var body = await response.Content.ReadAsStringAsync();

        Assert.Equal(HttpStatusCode.Conflict, response.StatusCode);
        Assert.Contains("conflict:relationship already exists", body, StringComparison.Ordinal);
    }

    [Fact]
    public async Task RelationshipEdges_Create_PersistsEdge()
    {
        var create = await _client.PostAsJsonAsync(
            "/api/relationships",
            new { sourceEntityId = "beta", targetEntityId = "alpha", kind = "reports-to", note = "created from test" });
        var createBody = await create.Content.ReadAsStringAsync();

        Assert.Equal(HttpStatusCode.Created, create.StatusCode);
        Assert.Contains("beta-reports-to-alpha", createBody, StringComparison.Ordinal);
        Assert.Contains("created from test", createBody, StringComparison.Ordinal);

        var detail = await _client.GetAsync("/api/relationship-edges/beta-reports-to-alpha");
        var detailBody = await detail.Content.ReadAsStringAsync();

        Assert.Equal(HttpStatusCode.OK, detail.StatusCode);
        Assert.Contains("reports-to", detailBody, StringComparison.Ordinal);
    }

    [Fact]
    public async Task RelationshipEdges_Update_PersistsChanges()
    {
        var create = await _client.PostAsJsonAsync(
            "/api/relationship-edges",
            new { sourceEntityId = "alpha", targetEntityId = "beta", label = "mentors", note = "before" });

        Assert.Equal(HttpStatusCode.Created, create.StatusCode);

        var update = await _client.PutAsJsonAsync(
            "/api/relationships/alpha-mentors-beta",
            new { sourceEntityId = "alpha", targetEntityId = "beta", type = "advises", note = "after" });
        var detail = await _client.GetAsync("/api/relationship-edges/alpha-mentors-beta");
        var body = await detail.Content.ReadAsStringAsync();

        Assert.Equal(HttpStatusCode.OK, update.StatusCode);
        Assert.Equal(HttpStatusCode.OK, detail.StatusCode);
        Assert.Contains("advises", body, StringComparison.Ordinal);
        Assert.Contains("after", body, StringComparison.Ordinal);
    }

    [Fact]
    public async Task RelationshipEdges_Update_RejectsDuplicateRelationship()
    {
        var create = await _client.PostAsJsonAsync(
            "/api/relationships",
            new { sourceEntityId = "beta", targetEntityId = "alpha", kind = "reports-to", note = "candidate" });

        Assert.Equal(HttpStatusCode.Created, create.StatusCode);

        var update = await _client.PutAsJsonAsync(
            "/api/relationships/beta-reports-to-alpha",
            new { sourceEntityId = "alpha", targetEntityId = "beta", kind = "knows", note = "would duplicate seed" });
        var body = await update.Content.ReadAsStringAsync();

        Assert.Equal(HttpStatusCode.Conflict, update.StatusCode);
        Assert.Contains("conflict:relationship already exists", body, StringComparison.Ordinal);
    }

    [Fact]
    public async Task RelationshipEdges_Delete_RemovesEdge()
    {
        var create = await _client.PostAsJsonAsync(
            "/api/relationships",
            new { sourceEntityId = "beta", targetEntityId = "alpha", kind = "reviewed-by", note = "temporary" });

        Assert.Equal(HttpStatusCode.Created, create.StatusCode);

        var delete = await _client.DeleteAsync("/api/relationships/beta-reviewed-by-alpha");
        var detail = await _client.GetAsync("/api/relationships/beta-reviewed-by-alpha");

        Assert.Equal(HttpStatusCode.NoContent, delete.StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, detail.StatusCode);
    }

    [Fact]
    public async Task GraphSnapshot_ReturnsSeededNodesAndLinks()
    {
        var response = await _client.GetAsync("/api/graph");
        var body = await response.Content.ReadAsStringAsync();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Contains("\"nodes\"", body, StringComparison.Ordinal);
        Assert.Contains("\"links\"", body, StringComparison.Ordinal);
        Assert.Contains("\"id\":\"alpha\"", body, StringComparison.Ordinal);
        Assert.Contains("\"id\":\"beta\"", body, StringComparison.Ordinal);
        Assert.Contains("\"id\":\"alpha-knows-beta\"", body, StringComparison.Ordinal);
    }

    [Fact]
    public async Task GraphSnapshot_FiltersToFocusedOneHopNeighborhood()
    {
        var gamma = await _client.PostAsJsonAsync("/api/entities", new { name = "Gamma", note = "outside focus" });
        var edge = await _client.PostAsJsonAsync(
            "/api/relationships",
            new { sourceEntityId = "beta", targetEntityId = "alpha", kind = "reports-to", note = "visible from alpha" });

        Assert.Equal(HttpStatusCode.Created, gamma.StatusCode);
        Assert.Equal(HttpStatusCode.Created, edge.StatusCode);

        var response = await _client.GetAsync("/api/graph?entityId=alpha");
        var body = await response.Content.ReadAsStringAsync();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Contains("\"id\":\"alpha\"", body, StringComparison.Ordinal);
        Assert.Contains("\"id\":\"beta\"", body, StringComparison.Ordinal);
        Assert.Contains("\"id\":\"alpha-knows-beta\"", body, StringComparison.Ordinal);
        Assert.Contains("\"id\":\"beta-reports-to-alpha\"", body, StringComparison.Ordinal);
        Assert.DoesNotContain("\"id\":\"gamma\"", body, StringComparison.Ordinal);
    }

    [Fact]
    public async Task GraphSnapshot_ReturnsNotFoundForUnknownFocusEntity()
    {
        var response = await _client.GetAsync("/api/graph?entityId=missing");
        var body = await response.Content.ReadAsStringAsync();

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        Assert.Contains("not_found:entity", body, StringComparison.Ordinal);
    }

    [Fact]
    public async Task StaticViewer_ReturnsGraphPage()
    {
        var response = await _client.GetAsync("/");
        var body = await response.Content.ReadAsStringAsync();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Contains("<title>SocialGraph Workbench</title>", body, StringComparison.Ordinal);
        Assert.Contains("Entity Workbench", body, StringComparison.Ordinal);
        Assert.Contains("Entity neighborhood summary", body, StringComparison.Ordinal);
        Assert.Contains("Neighbor drilldown", body, StringComparison.Ordinal);
        Assert.Contains("Focused Exploration", body, StringComparison.Ordinal);
        Assert.Contains("Relationship Explorer", body, StringComparison.Ordinal);
        Assert.Contains("Global browse", body, StringComparison.Ordinal);
        Assert.Contains("Filter relationships", body, StringComparison.Ordinal);
        Assert.Contains("Direction", body, StringComparison.Ordinal);
        Assert.Contains("Relationship inspector", body, StringComparison.Ordinal);
        Assert.Contains("Clear selection", body, StringComparison.Ordinal);
        Assert.Contains("Select a node or relationship to inspect it locally.", body, StringComparison.Ordinal);
        Assert.Contains("aria-describedby=\"graphInteractionHint\"", body, StringComparison.Ordinal);
        Assert.Contains("role=\"group\"", body, StringComparison.Ordinal);
        Assert.Contains("href=\"/app.css\"", body, StringComparison.Ordinal);
        Assert.Contains("src=\"/app.js\"", body, StringComparison.Ordinal);
        Assert.DoesNotContain("<style>", body, StringComparison.Ordinal);
        Assert.DoesNotContain("<script>", body, StringComparison.Ordinal);
    }

    [Fact]
    public async Task StaticViewer_ServesExternalAssets()
    {
        var stylesheet = await _client.GetAsync("/app.css");
        var stylesheetBody = await stylesheet.Content.ReadAsStringAsync();
        var script = await _client.GetAsync("/app.js");
        var scriptBody = await script.Content.ReadAsStringAsync();

        Assert.Equal(HttpStatusCode.OK, stylesheet.StatusCode);
        Assert.Contains(".graph-frame", stylesheetBody, StringComparison.Ordinal);
        Assert.Contains(".relationship-card.active", stylesheetBody, StringComparison.Ordinal);
        Assert.Contains(".filter-stack", stylesheetBody, StringComparison.Ordinal);
        Assert.Contains(".node-shell.spotlight", stylesheetBody, StringComparison.Ordinal);
        Assert.Contains(".chip-button.active", stylesheetBody, StringComparison.Ordinal);
        Assert.Contains("button:focus-visible", stylesheetBody, StringComparison.Ordinal);
        Assert.Contains(".link-shell:focus-visible .link", stylesheetBody, StringComparison.Ordinal);
        Assert.Contains(".node-shell:focus-visible .node-circle", stylesheetBody, StringComparison.Ordinal);

        Assert.Equal(HttpStatusCode.OK, script.StatusCode);
        Assert.Contains("requestJson(\"/api/entities\")", scriptBody, StringComparison.Ordinal);
        Assert.Contains("requestJson(\"/api/relationship-edges\")", scriptBody, StringComparison.Ordinal);
        Assert.Contains("requestJson(`/api/graph${suffix}`)", scriptBody, StringComparison.Ordinal);
        Assert.Contains("function getEntityMetrics(entityId)", scriptBody, StringComparison.Ordinal);
        Assert.Contains("function getGraphSpotlight()", scriptBody, StringComparison.Ordinal);
        Assert.Contains("selectRelationship(link.id)", scriptBody, StringComparison.Ordinal);
        Assert.Contains("state.relationshipFilters.direction", scriptBody, StringComparison.Ordinal);
        Assert.Contains("indicator.setAttribute(\"aria-hidden\", String(!value));", scriptBody, StringComparison.Ordinal);
        Assert.Contains("function renderSelection()", scriptBody, StringComparison.Ordinal);
        Assert.Contains("state.selectedRelationship = state.relationships.find", scriptBody, StringComparison.Ordinal);
        Assert.Contains("text.textContent = edgeLabel;", scriptBody, StringComparison.Ordinal);
    }

    [Fact]
    public async Task GraphStorage_PersistsEntitiesAndRelationshipsAcrossHosts()
    {
        var dataPath = Path.Combine(Path.GetTempPath(), "SocialGraph.Api.Tests", $"{Guid.NewGuid():N}.json");
        using var factory = new WebApplicationFactory<Program>()
            .WithWebHostBuilder(builder => builder.UseSetting("Storage:DataPath", dataPath));

        using (var firstClient = factory.CreateClient())
        {
            var entity = await firstClient.PostAsJsonAsync("/api/entities", new { name = "Gamma", note = "stored" });
            var edge = await firstClient.PostAsJsonAsync(
                "/api/relationships",
                new { sourceEntityId = "gamma", targetEntityId = "alpha", kind = "knows", note = "persisted edge" });

            Assert.Equal(HttpStatusCode.Created, entity.StatusCode);
            Assert.Equal(HttpStatusCode.Created, edge.StatusCode);
        }

        using var restartedFactory = new WebApplicationFactory<Program>()
            .WithWebHostBuilder(builder => builder.UseSetting("Storage:DataPath", dataPath));
        using var restartedClient = restartedFactory.CreateClient();

        var entityDetail = await restartedClient.GetAsync("/api/entities/gamma");
        var entityBody = await entityDetail.Content.ReadAsStringAsync();
        var edgeDetail = await restartedClient.GetAsync("/api/relationships/gamma-knows-alpha");
        var edgeBody = await edgeDetail.Content.ReadAsStringAsync();

        Assert.Equal(HttpStatusCode.OK, entityDetail.StatusCode);
        Assert.Contains("stored", entityBody, StringComparison.Ordinal);
        Assert.Equal(HttpStatusCode.OK, edgeDetail.StatusCode);
        Assert.Contains("persisted edge", edgeBody, StringComparison.Ordinal);
    }

    [Fact]
    public async Task GraphStorage_PersistsEntityDeletionAcrossHosts()
    {
        var dataPath = Path.Combine(Path.GetTempPath(), "SocialGraph.Api.Tests", $"{Guid.NewGuid():N}.json");
        using var factory = new WebApplicationFactory<Program>()
            .WithWebHostBuilder(builder => builder.UseSetting("Storage:DataPath", dataPath));

        using (var firstClient = factory.CreateClient())
        {
            var delete = await firstClient.DeleteAsync("/api/entities/alpha");

            Assert.Equal(HttpStatusCode.NoContent, delete.StatusCode);
        }

        using var restartedFactory = new WebApplicationFactory<Program>()
            .WithWebHostBuilder(builder => builder.UseSetting("Storage:DataPath", dataPath));
        using var restartedClient = restartedFactory.CreateClient();

        var entityDetail = await restartedClient.GetAsync("/api/entities/alpha");
        var relationshipDetail = await restartedClient.GetAsync("/api/relationships/alpha-knows-beta");
        var graph = await restartedClient.GetAsync("/api/graph");
        var graphBody = await graph.Content.ReadAsStringAsync();

        Assert.Equal(HttpStatusCode.NotFound, entityDetail.StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, relationshipDetail.StatusCode);
        Assert.Equal(HttpStatusCode.OK, graph.StatusCode);
        Assert.DoesNotContain("\"id\":\"alpha\"", graphBody, StringComparison.Ordinal);
        Assert.DoesNotContain("\"id\":\"alpha-knows-beta\"", graphBody, StringComparison.Ordinal);
    }
}
