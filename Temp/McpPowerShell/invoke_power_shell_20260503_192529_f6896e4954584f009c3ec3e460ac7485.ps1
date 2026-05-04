[Console]::InputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

$ErrorActionPreference = 'Continue'
$env:DOTNET_CLI_HOME='I:\VS-Projekte\SocialGraph\Temp\dotnet-home'
$env:DOTNET_SKIP_FIRST_TIME_EXPERIENCE='1'
$env:DOTNET_CLI_TELEMETRY_OPTOUT='1'
$env:NUGET_PACKAGES='I:\VS-Projekte\SocialGraph\Temp\nuget-packages'
$env:APPDATA='I:\VS-Projekte\SocialGraph\Temp\appdata'
dotnet build SocialGraph.sln -c Release
$buildExit = $LASTEXITCODE
if ($buildExit -ne 0) { exit $buildExit }
$healthOk = $false
try {
  $response = Invoke-WebRequest -UseBasicParsing http://localhost:61804/health -TimeoutSec 3
  $healthOk = ($response.StatusCode -eq 200)
} catch {
  $healthOk = $false
}
if (-not $healthOk) {
  $p = Start-Process -FilePath 'C:\Program Files\dotnet\dotnet.exe' -ArgumentList @('run','--project','src\SocialGraph.Api\SocialGraph.Api.csproj') -WorkingDirectory (Get-Location).Path -WindowStyle Hidden -PassThru
  Start-Sleep -Seconds 10
}
$response = Invoke-WebRequest -UseBasicParsing http://localhost:61804/health -TimeoutSec 10
[pscustomobject]@{ buildExit=$buildExit; healthStatus=$response.StatusCode; previewUrl='http://localhost:61804/' } | ConvertTo-Json -Compress