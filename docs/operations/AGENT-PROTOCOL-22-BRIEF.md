---
title: 'Agent Protocol 22 Brief (paste to agents)'
status: current
date: 2026-06-03
owner: gtcx-operations
tier: operational
tags: ['agents', 'protocol-22', 'onboarding']
review_cycle: on-change
document_id: OPS-AWS-002
---

# Agent Protocol 22 — Session opener (gtcx-operations)

Copy the block below into any agent chat for this repo.

---

```
GTCX Protocol 22 is ESTABLISHED in gtcx-operations.

Before coding:
1. AGENTS.md Phases 1–5.3 (baseline, .baseline/memory/*, git status).
2. Read docs/operations/agent-work-selection.md
3. Run: pnpm agent:next-work
4. Announce storyId + tier; mark in_progress in docs/strategy/execution-roadmap.md
5. Implement — do NOT ask me which story to pick.

Override: only if I name a story ID in this message.

After each story: done in roadmap, refresh docs/audit/auto-dev-state.md,
micro-commit, pnpm agent:next-work again.

Verify wiring: pnpm agent:work-selection:check
Protocols hub: docs/operations/protocol-adoption-registry.md
```

---

## Repo paths

| Item | Path |
| --- | --- |
| Manifest | `docs/operations/agent-work-selection.md` |
| Roadmap | `docs/strategy/execution-roadmap.md` |
| Session pointer | `docs/audit/auto-dev-state.md` |
| Ecosystem protocol | `gtcx-docs/.../22-agent-work-selection/protocol.md` |
