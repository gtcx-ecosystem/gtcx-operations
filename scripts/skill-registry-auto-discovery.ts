#!/usr/bin/env tsx
/**
 * Skill Registry Auto-Discovery
 *
 * Scans docs for skills and compares against registry.
 * Reports new, missing, and outdated skills.
 *
 * Run: `pnpm discover:skills`
 */

import { existsSync, readFileSync, readdirSync, writeFileSync } from "fs";
import { join } from "path";

const ECOSYSTEM_ROOT = process.env.ECOSYSTEM_ROOT || join(process.env.HOME || "", "Sites", "gtcx-ecosystem");

interface DiscoveredSkill {
  id: string;
  name: string;
  source: string;
  type: string;
  layer: string;
  vertical: string;
  status: "new" | "registered" | "mismatch";
}

function scanSkillFiles(): DiscoveredSkill[] {
  const skills: DiscoveredSkill[] = [];

  const scanDirs = [
    join(ECOSYSTEM_ROOT, "baseline-os", "docs", "reference", "skills"),
    join(ECOSYSTEM_ROOT, "baseline-os", "docs", "agents", "skills"),
  ];

  for (const dir of scanDirs) {
    if (!existsSync(dir)) continue;

    try {
      const files = readdirSync(dir, { withFileTypes: true, recursive: true });
      for (const entry of files) {
        if (entry.isFile() && entry.name.endsWith("-skill.md")) {
          const fullPath = join(entry.parentPath || dir, entry.name);
          const relPath = fullPath.replace(ECOSYSTEM_ROOT, "");
          const content = readFileSync(fullPath, "utf-8");

          const idMatch = content.match(/ID:\s*`?([^`\n]+)`?/);
          const nameMatch = content.match(/# Skill:\s*(.+)/);
          const typeMatch = content.match(/Type:\s*`?([^`\n]+)`?/);
          const layerMatch = content.match(/Layer:\s*`?([^`\n]+)`?/);
          const verticalMatch = content.match(/Vertical:\s*`?([^`\n]+)`?/);

          const id = idMatch?.[1].trim() || entry.name.replace("-skill.md", "");
          const name = nameMatch?.[1].trim() || id;

          skills.push({
            id,
            name,
            source: relPath,
            type: typeMatch?.[1].trim() || "unknown",
            layer: layerMatch?.[1].trim() || "unknown",
            vertical: verticalMatch?.[1].trim() || "unknown",
            status: "new",
          });
        }
      }
    } catch { /* skip */ }
  }

  return skills;
}

function loadRegistry(): Set<string> {
  const registryPath = join(ECOSYSTEM_ROOT, "baseline-os", "packages", "baselineos", "src", "core", "skill-registry.ts");
  const ids = new Set<string>();

  if (!existsSync(registryPath)) return ids;

  try {
    const content = readFileSync(registryPath, "utf-8");
    const matches = content.matchAll(/id:\s*['"](.+?)['"]/g);
    for (const m of matches) {
      ids.add(m[1]);
    }
  } catch { /* skip */ }

  return ids;
}

function generateMarkdown(skills: DiscoveredSkill[]): string {
  const registry = loadRegistry();

  for (const skill of skills) {
    if (registry.has(skill.id)) {
      skill.status = "registered";
    }
  }

  const newSkills = skills.filter(s => s.status === "new");
  const registered = skills.filter(s => s.status === "registered");

  let md = `# Skill Registry Auto-Discovery Report\n\n`;
  md += `**Generated:** ${new Date().toISOString().split("T")[0]}\n`;
  md += `**Discovered:** ${skills.length}\n`;
  md += `**Registered:** ${registered.length}\n`;
  md += `**New (unregistered):** ${newSkills.length}\n\n`;

  if (newSkills.length > 0) {
    md += `## New Skills (Not in Registry)\n\n`;
    md += `| ID | Name | Type | Layer | Vertical | Source |\n`;
    md += `|----|------|------|-------|----------|--------|\n`;
    for (const s of newSkills) {
      md += `| ${s.id} | ${s.name} | ${s.type} | ${s.layer} | ${s.vertical} | ${s.source} |\n`;
    }
    md += `\n`;
    md += `To register, add to \`packages/baselineos/src/core/skill-registry.ts\`.\n\n`;
  }

  if (registered.length > 0) {
    md += `## Registered Skills\n\n`;
    md += `| ID | Name | Type | Layer | Vertical |\n`;
    md += `|----|------|------|-------|----------|\n`;
    for (const s of registered) {
      md += `| ${s.id} | ${s.name} | ${s.type} | ${s.layer} | ${s.vertical} |\n`;
    }
    md += `\n`;
  }

  return md;
}

function main() {
  console.log("Scanning for skills...");
  const skills = scanSkillFiles();
  console.log(`Discovered ${skills.length} skills.`);

  const md = generateMarkdown(skills);
  const outPath = join(ECOSYSTEM_ROOT, "gtcx-operations", "workstream", `skill-registry-discovery-${new Date().toISOString().split("T")[0]}.md`);
  writeFileSync(outPath, md);

  const registry = loadRegistry();
  const newSkills = skills.filter(s => !registry.has(s.id));
  console.log(`Registered: ${skills.length - newSkills.length} | New: ${newSkills.length}`);
  console.log(`Report: ${outPath}`);
}

main();
