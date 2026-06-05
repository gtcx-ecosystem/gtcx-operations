# SLSA Verification Report: baseline-os

**Score:** 67% (4/6)

| Check | Status | Detail |
|-------|--------|--------|
| Release workflow has SLSA steps | ✅ PASS | Found: provenance, SBOM, cosign, attestation |
| CI workflow has security gates | ✅ PASS | Audit: true, Test: true, Build: true |
| SBOM artifact exists | ❌ FAIL | No SBOM files found |
| Provenance attestation exists | ❌ FAIL | No provenance files found |
| Cosign signing configured | ✅ PASS | Cosign signing found in release workflow |
| Reproducible build script exists | ✅ PASS | 03-platform/scripts/reproducible-builds.sh found |

## SLSA Level Assessment

**SLSA Build L2** — Provenance exists but key L3 features missing.
