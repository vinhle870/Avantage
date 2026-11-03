# Project-scoped jira-cli wrapper (PowerShell).
#
# Uses tools\jira-cli\jira.exe with tools\jira-cli\config.yml — never the global
# config at ~\.config\.jira\. The repo-root .env is the single source of truth
# for the connection; config.yml is synced from it on every run.
$ErrorActionPreference = 'Stop'

$root     = $PSScriptRoot
$repoRoot = (Resolve-Path (Join-Path $root '..\..')).Path
$exe      = Join-Path $root 'jira.exe'
$cfg      = Join-Path $root 'config.yml'

if (-not (Test-Path $exe)) {
    Write-Host "jira.exe not found. Run this first:" -ForegroundColor Yellow
    Write-Host "  powershell -ExecutionPolicy Bypass -File `"$root\install.ps1`""
    exit 1
}

# --- load .env -------------------------------------------------------------
function Import-DotEnv($file) {
    if (-not (Test-Path $file)) { return }
    foreach ($line in (Get-Content $file)) {
        if ($line -match '^\s*#') { continue }
        if ($line -match '^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$') {
            $k = $Matches[1]
            $v = $Matches[2].Trim().Trim('"').Trim("'").Trim()
            if ($v) { [Environment]::SetEnvironmentVariable($k, $v, 'Process') }
        }
    }
}
Import-DotEnv (Join-Path $repoRoot '.env')   # shared project secrets
Import-DotEnv (Join-Path $root '.env')       # optional per-tool override

# --- token gate ------------------------------------------------------------
$offline = @('version','help','completion','man','--help','-h')
$needsAuth = $true
if ($args.Count -eq 0) { $needsAuth = $false }
elseif ($offline -contains $args[0]) { $needsAuth = $false }

if ($needsAuth -and -not $env:JIRA_API_TOKEN) {
    Write-Host "JIRA_API_TOKEN is not set." -ForegroundColor Yellow
    Write-Host "Add it to $repoRoot\.env"
    exit 1
}

# --- .env is authoritative: sync config.yml to match ------------------------
# UTF-8 without BOM: PS 5.1's -Encoding utf8 adds one, and a BOM in YAML is a
# hazard for the Go parser.
$noBom = New-Object System.Text.UTF8Encoding $false

function Sync-Scalar($key, $value) {
    if (-not $value -or -not (Test-Path $cfg)) { return }
    $lines   = Get-Content $cfg
    $current = ($lines | Where-Object { $_ -match "^$key\s*:" } | Select-Object -First 1)
    if ($current -and $current -ne "${key}: $value") {
        $updated = $lines | ForEach-Object {
            if ($_ -match "^$key\s*:") { "${key}: $value" } else { $_ }
        }
        [System.IO.File]::WriteAllLines($cfg, $updated, $noBom)
        Write-Host "note: config.yml $key -> $value" -ForegroundColor DarkGray
    }
}

function Sync-ProjectKey($value) {
    # project.key is nested; only touch the one directly under `project:`.
    if (-not $value -or -not (Test-Path $cfg)) { return }
    $lines = Get-Content $cfg
    $in = $false; $done = $false; $changed = $false
    $updated = foreach ($line in $lines) {
        if ($line -match '^project:') { $in = $true; $line; continue }
        if ($in -and $line -match '^\S')  { $in = $false }
        if ($in -and -not $done -and $line -match '^(\s+)key:\s*(.*)$') {
            $done = $true
            if ($Matches[2].Trim() -ne $value) { $changed = $true }
            "$($Matches[1])key: $value"
            continue
        }
        $line
    }
    if ($changed) {
        [System.IO.File]::WriteAllLines($cfg, $updated, $noBom)
        Write-Host "note: config.yml project.key -> $value" -ForegroundColor DarkGray
    }
}

Sync-Scalar 'server' $env:JIRA_SITE_URL
Sync-Scalar 'login'  $env:JIRA_LOGIN
Sync-ProjectKey      $env:JIRA_PROJECT

# --- build args ------------------------------------------------------------
# `init` regenerates config.yml from scratch, so feed it the .env values.
$argv = @($args)
if ($argv.Count -gt 0 -and $argv[0] -eq 'init') {
    $rest = @()
    if ($argv.Count -gt 1) { $rest = @($argv[1..($argv.Count - 1)]) }
    $argv = @('init', '--installation', 'cloud', '--auth-type', 'basic')
    if ($env:JIRA_SITE_URL) { $argv += @('--server',  $env:JIRA_SITE_URL) }
    if ($env:JIRA_LOGIN)    { $argv += @('--login',   $env:JIRA_LOGIN) }
    if ($env:JIRA_PROJECT)  { $argv += @('--project', $env:JIRA_PROJECT) }
    $argv += $rest
}

$env:JIRA_CONFIG_FILE = $cfg

# CRITICAL: jira-cli maps JIRA_<KEY> onto config keys. Leaving JIRA_PROJECT set
# would overwrite the `project` MAP with a bare string, blanking project.key and
# producing `project=""` in every JQL. These are synced into config.yml above,
# so drop them before handing off.
$env:JIRA_PROJECT   = $null
$env:JIRA_SITE_URL  = $null
$env:JIRA_LOGIN     = $null

& $exe @argv
exit $LASTEXITCODE
