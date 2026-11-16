/**
 * Theme ids. Kept in a browser-free module so the server-side theme
 * pack scanner can reserve these ids without importing `themes.ts`, which
 * builds SVG data URLs with `btoa` at module scope.
 *
 * Currently empty — matches themePresets in themes.ts.
 */
export const builtinThemeIds: readonly string[] = [];
