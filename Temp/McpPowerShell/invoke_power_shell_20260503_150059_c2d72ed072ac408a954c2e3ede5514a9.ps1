[Console]::InputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

$ErrorActionPreference = 'Stop'
$tabs = Invoke-RestMethod -Uri 'http://localhost:9222/json'
$page = $tabs | Where-Object { $_.url -eq 'http://localhost:61804/' } | Select-Object -First 1
if (-not $page) { throw 'SocialGraph tab not found on Edge remote debugging port 9222.' }
Add-Type -AssemblyName System.Net.WebSockets.Client
$ws = [System.Net.WebSockets.ClientWebSocket]::new()
$ws.ConnectAsync([Uri]$page.webSocketDebuggerUrl, [Threading.CancellationToken]::None).GetAwaiter().GetResult()
$id = 0
$events = New-Object System.Collections.Generic.List[object]
function Send-Cdp([string]$method, $params = $null) {
  $script:id++
  $msg = @{ id = $script:id; method = $method }
  if ($null -ne $params) { $msg.params = $params }
  $json = $msg | ConvertTo-Json -Depth 20 -Compress
  $bytes = [Text.Encoding]::UTF8.GetBytes($json)
  $seg = [ArraySegment[byte]]::new($bytes)
  $script:ws.SendAsync($seg, [Net.WebSockets.WebSocketMessageType]::Text, $true, [Threading.CancellationToken]::None).GetAwaiter().GetResult()
  return $script:id
}
function Receive-Cdp([int]$timeoutMs = 5000) {
  $cts = [Threading.CancellationTokenSource]::new($timeoutMs)
  $buffer = New-Object byte[] 1048576
  $ms = [IO.MemoryStream]::new()
  try {
    do {
      $seg = [ArraySegment[byte]]::new($buffer)
      $res = $script:ws.ReceiveAsync($seg, $cts.Token).GetAwaiter().GetResult()
      if ($res.Count -gt 0) { $ms.Write($buffer, 0, $res.Count) }
    } while (-not $res.EndOfMessage)
  } catch { return $null } finally { $cts.Dispose() }
  if ($ms.Length -eq 0) { return $null }
  $text = [Text.Encoding]::UTF8.GetString($ms.ToArray())
  return $text | ConvertFrom-Json
}
function Wait-Response([int]$targetId, [int]$timeoutMs = 5000) {
  $deadline = [DateTime]::UtcNow.AddMilliseconds($timeoutMs)
  while ([DateTime]::UtcNow -lt $deadline) {
    $msg = Receive-Cdp 500
    if ($null -eq $msg) { continue }
    if ($msg.PSObject.Properties.Name -contains 'id' -and $msg.id -eq $targetId) { return $msg }
    $events.Add($msg) | Out-Null
  }
  return $null
}
function Invoke-Cdp([string]$method, $params = $null, [int]$timeoutMs = 5000) {
  $cmdId = Send-Cdp $method $params
  return Wait-Response $cmdId $timeoutMs
}
Invoke-Cdp 'Runtime.enable' | Out-Null
Invoke-Cdp 'Log.enable' | Out-Null
Invoke-Cdp 'Page.enable' | Out-Null
Invoke-Cdp 'Network.enable' | Out-Null
Invoke-Cdp 'Page.reload' @{ ignoreCache = $true } | Out-Null
$deadline = [DateTime]::UtcNow.AddSeconds(8)
while ([DateTime]::UtcNow -lt $deadline) {
  $msg = Receive-Cdp 500
  if ($null -ne $msg) { $events.Add($msg) | Out-Null }
}
$title = Invoke-Cdp 'Runtime.evaluate' @{ expression = 'document.title'; returnByValue = $true }
$summary = Invoke-Cdp 'Runtime.evaluate' @{ expression = @'
(() => ({
  title: document.title,
  url: location.href,
  bodyTextSample: document.body.innerText.slice(0, 1200),
  errorTexts: Array.from(document.querySelectorAll('[role="alert"], .error, .error-message, .notice, .toast, [data-testid*="error" i]')).map(e => e.innerText).filter(Boolean),
  entityCards: document.querySelectorAll('[data-entity-id], .entity-card, [data-testid*="entity" i]').length,
  relationshipCards: document.querySelectorAll('[data-relationship-id], .relationship-card, [data-testid*="relationship" i]').length,
  buttons: Array.from(document.querySelectorAll('button')).map(b => b.innerText || b.getAttribute('aria-label')).filter(Boolean).slice(0, 40)
}))
'@; returnByValue = $true } 5000
$shot = Invoke-Cdp 'Page.captureScreenshot' @{ format = 'png'; captureBeyondViewport = $false } 10000
if ($shot -and $shot.result.data) { [IO.File]::WriteAllBytes('I:\VS-Projekte\SocialGraph\Temp\socialgraph-edge-cdp.png', [Convert]::FromBase64String($shot.result.data)) }
$ws.CloseAsync([Net.WebSockets.WebSocketCloseStatus]::NormalClosure, 'done', [Threading.CancellationToken]::None).GetAwaiter().GetResult()
$interesting = $events | Where-Object { $_.method -in @('Runtime.exceptionThrown','Runtime.consoleAPICalled','Log.entryAdded','Network.loadingFailed') } | ForEach-Object {
  if ($_.method -eq 'Runtime.consoleAPICalled') { [pscustomobject]@{ method=$_.method; type=$_.params.type; text=(($_.params.args | ForEach-Object { $_.value }) -join ' ') } }
  elseif ($_.method -eq 'Log.entryAdded') { [pscustomobject]@{ method=$_.method; level=$_.params.entry.level; text=$_.params.entry.text; url=$_.params.entry.url } }
  elseif ($_.method -eq 'Network.loadingFailed') { [pscustomobject]@{ method=$_.method; errorText=$_.params.errorText; blockedReason=$_.params.blockedReason } }
  else { [pscustomobject]@{ method=$_.method; text=$_.params.exceptionDetails.text; url=$_.params.exceptionDetails.url; line=$_.params.exceptionDetails.lineNumber } }
}
[pscustomobject]@{
  page = @{ title = $summary.result.result.value.title; url = $summary.result.result.value.url; entityCards = $summary.result.result.value.entityCards; relationshipCards = $summary.result.result.value.relationshipCards; buttons = $summary.result.result.value.buttons; errorTexts = $summary.result.result.value.errorTexts; bodyTextSample = $summary.result.result.value.bodyTextSample }
  eventCount = $events.Count
  interestingEvents = @($interesting)
  screenshot = 'I:\VS-Projekte\SocialGraph\Temp\socialgraph-edge-cdp.png'
} | ConvertTo-Json -Depth 20