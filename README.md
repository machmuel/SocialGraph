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

Operational note:

- the bare Guido MCP root can respond with `404`; for this repo that still counts as "online" because the remote HTTP endpoint answered
- use `./scripts/check-guido-mcp.sh` to verify transport reachability from the current workspace and print the observed HTTP status line

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
- `GET /api/cto/weekly-monitor/qa-model-a-validation`

`/api/relationships` is also supported as an alias for the relationship edge endpoints.

Deleting an entity also removes any incident relationship edges in the same persisted write so the stored graph never contains orphaned links.

`GET /api/graph` returns a frontend-ready snapshot with `nodes` and `links`. Add `?entityId=alpha` to return only the selected entity, directly connected neighbors, and incident relationships. The API returns `404` for an unknown focus entity.

`GET /api/cto/weekly-monitor/qa-model-a-validation` is the `GUI-92` checkpoint report path used by the day-30 QA Model A preflight. It reads from `assessment-v1/GUI92_QA_MODEL_A_VALIDATION_REPORT_SOURCE.json` by default and returns a structured `PASS`, `FAIL`, or `NO_READOUT` result using the frozen thresholds from the assessment docs. Override the source file with either:

- `SOCIALGRAPH_QA_VALIDATION_REPORT_PATH=/absolute/or/relative/path.json`
- ASP.NET configuration key `QaValidation:ReportPath`

The API host also serves an interactive single-page workbench at `/`. It loads entities, relationship edges, and the graph snapshot directly from the API so an operator can:

- browse and filter entities
- see each entity's incident relationship count before selecting it
- inspect a selected entity's neighborhood summary with incident, incoming, outgoing, and distinct-neighbor counts
- drill into neighboring entities from the selected-entity summary and optionally refocus the graph on that neighbor
- use incident relationship kind chips from the selected entity to drive the existing relationship explorer filters
- browse all relationship edges even when no entity is selected
- filter relationships by free text and kind from the right-side explorer
- switch selected-entity relationship browsing between all, incoming, and outgoing incident edges
- create, edit, and delete entities
- inspect a relationship directly from the graph even when no entity is selected
- create, edit, and delete relationship edges
- focus the graph on a selected entity's one-hop neighborhood and reset back to the full graph
- inspect entities and relationships locally without triggering a full workbench reload on every selection
- spotlight matching nodes when entity search is active and emphasize matching edges when relationship filters are active without forcing a graph refetch
- see relationship result counts and explicit empty states as filters change
- see the selected relationship highlighted in both the inspector list and graph canvas
- see a notice when a selected relationship is outside the currently focused graph
- see inline loading and error states when API requests fail
- see visible graph guidance for inspect-versus-focus behavior plus keyboard focus rings on interactive controls

The workbench intentionally stays framework-free for this slice: the UI is delivered as static `wwwroot` assets with plain browser-side JavaScript.

Current workbench asset layout:

- `src/SocialGraph.Api/wwwroot/index.html`: page structure and static asset references
- `src/SocialGraph.Api/wwwroot/app.css`: extracted workbench styles, neighborhood cards, and graph spotlight states
- `src/SocialGraph.Api/wwwroot/app.js`: browser state, derived entity metrics, relationship filtering, and graph spotlight wiring

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
4. Confirm the entity list shows incident relationship counts before any entity is selected.
5. Select an entity and confirm the summary card shows incoming, outgoing, total incident, and distinct neighbor counts without triggering global loading churn.
6. Click a neighbor from the summary card and confirm the workbench selects that entity locally; use the neighbor focus action and confirm only the graph refetches into one-hop mode.
7. Click an incident relationship kind chip and confirm the relationship explorer kind filter updates to match.
8. Filter relationships by text and by kind, then confirm the result count and empty state update.
9. Apply an entity search term and confirm matching nodes are spotlighted while non-matches are visually muted.
10. Select a relationship from the filtered list or graph and confirm the inspector updates immediately without a full workbench reload.
11. Confirm the graph hint explains inspect versus focus behavior, including the visible Focus controls.
12. Focus the graph on an entity, then inspect a relationship outside that focus and confirm the notice explains why it is not visible.
13. Tab through buttons, inputs, selects, graph nodes, and graph links and confirm visible focus treatment is present.
14. Clear the relationship selection, create a new relationship edge, then delete it.
