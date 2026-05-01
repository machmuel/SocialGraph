# GUI-202 Next Slice Definition

Prepared: 2026-04-29 14:34 CEST  
Issue: [GUI-202](/GUI/issues/GUI-202)  
Baseline dependency: current `SocialGraph` head already includes the post-`GUI-195` keyboard-first explorer navigation slice that this repo appears to treat as the effective `GUI-196` baseline

## 1. Wake Handling

The wake payload for this heartbeat contained no pending thread comments (`0/0`), so there was no comment-driven scope correction to absorb before acting.

The wake changed active issue priority rather than product direction: `GUI-202` became the current critical lane, which shifted the next action from generic workspace maintenance to defining the next `SocialGraph` slice after the now-visible keyboard-first explorer work.

## 2. Current Baseline Observed

The checked-out workspace already shows the capability that `GUI-195` had recommended:

- entity cards are directly keyboard reachable
- relationship cards are directly keyboard reachable
- explorer hints document Enter, Space, arrow-key movement, and `F`-to-focus behavior
- static asset tests already assert the keyboard explorer copy and handler presence
- README smoke steps already cover direct card focus and keyboard-driven inspection

The repository does not include a dedicated `GUI-196` assessment artifact, so the exact issue-to-commit mapping cannot be proven from assessment files alone. The `GUI-196` baseline statement above is therefore an inference from the current `README.md`, `wwwroot` assets, tests, and recent local diff state.

## 3. Recommended Immediate Next Slice

### Slice name

**Reload-safe workbench state and shareable operator context**

### Why this should be next

- The workbench now supports richer operator flows: focused graph mode, spotlighted searches, keyboard-first explorer traversal, and local inspection without full reload churn.
- That richer flow is still fragile because a page refresh, accidental reload, or copied browser URL loses the operator's current context.
- The current UI has enough state that "start over after reload" is now a material workflow tax rather than a minor inconvenience.
- This slice stays small and reviewable because it can be delivered entirely in the existing static frontend without backend or API changes.

## 4. Concrete Scope For The Follow-On Implementation Slice

### In scope

- Reflect the current operator context in the URL without full-page navigation:
  - selected entity id
  - focused entity id when the graph is in one-hop mode
  - selected relationship id when still present in the active result set
  - entity search term
  - relationship search term
  - relationship kind filter
  - relationship direction filter
- Restore that state on initial load and on manual reload:
  - hydrate list filters before rendering explorer results
  - restore selected entity or relationship when the referenced item still exists
  - restore focused-graph mode when the referenced entity still exists
- Keep URL updates lightweight and local:
  - use `history.replaceState` or equivalent instead of adding noisy back-stack entries for every interaction
  - avoid triggering duplicate fetches when state restoration and existing selection flows overlap
- Degrade safely when deep-linked state is stale:
  - missing entity ids should clear focus/selection instead of breaking rendering
  - missing relationship ids should be ignored cleanly
- Extend static asset regression coverage for the new state-sync helpers and any new user-facing recovery copy

### Explicitly out of scope

- backend persistence or API contract changes
- per-user saved views or named bookmarks
- cross-device sync
- multi-tab collaboration semantics
- viewport pan/zoom persistence
- multi-entity comparison workflows

## 5. Planned File Touches

Primary files expected for the follow-on slice:

- `src/SocialGraph.Api/wwwroot/app.js`
  - add URL state serialization, hydration, and stale-state recovery handling
- `src/SocialGraph.Api/wwwroot/index.html`
  - only if minimal helper copy or ARIA messaging is needed for restored-state behavior
- `tests/SocialGraph.Api.Tests/EntitiesApiTests.cs`
  - extend static asset assertions for state-sync helper names and any new recovery strings
- `README.md`
  - update capability bullets and manual smoke flow for reload-safe/shared workbench context

Default expectation: this slice should use the current API surface as-is.

## 6. Acceptance Criteria

The next implementation slice should be considered complete when all of the following are true:

1. Reloading `/` preserves the active entity and relationship filters from the URL.
2. Reloading `/` restores the selected entity when that entity still exists.
3. Reloading `/` restores focused-graph mode when the focused entity still exists.
4. A copied URL can reopen the same filtered/focused workbench context on another browser session using the same dataset.
5. Missing or deleted deep-linked ids fail soft without leaving the workbench in a broken state.
6. URL synchronization does not create a noisy browser history entry for every small selection change.
7. Existing pointer, keyboard, spotlight, and focused-graph behaviors continue to work.

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
2. Open `/` and apply an entity search term plus at least one relationship filter.
3. Select an entity and switch the graph into focused one-hop mode.
4. Copy the browser URL, reload the page, and confirm the same filters and focused entity return.
5. Open the copied URL in a fresh tab and confirm the same operator context is reconstructed.
6. Select a relationship that remains visible in the current filtered result set, reload, and confirm the inspector restores cleanly.
7. Delete or otherwise remove an entity referenced by a saved URL state, reopen that URL, and confirm the workbench clears stale state without surfacing a hard error.
8. Confirm keyboard explorer navigation, graph focus shortcuts, spotlighting, and delete recovery still behave as before.

## 8. Risks And Follow-On Note

- URL hydration can accidentally duplicate fetches if it reuses existing selection handlers without guarding initialization order.
- Stale deep links are unavoidable once data changes; the slice should optimize for graceful fallback rather than strict restoration at any cost.
- This recommendation intentionally leaves heavier persistence work for later. Saved named views or per-user preferences may still become valuable, but reload-safe shareable context is the sharper next step on top of the current keyboard-first workbench.
