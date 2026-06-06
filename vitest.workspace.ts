import { defineWorkspace } from 'vitest/config';

/**
 * Vitest monorepo workspace — SoR: config/toolchain/vitest.workspace.ts
 * Root copy: pnpm config:stubs:sync
 * Primary test entry: pnpm test (turbo).
 */
export default defineWorkspace([
  '03-platform/packages/*/vitest.config.ts',
  '03-platform/services/*/vitest.config.ts',
  '03-platform/apps/*/vitest.config.ts',
  '03-platform/tests/**/vitest.config.ts',
  '03-platform/tools/vitest.config.ts',
]);
