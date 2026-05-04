param(
    [switch]$SkipStart,
    [string]$Url = "http://127.0.0.1:5299"
)

$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$apiDll = Join-Path $repoRoot "src\SocialGraph.Api\bin\Release\net10.0\SocialGraph.Api.dll"
$runner = Join-Path $repoRoot "scripts\run-socialgraph-api.cmd"
$pidFile = Join-Path $repoRoot "app_pid.txt"
$port = ([Uri]$Url).Port
$env:DOTNET_CLI_HOME = Join-Path $repoRoot "Temp\dotnet-home"
$env:DOTNET_SKIP_FIRST_TIME_EXPERIENCE = "1"
$env:DOTNET_NOLOGO = "1"

function Invoke-Checked {
    param(
        [string]$FilePath,
        [string[]]$Arguments
    )

    & $FilePath @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "$FilePath $($Arguments -join ' ') failed with exit code $LASTEXITCODE"
    }
}

function Stop-SocialGraphApi {
    $processIds = @()

    if (Get-Command Get-NetTCPConnection -ErrorAction SilentlyContinue) {
        $processIds += Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue |
            Select-Object -ExpandProperty OwningProcess
    }

    if (Test-Path $pidFile) {
        $pidText = Get-Content $pidFile -Raw
        if ($pidText -match "^\s*(\d+)\s*$") {
            $processIds += [int]$Matches[1]
        }
    }

    foreach ($processId in ($processIds | Sort-Object -Unique)) {
        if ($processId -gt 0) {
            Write-Host "Stopping SocialGraph API process $processId"
            Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
        }
    }
}

Push-Location $repoRoot
try {
    Stop-SocialGraphApi

    Invoke-Checked "dotnet" @("build", "SocialGraph.sln", "-c", "Release")
    Invoke-Checked "dotnet" @("test", "SocialGraph.sln", "-c", "Release", "--no-build")

    if (-not $SkipStart) {
        if (-not (Test-Path $apiDll)) {
            throw "Release API DLL not found at $apiDll"
        }

        Start-Process -FilePath "cmd.exe" -ArgumentList "/c", "start", "`"SocialGraph API`"", "/min", "`"$runner`"" -WindowStyle Hidden
        Start-Sleep -Seconds 4

        $health = Invoke-WebRequest -UseBasicParsing "$Url/health"
        if ($health.StatusCode -ne 200) {
            throw "Health check failed with status $($health.StatusCode)"
        }

        Write-Host "SocialGraph API running at $Url"
    }
}
finally {
    Pop-Location
}
