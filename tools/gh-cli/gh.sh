#!/usr/bin/env bash
# Project-scoped GitHub CLI wrapper (Git Bash / WSL).
#
# Uses tools/gh-cli/gh.exe with its login stored in tools/gh-cli/config/ — never the
# per-user config at %APPDATA%\GitHub CLI. Falls back to a gh on PATH only when the
# project binary is missing.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
EXE="$ROOT/gh.exe"

export GH_CONFIG_DIR="$ROOT/config"
mkdir -p "$GH_CONFIG_DIR"

if [ -f "$EXE" ]; then
  exec "$EXE" "$@"
elif command -v gh >/dev/null 2>&1; then
  exec gh "$@"
else
  echo "gh.exe not found. Run this first:" >&2
  echo "  powershell -ExecutionPolicy Bypass -File '$ROOT/install.ps1'" >&2
  exit 1
fi
