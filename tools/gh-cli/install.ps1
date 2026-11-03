# Downloads the pinned GitHub CLI release into this folder (project-scoped).
# The binary is gitignored, so each teammate runs this once after cloning.
$ErrorActionPreference = 'Stop'

$Version = '2.102.1'
$Sha256  = '843c0dc119f014d9458aeaff96c44c16fc4b8e556c1c4c5df9bab5ba002356e9'
$Asset   = "gh_${Version}_windows_amd64.zip"
$Url     = "https://github.com/cli/cli/releases/download/v$Version/$Asset"

$root = $PSScriptRoot
$zip  = Join-Path $env:TEMP $Asset
$dest = Join-Path $root 'gh.exe'

Write-Host "Downloading GitHub CLI v$Version..."
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
Invoke-WebRequest -Uri $Url -OutFile $zip -UseBasicParsing

$actual = (Get-FileHash -Path $zip -Algorithm SHA256).Hash.ToLower()
if ($actual -ne $Sha256) {
    Remove-Item $zip -Force
    Write-Error "Checksum mismatch.`n  expected: $Sha256`n  actual:   $actual"
    exit 1
}
Write-Host "Checksum OK." -ForegroundColor Green

$staging = Join-Path $env:TEMP "gh-cli-$Version-extract"
if (Test-Path $staging) { Remove-Item $staging -Recurse -Force }
Expand-Archive -Path $zip -DestinationPath $staging -Force
Copy-Item (Join-Path $staging 'bin\gh.exe') $dest -Force
Remove-Item $zip, $staging -Recurse -Force

Write-Host "Installed to $dest" -ForegroundColor Green
& $dest --version

Write-Host ""
Write-Host "Next, sign in once (opens a browser):"
Write-Host "  bash tools/gh-cli/gh.sh auth login"
