[Console]::InputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

Get-Content scripts/check-guido-mcp.sh -Encoding Byte | Select-Object -First 16 | ForEach-Object { $_.ToString('X2') }