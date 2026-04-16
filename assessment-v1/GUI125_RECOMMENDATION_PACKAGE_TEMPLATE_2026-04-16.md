# GUI-125 Recommendation Package Template

Use this as the markdown payload for the true day-30 checkpoint on or after **2026-05-20**.

```md
## Day-30 Checkpoint Package for GUI-95

Prepared: YYYY-MM-DD (Europe/Berlin)  
Prepared by: Senior SWE (`GUI-125`)  
Checkpoint issue: [GUI-95](/GUI/issues/GUI-95)  
Prep issue: [GUI-125](/GUI/issues/GUI-125)  
Metric source: [GUI-92](/GUI/issues/GUI-92)  
Packaging precedent: [GUI-103](/GUI/issues/GUI-103)  
Artifact path: `assessment-v1/<fill-me>.md`

### 1) Execution Summary

- Checkpoint window evaluated: `<start>` to `<end>`
- Execution timestamp: `<timestamp>`
- Overall checkpoint status: `PASS | FAIL | NO READOUT`
- Recommended decision: `continue model A | continue model A with adjustments | transition to option C`

### 2) Measured Outcomes vs Baseline

| Metric | Baseline / Threshold | Measured result | Status | Evidence note |
|---|---|---|---|---|
| QA acknowledgement SLA attainment | `>=95%` | `<fill-me>` | `PASS/FAIL` | `<counts + caveat>` |
| QA completion SLA attainment | `>=90%` | `<fill-me>` | `PASS/FAIL` | `<counts + caveat>` |
| Median review turnaround | `<=8 business hours` | `<fill-me>` | `PASS/FAIL` | `<distribution note>` |
| Escaped defects trend vs prior 30d | `current <= prior` | `<fill-me>` | `PASS/FAIL` | `<normalization note>` |
| Delivery lead-time impact | `<=66h` median | `<fill-me>` | `PASS/FAIL` | `<baseline 60h>` |
| Instrumentation completeness | `all required fields present` | `<fill-me>` | `PASS/FAIL` | `<missing data if any>` |

### 3) Threshold Readout

- Hard-gate breaches:
  - `<none>` or list exact threshold failures
- Near-boundary signals:
  - `<optional>`
- Data quality concerns:
  - `<optional>`

### 4) Recommendation

**Recommendation: `<fill-me>`**

Rationale:
- `<reason 1>`
- `<reason 2>`
- `<reason 3>`

### 5) Option Analysis

#### Option 1: Continue model A unchanged
- Pros:
  - `<fill-me>`
- Risks:
  - `<fill-me>`
- Assessment:
  - `<fill-me>`

#### Option 2: Continue model A with adjustments
- Pros:
  - `<fill-me>`
- Required adjustments:
  - `<fill-me>`
  - `<fill-me>`
  - `<fill-me>`
- Risks:
  - `<fill-me>`
- Assessment:
  - `<fill-me>`

#### Option 3: Transition to dedicated QA option C
- Pros:
  - `<fill-me>`
- Risks:
  - `<fill-me>`
- Assessment:
  - `<fill-me>`

### 6) Rollback / Next-Step Plan

If recommendation is to continue model A:
1. `<next step 1>`
2. `<next step 2>`
3. `<next step 3>`

If recommendation is to transition away from model A:
1. Escalate in-thread on [GUI-95](/GUI/issues/GUI-95) the same business day.
2. Freeze expanded usage of model A for new inflow.
3. Open the replacement/corrective-action issue bundle.

### 7) Evidence Appendix

- KPI report command or endpoint:
  - `<fill-me>`
- Raw report artifact:
  - `<fill-me>`
- Supporting screenshots / logs / exports:
  - `<fill-me>`
- Known caveats:
  - `<fill-me>`
```

## Usage Notes

- If any required KPI is missing or untrustworthy, set the overall checkpoint status to `NO READOUT`.
- Do not label the checkpoint `PASS` if lead-time impact exceeds `66h` median, even when the other quality metrics pass.
- Reference both [GUI-125](/GUI/issues/GUI-125) and [GUI-95](/GUI/issues/GUI-95) in the final posted payload for traceability.
