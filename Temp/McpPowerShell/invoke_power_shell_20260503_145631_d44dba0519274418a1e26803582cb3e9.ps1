[Console]::InputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

$ErrorActionPreference = 'Stop'
$psi = New-Object System.Diagnostics.ProcessStartInfo
$psi.FileName = 'C:\Program Files\dotnet\dotnet.exe'
$psi.WorkingDirectory = (Get-Location).Path
$psi.Arguments = 'run --project src\SocialGraph.Api\SocialGraph.Api.csproj'
$psi.UseShellExecute = $false
$psi.CreateNoWindow = $true
$psi.RedirectStandardOutput = $false
$psi.RedirectStandardError = $false
$psi.EnvironmentVariables.Clear()
$psi.EnvironmentVariables['PATH'] = 'C:\Program Files\dotnet;C:\Windows\System32;C:\Windows'
$psi.EnvironmentVariables['ASPNETCORE_ENVIRONMENT'] = 'Development'
$psi.EnvironmentVariables['ASPNETCORE_PREVENTHOSTINGSTARTUP'] = 'true'
$p = [System.Diagnostics.Process]::Start($psi)
Start-Sleep -Seconds 5
[pscustomobject]@{ Id = $p.Id; HasExited = $p.HasExited } | ConvertTo-Json -Compress