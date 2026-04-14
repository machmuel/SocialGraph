# SocialGraph

`SocialGraph` is the `.NET 10` solution scaffold for GUI-100 under the Guido MCP-only policy.

## Structure

- `src/SocialGraph.Api`: ASP.NET Core host and HTTP endpoints
- `src/SocialGraph.Application`: use cases and ports
- `src/SocialGraph.Domain`: core domain types
- `src/SocialGraph.Infrastructure`: adapter implementations
- `tests/SocialGraph.Api.Tests`: endpoint regression tests

## Guido MCP

The solution-level MCP config is stored in `.mcp.json` and points to:

- `https://mcp-guido.stephan-derkowski.de/`

## First Slice

The initial delivery slice implements:

- `GET /health`
- `GET /api/entities`
- `GET /api/entities/{id}`
- `POST /api/entities`
- `PUT /api/entities/{id}`

## Verification

- `dotnet build SocialGraph.sln -c Release`
- `dotnet test SocialGraph.sln -c Release --no-build`
