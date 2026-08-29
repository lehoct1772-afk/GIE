$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent $PSScriptRoot
$Source = Join-Path $PSScriptRoot "payload\server\gie\hardeningTest.js"
$TargetDir = Join-Path $ProjectRoot "server\gie"
$Target = Join-Path $TargetDir "hardeningTest.js"
$Stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$Backup = Join-Path $ProjectRoot "_HARDENING_PREINSTALL_BACKUP_$Stamp"

if (-not (Test-Path (Join-Path $ProjectRoot "server\gie\layer6Test.js"))) { throw "STOP: Six-layer GIE engine not found at expected project root." }
if (-not (Test-Path $Source)) { throw "STOP: Hardening payload missing." }
New-Item -ItemType Directory -Force -Path $Backup | Out-Null
if (Test-Path $Target) { Copy-Item $Target (Join-Path $Backup "hardeningTest.js") -Force }
Copy-Item $Source $Target -Force

$tests = @(
  @{Name="LAYER 1"; File="server\gie\selfTest.js"},
  @{Name="LAYER 2"; File="server\gie\layer2Test.js"},
  @{Name="LAYER 3"; File="server\gie\layer3Test.js"},
  @{Name="LAYER 4"; File="server\gie\layer4Test.js"},
  @{Name="LAYER 5"; File="server\gie\layer5Test.js"},
  @{Name="LAYER 6"; File="server\gie\layer6Test.js"},
  @{Name="HARDENING"; File="server\gie\hardeningTest.js"}
)
Set-Location $ProjectRoot
foreach ($t in $tests) {
  Write-Host "`nGIE $($t.Name) TEST" -ForegroundColor Cyan
  & node $t.File
  if ($LASTEXITCODE -ne 0) { throw "STOP: $($t.Name) test failed. Backup preserved at $Backup" }
}
Write-Host "`n==============================================" -ForegroundColor Green
Write-Host " GIE ENGINE 1.0.0 HARDENING SUITE PASSED" -ForegroundColor Green
Write-Host " ALL SIX LAYERS REGRESSION VERIFIED" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Green
Write-Host "Backup: $Backup" -ForegroundColor Yellow
