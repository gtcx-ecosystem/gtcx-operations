---
title: 'Documentation Guide'
status: 'current'
date: '2026-05-27'
owner: 'ops@gtcx.io'
role: 'ops@gtcx.io'
tier: 'standard'
tags: ['docs', 'architecture']
review_cycle: 'on-change'
---

# Documentation Guide

> Canonical structure for `/docs` in `gtcx-operations`. Follows the [GTCX Documentation Standard](https://github.com/gtcx-ecosystem/gtcx-protocols/blob/main/docs/reference/docs-standard.md).

This repository uses the standard 6-folder documentation skeleton. Every document belongs in exactly one of these folders based on the question it answers.

---

## Structure

```
docs/
├── README.md           ← This file (standard + guide)
├── architecture/       ← How the system works
├── specs/              ← What we're building
├── engineering/        ← How to build it
├── operations/         ← How to run it
├── reference/          ← Where to look things up
└── gitbook/            ← What users see (external docs)
```

---

## Folder Quick Reference

| Question | Folder | Key Docs |
|----------|--------|----------|
| How does the system work? | [`architecture/`](./architecture/) | System architecture, design principles, ADRs |
| What are we building? | [`specs/`](./specs/) | Roadmap, backlog, sprint plans, integrations |
| How do I build/contribute? | [`engineering/`](./engineering/) | Developer guides, testing, security |
| How do I run/maintain this? | [`operations/`](./operations/) | Runbooks, org structure, compliance |
| Where do I look something up? | [`reference/`](./reference/) | Research, glossary, archived docs |
| What do external users need? | [`gitbook/`](./gitbook/) | API reference, user guides |

---

## Principles

1. **Six folders, one question each.** If you can't decide where something goes, ask: "What question does this document answer?"
2. **Pre-create all subfolders.** Empty folders are tracked with `.gitkeep`. The structure itself communicates the standard.
3. **One source of truth.** Never duplicate content across folders.
4. **Project-specific content lives in `specs/`.** The other 5 folders have universal subfolders.
5. **READMEs are navigation.** Every folder's README explains what belongs there and links to its contents.

---

## Adopting This Standard

To add a new document:

1. Determine which question it answers (see table above)
2. Place it in the corresponding folder
3. Add YAML frontmatter with `title`, `status`, `date`, `owner`, `role`, `tier`, `tags`, `review_cycle`
4. Update the folder's README to link to it

---

_Standard version: 1.1 — May 2026_
