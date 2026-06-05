# Security Audit Report

**Generated:** 2026-05-29
**Repos scanned:** 21/22

## Summary

| Severity | Count |
|----------|-------|
| 🔴 Critical | 0 |
| 🟠 High | 18 |
| 🟡 Moderate | 42 |
| 🟢 Low | 8 |
| 🟢 Info | 0 |
| **Total** | **68** |

## Per-Repo Results

| Repo | Status | Findings |
|------|--------|----------|
| ✅ baseline-os | 0 findings | 0 |
| ✅ gtcx-core | 0 findings | 0 |
| ✅ gtcx-protocols | 0 findings | 0 |
| ✅ gtcx-infrastructure | 0 findings | 0 |
| ⚠️ gtcx-agentic | 3 findings | 3 |
| ⚠️ gtcx-mobile | 5 findings | 5 |
| ✅ gtcx-intelligence | 0 findings | 0 |
| ⚠️ terminal-os | 1 findings | 1 |
| ✅ ledger-ui | 0 findings | 0 |
| ⚠️ compliance-os | 11 findings | 11 |
| ⚠️ exploration-os | 1 findings | 1 |
| ✅ griot-ai | 0 findings | 0 |
| ⚠️ sensei-ai | 4 findings | 4 |
| ✅ terra-os | 0 findings | 0 |
| ✅ veritas-ai | 0 findings | 0 |
| ➖ nyota-ai | No lockfile | 0 |
| ⚠️ gtcx-operations | 3 findings | 3 |
| ⚠️ gtcx-docs | 2 findings | 2 |
| ✅ gtcx-agile | 0 findings | 0 |
| ⚠️ gtcx-markets | 7 findings | 7 |
| ⚠️ gtcx-platforms | 9 findings | 9 |
| ⚠️ gtcx-hardware | 22 findings | 22 |

## Findings by Repo

### gtcx-agentic

| Package | Severity | Vulnerability | Fix Available |
|---------|----------|---------------|---------------|
| agents@0.1.0 | moderate | Cloudflare Agents SDK has Insecure Direct Object R | ✅ |
| agents@0.1.0 | moderate | Cloudflare Agents is Vulnerable to Reflected Cross | ✅ |
| agents@0.1.0 | moderate | Cloudflare Agents has a Reflected Cross-Site Scrip | ✅ |

### gtcx-mobile

| Package | Severity | Vulnerability | Fix Available |
|---------|----------|---------------|---------------|
| drizzle-orm@0.41.0 | high | Drizzle ORM has SQL injection via improperly escap | ✅ |
| brace-expansion@5.0.5 | moderate | brace-expansion: Large numeric range defeats docum | ✅ |
| ws@8.20.0 | moderate | ws: Uninitialized memory disclosure | ✅ |
| turbo@2.9.6 | moderate | Trubo: Login callback CSRF/session fixation | ✅ |
| turbo@2.9.6 | low | Turbo: Unexpected local code execution during Yarn | ✅ |

### terminal-os

| Package | Severity | Vulnerability | Fix Available |
|---------|----------|---------------|---------------|
| tmp@0.2.5 | high | tmp has Path Traversal via unsanitized prefix/post | ✅ |

### compliance-os

| Package | Severity | Vulnerability | Fix Available |
|---------|----------|---------------|---------------|
| yaml@2.8.2 | moderate | yaml is vulnerable to Stack Overflow via deeply ne | ✅ |
| vite@5.4.21 | moderate | Vite Vulnerable to Path Traversal in Optimized Dep | ✅ |
| @fastify/static@9.0.0 | moderate | @fastify/static vulnerable to path traversal in di | ✅ |
| @fastify/static@9.0.0 | moderate | @fastify/static vulnerable to route guard bypass v | ✅ |
| postcss@8.4.49 | moderate | PostCSS has XSS via Unescaped </style> in its CSS  | ✅ |
| ws@8.19.0 | moderate | ws: Uninitialized memory disclosure | ✅ |
| turbo@2.8.9 | moderate | Trubo: Login callback CSRF/session fixation | ✅ |
| turbo@2.8.9 | low | Turbo: Unexpected local code execution during Yarn | ✅ |
| @tootallnate/once@2.0.0 | low | @tootallnate/once vulnerable to Incorrect Control  | ✅ |
| uuid@7.0.3 | moderate | uuid: Missing buffer bounds check in v3/v5/v6 when | ✅ |
| qs@6.15.0 | moderate | qs has a remotely triggerable DoS: qs.stringify cr | ✅ |

### exploration-os

| Package | Severity | Vulnerability | Fix Available |
|---------|----------|---------------|---------------|
| uuid@7.0.3 | moderate | uuid: Missing buffer bounds check in v3/v5/v6 when | ✅ |

### sensei-ai

| Package | Severity | Vulnerability | Fix Available |
|---------|----------|---------------|---------------|
| brace-expansion@5.0.5 | moderate | brace-expansion: Large numeric range defeats docum | ✅ |
| protobufjs@8.0.3 | moderate | protobufjs: Denial of Service via unbounded recurs | ✅ |
| turbo@2.8.1 | moderate | Trubo: Login callback CSRF/session fixation | ✅ |
| turbo@2.8.1 | low | Turbo: Unexpected local code execution during Yarn | ✅ |

### gtcx-operations

| Package | Severity | Vulnerability | Fix Available |
|---------|----------|---------------|---------------|
| esbuild@0.21.5 | moderate | esbuild enables any website to send any requests t | ✅ |
| vite@5.4.21 | moderate | Vite Vulnerable to Path Traversal in Optimized Dep | ✅ |
| uuid@9.0.1 | moderate | uuid: Missing buffer bounds check in v3/v5/v6 when | ✅ |

### gtcx-docs

| Package | Severity | Vulnerability | Fix Available |
|---------|----------|---------------|---------------|
| esbuild@0.21.5 | moderate | esbuild enables any website to send any requests t | ✅ |
| vite@5.4.21 | moderate | Vite Vulnerable to Path Traversal in Optimized Dep | ✅ |

### gtcx-markets

| Package | Severity | Vulnerability | Fix Available |
|---------|----------|---------------|---------------|
| postcss@8.4.31 | moderate | PostCSS has XSS via Unescaped </style> in its CSS  | ✅ |
| hono@4.12.16 | moderate | Hono has CSS Declaration Injection via Style Objec | ✅ |
| next@15.5.16 | high | Next.js has a Middleware / Proxy bypass in App Rou | ✅ |
| hono@4.12.16 | low | Hono has improper validation of NumericDate claims | ✅ |
| hono@4.12.16 | moderate | Hono's Cache Middleware ignores Vary: Authorizatio | ✅ |
| turbo@2.9.7 | moderate | Trubo: Login callback CSRF/session fixation | ✅ |
| turbo@2.9.7 | low | Turbo: Unexpected local code execution during Yarn | ✅ |

### gtcx-platforms

| Package | Severity | Vulnerability | Fix Available |
|---------|----------|---------------|---------------|
| esbuild@0.21.5 | moderate | esbuild enables any website to send any requests t | ✅ |
| @nestjs/platform-fastify@10.4.22 | moderate | Nest has a Fastify URL Encoding Middleware Bypass  | ✅ |
| fastify@4.28.1 | low | Fastify Vulnerable to DoS via Unbounded Memory All | ✅ |
| fastify@4.28.1 | high | Fastify's Content-Type header tab character allows | ✅ |
| @nestjs/platform-fastify@10.4.22 | high | Nest has a Fastify URL Encoding Middleware Bypass  | ✅ |
| @nestjs/platform-fastify@10.4.22 | high | Nest Fastify HEAD Request Middleware Bypass | ✅ |
| fastify@4.28.1 | moderate | fastify: request.protocol and request.host Spoofab | ✅ |
| vite@5.4.21 | moderate | Vite Vulnerable to Path Traversal in Optimized Dep | ✅ |
| @nestjs/core@10.4.22 | moderate | @nestjs/core Improperly Neutralizes Special Elemen | ✅ |

### gtcx-hardware

| Package | Severity | Vulnerability | Fix Available |
|---------|----------|---------------|---------------|
| minimatch@3.1.2 | high | minimatch has a ReDoS via repeated wildcards with  | ✅ |
| minimatch@9.0.5 | high | minimatch has a ReDoS via repeated wildcards with  | ✅ |
| minimatch@3.1.2 | high | minimatch has ReDoS: matchOne() combinatorial back | ✅ |
| minimatch@9.0.5 | high | minimatch has ReDoS: matchOne() combinatorial back | ✅ |
| minimatch@3.1.2 | high | minimatch ReDoS: nested *() extglobs generate cata | ✅ |
| minimatch@9.0.5 | high | minimatch ReDoS: nested *() extglobs generate cata | ✅ |
| ajv@6.12.6 | moderate | ajv has ReDoS when using `$data` option | ✅ |
| flatted@3.3.3 | high | flatted vulnerable to unbounded recursion DoS in p | ✅ |
| flatted@3.3.3 | high | Prototype Pollution via parse() in NodeJS flatted | ✅ |
| brace-expansion@1.1.12 | moderate | brace-expansion: Zero-step sequence causes process | ✅ |
| brace-expansion@2.0.2 | moderate | brace-expansion: Zero-step sequence causes process | ✅ |
| picomatch@2.3.1 | moderate | Picomatch: Method Injection in POSIX Character Cla | ✅ |
| picomatch@4.0.3 | moderate | Picomatch: Method Injection in POSIX Character Cla | ✅ |
| picomatch@2.3.1 | high | Picomatch has a ReDoS vulnerability via extglob qu | ✅ |
| picomatch@4.0.3 | high | Picomatch has a ReDoS vulnerability via extglob qu | ✅ |
| yaml@2.8.2 | moderate | yaml is vulnerable to Stack Overflow via deeply ne | ✅ |
| vite@7.3.1 | moderate | Vite Vulnerable to Path Traversal in Optimized Dep | ✅ |
| vite@7.3.1 | high | Vite: `server.fs.deny` bypassed with queries | ✅ |
| vite@7.3.1 | high | Vite Vulnerable to Arbitrary File Read via Vite De | ✅ |
| postcss@8.5.8 | moderate | PostCSS has XSS via Unescaped </style> in its CSS  | ✅ |
| turbo@2.8.3 | moderate | Trubo: Login callback CSRF/session fixation | ✅ |
| turbo@2.8.3 | low | Turbo: Unexpected local code execution during Yarn | ✅ |

