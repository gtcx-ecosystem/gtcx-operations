export declare const REPO_ROOT: string;
export declare function walkDir(dir: string, callback: (path: string) => void): void;
export declare function readYaml<T>(path: string): T;
export declare function readJson<T>(path: string): T;
export interface FrontmatterResult<T> {
    frontmatter: T;
    body: string;
}
export declare function readMarkdownWithFrontmatter<T>(path: string): FrontmatterResult<T>;
export declare function getFilesByExtension(dir: string, ext: string): string[];
//# sourceMappingURL=files.d.ts.map