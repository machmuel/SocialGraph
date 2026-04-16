# GUI-129 Next Slice Definition

Prepared: 2026-04-16 (Europe/Berlin)  
Issue: [GUI-129](/GUI/issues/GUI-129)  
Follow-on implementation issue: [GUI-130](/GUI/issues/GUI-130)  
Baseline dependency: [GUI-124](/GUI/issues/GUI-124)

## 1. Current Baseline Observed

The current `GUI-124` worktree establishes the first usable backend-oriented SocialGraph slice:

- persisted entity storage in `data/socialgraph.json`
- persisted relationship-edge CRUD
- `GET /api/graph` full snapshot plus `?entityId=` one-hop focus
- cascade deletion of incident relationships when an entity is removed
- a static `/` graph viewer that renders the current graph as SVG

That gives the project a working graph API and a visual smoke surface, but it still does not provide a practical operator workflow for exploring or editing the graph from the browser.

## 2. Recommended Immediate Next Slice

### Slice name

**Interactive graph workbench on top of the existing API**

### Why this should be next

- `GUI-124` already delivered the domain primitives and persistence needed for graph editing.
- The largest remaining product gap is usability, not storage or route coverage.
- A browser workbench turns the current API into a testable end-to-end user flow without introducing a heavier frontend stack yet.
- This keeps `GUI-130` tightly scoped: mostly static UI work, minimal backend changes only if needed for small convenience affordances.

## 3. Concrete Scope For GUI-130

### In scope

- Replace the current static landing page with a simple single-page workbench served from `src/SocialGraph.Api/wwwroot/index.html`.
- Add an entity list / inspector panel that:
  - loads all entities from `/api/entities`
  - shows the selected entity's name and note
  - allows create, edit, and delete of entities via the existing entity endpoints
- Add graph focus interaction that:
  - lets the operator click an entity in the list or graph
  - reloads `/api/graph?entityId=<id>` for focused exploration
  - provides a clear "show full graph" reset action
- Add a relationship-edge panel that:
  - lists relationships incident to the selected entity using `/api/relationship-edges?entityId=<id>`
  - allows create and delete of relationships with existing endpoints
  - surfaces source, target, kind, and note clearly
- Add inline error and loading states so failed API calls are visible in the page instead of silently failing.
- Refresh all affected panels after any successful mutation so the UI always reflects persisted state.

### Explicitly out of scope

- introducing a JS framework, bundler, or separate frontend app
- multi-hop traversal beyond the current one-hop focused graph
- authentication, multi-user editing, or conflict resolution
- advanced graph layout physics
- graph database migration or Neo4j integration
- bulk import/export workflows

## 4. Planned File Touches

Primary files expected for `GUI-130`:

- `src/SocialGraph.Api/wwwroot/index.html`
  - replace the read-only SVG page with the interactive workbench UI, styles, and browser-side controller code
- `tests/SocialGraph.Api.Tests/EntitiesApiTests.cs`
  - extend coverage for any backend behavior added to support the workbench
  - keep the existing static asset smoke test, updated for new UI strings if needed
- `README.md`
  - document the workbench behavior and revised manual verification flow

Conditional backend touches only if the UI implementation proves them necessary:

- `src/SocialGraph.Api/Program.cs`
  - only for small API-shape additions that reduce client-side complexity
- `src/SocialGraph.Application/Services/GraphService.cs`
  - only if minor graph response metadata is required for focus/reset UX

Default expectation: the slice should use the current API surface as-is unless a small gap is discovered during implementation.

## 5. Acceptance Criteria

`GUI-130` should be considered complete when all of the following are true:

1. Opening `/` shows an interactive SocialGraph workbench instead of a read-only canvas.
2. The page loads the current persisted entities and graph without requiring manual API calls.
3. Selecting an entity from the graph or entity list reloads the focused one-hop graph for that entity.
4. The operator can create an entity from the page and immediately see it in the entity list and graph after refresh.
5. The operator can update an entity's name/note from the page and see the persisted change after refresh.
6. The operator can delete an entity from the page and the UI reflects the removal of any incident relationships.
7. The operator can create a relationship edge from the page using existing entities and see it in both the relationship list and graph.
8. The operator can delete a relationship edge from the page and see it removed immediately after refresh.
9. Failed API calls display a visible error message in the page.
10. Existing API regression tests still pass.

## 6. Verification Commands

Implementation verification for `GUI-130` should use:

```sh
dotnet build SocialGraph.sln -c Release
dotnet test SocialGraph.sln -c Release --no-build
```

Manual smoke checks:

1. Run the API host locally.
2. Open `/` in a browser.
3. Create an entity, edit it, and delete it from the workbench.
4. Create and delete a relationship edge from the workbench.
5. Click an entity to confirm focused graph reload and use the reset control to return to the full graph.
6. Restart the host and confirm the previously saved graph state persists.

## 7. Risks And Notes

- The current single-file static page can become messy quickly. Keep browser-side state small and explicit.
- If mutation UX starts forcing significant client complexity, split the page assets into separate `wwwroot` files rather than introducing a framework immediately.
- `GUI-130` should avoid broad backend redesign. The value of the slice is proving a complete operator loop on top of the current API.
- This recommendation assumes the inspected `GUI-124` worktree lands substantially as implemented in the current workspace.
