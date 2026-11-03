#!/usr/bin/env bash
# Project-scoped jira-cli wrapper (Git Bash / WSL).
#
# Uses tools/jira-cli/jira.exe with tools/jira-cli/config.yml — never the global
# config at ~/.config/.jira/. The repo-root .env is the single source of truth
# for the connection; config.yml is synced from it on every run.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$ROOT/../.." && pwd)"
EXE="$ROOT/jira.exe"
CFG="$ROOT/config.yml"

if [ ! -f "$EXE" ]; then
  echo "jira.exe not found. Run this first:" >&2
  echo "  powershell -ExecutionPolicy Bypass -File '$ROOT/install.ps1'" >&2
  exit 1
fi

# --- load .env -------------------------------------------------------------
# Parsed, not sourced: a .env should be data, not executable shell.
trim() {
  local s="$1"
  s="${s#"${s%%[![:space:]]*}"}"
  s="${s%"${s##*[![:space:]]}"}"
  printf '%s' "$s"
}

load_env() {
  local file="$1" line key val
  [ -f "$file" ] || return 0
  while IFS= read -r line || [ -n "$line" ]; do
    line="${line%$'\r'}"          # tolerate CRLF saves from VS Code
    case "$line" in ''|'#'*) continue ;; esac
    case "$line" in *=*) ;; *) continue ;; esac
    key="$(trim "${line%%=*}")"
    val="$(trim "${line#*=}")"
    val="${val#\"}" ; val="${val%\"}"   # strip surrounding quotes
    val="${val#\'}" ; val="${val%\'}"
    val="$(trim "$val")"                # ...and any space they hid
    [ -n "$key" ] || continue
    [ -n "$val" ] || continue
    export "$key=$val"
  done < "$file"
}
load_env "$REPO_ROOT/.env"   # shared project secrets
load_env "$ROOT/.env"        # optional per-tool override

# --- token gate ------------------------------------------------------------
needs_auth=1
case "${1:-}" in
  ''|version|help|completion|man|--help|-h) needs_auth=0 ;;
esac

if [ "$needs_auth" = "1" ] && [ -z "${JIRA_API_TOKEN:-}" ]; then
  echo "JIRA_API_TOKEN is not set. Add it to $REPO_ROOT/.env" >&2
  exit 1
fi

# --- .env is authoritative: sync config.yml to match ------------------------
sync_scalar() {  # $1=top-level yaml key  $2=desired value
  local key="$1" want="$2" have
  [ -n "$want" ] || return 0
  [ -f "$CFG" ] || return 0
  have="$(sed -n "s|^${key}:[[:space:]]*||p" "$CFG" | head -1)"
  if [ "$have" != "$want" ]; then
    sed -i "s|^${key}:.*$|${key}: ${want}|" "$CFG"
    echo "note: config.yml ${key} -> ${want}" >&2
  fi
}

sync_project_key() {  # project.key is nested; only touch the one under `project:`
  local want="$1" have
  [ -n "$want" ] || return 0
  [ -f "$CFG" ] || return 0
  have="$(awk '
    /^project:/ { f=1; next }
    f && /^[^[:space:]]/ { exit }
    f && /^[[:space:]]+key:/ {
      sub(/^[[:space:]]+key:[[:space:]]*/, ""); print; exit
    }' "$CFG")"
  if [ "$have" != "$want" ]; then
    awk -v want="$want" '
      /^project:/ { f=1; print; next }
      f && /^[^[:space:]]/ { f=0 }
      f && !done && /^[[:space:]]+key:/ {
        match($0, /^[[:space:]]+/)
        print substr($0, 1, RLENGTH) "key: " want
        done=1; next
      }
      { print }' "$CFG" > "$CFG.tmp" && mv "$CFG.tmp" "$CFG"
    echo "note: config.yml project.key -> ${want}" >&2
  fi
}

sync_scalar server "${JIRA_SITE_URL:-}"
sync_scalar login  "${JIRA_LOGIN:-}"
sync_project_key   "${JIRA_PROJECT:-}"

# --- build args ------------------------------------------------------------
# `init` regenerates config.yml from scratch, so feed it the .env values.
args=("$@")
if [ "${1:-}" = "init" ]; then
  shift
  args=(init --installation cloud --auth-type basic)
  [ -n "${JIRA_SITE_URL:-}" ] && args+=(--server  "$JIRA_SITE_URL")
  [ -n "${JIRA_LOGIN:-}" ]    && args+=(--login   "$JIRA_LOGIN")
  [ -n "${JIRA_PROJECT:-}" ]  && args+=(--project "$JIRA_PROJECT")
  args+=("$@")
fi

# jira.exe is a Windows binary: hand it a Windows-style config path.
if command -v cygpath >/dev/null 2>&1; then
  JIRA_CONFIG_FILE="$(cygpath -w "$CFG")"
else
  JIRA_CONFIG_FILE="$CFG"
fi
export JIRA_CONFIG_FILE

# CRITICAL: jira-cli maps JIRA_<KEY> onto config keys. Leaving JIRA_PROJECT set
# would overwrite the `project` MAP with a bare string, blanking project.key and
# producing `project=""` in every JQL. These have been synced into config.yml
# above, so drop them before handing off.
unset JIRA_PROJECT JIRA_SITE_URL JIRA_LOGIN

exec "$EXE" "${args[@]}"
