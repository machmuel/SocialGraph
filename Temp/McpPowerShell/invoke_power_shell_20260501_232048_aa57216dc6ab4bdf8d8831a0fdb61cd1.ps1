[Console]::InputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

$fetchOut = cmd /c "git fetch origin --prune 2>&1"
$checkoutOut = cmd /c "git checkout main 2>&1"
$pullOut = cmd /c "git pull --ff-only origin main 2>&1"
$results = [ordered]@{}
$results.cwd = (Get-Location).Path
$results.beforeHead = cmd /c "git rev-parse HEAD"
$results.fetch = $fetchOut
$results.checkout = $checkoutOut
$results.pull = $pullOut
$results.afterHead = cmd /c "git rev-parse HEAD"
$results.afterStatus = cmd /c "git status --short --branch"
$results | ConvertTo-Json -Depth 5