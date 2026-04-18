# GUI-170 Next Slice Definition

Prepared: 2026-04-19 16:10 CEST  
Issue: [GUI-170](/GUI/issues/GUI-170)  
Baseline dependency: shipped neighborhood/spotlight work following [GUI-151](/GUI/issues/GUI-151)

## 1. Wake Handling

Wake payload contained no new issue-thread comments (`pending comments: 0/0`), so this definition is based on the current `main` worktree rather than a comment-driven revision.

## 2. Current Baseline Observed

The current `SocialGraph` head already appears to include the slice that `GUI-151` proposed:

- entity incident counts in the left-column explorer
- selected-entity neighborhood summary with incoming, outgoing, incident, and neighbor counts
- neighbor drilldown and one-hop graph focus actions
- incident relationship-kind chips that drive the relationship explorer
- graph spotlighting for entity search and relationship filters
- explicit focus-vs-spotlight messaging in the workbench
- regression coverage for the static workbench assets and graph/focus API behavior

There is no separate `GUI-152` artifact in this repository. The recommendation below therefore uses the currently shipped neighborhood/spotlight experience as the effective post-`GUI-152` baseline. This is an inference from the code and docs, not a direct issue-thread citation.

## 3. Recommended Immediate Next Slice

### Slice name

**Fast selection path and visible graph focus affordance**

### Why this should be next

- The current workbench is now context-rich enough to explore, but the interaction model is still heavier than it needs to be: selecting an entity or relationship triggers a full multi-endpoint refresh instead of a local state render.
- That refresh cost directly affects the primary operator loop. Every exploratory click pays the same price as a mutating action, which will feel unstable as latency or dataset size grows.
- The graph already supports a faster exploration gesture (`double-click` to focus), but the UI does not teach it. This keeps a valuable interaction path effectively hidden.
- This slice stays inside the existing frontend architecture: static `wwwroot` assets and current API contracts. It should be small, reviewable, and low-risk compared with bundling undo/restore or backend redesign into the same change.

## 4. Concrete Scope For The Follow-On Implementation Slice

### In scope

- Split the current selection/focus behavior into distinct paths:
  - entity selection updates local browser state and re-renders without calling the full refresh pipeline
  - relationship selection updates local browser state and only fetches relationship detail when needed
  - graph focus continues to refetch graph data, but only for the graph payload
- Keep mutation paths explicit:
  - create, update, delete, and manual reload still use the broader refresh path
  - selection-only interactions do not toggle all loading indicators
- Improve graph discoverability:
  - add visible helper copy near the graph controls explaining select vs focus behavior
  - keep non-double-click parity through existing visible `Focus` controls
- Harden basic accessibility semantics tied to this interaction loop:
  - loading indicators update `aria-hidden` consistently with visibility
  - interactive controls receive clear `:focus-visible` treatment

### Explicitly out of scope

- delete confirmation modal or undo toast flows
- bulk import/export or graph traversal beyond one-hop focus
- backend/API contract changes unless a narrow selection-detail gap is proven during implementation
- graph layout redesign or drag-and-drop positioning
- analytics, recommendations, or clustering

## 5. Planned File Touches

Primary files expected for the follow-on slice:

- `src/SocialGraph.Api/wwwroot/app.js`
  - separate local selection renders from network refreshes
  - keep graph-only fetches isolated for focus transitions
  - synchronize loading accessibility state
- `src/SocialGraph.Api/wwwroot/index.html`
  - add graph interaction hint copy and any small status affordances needed for the new interaction model
- `src/SocialGraph.Api/wwwroot/app.css`
  - add focus-visible styling and any graph-hint presentation updates
- `tests/SocialGraph.Api.Tests/EntitiesApiTests.cs`
  - extend static asset assertions for the graph hint and accessibility-related selectors/strings
- `README.md`
  - update manual smoke flow to reflect the faster selection model and visible graph guidance

Default expectation: the slice should use the current API surface as-is.

## 6. Acceptance Criteria

The next implementation slice should be considered complete when all of the following are true:

1. Selecting an entity from the entity list no longer triggers the full workbench refresh pipeline.
2. Selecting a relationship from the list or graph no longer triggers the full workbench refresh pipeline.
3. Focusing the graph still reloads the one-hop graph correctly without reloading unrelated data.
4. The graph UI explicitly teaches how to select and how to focus.
5. Loading indicators expose visibility changes through correct accessibility semantics.
6. Keyboard users can see a clear focus ring on interactive controls in the workbench.
7. Existing entity and relationship mutation flows still work after the interaction-path split.
8. Existing API and static-asset regression tests still pass.

## 7. Verification Commands

Implementation verification for the follow-on slice should use:

```sh
dotnet build SocialGraph.sln -c Release
dotnet test SocialGraph.sln -c Release --no-build
```

Manual smoke checks:

1. Run the API host locally.
2. Open `/`.
3. Select several entities in sequence and confirm the left and right panels update immediately without global loading churn.
4. Select several relationships in sequence and confirm the inspector updates immediately without refetching the full workbench.
5. Use `Focus` from the entity list or summary and confirm only the graph context changes into one-hop mode.
6. Confirm the graph shows visible hint copy for select vs focus behavior.
7. Tab through buttons, inputs, and selects and confirm visible focus treatment is present.

## 8. Risks And Follow-On Note

- Local-only selection updates must not leave stale form state behind when a mutation completes. The implementation should keep mutation refreshes authoritative.
- Relationship detail loading should remain deterministic if the selected edge was deleted by a previous action in the same session.
- This recommendation intentionally leaves destructive-action safety for the next slice. Delete confirmation plus undo remains important, but it should land separately from the selection-path refactor to keep review scope tight and failure modes easier to reason about.
