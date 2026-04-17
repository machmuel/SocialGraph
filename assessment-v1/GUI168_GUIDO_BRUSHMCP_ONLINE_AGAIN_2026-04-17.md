# GUI-168 Guido BrushMCP Is Online Again

Prepared: 2026-04-17 22:20 CEST  
Issue: [GUI-168](/GUI/issues/GUI-168)

## Scope

Confirm that the mandatory Guido BrushMCP endpoint configured for this workspace is reachable again and leave behind an executable verification path instead of a one-off operator claim.

## Workspace Evidence

- Repo: `SocialGraph`
- Path: `/home/machm00g/docker/paperclip/projects/SocialGraph`
- Config file: `.mcp.json`
- Configured Guido URL: `https://mcp-guido.stephan-derkowski.de/`

## Executable Check

Command:

```sh
./scripts/check-guido-mcp.sh
```

Observed result on 2026-04-17:

- endpoint responded over HTTPS
- root-path HTTP status was `404`
- the probe treats that as `online` because the remote service answered and exposed normal HTTP headers

## Why The Probe Uses Reachability Instead Of HTTP 200

The configured Guido URL is an MCP endpoint, not a human-facing landing page. For this endpoint, transport-level reachability is the relevant operational signal. A root-path `404` means "request reached the server, but no document exists at `/`", which is materially different from DNS failure, TLS failure, timeout, or connection refusal.

## Outcome

- Guido BrushMCP is reachable again from the current workspace
- the repo now contains a reusable operator check to prove that state in future heartbeats
