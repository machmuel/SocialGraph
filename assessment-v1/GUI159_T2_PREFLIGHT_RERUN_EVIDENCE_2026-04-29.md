# GUI-159 T-2 Preflight Rerun Evidence

Prepared: 2026-04-29 12:26 CEST  
Issue: [GUI-159](/GUI/issues/GUI-159)  
Parent preflight: [GUI-153](/GUI/issues/GUI-153)  
Checkpoint target: [GUI-95](/GUI/issues/GUI-95)  
Metric source: [GUI-92](/GUI/issues/GUI-92)  
Required-fields sign-off: [GUI-194](/GUI/issues/GUI-194)

## 1. Execution Scope

This rerun was executed from the current `SocialGraph` workspace after the `GUI-194` required-fields sign-off updated the default `GUI-92` source artifact.

- Repo: `SocialGraph`
- Path: `/home/machm00g/SocialGraph`
- KPI source artifact: `assessment-v1/GUI92_QA_MODEL_A_VALIDATION_REPORT_SOURCE.json`
- KPI report path: `GET /api/cto/weekly-monitor/qa-model-a-validation`

## 2. Commands Executed

```sh
dotnet build SocialGraph.sln -c Release
dotnet test SocialGraph.sln -c Release --no-build
SOCIALGRAPH_DATA_PATH=/tmp/socialgraph-gui159-rerun-<timestamp>.json \
dotnet run --project src/SocialGraph.Api/SocialGraph.Api.csproj -c Release --urls http://127.0.0.1:5102
curl -sf http://127.0.0.1:5102/health
curl -sf http://127.0.0.1:5102/api/cto/weekly-monitor/qa-model-a-validation
```

## 3. Objective Results

| Check | Result | Evidence |
|---|---|---|
| Release build | `PASS` | `dotnet build SocialGraph.sln -c Release` succeeded with `0` warnings and `0` errors |
| Regression tests | `PASS` | `dotnet test SocialGraph.sln -c Release --no-build` passed with `26/26` tests green |
| Health endpoint | `PASS` | `GET /health` returned `{"status":"ok"}` |
| KPI endpoint reachability | `PASS` | `GET /api/cto/weekly-monitor/qa-model-a-validation` returned `200` |
| KPI threshold logic with field-complete source | `PASS` | acknowledgement `97.4%`, completion `92.3%`, median review turnaround `6.8 business hours`, lead time `62 hours`, escaped defects `current=1, prior=2` |
| Instrumentation completeness | `PASS` | `missingFields` is empty and the response reports required-fields sign-off from `GUI-194` |
| Overall checkpoint state | `NO_READOUT` | response still reports `Observation window is incomplete through 2026-04-29; earliest checkpoint date is 2026-05-20.` |

## 4. Key Observation

The `GUI-92` execution blocker in this workspace is now reduced to a date-window constraint only. The endpoint runs, the source artifact is field-complete, and provisional KPI values clear all current thresholds. The remaining reason the checkpoint cannot be scored is that the measured observation window ends on `2026-04-29`, while the earliest valid day-30 execution date remains `2026-05-20`.

## 5. Remaining Unblock Step

Replace the provisional `GUI-92` source artifact with the final full-window data covering a window end on or after `2026-05-20`, then rerun the same command set and publish the final scored output to [GUI-153](/GUI/issues/GUI-153).
