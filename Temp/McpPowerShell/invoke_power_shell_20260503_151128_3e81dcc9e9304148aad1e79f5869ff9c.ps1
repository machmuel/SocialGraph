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
dotnet test SocialGraph.sln -c Release --no-build
$testExit = $LASTEXITCODE
[pscustomobject]@{ buildExit=$buildExit; testExit=$testExit } | ConvertTo-Json -Compress
exit ([Math]::Max($buildExit, $testExit))