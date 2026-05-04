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
        Assert.Contains("\"explanation\":\"Checkpoint cannot be scored yet because Observation window is incomplete through 2026-04-29; earliest checkpoint date is 2026-05-20.\"", body, StringComparison.Ordinal);
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
              "requiredFieldsSignOffStatus": "complete",
              "requiredFieldsSignOffBy": "Senior SWE (GUI-194)",
              "requiredFieldsSignOffAt": "2026-05-20T09:00:00+02:00",
              "requiredFieldsSignOffNote": "Synthetic sign-off for API regression coverage.",
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
        Assert.Contains("\"explanation\":\"All checkpoint thresholds passed and no data-quality blockers remain.\"", body, StringComparison.Ordinal);
    }

    [Fact]
    public async Task Entities_CreateRequiresDemoUserHeader()
    {
        var response = await _client.PostAsJsonAsync("/api/entities", new { name = "Accessibility", note = "", type = "topic" });
        var body = await response.Content.ReadAsStringAsync();

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Contains("validation:user is required", body, StringComparison.Ordinal);
    }

    [Fact]
    public async Task Entities_CreateRejectsInvalidType()
    {
        var response = await SendAsJsonAsync(HttpMethod.Post, "/api/entities", "Guido_Machmueller", new { name = "Bad", note = "", type = "planet" });
        var body = await response.Content.ReadAsStringAsync();

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Contains("validation:type is not allowed", body, StringComparison.Ordinal);
    }

    [Fact]
    public async Task Entities_CreateTypedTopicPersistsOwnership()
    {
        var response = await SendAsJsonAsync(HttpMethod.Post, "/api/entities", "Guido_Machmueller", new { name = "Accessibility", note = "Inclusive UX", type = "topic" });
        var body = await response.Content.ReadAsStringAsync();

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        Assert.Contains("\"type\":\"topic\"", body, StringComparison.Ordinal);
        Assert.Contains("\"createdByUserId\":\"Guido_Machmueller\"", body, StringComparison.Ordinal);
    }

    [Fact]
    public async Task Employee_UpdateAllowsOwnProfile()
    {
        var response = await SendAsJsonAsync(HttpMethod.Put, "/api/entities/Guido_Machmueller", "Guido_Machmueller", new { name = "Guido M.", note = "Updated", type = "employee" });
        var body = await response.Content.ReadAsStringAsync();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Contains("Guido M.", body, StringComparison.Ordinal);
        Assert.Contains("\"ownerUserId\":\"Guido_Machmueller\"", body, StringComparison.Ordinal);
    }

    [Fact]
    public async Task Employee_UpdateRejectsForeignProfile()
    {
        var response = await SendAsJsonAsync(HttpMethod.Put, "/api/entities/Matthias_Schmidt", "Guido_Machmueller", new { name = "Matthias", note = "Nope", type = "employee" });

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task Relationships_CreateRejectsInvalidKind()
    {
        var response = await SendAsJsonAsync(
            HttpMethod.Post,
            "/api/relationship-edges",
            "Guido_Machmueller",
            new { sourceEntityId = "Guido_Machmueller", targetEntityId = "COMOS", kind = "knows", note = "" });
        var body = await response.Content.ReadAsStringAsync();

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Contains("validation:kind is not allowed", body, StringComparison.Ordinal);
    }

    [Fact]
    public async Task Relationships_CreateAllowsOwnEmployeeToTopic()
    {
        var topic = await SendAsJsonAsync(HttpMethod.Post, "/api/entities", "Guido_Machmueller", new { name = "Accessibility", note = "", type = "topic" });
        Assert.Equal(HttpStatusCode.Created, topic.StatusCode);

        var response = await SendAsJsonAsync(
            HttpMethod.Post,
            "/api/relationship-edges",
            "Guido_Machmueller",
            new { sourceEntityId = "Guido_Machmueller", targetEntityId = "accessibility", kind = "related-to", note = "Profile topic" });
        var body = await response.Content.ReadAsStringAsync();

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        Assert.Contains("\"kind\":\"related-to\"", body, StringComparison.Ordinal);
    }

    [Fact]
    public async Task Relationships_CreateRejectsForeignEmployeeSource()
    {
        var response = await SendAsJsonAsync(
            HttpMethod.Post,
            "/api/relationship-edges",
            "Guido_Machmueller",
            new { sourceEntityId = "Matthias_Schmidt", targetEntityId = "COMOS", kind = "has-skill", note = "" });

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task GraphSnapshot_ReturnsTypedNodesAndOwnership()
    {
        var response = await _client.GetAsync("/api/graph");
        var body = await response.Content.ReadAsStringAsync();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Contains("\"id\":\"Guido_Machmueller\"", body, StringComparison.Ordinal);
        Assert.Contains("\"type\":\"employee\"", body, StringComparison.Ordinal);
        Assert.Contains("\"ownerUserId\":\"Guido_Machmueller\"", body, StringComparison.Ordinal);
        Assert.Contains("\"id\":\"Guido_Machmueller-has-skill-MCP\"", body, StringComparison.Ordinal);
    }

    [Fact]
    public async Task GraphSnapshot_FiltersToFocusedOneHopNeighborhood()
    {
        var create = await SendAsJsonAsync(HttpMethod.Post, "/api/entities", "Guido_Machmueller", new { name = "Accessibility", note = "", type = "topic" });
        Assert.Equal(HttpStatusCode.Created, create.StatusCode);

        var edge = await SendAsJsonAsync(
            HttpMethod.Post,
            "/api/relationships",
            "Guido_Machmueller",
            new { sourceEntityId = "Guido_Machmueller", targetEntityId = "accessibility", kind = "related-to", note = "visible from guido" });
        Assert.Equal(HttpStatusCode.Created, edge.StatusCode);

        var response = await _client.GetAsync("/api/graph?entityId=Guido_Machmueller");
        var body = await response.Content.ReadAsStringAsync();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Contains("\"id\":\"Guido_Machmueller\"", body, StringComparison.Ordinal);
        Assert.Contains("\"id\":\"accessibility\"", body, StringComparison.Ordinal);
        Assert.DoesNotContain("\"id\":\"Matthias_Schmidt\"", body, StringComparison.Ordinal);
    }

    [Fact]
    public async Task GraphStorage_LoadsLegacyJsonWithDefaultTopicType()
    {
        var dataPath = Path.Combine(Path.GetTempPath(), "SocialGraph.Api.Tests", $"{Guid.NewGuid():N}-legacy.json");
        await File.WriteAllTextAsync(
            dataPath,
            """
            {
              "entities": [
                { "id": "legacy", "name": "Legacy", "note": "old shape" }
              ],
              "relationshipEdges": []
            }
            """);

        using var factory = new WebApplicationFactory<Program>()
            .WithWebHostBuilder(builder => builder.UseSetting("Storage:DataPath", dataPath));
        using var client = factory.CreateClient();

        var response = await client.GetAsync("/api/entities/legacy");
        var body = await response.Content.ReadAsStringAsync();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Contains("\"type\":\"topic\"", body, StringComparison.Ordinal);
        Assert.Contains("\"ownerUserId\":\"\"", body, StringComparison.Ordinal);
    }

    [Fact]
    public async Task StaticViewer_ReturnsThreeJsWorkbench()
    {
        var response = await _client.GetAsync("/");
        var body = await response.Content.ReadAsStringAsync();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Contains("<title>SocialGraph Workbench</title>", body, StringComparison.Ordinal);
        Assert.Contains("Employee Workbench", body, StringComparison.Ordinal);
        Assert.Contains("Demo user", body, StringComparison.Ordinal);
        Assert.Contains("My profile", body, StringComparison.Ordinal);
        Assert.Contains("Three.js graph canvas", body, StringComparison.Ordinal);
        Assert.Contains("<canvas", body, StringComparison.Ordinal);
        Assert.Contains("type=\"importmap\"", body, StringComparison.Ordinal);
        Assert.Contains("\"three\": \"/vendor/three/build/three.module.js\"", body, StringComparison.Ordinal);
        Assert.Contains("\"d3-force-3d\": \"/vendor/d3-force-3d/src/index.js\"", body, StringComparison.Ordinal);
        Assert.Contains("type=\"module\" src=\"/app.js", body, StringComparison.Ordinal);
        Assert.DoesNotContain("<svg", body, StringComparison.Ordinal);
    }

    [Fact]
    public async Task StaticViewer_ServesThreeJsAssets()
    {
        var stylesheet = await _client.GetAsync("/app.css");
        var stylesheetBody = await stylesheet.Content.ReadAsStringAsync();
        var script = await _client.GetAsync("/app.js");
        var scriptBody = await script.Content.ReadAsStringAsync();

        Assert.Equal(HttpStatusCode.OK, stylesheet.StatusCode);
        Assert.Contains(".graph-label-layer", stylesheetBody, StringComparison.Ordinal);
        Assert.Contains(".type-employee", stylesheetBody, StringComparison.Ordinal);
        Assert.Contains("canvas", stylesheetBody, StringComparison.Ordinal);

        Assert.Equal(HttpStatusCode.OK, script.StatusCode);
        Assert.DoesNotContain("cdn.jsdelivr.net", scriptBody, StringComparison.Ordinal);
        Assert.Contains("from \"three\"", scriptBody, StringComparison.Ordinal);
        Assert.Contains("from \"d3-force-3d\"", scriptBody, StringComparison.Ordinal);
        Assert.Contains("\"X-SocialGraph-UserId\": state.currentUserId", scriptBody, StringComparison.Ordinal);
        Assert.Contains("function submitProfile", scriptBody, StringComparison.Ordinal);
        Assert.Contains("class ThreeGraphView", scriptBody, StringComparison.Ordinal);
    }

    private async Task<HttpResponseMessage> SendAsJsonAsync(HttpMethod method, string url, string userId, object payload)
    {
        using var request = new HttpRequestMessage(method, url)
        {
            Content = JsonContent.Create(payload)
        };
        request.Headers.Add("X-SocialGraph-UserId", userId);
        return await _client.SendAsync(request);
    }
}
