[Console]::InputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

$ErrorActionPreference = 'Stop'
$results = [ordered]@{}
$results.cwd = (Get-Location).Path
$results.remote = git remote -v
$results.beforeStatus = git status --short --branch
$results.beforeHead = git rev-parse HEAD
$results.fetch = git fetch origin --prune 2>&1
$results.checkout = git checkout main 2>&1
$results.pull = git pull --ff-only origin main 2>&1
$results.afterStatus = git status --short --branch
$results.afterHead = git rev-parse HEAD
$results | ConvertTo-Json -Depth 5