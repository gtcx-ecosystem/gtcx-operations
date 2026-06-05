# SOC 2 Evidence: CC7.1 — Security Operations

**Criterion:** CC7.1
**Responsible:** security-engineer
**Frequency:** continuous

## Control Description

The entity detects and responds to security events.

## Test Procedure

1. Verify security scanning in CI (Trivy, CodeQL, pnpm audit)
2. Check incident response runbook exists
3. Validate pentest tracking dashboard

## Expected Result

All CI runs include security scans. Incident response runbook < 1 year old. Pentest findings tracked with SLA.

## Evidence Sources

- [ ] .github/workflows/ci.yml
- [ ] ops/runbooks/incident-response.md
- [ ] workstream/pentest-tracker.md

## Evidence Collection Log

| Date | Collector | Finding | Status |
|------|-----------|---------|--------|
| | | | |

## Auditor Review

| Date | Auditor | Result | Notes |
|------|---------|--------|-------|
| | | | |
