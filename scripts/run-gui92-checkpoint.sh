#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
configuration="${CONFIGURATION:-Release}"
report_path="$repo_root/assessment-v1/GUI92_QA_MODEL_A_VALIDATION_REPORT_SOURCE.json"
port="${SOCIALGRAPH_QA_CHECKPOINT_PORT:-5102}"
allow_early_window="false"
skip_build="false"
skip_test="false"
output_path=""

usage() {
  cat <<'EOF'
Usage: ./scripts/run-gui92-checkpoint.sh [options]

Runs the GUI-92 QA Model A checkpoint flow end-to-end:
1. Optionally blocks early runs before the source artifact reaches its checkpoint date.
2. Builds and tests the solution.
3. Starts the API with an isolated data file and the selected GUI-92 report source.
4. Captures the health and qa-model-a-validation responses.

Options:
  --report-path PATH         Override the GUI-92 source artifact path.
  --port PORT                Override the local API port. Default: 5102
  --allow-early-window       Permit execution before earliestCheckpointDate.
  --skip-build               Skip dotnet build.
  --skip-test                Skip dotnet test.
  --output PATH              Write the qa-model-a-validation JSON response to PATH.
  --help                     Show this help.
EOF
}

require_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Required command not found: $1" >&2
    exit 1
  fi
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --report-path)
      report_path="$2"
      shift 2
      ;;
    --port)
      port="$2"
      shift 2
      ;;
    --allow-early-window)
      allow_early_window="true"
      shift
      ;;
    --skip-build)
      skip_build="true"
      shift
      ;;
    --skip-test)
      skip_test="true"
      shift
      ;;
    --output)
      output_path="$2"
      shift 2
      ;;
    --help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
done

require_command curl
require_command dotnet
require_command jq

if [[ ! -f "$report_path" ]]; then
  echo "GUI-92 report source not found: $report_path" >&2
  exit 1
fi

earliest_checkpoint_date="$(jq -r '.earliestCheckpointDate // empty' "$report_path")"
observation_window_end="$(jq -r '.observationWindowEnd // empty' "$report_path")"
prepared_at="$(jq -r '.preparedAt // empty' "$report_path")"
today="$(date +%F)"

if [[ -n "$earliest_checkpoint_date" && "$allow_early_window" != "true" && "$today" < "$earliest_checkpoint_date" ]]; then
  echo "Checkpoint run blocked by date gate." >&2
  echo "Today: $today" >&2
  echo "Earliest checkpoint date: $earliest_checkpoint_date" >&2
  echo "Observation window end in source: ${observation_window_end:-unknown}" >&2
  echo "Re-run with --allow-early-window only for preflight validation." >&2
  exit 2
fi

tmp_dir="$(mktemp -d)"
data_path="$tmp_dir/socialgraph-data.json"
health_output="$tmp_dir/health.json"
report_output="$tmp_dir/gui92-report.json"
app_log="$tmp_dir/app.log"
app_pid=""

cleanup() {
  if [[ -n "$app_pid" ]] && kill -0 "$app_pid" >/dev/null 2>&1; then
    kill "$app_pid" >/dev/null 2>&1 || true
    wait "$app_pid" >/dev/null 2>&1 || true
  fi
  rm -rf "$tmp_dir"
}

trap cleanup EXIT

if [[ "$skip_build" != "true" ]]; then
  dotnet build "$repo_root/SocialGraph.sln" -c "$configuration"
fi

if [[ "$skip_test" != "true" ]]; then
  dotnet test "$repo_root/SocialGraph.sln" -c "$configuration" --no-build
fi

(
  cd "$repo_root"
  SOCIALGRAPH_DATA_PATH="$data_path" \
  SOCIALGRAPH_QA_VALIDATION_REPORT_PATH="$report_path" \
  dotnet run \
    --project src/SocialGraph.Api/SocialGraph.Api.csproj \
    -c "$configuration" \
    --urls "http://127.0.0.1:$port"
) >"$app_log" 2>&1 &
app_pid="$!"

health_url="http://127.0.0.1:$port/health"
report_url="http://127.0.0.1:$port/api/cto/weekly-monitor/qa-model-a-validation"

for _ in $(seq 1 40); do
  if curl --silent --fail "$health_url" >"$health_output"; then
    break
  fi
  sleep 1
done

if [[ ! -s "$health_output" ]]; then
  echo "API health check did not succeed. App log:" >&2
  cat "$app_log" >&2
  exit 1
fi

curl --silent --fail "$report_url" >"$report_output"

if [[ -n "$output_path" ]]; then
  mkdir -p "$(dirname "$output_path")"
  cp "$report_output" "$output_path"
fi

overall_status="$(jq -r '.overallStatus' "$report_output")"
recommended_decision="$(jq -r '.recommendedDecision' "$report_output")"
summary="$(jq -r '.summary' "$report_output")"

echo "GUI-92 checkpoint run completed."
echo "Report source: $report_path"
echo "Prepared at: ${prepared_at:-unknown}"
echo "Observation window end: ${observation_window_end:-unknown}"
echo "Earliest checkpoint date: ${earliest_checkpoint_date:-unknown}"
echo "Overall status: $overall_status"
echo "Recommended decision: $recommended_decision"
echo "Summary: $summary"

if [[ -n "$output_path" ]]; then
  echo "Saved report JSON to: $output_path"
fi
