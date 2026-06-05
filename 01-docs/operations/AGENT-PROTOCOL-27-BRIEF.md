---
title: 'Agent Protocol 27 Brief (paste to agents)'
status: current
date: 2026-06-03
owner: gtcx-operations
document_id: OPS-P27-002
---

# Agent Protocol 27 — Session execution (gtcx-operations)

```
Protocol 27 — run verification yourself.

Before marking work done:
1. pnpm agent:verify-ladder   (or: typecheck, validate, test, lint:policies)
2. Report: command → exit code for each step
3. Do NOT say "verify locally" or ask me to run pnpm test

If sandbox/credentials block you: Permission Unblock Report (see 01-docs/04-ops/agent-execution-obligation.md)

Cross-repo INF-86: cd ../gtcx-protocols && pnpm check:inf86-xr401-preceremony — you run it, not me.

Manifest: 01-docs/04-ops/agent-execution-obligation.md
```
