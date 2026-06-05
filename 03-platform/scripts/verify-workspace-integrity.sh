#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
# Workspace Integrity Verification
# Checks every repo in the ecosystem against the workspace manifest.
# Verifies required directories exist and forbidden patterns are absent.
# =============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_ROOT="$(dirname "$SCRIPT_DIR")"
MANIFEST="${WORKSPACE_ROOT}/.gtcx/workspace-manifest.json"

if [[ ! -f "$MANIFEST" ]]; then
  echo "ERROR: Workspace manifest not found at $MANIFEST" >&2
  exit 1
fi

FAILED=0
REPO_COUNT=0
PASS_COUNT=0

echo "=== Workspace Integrity Check ==="
echo "Manifest: $MANIFEST"
echo ""

for repo in $(jq -r 'keys[]' "$MANIFEST" | grep -v "^version$\|^description$\|^rules$"); do
  dir="${WORKSPACE_ROOT}/${repo}"
  REPO_COUNT=$((REPO_COUNT + 1))

  if [[ ! -d "$dir" ]]; then
    echo "[$repo] SKIP — directory not present"
    continue
  fi

  repo_failed=0
  required=$(jq -r ".repos[\"$repo\"].required_directories[]?" "$MANIFEST" 2>/dev/null || true)

  for pattern in $required; do
    # Expand glob and count files
    count=$(find "$dir" -path "$dir/${pattern}/*.ts" -type f 2>/dev/null | wc -l | tr -d ' ')
    if [[ "$count" -eq 0 ]]; then
      echo "[$repo] FAIL — missing required source for pattern: $pattern"
      repo_failed=1
    fi
  done

  forbidden=$(jq -r ".repos[\"$repo\"].forbidden_patterns[]?" "$MANIFEST" 2>/dev/null || true)
  for pattern in $forbidden; do
    if echo "$pattern" | grep -q "package.json:name"; then
      forbidden_name=$(echo "$pattern" | sed 's/.*=\"\(.*\)\".*/\1/')
      actual_name=$(node -e "console.log(require('./${dir}/package.json').name || '')" 2>/dev/null || true)
      if [[ "$actual_name" == "$forbidden_name" ]]; then
        echo "[$repo] FAIL — forbidden package name detected: $forbidden_name"
        repo_failed=1
      fi
    else
      count=$(find "$dir" -path "$dir/$pattern" -type f 2>/dev/null | wc -l | tr -d ' ')
      if [[ "$count" -gt 0 ]]; then
        echo "[$repo] FAIL — forbidden pattern detected: $pattern ($count files)"
        repo_failed=1
      fi
    fi
  done

  if [[ "$repo_failed" -eq 0 ]]; then
    echo "[$repo] PASS ✓"
    PASS_COUNT=$((PASS_COUNT + 1))
  else
    FAILED=1
  fi
done

echo ""
echo "=== Results ==="
echo "Repos checked: $REPO_COUNT"
echo "Repos passed:  $PASS_COUNT"

if [[ "$FAILED" -ne 0 ]]; then
  echo "Workspace integrity check FAILED"
  exit 1
fi

echo "Workspace integrity check PASSED ✓"
