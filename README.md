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
- `DELETE /api/entities/{id}`
- `GET /api/graph`
- `GET /api/relationship-edges`
- `GET /api/relationship-edges/{id}`
- `POST /api/relationship-edges`
- `PUT /api/relationship-edges/{id}`
- `DELETE /api/relationship-edges/{id}`

`/api/relationships` is also supported as an alias for the relationship edge endpoints.

Deleting an entity also removes any incident relationship edges in the same persisted write so the stored graph never contains orphaned links.

`GET /api/graph` returns a frontend-ready snapshot with `nodes` and `links`. Add `?entityId=alpha` to return only the selected entity, directly connected neighbors, and incident relationships. The API returns `404` for an unknown focus entity.

The API host also serves an interactive single-page workbench at `/`. It loads entities, relationship edges, and the graph snapshot directly from the API so an operator can:

- browse and filter entities
- browse all relationship edges even when no entity is selected
- filter relationships by free text and kind from the right-side explorer
- switch selected-entity relationship browsing between all, incoming, and outgoing incident edges
- create, edit, and delete entities
- inspect a relationship directly from the graph even when no entity is selected
- create, edit, and delete relationship edges
- focus the graph on a selected entity's one-hop neighborhood and reset back to the full graph
- see relationship result counts and explicit empty states as filters change
- see the selected relationship highlighted in both the inspector list and graph canvas
- see a notice when a selected relationship is outside the currently focused graph
- see inline loading and error states when API requests fail

The workbench intentionally stays framework-free for this slice: the UI is delivered as static `wwwroot` assets with plain browser-side JavaScript.

Current workbench asset layout:

- `src/SocialGraph.Api/wwwroot/index.html`: page structure and static asset references
- `src/SocialGraph.Api/wwwroot/app.css`: extracted workbench styles
- `src/SocialGraph.Api/wwwroot/app.js`: extracted browser state, rendering, and event wiring

## Storage

Graph data is persisted in a local JSON document instead of a managed graph database. This keeps development and evaluation free while the graph model is still small: entities and relationship edges are stored together, writes are flushed atomically, and the API reloads the same data after a restart.

The default path is `data/socialgraph.json`. Override it with either:

- `SOCIALGRAPH_DATA_PATH=/absolute/or/relative/path.json`
- ASP.NET configuration key `Storage:DataPath`

Neo4j remains a reasonable later adapter if traversal/query complexity outgrows the embedded JSON store, but it is intentionally not required for this slice.

## Verification

- `dotnet build SocialGraph.sln -c Release`
- `dotnet test SocialGraph.sln -c Release --no-build`

Manual smoke flow:

1. Run the API host.
2. Open `/`.
3. Browse all relationships with no entity selected and confirm the global list is populated.
4. Filter relationships by text and by kind, then confirm the result count and empty state update.
5. Select an entity and confirm the relationship panel switches into entity-context mode.
6. Switch between incoming, outgoing, and all relationship filters for that entity.
7. Select a relationship from the filtered list, edit its kind or note, and confirm the persisted change survives refresh.
8. Click a graph edge directly and confirm the inspector loads the same relationship.
9. Focus the graph on an entity, then inspect a relationship outside that focus and confirm the notice explains why it is not visible.
10. Clear the relationship selection, create a new relationship edge, then delete it.
