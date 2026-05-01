# GUI-175 Next Slice Definition

Prepared: 2026-04-19 18:05 CEST  
Issue: [GUI-175](/GUI/issues/GUI-175)  
Baseline dependency: current `main` contains the post-`GUI-170` interaction split and the `GUI-173` UX hardening fixes

## 1. Wake Handling

Initial wake payload contained no issue-thread comments (`pending comments: 0/0`), so the first pass of this definition was based on the current repository state rather than comment-driven scope changes.

Resume delta comment from PMO canonicalization clarified that stale blocker dependencies were removed and `GUI-175` is the active definition lane. This does not change the recommended slice, but it removes any reason to defer the definition behind previously referenced blockers.

## 2. Current Baseline Observed

The active `SocialGraph` workbench already supports:

- local entity and relationship inspection without full workbench reload on every selection
- one-hop graph focus reloads isolated to graph data
- visible inspect-versus-focus guidance in the graph panel
- relationship spotlighting, focused-graph notices, and keyboard-focus styling
- post-slice UX fixes from `GUI-173`, including safer graph semantics and graph-edge label fallback behavior

There is no direct `GUI-171` artifact in this repository. The recommendation below therefore uses the current `main` workbench behavior as the effective post-`GUI-171` baseline. That is an inference from the checked-in code, README, and assessment artifacts.

## 3. Recommended Immediate Next Slice

### Slice name

**Recoverable destructive actions with impact preview**

### Why this should be next

- The main remaining operator risk is destructive work: entity and relationship deletion still rely on blocking `window.confirm` dialogs with no recovery path after confirmation.
- This gap directly affects trust in the workbench. Exploration is now faster, but operators still have to treat delete actions as irreversible.
- The previous slice-definition explicitly deferred destructive-action safety, and the latest UX audit still identifies missing undo affordances as an open risk.
- This slice stays reviewable if it is constrained to delete safety and recovery instead of mixing in graph-layout redesign or broader workflow additions.

## 4. Concrete Scope For The Follow-On Implementation Slice

### In scope

- Replace generic browser confirm dialogs with in-app confirmation UX that shows concrete impact before deletion:
  - entity delete confirms the entity name and the count of incident relationships that will also be removed
  - relationship delete confirms the exact source, target, and kind
- Add a short-lived undo path after deletion:
  - deleting a relationship can be undone by recreating the same edge from captured pre-delete data
  - deleting an entity can be undone by recreating the entity and its previously incident relationships from captured pre-delete data
- Keep deletion feedback local and explicit:
  - show success/error toast or notice state in the workbench
  - keep selection/focus state coherent after delete and after undo
- Add focused regression coverage for the new static asset strings and the API behavior the undo flow depends on

### Explicitly out of scope

- multi-step history, audit timeline, or persistent recycle-bin storage
- batch delete operations
- graph layout redesign or graph interaction changes unrelated to delete safety
- import/export, traversal, clustering, or recommendation features
- backend contract redesign unless a narrow restore gap is discovered during implementation

## 5. Planned File Touches

Primary files expected for the follow-on slice:

- `src/SocialGraph.Api/wwwroot/index.html`
  - add confirmation surface and transient undo/status region
- `src/SocialGraph.Api/wwwroot/app.js`
  - replace `window.confirm` flows
  - capture pre-delete payloads for undo
  - restore entity plus incident relationships when undoing an entity delete
  - keep selection/focus/status state synchronized after delete and restore
- `src/SocialGraph.Api/wwwroot/app.css`
  - style confirmation and toast/notice states
- `tests/SocialGraph.Api.Tests/EntitiesApiTests.cs`
  - extend static asset assertions for delete-safety and undo UI affordances
- `README.md`
  - update manual smoke flow to cover delete impact preview and undo recovery

Default expectation: the slice should use the current entity and relationship endpoints as-is.

## 6. Acceptance Criteria

The next implementation slice should be considered complete when all of the following are true:

1. Deleting an entity no longer relies on a raw browser confirm dialog.
2. Entity delete confirmation shows the selected entity and the number of incident relationships that will also be removed.
3. Deleting a relationship no longer relies on a raw browser confirm dialog.
4. Relationship delete confirmation shows the relationship endpoints and kind.
5. After confirming a delete, the workbench presents a visible undo affordance for a short recovery window.
6. Undoing a relationship delete recreates the deleted relationship and restores it to the explorer and graph.
7. Undoing an entity delete recreates the entity and its previously incident relationships.
8. Selection, focus, and inspector state remain coherent after delete and after undo.
9. Existing API and static-asset regression tests continue to pass.

## 7. Verification Commands

Implementation verification for the follow-on slice should use:

```sh
dotnet build SocialGraph.sln -c Release
dotnet test SocialGraph.sln -c Release --no-build
```

Manual smoke checks:

1. Run the API host locally.
2. Open `/`.
3. Delete a relationship and confirm the workbench shows in-app confirmation details instead of a browser modal.
4. Confirm the deleted relationship disappears from the explorer and graph, then use undo and verify it returns.
5. Delete an entity with incident relationships and confirm the impact preview reports the cascade count.
6. Use undo for the entity delete and verify the entity plus its incident relationships return.
7. Confirm focus and selection state do not end in a stale or broken state after delete or undo.
8. Verify normal create, update, and graph-focus flows still work after the delete-safety additions.

## 8. Risks And Follow-On Note

- Undo for entity deletion requires replaying multiple API writes; partial-restore failure handling must be explicit so the operator is not left with silent half-recovery.
- Restore flows must tolerate ID conflicts if the operator recreated related data manually before using undo.
- This recommendation intentionally leaves graph readability and list-level keyboard interaction improvements for a later slice. Those remain worthwhile, but destructive-action recovery is the sharper operator-risk reduction.
