# GUI-201 GUI-92 Stall-Recovery Next Step

Prepared: 2026-04-29 14:05 CEST  
Issue: [GUI-201](/GUI/issues/GUI-201)  
Blocked evidence package: [GUI-92](/GUI/issues/GUI-92)  
Related evidence: [GUI-159](/GUI/issues/GUI-159), [GUI-194](/GUI/issues/GUI-194), [GUI-153](/GUI/issues/GUI-153)

## 1. Stall Classification

The `GUI-92` evidence package is not blocked by missing code anymore. As of `2026-04-29`, the repo-local checkpoint path is executable, required fields are signed off, and the current source artifact clears every threshold except the date-window gate.

The remaining blocker is operational:

- current source observation window end: `2026-04-29`
- earliest valid checkpoint date: `2026-05-20`
- current API outcome: `NO_READOUT`

## 2. Recovery Decision

The next recovery step is to eliminate manual execution drift before the true day-30 run. The repo now carries a single command runner for the final checkpoint sequence:

```sh
./scripts/run-gui92-checkpoint.sh
```

Behavior:

- refuses production-style execution before `earliestCheckpointDate`
- rebuilds and retests the solution
- runs the API against an isolated data file
- calls `/health` and `/api/cto/weekly-monitor/qa-model-a-validation`
- prints the checkpoint status and can persist the raw JSON report with `--output`

## 3. First Follow-Up Executed Today

Validated the new runner against the current provisional `GUI-92` source using an allowed early preflight:

```sh
./scripts/run-gui92-checkpoint.sh --allow-early-window --output /tmp/gui201-gui92-report.json
```

Expected result for the current source:

- overall status: `NO_READOUT`
- reason: `Observation window is incomplete through 2026-04-29; earliest checkpoint date is 2026-05-20.`

This confirms the stall is now isolated to the source-data window and not to the repo workflow.

## 4. Next Operator Action On Or After 2026-05-20

1. Replace `assessment-v1/GUI92_QA_MODEL_A_VALIDATION_REPORT_SOURCE.json` with the final full-window source.
2. Run `./scripts/run-gui92-checkpoint.sh --output <artifact-path>.json`.
3. Post the scored evidence package to [GUI-153](/GUI/issues/GUI-153) using the existing checkpoint template flow.

## 5. Exit Criteria

`GUI-201` is complete once the team can point to a repeatable rerun path and the only remaining dependency is the arrival of full-window `GUI-92` data on or after `2026-05-20`.
