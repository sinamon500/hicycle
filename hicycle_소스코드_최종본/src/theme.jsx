import React, { createContext, useContext, useEffect, useState } from 'react';

/* ───────────────────────────────────────────────────────────────────────────
 * Design tokens. Static values stay as plain hex; dynamic (theme-varying)
 * values resolve through CSS custom properties so a single `<html data-theme>`
 * flip switches the entire app.
 * ─────────────────────────────────────────────────────────────────────────── */
export const HF = {
  // STATIC brand
  green:    '#00A859', // Brighter UI Green
  greenHi:  '#00D16B',
  greenLo:  '#006633', // Original HD Hyundai Green for text contrast
  warn:     '#F2994A',
  bad:      '#EB5757',
  font:     "'Pretendard Variable', Pretendard, -apple-system, system-ui, sans-serif",
  mono:     "'JetBrains Mono', ui-monospace, monospace",

  // STATIC gradients (green-based, work on either bg)
  gradGreen:     'linear-gradient(135deg, #008C4A 0%, #006633 100%)',
  gradGreenSoft: 'linear-gradient(135deg, rgba(0,102,51,0.2) 0%, rgba(0,102,51,0.05) 100%)',

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
 * Theme context — 다크모드를 제거하고 Light 테마로 고정합니다.
 * CSS 변수들은 모두 html 수준이나 :root에 고정적으로 적용됩니다.
 * ─────────────────────────────────────────────────────────────────────────── */
const ThemeCtx = createContext({ theme: 'light', setTheme: () => {}, toggle: () => {} });
export const useTheme = () => useContext(ThemeCtx);

export function ThemeProvider({ children }) {
  // 항상 light 테마만 사용
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
    document.documentElement.style.colorScheme = 'light';
  }, []);

  return (
    <ThemeCtx.Provider value={{ theme: 'light', setTheme: () => {}, toggle: () => {} }}>
      {children}
    </ThemeCtx.Provider>
  );
}
