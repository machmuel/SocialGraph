# GUI-135 Next Slice Definition

Prepared: 2026-04-16 (Europe/Berlin)  
Issue: [GUI-135](/GUI/issues/GUI-135)  
Baseline dependency: [GUI-130](/GUI/issues/GUI-130)

## 1. Current Baseline Observed

The current `GUI-130` worktree establishes the first practical operator-facing SocialGraph slice:

- persisted entity and relationship-edge CRUD backed by `data/socialgraph.json`
- `GET /api/graph` full snapshot plus one-hop focused graph via `?entityId=`
- a framework-free `/` workbench with entity create/edit/delete
- relationship-edge create/delete from the browser
- selection-driven graph focus and full-graph reset controls
- inline loading/error states and regression coverage for the current API/UI surface

That is enough for a complete end-to-end operator loop, but the workbench still treats relationships as second-class objects. The API already supports relationship detail and update operations, while the UI only supports create/delete and basic per-entity listing.

## 2. Recommended Immediate Next Slice

### Slice name

**Relationship inspector and graph-driven editing**

### Why this should be next

- `GUI-130` solved the biggest usability gap by making the graph editable at all.
- The highest remaining product friction is relationship maintenance: operators can create links, but they cannot inspect or revise them cleanly once the graph gets denser.
- The backend contract for this slice mostly already exists (`GET /api/relationship-edges/{id}`, `PUT /api/relationship-edges/{id}`), so the next increment can stay focused on operator workflow rather than new storage work.
- This slice strengthens the graph as the primary interaction surface before considering more ambitious traversal, search, or layout work.

## 3. Concrete Scope For The Follow-on Implementation Slice

### In scope

- Add first-class relationship selection to the workbench:
  - clicking a relationship card selects it
  - clicking a graph edge selects it
  - the selected relationship is visibly highlighted in both list and graph
- Replace the create-only relationship form with a create/edit inspector that:
  - loads the selected relationship into the form
  - supports updating source, target, kind, and note through the existing `PUT` endpoint
  - supports clearing the selection to return to create mode
- Tighten graph-to-panel coordination:
  - selecting a node in the graph also selects that entity in the left panel
  - selecting an edge in the graph loads its details in the relationship inspector
  - graph highlights should distinguish selected entity vs selected relationship
- Improve relationship context in the right panel:
  - show relationship id and direction clearly
  - surface when the selected relationship is outside the currently focused one-hop graph
  - keep the panel useful when no entity is selected by allowing direct relationship inspection from the graph
- Preserve the existing lightweight stack:
  - continue using static `wwwroot` assets and plain browser JavaScript
  - avoid introducing a separate frontend framework or build pipeline

### Explicitly out of scope

- multi-hop traversal or pathfinding
- graph database migration or Neo4j integration
- drag-and-drop/manual node positioning
- bulk import/export
- auth, collaboration, or optimistic concurrency control
- advanced analytics such as centrality, clustering, or recommendations

## 4. Planned File Touches

Primary files expected for the follow-on slice:

- `src/SocialGraph.Api/wwwroot/index.html`
  - extend browser-side state to track selected relationship and graph-edge interactions
  - convert the relationship form from create-only to create/edit inspector behavior
  - add visual selection/highlight treatment for graph edges and relationship cards
- `tests/SocialGraph.Api.Tests/EntitiesApiTests.cs`
  - keep static asset smoke coverage aligned with the updated workbench strings and behavior
- `README.md`
  - document the richer relationship-editing workflow and revised manual smoke steps

Conditional backend touches only if implementation exposes a real UX gap:

- `src/SocialGraph.Application/Contracts/GraphLinkDto.cs`
- `src/SocialGraph.Application/Services/GraphService.cs`

Default expectation: use the current API surface as-is unless the UI proves that a small metadata addition is necessary for clearer edge selection or focus state.

## 5. Acceptance Criteria

The next implementation slice should be considered complete when all of the following are true:

1. An operator can select a relationship from the relationship list and see it loaded into an edit form.
2. An operator can click a rendered graph edge and see the same relationship selected in the inspector.
3. The selected relationship is visually distinguishable in both the relationship list and graph canvas.
4. The operator can update a relationship's source, target, kind, and note from the browser and see the persisted change after refresh.
5. The workbench still supports creating a new relationship after clearing the current relationship selection.
6. Selecting a graph node still selects the matching entity and keeps entity-centric workflows intact.
7. Relationship deletion still works when a relationship is selected for editing.
8. Failed relationship update requests display a visible inline error message.
9. Existing API regression tests still pass.
10. The workbench remains framework-free and served from static `wwwroot` assets.

## 6. Verification Commands

Implementation verification for the follow-on slice should use:

```sh
dotnet build SocialGraph.sln -c Release
dotnet test SocialGraph.sln -c Release --no-build
```

Manual smoke checks:

1. Run the API host locally.
2. Open `/`.
3. Select an entity, then select one of its relationship edges from the panel.
4. Edit that relationship's kind or note and confirm the graph/list refresh with the persisted change.
5. Click a graph edge directly and confirm the relationship inspector syncs to the same edge.
6. Clear the relationship selection, create a new relationship, then delete it.
7. Focus the graph on an entity and confirm edge selection/highlighting still works in focused mode.

## 7. Risks And Notes

- The current single-file page is still manageable, but additional UI state should stay explicit and minimal. Avoid drifting into implicit selection rules that are hard to debug.
- Edge hit-targets in SVG can become awkward if labels and lines overlap. Favor simple, forgiving click targets over visual cleverness.
- If graph-edge selection requires notable DOM complexity, splitting the page into small static JS/CSS assets is reasonable before adopting any heavier frontend tooling.
- This recommendation intentionally avoids pushing traversal depth or backend redesign. The next value is making the current graph objects easier to inspect and maintain.
