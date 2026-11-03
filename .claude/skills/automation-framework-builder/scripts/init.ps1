# init.ps1 — Scaffold automation framework directories (Windows / PowerShell)
# Usage: .\init.ps1 -ProjectName "my-tests" -TargetDir "C:\Projects"
# Safe to re-run — existing directories are never deleted.

param(
  [Parameter(Mandatory = $true)]
  [string]$ProjectName,

  [string]$TargetDir = (Get-Location).Path
)

$root = Join-Path $TargetDir $ProjectName

$dirs = @(
  "src\config",
  "src\fixtures",
  "src\pages",
  "src\builders",
  "src\utils",
  "tests\ui",
  "test-results\html",
  "test-results\screenshots"
)

Write-Host ""
Write-Host "Scaffolding automation framework: $root"
Write-Host ("─" * 60)

foreach ($dir in $dirs) {
  $path = Join-Path $root $dir
  if (-not (Test-Path $path)) {
    New-Item -ItemType Directory -Path $path -Force | Out-Null
    Write-Host "  Created : $dir"
  }
  else {
    Write-Host "  Exists  : $dir"
  }
}

Write-Host ("─" * 60)
Write-Host "Directory structure ready at: $root"
Write-Host ""
Write-Host "Next: the automation-framework-builder skill will write all"
Write-Host "source files (package.json, tsconfig.json, playwright.config.ts,"
Write-Host "fixtures, pages, builders, utils, and a sample test)."
Write-Host ""
