# GUI-186 Next Slice Definition

Prepared: 2026-04-29 11:41 CEST  
Issue: [GUI-186](/GUI/issues/GUI-186)  
Baseline dependency: current `SocialGraph` head includes the post-`GUI-178` delete impact preview and short-lived undo recovery flow in the workbench

## 1. Wake Handling

The wake payload for this heartbeat contained no new issue-thread comments (`pending comments: 0/0`), so this definition is based on the checked-out repository state rather than a comment-driven scope change.

The important wake change was assignment priority, not product direction: `GUI-186` became the active lane and the next action shifted from generic repo maintenance to defining the first follow-on slice after the currently implemented delete-recovery work.

## 2. Current Baseline Observed

The active `SocialGraph` workbench already appears to include the slice that `GUI-175` proposed and that `GUI-178` likely delivered:

- in-app delete impact preview for entities and relationships
- short-lived undo recovery for deleted relationships
- short-lived undo recovery for deleted entities plus captured incident relationships
- explicit success and error notice states around delete and restore actions
- static asset and API regression coverage for delete recovery affordances

There is no direct `GUI-178` assessment artifact in this repository. The baseline above is therefore an inference from the current `wwwroot` assets, README delta, and regression tests in the checked-out workspace.

## 3. Recommended Immediate Next Slice

### Slice name

**Graph viewport controls and dense-state readability**

### Why this should be next

- The workbench is now safer to mutate, but the graph canvas still uses a fixed radial layout with no zoom, pan, or reset controls.
- That makes the primary visualization degrade quickly as node count, label length, or relationship density increases. The operator can recover from mistakes now, but still cannot reliably parse crowded graph states.
- Earlier UX checks already flagged graph readability as a remaining risk after the interaction-speed and delete-safety slices. The checked-in renderer still matches that limitation.
- This slice stays reviewable if it is constrained to viewport control and readability affordances inside the existing static frontend, without mixing in layout-engine redesign or deeper graph-analysis features.

## 4. Concrete Scope For The Follow-On Implementation Slice

### In scope

- Add graph viewport controls in the workbench:
  - zoom in
  - zoom out
  - reset view
  - fit current graph
- Add direct manipulation for the graph surface:
  - drag to pan the graph viewport
  - preserve click, double-click, and keyboard graph interactions while panning is available
- Keep graph state coherent with current workbench behaviors:
  - selected entity and selected relationship remain visibly emphasized after zoom or pan
  - focused-graph mode and spotlight/filter states keep working without additional API calls
- Improve dense-state readability without replacing the current renderer:
  - make labels and strokes remain legible across supported zoom levels
  - ensure the viewport does not clip the outer ring of nodes in normal use
- Extend static asset regression coverage for the new controls and graph interaction strings

### Explicitly out of scope

- replacing the radial layout with a force-directed or physics-based engine
- clustering, traversal, shortest-path, or recommendation features
- bulk edit/import/export flows
- persistent per-user viewport preferences
- backend or API contract changes unless a narrow graph-metadata gap is discovered during implementation

## 5. Planned File Touches

Primary files expected for the follow-on slice:

- `src/SocialGraph.Api/wwwroot/index.html`
  - add viewport controls and any helper copy needed for zoom/pan behavior
- `src/SocialGraph.Api/wwwroot/app.js`
  - introduce viewport state, zoom/pan handling, fit/reset behavior, and interaction-safe graph transforms
- `src/SocialGraph.Api/wwwroot/app.css`
  - style the new graph controls and preserve readability/focus treatment while transformed
- `tests/SocialGraph.Api.Tests/EntitiesApiTests.cs`
  - extend static asset assertions for viewport controls and interaction strings
- `README.md`
  - update the workbench capability list and manual smoke flow for zoom/pan/reset behavior

Default expectation: the slice should use the current API surface as-is.

## 6. Acceptance Criteria

The next implementation slice should be considered complete when all of the following are true:

1. The graph workbench exposes visible controls for zooming in, zooming out, resetting the view, and fitting the current graph.
2. Operators can pan the graph directly without breaking existing node and relationship inspection behavior.
3. Node selection, relationship selection, and focused-graph mode still work after zooming and panning.
4. Graph spotlight and filter emphasis remain coherent after viewport changes and do not require a graph refetch.
5. The default graph view no longer risks clipping the outer node ring under normal desktop viewport sizes.
6. The new controls remain keyboard reachable and retain visible focus treatment.
7. Existing API and static-asset regression tests continue to pass.

## 7. Verification Commands

Implementation verification for the follow-on slice should use:

```sh
dotnet build SocialGraph.sln -c Release
dotnet test SocialGraph.sln -c Release --no-build
```

Transport reachability for the mandatory Guido MCP endpoint can be rechecked from this workspace with:

```sh
bash ./scripts/check-guido-mcp.sh
```

Manual smoke checks:

1. Run the API host locally.
2. Open `/`.
3. Confirm the graph toolbar exposes zoom in, zoom out, reset, and fit controls.
4. Zoom in on a dense graph area and confirm node labels and selected-state emphasis remain readable.
5. Drag to pan the graph and confirm click, double-click, and keyboard graph interactions still work.
6. Focus the graph on an entity, then use zoom and pan while confirming the focused context and spotlight states remain coherent.
7. Reset or fit the graph and confirm the viewport returns to a stable, unclipped view.

## 8. Risks And Follow-On Note

- Pan gestures must not conflict with node click and double-click inspection semantics; implementation should keep the drag threshold explicit.
- Zoom behavior can easily produce unreadable text or oversized hit targets if SVG transforms are applied without compensating style choices.
- This recommendation intentionally leaves graph layout redesign and list-level keyboard scanning improvements for later slices. Those are still worthwhile, but viewport control is the sharper near-term improvement to real graph readability on the current architecture.
