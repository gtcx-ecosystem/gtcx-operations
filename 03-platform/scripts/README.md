# Scripts — gtcx-operations

Taxonomy under `03-platform/scripts/` (layout v3 corporate-ops).

| Folder | Role | Examples |
| ------ | ---- | -------- |
| [`agent/`](./agent/) | P19–P27 protocol wiring, bootstrap, next-work | `agent-next-work.mjs`, `check-agent-protocols.mjs` |
| [`domains/`](./domains/) | Corporate domain CLI (legal, finance, CRM, comms) | `validate.ts`, `orchestrate-cross-channel.ts` |
| [`ecosystem/`](./ecosystem/) | Cross-repo health, hygiene, release tooling | `ecosystem-health.ts`, `validate-ecosystem-consistency.ts` |
| [`layout/`](./layout/) | Layout v3 drift scans | `layout-drift-check.mjs` |
| [`workspace/`](./workspace/) | P29 domain checks, PM sync | `check.mjs`, `pm-sync.mjs` |
| [`ops/`](./ops/) | Root hygiene Python gate | `check-workspace-root-cleanliness.py` |
| [`config/`](./config/) | Root stub sync | `sync-root-stubs.mjs` |
| [`agent-sync/`](./agent-sync/) | AGENTS.md partial sync | `sync.mjs` |
| [`lib/`](./lib/) | Shared helpers | `repo-root.mjs` |

Machine-readable index: [`config/scripts.manifest.json`](../../config/scripts.manifest.json).

**Rule:** Source only (`.ts`, `.mjs`, `.py`) — no compiled `.js` / `.d.ts` beside sources; build output → repo `dist/`.
