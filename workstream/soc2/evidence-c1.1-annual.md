# SOC 2 Evidence: C1.1 — Confidentiality Classification

**Criterion:** C1.1
**Responsible:** security-engineer
**Frequency:** annual

## Control Description

The entity classifies information based on confidentiality.

## Test Procedure

1. Verify data classification policy
2. Check secret scanning in CI
3. Validate encryption at rest and in transit

## Expected Result

Data classified as Public/Internal/Restricted/Evidence. Secret scanning gates CI. AES-256 at rest, TLS 1.3 in transit.

## Evidence Sources

- [ ] docs/security/classification-policy.md
- [ ] .github/workflows/ci.yml
- [ ] k8s secret configs

## Evidence Collection Log

| Date | Collector | Finding | Status |
|------|-----------|---------|--------|
| | | | |

## Auditor Review

| Date | Auditor | Result | Notes |
|------|---------|--------|-------|
| | | | |
