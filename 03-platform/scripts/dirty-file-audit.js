#!/usr/bin/env tsx
/**
 * Dirty File Audit
 *
 * Categorizes uncommitted files in a repo to guide cleanup decisions.
 * Run: `tsx 03-platform/scripts/dirty-file-audit.ts <repo-name>`
 */
import { execSync } from "child_process";
import { existsSync } from "fs";
import { join } from "path";
const ECOSYSTEM_ROOT = process.env.ECOSYSTEM_ROOT || join(process.env.HOME || "", "Sites", "gtcx-ecosystem");
const CATEGORIES = [
    {
        name: "Audit outputs (superseded)",
        patterns: [
            /docs\/audit\/.*-2026-0[1-4]-/,
            /docs\/audit\/.*-2026-05-0[1-9]-/,
            /audit\/.*-2026-0[1-4]-/,
        ],
        action: "purge",
        reason: "Old audit outputs superseded by newer versions",
    },
    {
        name: "Coverage reports",
        patterns: [/coverage\//, /\.nyc_output\//, /\.coverage/],
        action: "purge",
        reason: "Generated artifacts, should not be committed",
    },
    {
        name: "Build artifacts",
        patterns: [/dist\//, /build\//, /\.turbo\//, /\.next\//, /out\//],
        action: "purge",
        reason: "Generated build outputs",
    },
    {
        name: "Node modules",
        patterns: [/node_modules\//],
        action: "purge",
        reason: "Should be in .gitignore",
    },
    {
        name: "IDE / OS files",
        patterns: [/\.DS_Store/, /\.idea\//, /\.vscode\//, /\.swp$/, /~$/],
        action: "purge",
        reason: "Editor/OS artifacts",
    },
    {
        name: "Log files",
        patterns: [/\.log$/, /console-.*\.log$/, /\.playwright-mcp\//],
        action: "purge",
        reason: "Runtime logs",
    },
    {
        name: "Package lock (npm)",
        patterns: [/package-lock\.json$/],
        action: "purge",
        reason: "Migrated to pnpm",
    },
    {
        name: "Docs (potentially valuable)",
        patterns: [/docs\//, /\.md$/],
        action: "review",
        reason: "May contain useful documentation",
    },
    {
        name: "Config files",
        patterns: [/\.config\./, /\.env/, /\.yaml$/, /\.yml$/, /\.json$/],
        action: "review",
        reason: "May be intentional config changes",
    },
    {
        name: "Source code",
        patterns: [/\.(ts|tsx|js|jsx|py|rs|go)$/],
        action: "review",
        reason: "Actual code changes need review",
    },
];
function run(repo, cmd) {
    try {
        return execSync(cmd, {
            cwd: join(ECOSYSTEM_ROOT, repo),
            encoding: "utf-8",
            timeout: 5000,
        }).trim();
    }
    catch {
        return "";
    }
}
function categorizeFile(path) {
    for (const cat of CATEGORIES) {
        for (const pattern of cat.patterns) {
            if (pattern.test(path)) {
                return { category: cat.name, action: cat.action, reason: cat.reason };
            }
        }
    }
    return { category: "Unknown", action: "review", reason: "No matching category" };
}
function auditRepo(repo) {
    const repoPath = join(ECOSYSTEM_ROOT, repo);
    if (!existsSync(repoPath)) {
        console.log(`Repo ${repo} not found`);
        return;
    }
    const statusOutput = run(repo, "git status --short");
    if (!statusOutput) {
        console.log(`\n=== ${repo} ===`);
        console.log("No dirty files\n");
        return;
    }
    const files = statusOutput.split("\n").filter((l) => l.trim());
    const categorized = files.map((line) => {
        const path = line.slice(3).trim();
        const status = line.slice(0, 2).trim();
        const cat = categorizeFile(path);
        return { line, path, status, ...cat };
    });
    const byAction = {
        purge: categorized.filter((f) => f.action === "purge"),
        commit: categorized.filter((f) => f.action === "commit"),
        review: categorized.filter((f) => f.action === "review"),
    };
    console.log(`\n=== ${repo} — Dirty File Audit ===`);
    console.log(`Total dirty files: ${files.length}\n`);
    for (const [action, items] of Object.entries(byAction)) {
        if (items.length === 0)
            continue;
        console.log(`\n## ${action.toUpperCase()} (${items.length} files)\n`);
        for (const item of items.slice(0, 20)) {
            console.log(`  [${item.status}] ${item.path}`);
            console.log(`      → ${item.category}: ${item.reason}`);
        }
        if (items.length > 20) {
            console.log(`  ... and ${items.length - 20} more`);
        }
    }
    console.log(`\n## Summary\n`);
    console.log(`| Action | Count |`);
    console.log(`|--------|-------|`);
    console.log(`| PURGE  | ${byAction.purge.length} |`);
    console.log(`| COMMIT | ${byAction.commit.length} |`);
    console.log(`| REVIEW | ${byAction.review.length} |`);
}
function main() {
    const repo = process.argv[2];
    if (repo) {
        auditRepo(repo);
    }
    else {
        const repos = ["gtcx-docs", "baseline-os", "gtcx-protocols"];
        for (const r of repos) {
            auditRepo(r);
        }
    }
}
main();
//# sourceMappingURL=dirty-file-audit.js.map