using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace SocialGraph.Api.Tests;

public sealed class EntitiesApiTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public EntitiesApiTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task Health_ReturnsOk()
    {
        var response = await _client.GetAsync("/health");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
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
}
