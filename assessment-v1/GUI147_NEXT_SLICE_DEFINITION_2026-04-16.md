# GUI-147 Next Slice Definition

Prepared: 2026-04-16 10:54:02 CEST  
Issue: [GUI-147](/GUI/issues/GUI-147)  
Baseline dependency: [GUI-142](/GUI/issues/GUI-142)

## 1. Current Baseline Observed

The current worktree already delivers the relationship-inspector slice that GUI-135 recommended and GUI-142 appears to have implemented:

- persisted entity CRUD and relationship-edge CRUD backed by `data/socialgraph.json`
- `GET /api/graph` full snapshot plus one-hop focus via `?entityId=`
- graph-driven entity selection and relationship-edge selection
- relationship create/edit/delete from the browser inspector
- direct edge inspection from the graph even when no entity is selected
- selected relationship highlighting in both the inspector list and graph canvas
- static asset delivery from `wwwroot` with regression coverage for the current workbench surface

That baseline is now coherent for editing individual objects, but the operator experience still degrades quickly as graph density increases. The workbench can inspect a specific relationship once it is found, yet it still lacks a practical way to browse and narrow the full relationship set before picking one.

## 2. Recommended Immediate Next Slice

### Slice name

**Global relationship explorer and filter-driven graph browsing**

### Why this should be next

- GUI-142 made relationships first-class editable objects, which removes the most obvious maintenance gap.
- The next usability bottleneck is discovery, not editing: once the graph contains many edges, operators need a fast way to browse and narrow relationships without already knowing which entity to focus or which edge to click.
- The existing backend contract is already close to sufficient because `GET /api/relationship-edges` returns the full edge set when `entityId` is omitted.
- This slice can add meaningful operator leverage while preserving the current lightweight architecture: static assets, plain browser JavaScript, and JSON-backed storage.

## 3. Concrete Scope For The Follow-on Implementation Slice

### In scope

- Add a relationship browsing mode that works without a selected entity:
  - keep the current entity-context behavior
  - add a global browse state that shows all relationship edges
  - make the active mode explicit in the right panel copy and controls
- Add relationship filters in the right panel:
  - free-text filter across relationship id, source entity id, target entity id, kind, and note
  - kind filter driven from the currently loaded relationship data
  - directional filter when an entity is selected: `all`, `incoming`, `outgoing`
- Tighten list-to-graph coordination:
  - filtered relationship results should drive visible list counts and summary text
  - selecting a filtered relationship should still load it into the existing inspector
  - selecting a relationship from the filtered list should surface it in the graph, including a clear prompt when the current graph focus hides it
- Improve operator feedback for denser graphs:
  - show relationship result counts after filters are applied
  - show an explicit empty state when filters remove every result
  - keep create/edit actions available without making filter state ambiguous

### Explicitly out of scope

- multi-hop traversal or configurable pathfinding
- graph database migration or query-engine replacement
- auth, collaboration, or optimistic concurrency
- drag-and-drop/manual graph layout
- bulk import/export
- analytics such as centrality, clustering, or recommendation scoring

## 4. Planned File Touches

Primary files expected for the follow-on slice:

- `src/SocialGraph.Api/wwwroot/index.html`
  - add the relationship browsing and filtering controls
- `src/SocialGraph.Api/wwwroot/app.js`
  - extend browser state for browse mode, relationship filters, filtered summaries, and graph/list coordination
- `src/SocialGraph.Api/wwwroot/app.css`
  - style the new filter controls, browse-mode affordances, and empty/result states
- `tests/SocialGraph.Api.Tests/EntitiesApiTests.cs`
  - keep static asset smoke coverage aligned with the updated workbench strings
- `README.md`
  - document the browse/filter workflow and revised manual smoke path

Default expectation: use the existing API surface as-is. Backend changes should only be introduced if implementation reveals a concrete operator gap that cannot be solved cleanly with the current `GET /api/relationship-edges` contract.

## 5. Acceptance Criteria

The next implementation slice should be considered complete when all of the following are true:

1. An operator can browse relationship edges even when no entity is selected.
2. An operator can filter relationships by text and by kind from the browser workbench.
3. When an entity is selected, the operator can narrow the relationship list to incoming, outgoing, or all incident edges.
4. The workbench shows the current result count and a clear empty state after filters are applied.
5. Selecting a relationship from the filtered list still loads the existing relationship inspector correctly.
6. The operator can clear or change filters without losing create/edit/delete behavior for relationships.
7. The graph/list coordination still makes it clear when a selected relationship is outside the current focused one-hop graph.
8. Existing API regression tests still pass after the UI changes.
9. The workbench remains framework-free and served from static `wwwroot` assets.

## 6. Verification Commands

Implementation verification for the follow-on slice should use:

```sh
dotnet build SocialGraph.sln -c Release
dotnet test SocialGraph.sln -c Release --no-build
```

Manual smoke checks:

1. Run the API host locally.
2. Open `/`.
3. Browse all relationships with no entity selected and confirm the global list is populated.
4. Filter relationships by a kind value and confirm the list count and empty state react correctly.
5. Select an entity, switch between incoming and outgoing filters, and confirm the list contents change appropriately.
6. Select a filtered relationship and confirm the inspector loads the same edge.
7. Focus the graph on an entity, then select a relationship outside that focus and confirm the workbench explains why the edge is not currently visible.

## 7. Risks And Notes

- The right panel is already carrying multiple responsibilities. The next slice should improve discoverability without turning the panel into a dense control wall.
- Filter state should stay explicit and resettable. Hidden coupling between entity selection, graph focus, and relationship filters will make the UI hard to reason about.
- The current graph rendering is intentionally simple. This slice should not attempt to solve visual density in the SVG itself beyond selection and messaging.
- This recommendation intentionally defers traversal depth. The immediate value is helping operators find the relationship they already need within the graph they already have.
