using SocialGraph.Application.Contracts;

namespace SocialGraph.Application.Ports;

public interface IQaModelAValidationReportSource
{
    Task<QaModelAValidationSourceDocument> GetAsync(CancellationToken cancellationToken);
}
