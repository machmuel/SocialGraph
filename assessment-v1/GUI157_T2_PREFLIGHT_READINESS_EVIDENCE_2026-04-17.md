# GUI-157 T-2 Preflight Readiness Evidence

Prepared: 2026-04-17 23:31 CEST  
Issue: [GUI-157](/GUI/issues/GUI-157)  
Parent preflight: [GUI-153](/GUI/issues/GUI-153)  
Checkpoint target: [GUI-95](/GUI/issues/GUI-95)  
Metric source dependency: [GUI-92](/GUI/issues/GUI-92)

## 1. Execution Scope

This rehearsal was executed against the current checked-out workspace:

- Repo: `SocialGraph`
- Path: `/home/machm00g/docker/paperclip/projects/SocialGraph`
- Guido MCP endpoint present in `.mcp.json`: `https://mcp-guido.stephan-derkowski.de/`

Goal of this rehearsal:

- prove that the local verification path for the current workspace executes successfully
- confirm whether the true day-30 checkpoint inputs and report path are executable from this same workspace
- produce a PMO-ready `GO` / `NO-GO` recommendation for running [GUI-95](/GUI/issues/GUI-95) on or after `2026-05-20`

## 2. Commands Executed

Automated verification:

```sh
dotnet build SocialGraph.sln -c Release
dotnet test SocialGraph.sln -c Release --no-build
```

Runtime smoke rehearsal:

```sh
SOCIALGRAPH_DATA_PATH=/tmp/socialgraph-gui157-2TDg.json \
dotnet run --project src/SocialGraph.Api/SocialGraph.Api.csproj -c Release --urls http://127.0.0.1:5088
```

Smoke queries executed against the live host:

- `GET /health`
- `GET /api/cto/weekly-monitor/qa-model-a-validation`

## 3. Objective Results

| Check | Result | Evidence |
|---|---|---|
| Release build | `PASS` | `dotnet build SocialGraph.sln -c Release` succeeded with `0` warnings and `0` errors |
| Regression tests | `PASS` | `dotnet test SocialGraph.sln -c Release --no-build` passed with `22/22` tests green |
| API host startup | `PASS` | app listened on `http://127.0.0.1:5092` for the rerun |
| Health endpoint | `PASS` | `GET /health` returned `{\"status\":\"ok\"}` |
| `GUI-92` metric report executable in this workspace | `PASS` | `GET /api/cto/weekly-monitor/qa-model-a-validation` returned structured JSON with `overallStatus: NO_READOUT` and the expected checkpoint thresholds |
| Checkpoint checklist artifact | `PASS` | `assessment-v1/GUI125_DAY30_VALIDATION_CHECKLIST_2026-04-16.md` present |
| Recommendation template artifact | `PASS` | `assessment-v1/GUI125_RECOMMENDATION_PACKAGE_TEMPLATE_2026-04-16.md` present |
| Bundled `GUI-92` report source artifact | `PASS` | `assessment-v1/GUI92_QA_MODEL_A_VALIDATION_REPORT_SOURCE.json` present and read by the API |

## 4. Key Observations

- The current SocialGraph workspace is technically healthy for its own build, test, and API smoke path.
- The day-30 checkpoint preparation docs are present in `assessment-v1/` and are usable as operator instructions/templates.
- The [GUI-92](/GUI/issues/GUI-92) report path is now implemented directly in this workspace as `GET /api/cto/weekly-monitor/qa-model-a-validation`.
- The endpoint reads the repo-local source artifact `assessment-v1/GUI92_QA_MODEL_A_VALIDATION_REPORT_SOURCE.json`, applies the frozen threshold contract from the checkpoint checklist, and returns `PASS`, `FAIL`, or `NO_READOUT`.
- The current live response is `NO_READOUT`, which is correct on `2026-04-17` because the measured window only runs through `2026-04-17` and the checkpoint earliest-execution date remains `2026-05-20`.
- The remaining blocker is no longer missing code. It is the absence of real post-go-live KPI fields for the full observation window.

## 5. Unresolved Gaps / Blockers

### Blocker B1: true day-30 KPI evidence is not yet complete for scoring

- Impact:
  - the required report path now runs locally, but the true checkpoint still cannot be scored before the full day-30 evidence window closes
  - PMO now has single-workspace execution proof for the report path, but not yet for final checkpoint scoring
- Evidence:
  - `GET /api/cto/weekly-monitor/qa-model-a-validation` returns `overallStatus: NO_READOUT`
  - the live response lists missing required fields and reports `Observation window is incomplete through 2026-04-17; earliest checkpoint date is 2026-05-20`
- Owner:
  - PMO / project owner to populate the real KPI source document once the full post-go-live window is available
  - engineering owner of [GUI-92](/GUI/issues/GUI-92) to keep the source artifact current with real counts and timestamps
- Required action:
  - replace placeholder `NO_READOUT` source values in `assessment-v1/GUI92_QA_MODEL_A_VALIDATION_REPORT_SOURCE.json` with the real checkpoint counts and field-complete evidence
- Required ETA:
  - no later than `2026-05-20` when the checkpoint window opens

## 6. Residual Risks

- Manual browser UX smoke was not re-run in a real browser during this heartbeat; the runtime proof here is API-level plus existing automated coverage.
- The current worktree is dirty with unrelated UI/test/doc changes. That does not block the rehearsal evidence, but it means merge/release packaging remains separate work.
- The actual day-30 scoring window cannot be completed until the full post-go-live observation period is available on or after `2026-05-20`.

## 7. Recommendation

**Recommendation for PMO: `NO-GO` for executing [GUI-95](/GUI/issues/GUI-95) from the current SocialGraph workspace as-is.**

Rationale:

- the local verification surface for this repo is healthy
- the `GUI-92` report path is now executable from the same workspace that will host the checkpoint run
- the checkpoint checklist and packaging templates are ready
- the current report correctly returns `NO_READOUT` because the true day-30 evidence window and required KPI fields are not yet complete

Conditional flip to `GO`:

- keep the current report endpoint in the final execution workspace
- populate the bundled report source with the real measured checkpoint values on or after `2026-05-20`
- rerun the endpoint successfully and append the resulting `PASS` or `FAIL` package summary to [GUI-157](/GUI/issues/GUI-157)
