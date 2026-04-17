# GUI-151 Next Slice Definition

Prepared: 2026-04-17 20:58 CEST  
Issue: [GUI-151](/GUI/issues/GUI-151)  
Baseline dependency: [GUI-148](/GUI/issues/GUI-148)

## 1. Current Baseline Observed

The current worktree already delivers the relationship-discovery slice that GUI-147 recommended and GUI-148 appears to have implemented:

- persisted entity CRUD and relationship-edge CRUD backed by `data/socialgraph.json`
- `GET /api/graph` full snapshot plus one-hop focus via `?entityId=`
- global relationship browsing with free-text, kind, and direction filters
- graph-driven entity selection and direct relationship inspection from the SVG canvas
- relationship create/edit/delete from the workbench inspector
- selected relationship highlighting plus explicit messaging when the current graph focus hides that edge
- framework-free static asset delivery from `wwwroot` with regression coverage for the current browser surface

That baseline is coherent for finding and editing a specific relationship, but the next operator bottleneck is understanding entity context quickly once the graph grows. The left column still acts mostly as a flat CRUD list, and the graph canvas does not yet help the operator see which entities or edges matter after search and filter state is applied.

## 2. Recommended Immediate Next Slice

### Slice name

**Entity neighborhood summary and graph spotlighting**

### Why this should be next

- GUI-148 addressed the biggest remaining discovery gap for relationships, so the next value is helping operators understand why a selected entity matters before they edit anything.
- Once the graph contains more than a handful of nodes, operators need fast local context: incident counts, neighbor list, relationship kind mix, and a clear visual signal on the graph for the current search/filter state.
- This slice can stay within the current lightweight architecture: plain browser JavaScript, static `wwwroot` assets, and JSON-backed persistence.
- Most of the required data is already available from the existing entity, relationship-edge, and graph endpoints, so the follow-on implementation can remain primarily UI-driven.

## 3. Concrete Scope For The Follow-on Implementation Slice

### In scope

- Upgrade the entity explorer from a flat CRUD list into an operator context surface:
  - show each entity's incident relationship count in the list
  - show a selected-entity summary card with total incident relationships, incoming count, outgoing count, and distinct neighbor count
  - keep the existing create/edit/delete workflow intact
- Add neighborhood drilldown for the selected entity:
  - show neighboring entities derived from the current relationship data
  - allow clicking a neighbor to select that entity and optionally refocus the graph
  - show incident relationship kinds as quick chips that feed the existing relationship-filter controls
- Add graph spotlighting that respects existing browser state:
  - when entity search is active, highlight matching nodes and visually mute non-matches
  - when relationship filters are active, emphasize matching edges and de-emphasize non-matching edges in the full graph
  - keep focused one-hop mode explicit so operators can distinguish spotlighting from graph refetch focus
- Improve graph-to-panel coordination:
  - keep the summary copy clear about whether the operator is viewing full graph, focused graph, or spotlighted filter results
  - make it obvious which entity the relationship filters are currently scoped around
  - preserve current relationship-inspector behavior when entity selection changes

### Explicitly out of scope

- multi-hop traversal or pathfinding beyond the existing one-hop focus
- graph database migration or query-engine replacement
- drag-and-drop/manual node layout
- auth, collaboration, or optimistic concurrency
- bulk import/export
- analytics such as centrality, recommendations, or clustering

## 4. Planned File Touches

Primary files expected for the follow-on slice:

- `src/SocialGraph.Api/wwwroot/index.html`
  - add selected-entity summary and neighborhood drilldown sections
- `src/SocialGraph.Api/wwwroot/app.js`
  - derive entity metrics from loaded relationship data, wire quick-filter chips, and apply graph spotlight styling rules
- `src/SocialGraph.Api/wwwroot/app.css`
  - style summary cards, neighbor chips, and spotlight/dim visual states for nodes and links
- `tests/SocialGraph.Api.Tests/EntitiesApiTests.cs`
  - keep static asset smoke coverage aligned with the updated workbench strings and browser affordances
- `README.md`
  - document the new entity-context workflow and revised manual smoke checks

Conditional backend touch only if implementation exposes a concrete client-side data gap:

- `src/SocialGraph.Application/Contracts/EntityDto.cs`
- `src/SocialGraph.Application/Services/EntityService.cs`

Default expectation: use the current API surface as-is unless deriving stable entity metrics in the browser proves too indirect or too fragile.

## 5. Acceptance Criteria

The next implementation slice should be considered complete when all of the following are true:

1. An operator can see each entity's incident relationship count without opening that entity first.
2. Selecting an entity shows inbound, outbound, total-incident, and neighbor-count summary data in the workbench.
3. The workbench shows a clickable neighbor list for the selected entity and uses it to move the operator through the graph.
4. The workbench exposes incident relationship kinds for the selected entity as quick controls that feed the existing relationship explorer.
5. Applying entity search or relationship filters visually spotlights matching nodes or edges in the graph while preserving full-graph context.
6. Focused one-hop graph mode remains distinct from spotlight-only styling, and the UI explains the difference clearly.
7. Existing relationship create/edit/delete flows still work after the entity-context additions.
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
3. Confirm the entity list shows relationship counts before any entity is selected.
4. Select an entity and confirm the summary card shows inbound/outbound counts plus neighboring entities.
5. Click a neighbor from the summary and confirm the workbench selects that entity and refreshes the surrounding context.
6. Apply an entity search term and confirm the graph spotlights matching nodes while non-matches are visually muted.
7. Apply relationship filters and confirm matching edges are emphasized without breaking the current relationship inspector flow.

## 7. Risks And Notes

- Derived metrics can become misleading if the client mixes full-graph relationship data with entity-scoped relationship data implicitly. The next slice should keep those data sources explicit.
- Spotlight styling must remain legible. Dimming non-matches too aggressively will make the graph feel broken rather than guided.
- The left column should gain context without collapsing into a dense dashboard. Keep the summary focused on the next operator decision, not on exhaustive analytics.
- This recommendation intentionally defers traversal depth and storage redesign. The immediate value is making the current graph easier to understand and navigate after relationship discovery has landed.
