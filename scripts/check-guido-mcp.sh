#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
config_path="${GUIDO_MCP_CONFIG_PATH:-$repo_root/.mcp.json}"

if [[ ! -f "$config_path" ]]; then
  echo "Guido MCP config not found: $config_path" >&2
  exit 1
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "jq is required to read $config_path" >&2
  exit 1
fi

if ! command -v curl >/dev/null 2>&1; then
  echo "curl is required to probe the Guido MCP endpoint" >&2
  exit 1
fi

url="$(jq -r '.mcpServers.guido.url // empty' "$config_path")"
if [[ -z "$url" ]]; then
  echo "No Guido MCP URL configured in $config_path" >&2
  exit 1
fi

headers_file="$(mktemp)"
trap 'rm -f "$headers_file"' EXIT

http_code="$(
  curl \
    --silent \
    --show-error \
    --output /dev/null \
    --dump-header "$headers_file" \
    --location \
    --max-time "${GUIDO_MCP_TIMEOUT_SECONDS:-20}" \
    --write-out '%{http_code}' \
    "$url"
)"

if [[ "$http_code" == "000" ]]; then
  echo "Guido MCP probe failed: no HTTP response from $url" >&2
  exit 1
fi

status_line="$(head -n 1 "$headers_file" | tr -d '\r')"
server_header="$(grep -i '^server:' "$headers_file" | tail -n 1 | tr -d '\r' || true)"

echo "Guido MCP reachable."
echo "URL: $url"
echo "HTTP: ${status_line:-$http_code}"

if [[ -n "$server_header" ]]; then
  echo "$server_header"
fi

if [[ "$http_code" == "404" ]]; then
  echo "Note: root-path 404 is still treated as online because the HTTP endpoint answered."
fi
