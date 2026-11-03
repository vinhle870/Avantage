#!/usr/bin/env bash
# init.sh — Scaffold automation framework directories (macOS / Linux)
# Usage: bash init.sh <project-name> [target-dir]
# Safe to re-run — existing directories are never deleted.

set -e

PROJECT_NAME="${1:?Usage: init.sh <project-name> [target-dir]}"
TARGET_DIR="${2:-$(pwd)}"
ROOT="$TARGET_DIR/$PROJECT_NAME"

DIRS=(
  "src/config"
  "src/fixtures"
  "src/pages"
  "src/builders"
  "src/utils"
  "tests/ui"
  "test-results/html"
  "test-results/screenshots"
)

echo ""
echo "Scaffolding automation framework: $ROOT"
printf '%0.s─' {1..60}; echo

for dir in "${DIRS[@]}"; do
  path="$ROOT/$dir"
  if [ ! -d "$path" ]; then
    mkdir -p "$path"
    echo "  Created : $dir"
  else
    echo "  Exists  : $dir"
  fi
done

printf '%0.s─' {1..60}; echo
echo "Directory structure ready at: $ROOT"
echo ""
echo "Next: the automation-framework-builder skill will write all"
echo "source files (package.json, tsconfig.json, playwright.config.ts,"
echo "fixtures, pages, builders, utils, and a sample test)."
echo ""
