# Downloads the pinned jira-cli release into this folder (project-scoped).
# The binary is gitignored, so each teammate runs this once after cloning.
$ErrorActionPreference = 'Stop'

$Version = '1.7.0'
$Sha256  = '84b205a187ff498533088a8077a294e4245323a66b33f2d963430d27323923a2'
$Asset   = "jira_${Version}_windows_x86_64.zip"
$Url     = "https://github.com/ankitpokhrel/jira-cli/releases/download/v$Version/$Asset"

$root = $PSScriptRoot
$zip  = Join-Path $env:TEMP $Asset
$dest = Join-Path $root 'jira.exe'

Write-Host "Downloading jira-cli v$Version..."
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
Invoke-WebRequest -Uri $Url -OutFile $zip -UseBasicParsing

$actual = (Get-FileHash -Path $zip -Algorithm SHA256).Hash.ToLower()
if ($actual -ne $Sha256) {
    Remove-Item $zip -Force
    Write-Error "Checksum mismatch.`n  expected: $Sha256`n  actual:   $actual"
    exit 1
}
Write-Host "Checksum OK." -ForegroundColor Green

$staging = Join-Path $env:TEMP "jira-cli-$Version-extract"
if (Test-Path $staging) { Remove-Item $staging -Recurse -Force }
Expand-Archive -Path $zip -DestinationPath $staging -Force
Copy-Item (Join-Path $staging 'bin\jira.exe') $dest -Force
Remove-Item $zip, $staging -Recurse -Force

Write-Host "Installed to $dest" -ForegroundColor Green
& $dest version

Write-Host ""
Write-Host "Next: copy .env.example to .env, add your API token, then run:"
Write-Host "  .\tools\jira-cli\jira.ps1 init"
