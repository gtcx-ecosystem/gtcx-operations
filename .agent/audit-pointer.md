## Audits (cross-repo)

### Universal Rubric (all repos, all agents)

The canonical scoring framework lives here:

```
gtcx-agentic/03-platform/tools/audit-framework/UNIVERSAL_RUBRIC.md
```

Start with `gtcx-agentic/03-platform/tools/audit-framework/README.md` for the entry point.

This rubric works for **any GTCX repository** — product (mobile/web), infrastructure,
backend, or agentic/MCP. It covers 10 dimensions, score trajectory, per-repo-type
weights, and a complete execution protocol.

### How to Run an Audit

1. **Read the rubric** (`gtcx-agentic/03-platform/tools/audit-framework/UNIVERSAL_RUBRIC.md`)
2. **Determine repo type** (Product | Infra | Agentic | Backend) and apply weights from §2
3. **Execute the protocol** from §13 against the target repo
4. **Write the report** to `01-docs/05-audit/universal-audit-YYYY-MM-DD.md` in the target repo

If the command registry is not yet migrated, fall back to
`gtcx-docs/03-platform/tools/audit/audit-framework/commands.json` and the prompt path it references.

### Repo Hygiene (deterministic — no LLM)

Use `@gtcx/hygiene` — `gtcx-agentic/03-platform/tools/hygiene/` (`gtcx-hygiene check|fix|init`).
Per-repo policy: `hygiene.config.json`.

### Legacy Audit Types

The following audit types are still supported but now use the universal rubric as
their scoring backbone:

| Audit Type    | Output Path                              | Notes                                                                 |
| ------------- | ---------------------------------------- | --------------------------------------------------------------------- |
| master-audit  | `01-docs/05-audit/master-audit-YYYY-MM-DD.md`  | Forensic build/test/scan using rubric dimensions 1, 2, 6, 7, 8, 9, 10 |
| product-audit | `01-docs/05-audit/product-audit-YYYY-MM-DD.md` | User-outcome audit using rubric dimensions 3, 4, 5, 6, 9, 10          |
| 10-10-roadmap | `01-docs/05-audit/10-10-roadmap-YYYY-MM-DD.md` | Milestone planning aligned to rubric §2 trajectory                    |

### Provider-Agnostic

The same rubric and protocol work for Claude, Codex, Gemini, Kimi, Deepseek, Grok,
or any other agent. No provider-specific syntax is required.

---

_Canonical framework location: `gtcx-agentic/03-platform/tools/audit-framework/`_
_Rubric version: 1.0 (2026-05-27)_
