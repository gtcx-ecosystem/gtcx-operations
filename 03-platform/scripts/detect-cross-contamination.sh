#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
# Cross-Contamination Detection
# Detects if distinctive files from one repo appear in another repo.
# This catches automated sync jobs that copy code between repos.
# =============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_ROOT="$(dirname "$SCRIPT_DIR")"
TMPDIR=$(mktemp -d)
trap 'rm -rf "$TMPDIR"' EXIT

FAILED=0
EXCLUDE_FILES="README|LICENSE|package-lock|pnpm-lock|\.gitignore|tsconfig|\.md$|\.json$|\.yaml$|\.yml$"

echo "=== Cross-Contamination Scan ==="
echo "Workspace: $WORKSPACE_ROOT"
echo ""

# Build checksum index for each repo (only distinctive source files)
for repo_dir in "$WORKSPACE_ROOT"/*/; do
  repo=$(basename "$repo_dir")
  if [[ ! -d "$repo_dir/.git" ]]; then
    continue
  fi
  find "$repo_dir" -type f \
    -not -path "*/node_modules/*" \
    -not -path "*/dist/*" \
    -not -path "*/.git/*" \
    -not -path "*/coverage/*" \
    -not -path "*/.turbo/*" \
    -not -path "*/.pytest_cache/*" \
    -not -path "*/.venv/*" \
    | grep -vE "$EXCLUDE_FILES" \
    | xargs -I {} sha256sum "{}" 2>/dev/null \
    | sed "s|  $WORKSPACE_ROOT/$repo/|  |" \
    > "$TMPDIR/$repo.sha256" || true
done

# Check for overlaps between every pair of repos
for repo_a in "$TMPDIR"/*.sha256; do
  name_a=$(basename "$repo_a" .sha256)
  for repo_b in "$TMPDIR"/*.sha256; do
    name_b=$(basename "$repo_b" .sha256)
    if [[ "$name_a" == "$name_b" ]]; then continue; fi
    if [[ ! -s "$repo_a" ]] || [[ ! -s "$repo_b" ]]; then continue; fi

    overlaps=$(awk 'NR==FNR{a[$1];next} $1 in a' "$repo_a" "$repo_b" | awk '{print $2}' | sort -u | head -20)
    if [[ -n "$overlaps" ]]; then
      overlap_count=$(echo "$overlaps" | wc -l | tr -d ' ')
      echo "CONTAMINATION: $name_a ↔ $name_b — $overlap_count identical files:"
      echo "$overlaps" | head -10 | sed 's/^/  - /'
      if [[ "$overlap_count" -gt 10 ]]; then
        echo "  ... and $((overlap_count - 10)) more"
      fi
      FAILED=1
    fi
  done
done

echo ""
if [[ "$FAILED" -ne 0 ]]; then
  echo "Cross-contamination scan FAILED"
  exit 1
fi

echo "No cross-contamination detected ✓"
