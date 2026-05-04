[Console]::InputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

$ErrorActionPreference = 'Stop'
$ports = @(61803, 61804)
$pids = @()
foreach ($port in $ports) {
  $lines = netstat -ano | Select-String ":$port"
  foreach ($line in $lines) {
    $parts = ($line.ToString() -split '\s+') | Where-Object { $_ }
    if ($parts.Length -ge 5) { $pids += [int]$parts[-1] }
  }
}
$pids | Sort-Object -Unique | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }
Start-Sleep -Seconds 2
$p = Start-Process -FilePath 'C:\Program Files\dotnet\dotnet.exe' -ArgumentList @('run','--project','src\SocialGraph.Api\SocialGraph.Api.csproj') -WorkingDirectory (Get-Location).Path -WindowStyle Hidden -PassThru
Start-Sleep -Seconds 10
$portState = netstat -ano | Select-String ':61804'
[pscustomobject]@{ RestartedPid=$p.Id; Port=($portState -join "`n") } | ConvertTo-Json -Compress