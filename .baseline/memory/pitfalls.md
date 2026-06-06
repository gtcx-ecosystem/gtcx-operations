# Known Pitfalls

## Agent scope — sibling repos (2026-06-06)

**Discovered:** 2026-06-06 — scope incident with `sensei-ai`

- **gtcx-operations agents are approved for this repo only.** Do not run git (especially `reset --hard`, `clean`, or migration rollouts) in sibling repos.
- **`sensei-ai` has a dedicated owner agent.** Never audit, migrate, score, or revert there from this workspace.
- **Cross-repo migration checkers** (`gtcx-agentic` `score-migration-health.mjs`, P32/P33): use `--repo gtcx-operations` only — read-only invocation from agentic checkout.
- **Reverts:** undo **only artifacts this session created** (named file or commit). Never “restore repo to origin” on a sibling.
- **Witness:** `01-docs/coordination/to-sensei-ai-agent-scope-incident-2026-06-06.md`

## Code Quality

**Discovered:** 2026-05-27

- Add pitfalls here as they are discovered
