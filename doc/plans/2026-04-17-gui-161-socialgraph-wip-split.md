# GUI-161 SocialGraph WIP Split Plan

Prepared: 2026-04-17 23:20 CEST

## Goal

Convert the current SocialGraph dirty workspace from one opaque batch into a sequence of mergeable slices with:

- one clear user-facing outcome per slice
- explicit file ownership boundaries
- executable verification per slice
- local-only noise excluded from review scope

This operationalizes the `GUI-160` finding that the repo is shipping meaningful value, but in batches that are too large to review or reuse quickly.

## Current WIP Inventory

The current dirty workspace contains three categories of change:

1. Product slice: QA Model A validation checkpoint API
2. Product slice: SocialGraph workbench neighborhood and spotlight UX
3. Local-only noise that should not be part of a product PR

### Slice-shaped files already present

#### QA Model A validation API

- `src/SocialGraph.Api/Program.cs`
- `src/SocialGraph.Application/Contracts/QaModelAValidationReportDto.cs`
- `src/SocialGraph.Application/Contracts/QaModelAValidationSourceDocument.cs`
- `src/SocialGraph.Application/Ports/IQaModelAValidationReportSource.cs`
- `src/SocialGraph.Application/Services/QaModelAValidationReportService.cs`
- `src/SocialGraph.Infrastructure/Persistence/JsonQaModelAValidationReportSource.cs`
- `src/SocialGraph.Infrastructure/Persistence/QaModelAValidationReportOptions.cs`
- `assessment-v1/GUI92_QA_MODEL_A_VALIDATION_REPORT_SOURCE.json`
- `tests/SocialGraph.Api.Tests/EntitiesApiTests.cs`
- `README.md`

#### Workbench UX expansion

- `src/SocialGraph.Api/wwwroot/index.html`
- `src/SocialGraph.Api/wwwroot/app.js`
- `src/SocialGraph.Api/wwwroot/app.css`
- `tests/SocialGraph.Api.Tests/EntitiesApiTests.cs`
- `README.md`

#### Local-only noise to exclude from merge scope

- `SocialGraph.slnLaunch.user`
- `src/SocialGraph.Api/Properties/launchSettings.json`
- `src/SocialGraph.Api/SocialGraph.Api.csproj.user`
- `app_run.log`
- `src/SocialGraph.Api/data/socialgraph.json`

## Mergeable Slice Order

### Slice 1: QA checkpoint API

Outcome:
Expose `GET /api/cto/weekly-monitor/qa-model-a-validation` with deterministic `PASS` / `FAIL` / `NO_READOUT` evaluation backed by a JSON source document.

Why first:
This slice is backend-contained, testable, and independent from the frontend UX work. It also gives the repo a clean executable checkpoint that assessment artifacts can reference.

Files:

- `src/SocialGraph.Api/Program.cs`
- `src/SocialGraph.Application/Contracts/QaModelAValidationReportDto.cs`
- `src/SocialGraph.Application/Contracts/QaModelAValidationSourceDocument.cs`
- `src/SocialGraph.Application/Ports/IQaModelAValidationReportSource.cs`
- `src/SocialGraph.Application/Services/QaModelAValidationReportService.cs`
- `src/SocialGraph.Infrastructure/Persistence/JsonQaModelAValidationReportSource.cs`
- `src/SocialGraph.Infrastructure/Persistence/QaModelAValidationReportOptions.cs`
- `assessment-v1/GUI92_QA_MODEL_A_VALIDATION_REPORT_SOURCE.json`
- focused test additions in `tests/SocialGraph.Api.Tests/EntitiesApiTests.cs`
- focused docs additions in `README.md`

Acceptance:

- endpoint returns `200`
- missing/incomplete source returns `NO_READOUT`
- complete synthetic source returns `PASS`
- README documents endpoint contract and configuration override path

Verification:

- `dotnet build SocialGraph.sln -c Release`
- `dotnet test SocialGraph.sln -c Release --no-build --filter QaModelAValidationReport`

### Slice 2: Entity neighborhood summary

Outcome:
When an entity is selected, the workbench shows neighborhood metrics, neighbor drilldown, and incident-kind quick filters.

Why separate:
This is the first coherent UX expansion and is independently reviewable without mixing graph spotlight rendering concerns into the same PR.

Files:

- `src/SocialGraph.Api/wwwroot/index.html`
- `src/SocialGraph.Api/wwwroot/app.js`
- `src/SocialGraph.Api/wwwroot/app.css`
- focused static-asset assertions in `tests/SocialGraph.Api.Tests/EntitiesApiTests.cs`
- focused README workflow notes

Acceptance:

- entity list shows incident counts before selection
- selected entity shows incident, incoming, outgoing, and neighbor counts
- neighbor cards can select and focus adjacent entities
- incident-kind chips drive the relationship kind filter

Verification:

- `dotnet test SocialGraph.sln -c Release --no-build --filter Workbench`
- manual smoke:
  - open `/`
  - select an entity
  - confirm summary metrics, neighbor actions, and kind chips

### Slice 3: Graph spotlight behavior

Outcome:
Entity search and relationship filters visually spotlight matching graph elements without forcing a graph refetch.

Why separate:
This is materially different behavior from the neighborhood summary and touches graph rendering semantics. Keeping it isolated reduces review risk.

Files:

- `src/SocialGraph.Api/wwwroot/app.js`
- `src/SocialGraph.Api/wwwroot/app.css`
- focused static-asset assertions in `tests/SocialGraph.Api.Tests/EntitiesApiTests.cs`
- focused README workflow notes

Acceptance:

- entity search spotlights matching nodes and mutes non-matches
- relationship filters spotlight matching edges and connected nodes
- spotlight status is visible in graph metadata
- global relationship browsing still works with no entity selected

Verification:

- `dotnet test SocialGraph.sln -c Release --no-build --filter Workbench`
- manual smoke:
  - search for an entity name
  - apply relationship text/kind filters
  - confirm spotlighting changes without a graph refetch

## Packaging Rules

Use these rules when cutting the actual PRs:

1. Do not include local environment files, logs, or generated data in any PR.
2. Keep `README.md` edits limited to the slice being merged.
3. Split shared test-file edits by behavior, not by mechanical proximity.
4. If a later slice depends on a helper introduced in an earlier slice, move the helper down into the earlier slice instead of bundling both behaviors together.

## Immediate Next Action

The current best next merge candidate is **Slice 1: QA checkpoint API**.

Reason:

- smallest backend-first cut
- already has a clean service boundary
- already has targeted tests
- does not depend on the larger frontend WIP

After Slice 1 is extracted, the remaining frontend WIP should be re-cut into Slice 2 and Slice 3 before any further review request.
