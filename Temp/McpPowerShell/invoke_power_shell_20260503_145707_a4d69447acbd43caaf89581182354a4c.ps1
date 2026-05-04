[Console]::InputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

$ErrorActionPreference = 'Stop'
$p = Start-Process -FilePath 'C:\Program Files\dotnet\dotnet.exe' -ArgumentList @('run','--project','src\SocialGraph.Api\SocialGraph.Api.csproj') -WorkingDirectory (Get-Location).Path -WindowStyle Hidden -PassThru
Start-Sleep -Seconds 8
$port = netstat -ano | Select-String ':61804'
[pscustomobject]@{ Id=$p.Id; HasExited=$p.HasExited; Port=($port -join "`n") } | ConvertTo-Json -Compress