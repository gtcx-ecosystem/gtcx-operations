// Workaround for Vitest SSR transform bug where __vite_ssr_exportName__
// is called but not defined in the runtime scope.
if (typeof (globalThis as any).__vite_ssr_exportName__ !== 'function') {
  (globalThis as any).__vite_ssr_exportName__ = (_name: string, _getter: () => unknown) => {};
}
