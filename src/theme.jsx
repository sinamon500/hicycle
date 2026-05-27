import React, { createContext, useContext, useEffect, useState } from 'react';

/* ───────────────────────────────────────────────────────────────────────────
 * Design tokens. Static values stay as plain hex; dynamic (theme-varying)
 * values resolve through CSS custom properties so a single `<html data-theme>`
 * flip switches the entire app.
 * ─────────────────────────────────────────────────────────────────────────── */
export const HF = {
  // STATIC brand
  green:    '#00E600',
  greenHi:  '#33ff33',
  greenLo:  '#00a800',
  warn:     '#FF8800',
  bad:      '#FF3333',
  font:     "'Pretendard Variable', Pretendard, -apple-system, system-ui, sans-serif",
  mono:     "'JetBrains Mono', ui-monospace, monospace",

  // STATIC gradients (green-based, work on either bg)
  gradGreen:     'linear-gradient(135deg, #66ff66 0%, #00E600 45%, #00a800 100%)',
  gradGreenSoft: 'linear-gradient(135deg, rgba(0,230,0,0.35) 0%, rgba(0,230,0,0.1) 100%)',

  // DYNAMIC (resolved via CSS variables; switched by [data-theme] on <html>)
  bg:         'var(--hf-bg)',
  bgDeep:     'var(--hf-bg-deep)',
  text:       'var(--hf-text)',
  text90:     'var(--hf-text-90)',
  text70:     'var(--hf-text-70)',
  text50:     'var(--hf-text-50)',
  text40:     'var(--hf-text-40)',
  text25:     'var(--hf-text-25)',
  text10:     'var(--hf-text-10)',
  glass:      'var(--hf-glass)',
  glassBd:    'var(--hf-glass-bd)',
  greenDim:   'var(--hf-green-dim)',
  greenBd:    'var(--hf-green-bd)',
  gradText:   'var(--hf-grad-text)',
  heroText:   'var(--hf-hero-text)',
  heroShadow: 'var(--hf-hero-shadow)',
  divider:    'var(--hf-divider)',
  softBg:     'var(--hf-soft-bg)',
  softBd:     'var(--hf-soft-bd)',
};

/* ───────────────────────────────────────────────────────────────────────────
 * Theme context — global light/dark switch, persisted to localStorage.
 * Applies `data-theme` to <html> so CSS variables resolve correctly.
 * ─────────────────────────────────────────────────────────────────────────── */
const ThemeCtx = createContext({ theme: 'dark', setTheme: () => {}, toggle: () => {} });
export const useTheme = () => useContext(ThemeCtx);

const STORAGE_KEY = 'regen.theme';

export function ThemeProvider({ children, initialTheme = 'dark' }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return initialTheme;
    return localStorage.getItem(STORAGE_KEY) || initialTheme;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
    try { localStorage.setItem(STORAGE_KEY, theme); } catch {}
  }, [theme]);

  const toggle = () => setTheme(v => v === 'dark' ? 'light' : 'dark');

  return (
    <ThemeCtx.Provider value={{ theme, setTheme, toggle }}>
      {children}
    </ThemeCtx.Provider>
  );
}
