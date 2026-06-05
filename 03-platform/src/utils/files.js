import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';
const __dirname = dirname(fileURLToPath(import.meta.url));
function findRepoRoot() {
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
export function domainPath(...segments) {
    return join(PLATFORM_ROOT, ...segments);
}
export function walkDir(dir, callback) {
    for (const entry of readdirSync(dir)) {
        const fullPath = join(dir, entry);
        const stat = statSync(fullPath);
        if (stat.isDirectory()) {
            walkDir(fullPath, callback);
        }
        else {
            callback(fullPath);
        }
    }
}
export function readYaml(path) {
    const content = readFileSync(path, 'utf-8');
    return yaml.load(content);
}
export function readJson(path) {
    const content = readFileSync(path, 'utf-8');
    return JSON.parse(content);
}
export function readMarkdownWithFrontmatter(path) {
    const content = readFileSync(path, 'utf-8');
    const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) {
        throw new Error(`No frontmatter found in ${path}`);
    }
    const frontmatter = yaml.load(match[1]);
    const body = match[2];
    return { frontmatter, body };
}
export function getFilesByExtension(dir, ext) {
    const files = [];
    walkDir(dir, (path) => {
        if (path.endsWith(ext))
            files.push(path);
    });
    return files;
}
//# sourceMappingURL=files.js.map