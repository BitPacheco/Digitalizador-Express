import { ThemePreset, StoreTheme } from '../types/catalog';

export interface ThemeColors {
  primary: string;
  primaryHover: string;
  accent: string;
  lightBg: string;
  badgeBorder: string;
}

export const THEME_PRESETS: Record<ThemePreset, ThemeColors> = {
  emerald: {
    primary: '#059669',
    primaryHover: '#047857',
    accent: '#10b981',
    lightBg: '#ecfdf5',
    badgeBorder: '#a7f3d0',
  },
  amber: {
    primary: '#d97706',
    primaryHover: '#b45309',
    accent: '#f59e0b',
    lightBg: '#fffbeb',
    badgeBorder: '#fde68a',
  },
  rose: {
    primary: '#e11d48',
    primaryHover: '#be123c',
    accent: '#f43f5e',
    lightBg: '#fff1f2',
    badgeBorder: '#fecdd3',
  },
  indigo: {
    primary: '#4f46e5',
    primaryHover: '#4338ca',
    accent: '#6366f1',
    lightBg: '#eef2ff',
    badgeBorder: '#c7d2fe',
  },
  sky: {
    primary: '#0284c7',
    primaryHover: '#0369a1',
    accent: '#0ea5e9',
    lightBg: '#f0f9ff',
    badgeBorder: '#bae6fd',
  },
  slate: {
    primary: '#0f172a',
    primaryHover: '#1e293b',
    accent: '#334155',
    lightBg: '#f8fafc',
    badgeBorder: '#cbd5e1',
  },
  violet: {
    primary: '#7c3aed',
    primaryHover: '#6d28d9',
    accent: '#8b5cf6',
    lightBg: '#f5f3ff',
    badgeBorder: '#ddd6fe',
  },
};

export function getThemeColors(theme?: StoreTheme): ThemeColors {
  if (theme?.preset && THEME_PRESETS[theme.preset]) {
    const base = THEME_PRESETS[theme.preset];
    return {
      primary: theme.primaryColor || base.primary,
      primaryHover: theme.primaryColor ? base.primaryHover : base.primaryHover,
      accent: theme.accentColor || base.accent,
      lightBg: base.lightBg,
      badgeBorder: base.badgeBorder,
    };
  }

  if (theme?.primaryColor) {
    return {
      primary: theme.primaryColor,
      primaryHover: theme.primaryColor,
      accent: theme.accentColor || theme.primaryColor,
      lightBg: '#f8fafc',
      badgeBorder: '#cbd5e1',
    };
  }

  // Preset por defecto (Emerald)
  return THEME_PRESETS.emerald;
}
