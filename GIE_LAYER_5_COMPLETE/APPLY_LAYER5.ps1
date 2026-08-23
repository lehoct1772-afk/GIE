$ErrorActionPreference = 'Stop'
$project = "$HOME\OneDrive\Desktop\GIE AI ZIP 2\GIE Website\project"
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$backup = Join-Path $project "_LAYER5_PREINSTALL_BACKUP_$stamp"
$package = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not (Test-Path $project)) { throw "GIE project not found: $project" }
if (-not (Test-Path "$project\server\gie\layer4Test.js")) { throw 'Verified Layer 4 installation was not found. Nothing changed.' }
New-Item -ItemType Directory -Force -Path $backup | Out-Null
Copy-Item "$project\server\gie" "$backup\gie" -Recurse -Force
Copy-Item "$package\server\gie\*" "$project\server\gie" -Recurse -Force
Push-Location $project
try {
  Write-Host "`nGIE LAYER 1 REGRESSION TEST" -ForegroundColor Cyan; node server/gie/selfTest.js; if ($LASTEXITCODE -ne 0) { throw 'Layer 1 regression failed. Backup preserved.' }
  Write-Host "`nGIE LAYER 2 REGRESSION TEST" -ForegroundColor Cyan; node server/gie/layer2Test.js; if ($LASTEXITCODE -ne 0) { throw 'Layer 2 regression failed. Backup preserved.' }
  Write-Host "`nGIE LAYER 3 REGRESSION TEST" -ForegroundColor Cyan; node server/gie/layer3Test.js; if ($LASTEXITCODE -ne 0) { throw 'Layer 3 regression failed. Backup preserved.' }
  Write-Host "`nGIE LAYER 4 REGRESSION TEST" -ForegroundColor Cyan; node server/gie/layer4Test.js; if ($LASTEXITCODE -ne 0) { throw 'Layer 4 regression failed. Backup preserved.' }
  Write-Host "`nGIE LAYER 5 TEST" -ForegroundColor Cyan; node server/gie/layer5Test.js; if ($LASTEXITCODE -ne 0) { throw 'Layer 5 test failed. Backup preserved.' }
  Write-Host "`nLAYER 5 INSTALLED AND VERIFIED" -ForegroundColor Green; Write-Host "Backup: $backup" -ForegroundColor DarkGray
} finally { Pop-Location }
