using System.Text.Json;
using SocialGraph.Application.Contracts;
using SocialGraph.Application.Ports;

namespace SocialGraph.Infrastructure.Persistence;

public sealed class JsonQaModelAValidationReportSource : IQaModelAValidationReportSource
{
    private static readonly JsonSerializerOptions SerializerOptions = new(JsonSerializerDefaults.Web);

    private readonly string _reportPath;

    public JsonQaModelAValidationReportSource(QaModelAValidationReportOptions options)
    {
        _reportPath = ResolvePath(options.ReportPath);
    }

    public async Task<QaModelAValidationSourceDocument> GetAsync(CancellationToken cancellationToken)
    {
        if (!File.Exists(_reportPath))
        {
            return CreateFallbackDocument();
        }

        await using var stream = File.OpenRead(_reportPath);
        var document = await JsonSerializer.DeserializeAsync<QaModelAValidationSourceDocument>(stream, SerializerOptions, cancellationToken);
        return document ?? CreateFallbackDocument();
    }

    private static string ResolvePath(string reportPath)
    {
        var path = string.IsNullOrWhiteSpace(reportPath)
            ? "assessment-v1/GUI92_QA_MODEL_A_VALIDATION_REPORT_SOURCE.json"
            : reportPath;
        if (Path.IsPathRooted(path))
        {
            return path;
        }

        var candidates = new List<string>
        {
            Path.GetFullPath(path, Directory.GetCurrentDirectory()),
            Path.GetFullPath(path, AppContext.BaseDirectory)
        };

        var directory = new DirectoryInfo(AppContext.BaseDirectory);
        while (directory is not null)
        {
            candidates.Add(Path.Combine(directory.FullName, path));
            directory = directory.Parent;
        }

        return candidates.FirstOrDefault(File.Exists) ?? candidates[0];
    }

    private static QaModelAValidationSourceDocument CreateFallbackDocument() =>
        new(
            "GUI-92",
            new DateOnly(2026, 4, 20),
            null,
            new DateOnly(2026, 5, 20),
            DateTimeOffset.UtcNow,
            "Fallback checkpoint document was generated because the configured GUI-92 source file was missing.",
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            ["qa_requested_at", "qa_acknowledged_at", "qa_completed_at", "lead_time_hours"]);
}
