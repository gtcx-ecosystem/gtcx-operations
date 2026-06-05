---
title: 'Agent Proceed Confirmation Manifest'
status: current
date: 2026-06-03
owner: gtcx-operations
document_id: OPS-APC-001
protocol: gtcx-docs/01-docs/governance/protocols/26-agent-proceed-confirmation/protocol.md
adoption_status: established
---

# Agent Proceed Confirmation — gtcx-operations

> **Protocol:** [Protocol 26 — Agent Proceed Confirmation](https://github.com/gtcx-ecosystem/gtcx-docs/blob/main/01-docs/governance/protocols/26-agent-proceed-confirmation/protocol.md)  
> **Complements:** [Protocol 22](./agent-work-selection.md) · [Protocol 24](./cross-repo-coordination.md)

Agents **recommend and proceed**. Humans **stop**, **correct**, or supply a story ID — they do not **choose** among agent-generated options.

---

## Phase 5.6 (after Protocol 22)

1. Run `pnpm agent:next-work` (Phase 5.4).
2. Read [`01-docs/06-coordination/ECOSYSTEM-CRITICAL-PATH-INF-86-POINTER.md`](../coordination/ECOSYSTEM-CRITICAL-PATH-INF-86-POINTER.md) when story touches INF-86 or sibling repos.
3. Emit **Proceed Brief** or **Blocker Report** in the first substantive reply.
4. Begin work in the same turn unless user **stop** / **correct:** or approval gate applies.

---

## Proceed Brief template

```markdown
## Proceed Brief

**Next action:** …
**Story / work ID:** …
**Because:** …
**Inputs used:** …
**Blocked:** no | yes
**Override:** Reply **stop**, **correct:** …, or a story ID.
```

---

## Blocker Report template

```markdown
## Blocker Report

**Blocked on:** …
**Owner repo:** …
**Because:** …
**Artifact:** 01-docs/06-coordination/to-<repo>-….md
**Override:** Reply **stop** or name a different story ID.
```

---

## Approval gates (this repo)

| Gate | Requires explicit human authorize |
| --- | --- |
| `git push` | User asked or policy allows |
| KMS / Terraform / XR-402 ceremony | **Never here** — gtcx-infrastructure |
| Production external comms (live WhatsApp/email) | Dry-run default; approve before send |
| Force-push / destructive git | User explicit only |
| Committing secrets | Never |

---

## Forbidden

- "Which should I do next?" / "Option A or B?"
- "Do you want me to …?" without stating what you **will** do and **why**
- Menus at end of every message

**Check:** `pnpm agent:proceed-confirmation:check`
