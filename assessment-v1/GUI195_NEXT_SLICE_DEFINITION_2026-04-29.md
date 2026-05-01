# GUI-195 Next Slice Definition

Prepared: 2026-04-29 12:24 CEST  
Issue: [GUI-195](/GUI/issues/GUI-195)  
Baseline dependency: current `SocialGraph` head already includes the post-viewport-control workbench with zoom, pan, reset, fit, delete recovery, and local selection rendering

## 1. Wake Handling

The wake payload for this heartbeat contained no pending thread comments (`0/0`), so there was no comment-driven scope change to absorb before acting.

The wake changed priority rather than product direction: `GUI-195` became the active critical lane, which shifted the next action from generic repository maintenance to defining the next `SocialGraph` slice after the already-landed `GUI-187` era work.

## 2. Current Baseline Observed

The checked-out `main` branch already contains the capability that `GUI-186` had recommended as the next slice:

- graph zoom in, zoom out, reset, and fit controls
- drag-to-pan viewport handling on empty graph space
- focus-versus-inspect guidance in the graph panel
- static asset regression coverage for viewport behaviors
- README smoke steps documenting the graph viewport workflow

The repository does not include a dedicated `GUI-187` artifact, so the exact issue-to-commit mapping cannot be proven from assessment files alone. The baseline above is therefore an inference from the current `README.md`, `wwwroot` assets, tests, and recent commit history.

## 3. Recommended Immediate Next Slice

### Slice name

**Keyboard-first explorer navigation and card-level inspection**

### Why this should be next

- The workbench graph is now materially easier to read and move around, but the entity and relationship explorers still optimize more for mouse use than efficient keyboard scanning.
- Relationship cards are clickable as whole cards for pointer users, but keyboard users still land mostly on nested buttons instead of the card itself. That forces repetitive tabbing and weakens rapid inspection flow.
- Entity cards expose selection and focus actions only through button rows, which makes list scanning slower than it needs to be now that local selection no longer triggers a full reload.
- This slice stays small and reviewable because it can be delivered entirely in the existing static frontend without backend changes or renderer redesign.

## 4. Concrete Scope For The Follow-On Implementation Slice

### In scope

- Make entity cards directly keyboard reachable and semantically interactive:
  - one obvious focus target per card
  - Enter and Space select the entity
  - optional shortcut on the focused card to trigger graph focus without hunting for a secondary button
- Make relationship cards directly keyboard reachable and semantically interactive:
  - one obvious focus target per card
  - Enter and Space inspect the relationship
  - preserve destructive actions behind explicit buttons instead of card-level delete shortcuts
- Improve list scanning efficiency:
  - allow arrow-key movement between cards inside the entity list and relationship list
  - keep visible focus treatment stable while moving across cards
  - preserve current search and filter behavior while focus moves locally
- Improve operator guidance:
  - add concise helper copy that explains keyboard list navigation where needed
  - keep graph keyboard behavior and list keyboard behavior coherent instead of competing
- Extend static asset regression coverage for the new list semantics and keyboard interaction strings

### Explicitly out of scope

- graph layout redesign, clustering, or collision handling
- multi-select list workflows
- backend or API contract changes
- persistent per-user keyboard preferences
- bulk action flows across multiple entities or relationships

## 5. Planned File Touches

Primary files expected for the follow-on slice:

- `src/SocialGraph.Api/wwwroot/index.html`
  - add minimal explorer guidance copy or ARIA hooks for keyboard list behavior
- `src/SocialGraph.Api/wwwroot/app.js`
  - introduce card-level keyboard semantics, roving focus helpers, and explorer-local navigation behavior
- `src/SocialGraph.Api/wwwroot/app.css`
  - style focused cards and keep focus affordances distinct from selected-state styling
- `tests/SocialGraph.Api.Tests/EntitiesApiTests.cs`
  - extend static asset assertions for card semantics and keyboard navigation strings
- `README.md`
  - update capability bullets and manual smoke flow for keyboard explorer navigation

Default expectation: this slice should use the current API surface as-is.

## 6. Acceptance Criteria

The next implementation slice should be considered complete when all of the following are true:

1. Entity cards can be reached directly by keyboard without requiring the operator to tab into nested action buttons first.
2. Relationship cards can be reached directly by keyboard and inspected with Enter or Space.
3. Arrow-key navigation moves between cards inside each explorer list without triggering unnecessary network activity.
4. Focus styling is visible and clearly distinct from the existing selected-state styling.
5. Existing pointer behaviors on cards and buttons continue to work.
6. Delete actions remain explicit and are not made easier to trigger accidentally through new keyboard shortcuts.
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
3. Tab into the entity explorer and confirm each entity card can receive focus directly.
4. Use Enter or Space on a focused entity card and confirm selection updates locally without a full workbench reload.
5. Use arrow keys to move between entity cards and confirm focus moves predictably.
6. Tab into the relationship explorer and confirm each relationship card can receive focus directly.
7. Use Enter or Space on a focused relationship card and confirm the inspector updates immediately.
8. Trigger delete from the explicit delete button only and confirm the new keyboard semantics do not create accidental destructive paths.
9. Confirm graph-node keyboard interaction and graph viewport controls still behave as before.

## 8. Risks And Follow-On Note

- Card-level keyboard semantics can conflict with nested buttons if event delegation is sloppy; implementation should keep a clear distinction between primary-card activation and inner-button activation.
- Arrow-key navigation should not trap focus; operators must still be able to tab out of each list normally.
- This recommendation intentionally leaves deeper graph readability work for a later slice. A future slice may still revisit layout density or collision handling, but keyboard-first explorer navigation is the sharper near-term improvement on top of the current architecture.
