import { defineConfig } from 'vitest/config';

/** Single-package test entry — SoR: config/toolchain/vitest.config.ts */
export default defineConfig({
  test: {
    include: ['03-platform/tests/**/*.test.ts'],
  },
});
