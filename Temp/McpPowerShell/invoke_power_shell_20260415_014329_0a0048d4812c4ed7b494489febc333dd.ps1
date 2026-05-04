[Console]::InputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

$ErrorActionPreference = 'Stop'
Write-Host "Root: $(Get-Location)"
if (-not (Get-Command git -ErrorAction SilentlyContinue)) { throw 'git ist nicht installiert oder nicht im PATH.' }
Write-Host "Branch vor Pull: $(git rev-parse --abbrev-ref HEAD)"
Write-Host "Remote-URL: $(git remote get-url origin)"
git pull --ff-only
$exitCode = $LASTEXITCODE
if ($exitCode -ne 0) { exit $exitCode }
Write-Host "\nStatus nach Pull:"
git status --short --branch
exit 0