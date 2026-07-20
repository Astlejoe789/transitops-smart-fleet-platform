/**
 * Theme configuration constants.
 */
export const THEME = {
  modes: ['light', 'dark', 'system'] as const,
  default: 'system' as const,
  storageKey: 'transitops_theme',
} as const;

export type ThemeMode = (typeof THEME.modes)[number];
