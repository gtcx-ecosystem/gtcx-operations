# SOC 2 Evidence: CC8.1 — Change Management

**Criterion:** CC8.1
**Responsible:** platform-engineer
**Frequency:** continuous

## Control Description

The entity authorizes, tests, and documents changes.

## Test Procedure

1. Review PR approval requirements
2. Verify CI gates before merge
3. Check deployment rollback procedure

## Expected Result

All code changes require PR + 1 approval. CI gates (test, lint, typecheck, security) must pass. Rollback script tested monthly.

## Evidence Sources

- [ ] .github/PULL_REQUEST_TEMPLATE.md
- [ ] .github/workflows/ci.yml
- [ ] deploy/rollback.sh

## Evidence Collection Log

| Date | Collector | Finding | Status |
|------|-----------|---------|--------|
| | | | |

## Auditor Review

| Date | Auditor | Result | Notes |
|------|---------|--------|-------|
| | | | |
