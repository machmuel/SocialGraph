using System.Net.WebSockets;
using System.Text;
using System.Text.Json;

var tabsJson = await new HttpClient().GetStringAsync("http://localhost:9222/json");
using var tabsDoc = JsonDocument.Parse(tabsJson);
var page = tabsDoc.RootElement.EnumerateArray()
    .FirstOrDefault(t => t.GetProperty("url").GetString() == "http://localhost:61804/");

if (page.ValueKind == JsonValueKind.Undefined)
{
    throw new InvalidOperationException("SocialGraph tab not found.");
}

var wsUrl = page.GetProperty("webSocketDebuggerUrl").GetString()!;
using var ws = new ClientWebSocket();
await ws.ConnectAsync(new Uri(wsUrl), CancellationToken.None);

var nextId = 0;
var events = new List<JsonElement>();

async Task<int> SendAsync(string method, object? parameters = null)
{
    var id = ++nextId;
    var payload = parameters is null
        ? JsonSerializer.Serialize(new { id, method })
        : JsonSerializer.Serialize(new { id, method, @params = parameters });
    var bytes = Encoding.UTF8.GetBytes(payload);
    await ws.SendAsync(bytes, WebSocketMessageType.Text, true, CancellationToken.None);
    return id;
}

async Task<JsonDocument?> ReceiveAsync()
{
    var buffer = new byte[1024 * 1024];
    using var ms = new MemoryStream();

    WebSocketReceiveResult result;
    do
    {
        result = await ws.ReceiveAsync(buffer, CancellationToken.None);
        if (result.Count > 0)
        {
            ms.Write(buffer, 0, result.Count);
        }
    }
    while (!result.EndOfMessage);

    if (ms.Length == 0)
    {
        return null;
    }

    return JsonDocument.Parse(ms.ToArray());
}

async Task<JsonDocument?> InvokeAsync(string method, object? parameters = null, int timeoutMs = 5000)
{
    var id = await SendAsync(method, parameters);
    while (true)
    {
        var message = await ReceiveAsync();
        if (message is null)
        {
            continue;
        }

        var root = message.RootElement;
        if (root.TryGetProperty("id", out var responseId) && responseId.GetInt32() == id)
        {
            return message;
        }

        events.Add(root.Clone());
    }

}

await InvokeAsync("Runtime.enable");
await InvokeAsync("Log.enable");
await InvokeAsync("Page.enable");
await InvokeAsync("Network.enable");
await InvokeAsync("Page.reload", new { ignoreCache = true });

await Task.Delay(TimeSpan.FromSeconds(5));

const string summaryExpression = """
(() => ({
  title: document.title,
  url: location.href,
  bodyTextSample: document.body.innerText.slice(0, 1200),
  errorTexts: Array.from(document.querySelectorAll('[role="alert"], .error, .error-message, .notice, .toast, [data-testid*="error" i]')).map(e => e.innerText).filter(Boolean),
  entityCards: document.querySelectorAll('[data-entity-id], .entity-card, [data-testid*="entity" i]').length,
  relationshipCards: document.querySelectorAll('[data-relationship-id], .relationship-card, [data-testid*="relationship" i]').length,
  buttons: Array.from(document.querySelectorAll('button')).map(b => b.innerText || b.getAttribute('aria-label')).filter(Boolean).slice(0, 40)
}))()
""";

using var summaryDoc = await InvokeAsync("Runtime.evaluate", new { expression = summaryExpression, returnByValue = true })
    ?? throw new InvalidOperationException("Runtime.evaluate did not return a response.");
var pageSummary = summaryDoc.RootElement.GetProperty("result").GetProperty("result").GetProperty("value").Clone();

using var shotDoc = await InvokeAsync("Page.captureScreenshot", new { format = "png", captureBeyondViewport = false }, 10000)
    ?? throw new InvalidOperationException("Page.captureScreenshot did not return a response.");
var shotData = shotDoc.RootElement.GetProperty("result").GetProperty("data").GetString()!;
var screenshotPath = @"I:\VS-Projekte\SocialGraph\Temp\socialgraph-edge-cdp.png";
await File.WriteAllBytesAsync(screenshotPath, Convert.FromBase64String(shotData));

var interesting = events
    .Where(e => e.TryGetProperty("method", out var method) &&
        method.GetString() is "Runtime.exceptionThrown" or "Runtime.consoleAPICalled" or "Log.entryAdded" or "Network.loadingFailed")
    .Select(e =>
    {
        var method = e.GetProperty("method").GetString();
        var p = e.GetProperty("params");
        var item = new Dictionary<string, object?>
        {
            ["method"] = method
        };

        string? ReadString(JsonElement element, string name)
        {
            return element.TryGetProperty(name, out var value) ? value.ToString() : null;
        }

        return method switch
        {
            "Runtime.consoleAPICalled" => item
                .With("type", p.GetProperty("type").GetString())
                .With("text", string.Join(" ", p.GetProperty("args").EnumerateArray().Select(a => a.TryGetProperty("value", out var v) ? v.ToString() : a.ToString()))),
            "Log.entryAdded" => item
                .With("level", ReadString(p.GetProperty("entry"), "level"))
                .With("text", ReadString(p.GetProperty("entry"), "text"))
                .With("url", ReadString(p.GetProperty("entry"), "url")),
            "Network.loadingFailed" => item
                .With("errorText", ReadString(p, "errorText"))
                .With("blockedReason", ReadString(p, "blockedReason")),
            _ => item
                .With("text", ReadString(p.GetProperty("exceptionDetails"), "text"))
                .With("url", ReadString(p.GetProperty("exceptionDetails"), "url"))
                .With("line", ReadString(p.GetProperty("exceptionDetails"), "lineNumber"))
        };
    })
    .ToArray();

await ws.CloseAsync(WebSocketCloseStatus.NormalClosure, "done", CancellationToken.None);

Console.WriteLine(JsonSerializer.Serialize(new
{
    page = pageSummary,
    eventCount = events.Count,
    interestingEvents = interesting,
    screenshot = screenshotPath
}, new JsonSerializerOptions { WriteIndented = true }));

static class DictionaryExtensions
{
    public static Dictionary<string, object?> With(this Dictionary<string, object?> item, string key, object? value)
    {
        item[key] = value;
        return item;
    }
}
