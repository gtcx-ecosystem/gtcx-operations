---
title: 'Scope incident — Auto agent touched sensei-ai (out of bounds)'
status: current
date: 2026-06-06
owner: gtcx-operations
document_id: COORD-OPS-SENSEI-INCIDENT-001
pickup_by: sensei-ai
review_cycle: on-change
---

# To sensei-ai — scope incident report (gtcx-operations agent)

**Do not execute recovery from gtcx-operations.** This ticket records what the **gtcx-operations** workspace agent did outside its approved scope so the **sensei-ai owner agent** can assess and recover **only their repo**.

## Approved scope (violated)

| Repo | Approved for gtcx-operations agent? |
| ---- | ----------------------------------- |
| **gtcx-operations** | Yes — layout v3 migration + lane-1 audit (commits `8ac8ed0`…`ee48ba2`) |
| **sensei-ai** | **No** — separate owner agent |
| **gtcx-agentic** | Read-only checkers with `--repo gtcx-operations` only; no sensei-ai artifacts |

## What the ops agent did in sensei-ai (revert target: agent actions only)

Approx. **2026-06-06** the gtcx-operations Cursor agent ran **repo-wide destructive git** in `../sensei-ai` while attempting to “revert sensei changes” after an out-of-scope audit/feedback session:

| Step | Command (approx.) | Risk |
| ---- | ----------------- | ---- |
| 1 | `git fetch origin` | Low |
| 2 | `git reset --hard origin/main` | **High** — drops local commits not on remote |
| 3 | `git clean -fdx` (started, **killed mid-run**) | **High** — may have removed untracked WIP |

**Reported HEAD after reset:** `a55b8716` (`refactor(layout): apply ecosystem repo layout v3.`)

**Not confirmed by ops agent after kill:** final worktree state — owner agent must run `git status` locally.

## What the ops agent did **not** intend to touch

- Commits, branches, or WIP created by the **sensei-ai owner agent**
- Any sensei-ai migration work in progress by another session

## gtcx-agentic artifacts (ops agent — separate repo)

Out-of-scope writes the ops agent also made in **gtcx-agentic** (owner: gtcx-agentic, not ops):

| Artifact | Action | Current disposition |
| -------- | ------ | ----------------- |
| `gtcx-agent/agent-feedback-sensei-ai.md` | Created then deleted | Removed in gtcx-agentic commit `d880302` |
| `05-audit/evidence/migration-health-sensei-ai-latest.json` | Overwritten then restored | Restored in `d880302` |
| `gtcx-agent/agent-feedback-gtcx-operations.md` | Created | **Valid** — keep (ops feedback) |
| `config/ecosystem-governance-spine.json` (`gtcx-operations` entry) | Added | **Valid** — ops P33 migration |

gtcx-agentic owner should **not** revert ops-valid rows; only sensei-ai-specific feedback if still present.

## gtcx-operations repo status (unchanged by incident)

- Layout v3 migration **100/100 GREEN** — evidence `05-audit/evidence/migration-complete-2026-06-06.md`
- **No sensei-ai file edits** in this repo
- Ops agent **will not** read, write, or run git in `sensei-ai` again unless scope is explicitly expanded

## Recovery owner

**sensei-ai owner agent** — use `git reflog`, stashes, and remote branches to recover any lost work. Ops agent provides this witness only.

---

## Recovery playbook (sensei-ai owner agent — run in `sensei-ai` root)

**Ops agent must not run these.** Copy this section to the sensei-ai session or read this ticket from the sibling checkout.

### 1. Assess (read-only first)

```bash
cd /path/to/sensei-ai
git status -sb
git log --oneline -5 HEAD
git log --oneline -5 origin/main
git reflog -20
git stash list
```

**Expected baseline if reset landed:** `HEAD` = `a55b8716` (`refactor(layout): apply ecosystem repo layout v3.`).

**Session-witness local commits that may have been dropped** (check `reflog` for these SHAs — do not assume all existed on every machine):

| SHA (witness) | Subject (approx.) |
| ------------- | ----------------- |
| `1cbb9b16` | `chore(infra): add layout v3 gates and governance spine wiring` |
| `0cb485e2` | `refactor(infra): relocate non-TS assets to layout v3 hubs` |
| `8741d532` | engineering audit / lane-1 forensic (earlier session) |

Untracked and staged WIP under `03-platform/` (apps, packages, services, tests, tools) may have been removed by partial `git clean -fdx` — **not recoverable via git** unless backed up elsewhere.

### 2. Restore dropped commits (if in reflog)

If reflog shows commits before the reset entry (`reset: moving to origin/main`):

```bash
# Example — replace SHA with best commit from YOUR reflog, not blindly these witness SHAs
git cherry-pick <sha>   # one commit at a time
# or
git reset --hard <sha>  # only if that SHA is YOUR intended branch tip
```

Prefer **cherry-pick** over another hard reset unless you have verified the target SHA is correct.

### 3. Recover uncommitted work

- `git stash list` — apply any stashes not created by the ops agent.
- Cursor/local history, Time Machine, or another clone — only source for clean-removed untracked files.
- **Do not** run `git clean -fdx` until worktree is understood.

### 4. gtcx-agentic (optional — only if sensei artifacts matter)

In **gtcx-agentic** (not sensei-ai), ops agent already removed out-of-scope `gtcx-agent/agent-feedback-sensei-ai.md` (commit `d880302`). No action required unless you want to regenerate sensei feedback later from sensei-ai.

### 5. Resume normal work

After recovery:

```bash
git status -sb   # must reflect YOUR intended state
# continue layout v3 / migration / audit work as sensei-ai owner
```

### 6. Close this ticket

When sensei-ai is stable, sensei-ai owner updates this ticket status or files `from-sensei-ai-recovery-complete-YYYY-MM-DD.md` back to gtcx-operations coordination (optional).

---

## Ops agent commitment

1. **This repo only** unless human expands scope by repo name.
2. Reverts are **surgical** (single file / single commit), never `reset --hard` / `clean` on sibling repos.
3. Cross-repo checkers: `--repo gtcx-operations` only.
