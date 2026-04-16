# GUI-125 Day-30 Validation Checklist

Prepared: 2026-04-16 (Europe/Berlin)  
Issue: [GUI-125](/GUI/issues/GUI-125)  
Parent checkpoint: [GUI-95](/GUI/issues/GUI-95)  
Metric source: [GUI-92](/GUI/issues/GUI-92)  
Recommendation packaging reference: [GUI-103](/GUI/issues/GUI-103)

## 1. Purpose

Use this checklist on or after **2026-05-20** to execute the true day-30 QA Model A checkpoint without additional prep work. The checkpoint result should produce a recommendation package that can be posted first to [GUI-125](/GUI/issues/GUI-125) and then referenced from [GUI-95](/GUI/issues/GUI-95).

## 2. Required Inputs Before Execution

- Confirm the execution date is **2026-05-20 or later**.
- Confirm the KPI source path from [GUI-92](/GUI/issues/GUI-92) is available and returns the day-30 report.
- Confirm the report covers the full post-go-live observation window beginning **2026-04-20**.
- Confirm the frozen baseline values from [GUI-92](/GUI/issues/GUI-92):
  - acknowledgement SLA baseline target: `>=95%`
  - completion SLA baseline target: `>=90%`
  - median turnaround target: `<=8 business hours` / `<=1 business day`
  - delivery lead-time baseline: `60h` median
  - delivery lead-time fail ceiling: `66h` median (`+10%`)
- Confirm escaped defects are linked back to reviewed deliveries.
- Confirm the recommendation package template in `assessment-v1/GUI125_RECOMMENDATION_PACKAGE_TEMPLATE_2026-04-16.md` is available for direct reuse.

## 3. Data Completeness Checks

Do not score the checkpoint until all required fields are present for the full measurement window.

- QA acknowledgement SLA:
  - `qa_requested_at`
  - `qa_acknowledged_at`
  - `timezone`
  - `request_status`
- QA completion SLA:
  - `qa_requested_at`
  - `qa_completed_at`
  - `risk_level`
  - `submitted_before_noon_local`
- Median turnaround:
  - `qa_requested_at`
  - `qa_completed_at`
- Escaped defects:
  - `delivery_id`
  - `escaped_defect_discovered_at`
  - `severity`
- Lead-time impact:
  - `delivery_ready_for_qa_at`
  - `delivery_completed_at`
  - `lead_time_hours`

If any required field is materially missing, the checkpoint status is **NO READOUT** rather than pass or fail. Post the missing-field list and stop the recommendation.

## 4. Execution Steps

1. Generate the day-30 KPI report for the full checkpoint window.
2. Copy the raw metric outputs into the evidence template.
3. Validate each KPI against the threshold table below.
4. Assign checkpoint status: `PASS`, `FAIL`, or `NO READOUT`.
5. Complete the recommendation package with explicit rationale.
6. Post the package in [GUI-125](/GUI/issues/GUI-125) and link it from [GUI-95](/GUI/issues/GUI-95).
7. If the outcome recommends transition away from model A, escalate in-thread on [GUI-95](/GUI/issues/GUI-95) the same business day.

## 5. Threshold Table

| Metric | Pass threshold | Fail threshold | Notes |
|---|---|---|---|
| QA acknowledgement SLA attainment | `>=95%` | `<95%` | Hard gate |
| QA completion SLA attainment | `>=90%` | `<90%` | Hard gate |
| Median review turnaround | `<=8 business hours` / `<=1 business day` | `>8 business hours` / `>1 business day` | Hard gate |
| Delivery lead-time impact | `<=66h` median | `>66h` median | Hard gate using `60h` frozen baseline |
| Escaped defects trend vs prior 30 days | current window `<=` prior 30-day count | current window `>` prior 30-day count | Trend gate; explain normalization assumptions |
| Instrumentation completeness | all required fields present | any material gap | If failed, classify as `NO READOUT` |

## 6. Checkpoint Status Rules

### PASS

Assign **PASS** only if all are true:

- all hard-gate KPIs meet threshold
- escaped defects trend is flat or improving versus prior 30 days
- data completeness checks pass
- recommendation package is complete with evidence, rationale, and next steps

Default recommendation under PASS: continue model A, or continue model A with adjustments if operational caution items remain but no fail gate was tripped.

### FAIL

Assign **FAIL** if any hard gate is breached:

- acknowledgement SLA `<95%`
- completion SLA `<90%`
- median turnaround `>8 business hours`
- median delivery lead time `>66h`
- escaped defects trend worsens versus prior 30 days

Default recommendation under FAIL: recommend transition from model A to dedicated QA option C, unless a narrower rollback path is demonstrably lower-risk and can be justified in the package.

### NO READOUT

Assign **NO READOUT** if the KPI data is incomplete or cannot be trusted.

- Do not present a keep-vs-replace recommendation as if the checkpoint passed.
- Package the issue as instrumentation or evidence failure.
- Identify exact missing fields, owners, and recovery steps.

## 7. Evidence Bundle Checklist

The final comment should include or attach:

- checkpoint execution timestamp
- measured observation window dates
- raw KPI values and denominator counts
- baseline values from [GUI-92](/GUI/issues/GUI-92)
- pass/fail outcome for each KPI
- final overall checkpoint status
- recommendation with rationale
- rollback or next-step plan
- open risks and data caveats

## 8. Posting Rules

- Post the full package back to [GUI-125](/GUI/issues/GUI-125) first.
- Reference [GUI-95](/GUI/issues/GUI-95) explicitly in the package header and closing recommendation.
- When posting to [GUI-95](/GUI/issues/GUI-95), link the [GUI-125](/GUI/issues/GUI-125) artifact path and summarize only the final status, rationale, and escalation path.
