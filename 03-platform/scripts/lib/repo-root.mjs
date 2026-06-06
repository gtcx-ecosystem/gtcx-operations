/**
 * Resolve repo root from any script under 03-platform/scripts/
 */
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export function repoRootFromMeta(importMetaUrl) {
  let current = dirname(fileURLToPath(importMetaUrl));
  while (current !== '/') {
    if (existsSync(join(current, 'package.json'))) return current;
    current = dirname(current);
  }
  return process.cwd();
}
