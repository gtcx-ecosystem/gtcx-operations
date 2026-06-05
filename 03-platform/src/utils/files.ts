import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));

function findRepoRoot(): string {
  let current = __dirname;
  while (current !== '/') {
    if (existsSync(join(current, 'package.json'))) {
      return current;
    }
    current = dirname(current);
  }
  return process.cwd();
}

export const REPO_ROOT = findRepoRoot();
export const PLATFORM_ROOT = join(REPO_ROOT, '03-platform');

/** Corporate-ops domain content (CRM, finance, legal, …) under 03-platform/. */
export function domainPath(...segments: string[]): string {
  return join(PLATFORM_ROOT, ...segments);
}

export function walkDir(dir: string, callback: (path: string) => void): void {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath, callback);
    } else {
      callback(fullPath);
    }
  }
}

export function readYaml<T>(path: string): T {
  const content = readFileSync(path, 'utf-8');
  return yaml.load(content) as T;
}

export function readJson<T>(path: string): T {
  const content = readFileSync(path, 'utf-8');
  return JSON.parse(content) as T;
}

export interface FrontmatterResult<T> {
  frontmatter: T;
  body: string;
}

export function readMarkdownWithFrontmatter<T>(path: string): FrontmatterResult<T> {
  const content = readFileSync(path, 'utf-8');
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    throw new Error(`No frontmatter found in ${path}`);
  }
  const frontmatter = yaml.load(match[1]!) as T;
  const body = match[2]!;
  return { frontmatter, body };
}

export function getFilesByExtension(dir: string, ext: string): string[] {
  const files: string[] = [];
  walkDir(dir, (path) => {
    if (path.endsWith(ext)) files.push(path);
  });
  return files;
}
