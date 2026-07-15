// ────────────────────────────────────────────────────────────────
// AI Photo Enhancer — theme adapter
//
// This is the ONLY file you need to touch to re-skin this widget for
// a different site. Every color/font/radius in the component tree
// reads from CSS custom properties set here — nothing is hardcoded.
//
// Drop this whole `PhotoEnhancer/` folder into any React + Tailwind
// project, update the values below to match the host site's design
// tokens (or auto-derive them — see `deriveFromCSSVars()` at the
// bottom), and the widget matches the new brand with zero JSX edits.
// ────────────────────────────────────────────────────────────────

export const rokitTheme = {
  accent: '#FF9729',       // primary brand color (rokit-orange)
  accentDark: '#e6861a',   // hover/active state (rokit-orange-dark)
  accentSoft: 'rgba(255,151,41,0.10)',
  gold: '#EC9E00',         // secondary accent (rokit-gold)
  ink: '#1A1A1A',          // headline / high-contrast text (rokit-dark)
  body: '#5e5e5e',         // paragraph text (rokit-body)
  bg: '#FCFAF8',           // page background (rokit-cream)
  surface: '#FFFFFF',      // card/panel background
  border: 'rgba(26,26,26,0.08)',
  success: '#14AD7C',      // rokit-green
  danger: '#DC2626',
  radius: '4px',           // rokit uses square-ish, sharp-cornered cards
  fontDisplay: '"Cormorant Garamond", Georgia, serif',
  fontBody: '"DM Sans", system-ui, sans-serif',
  fontMono: '"Space Mono", monospace',
  buttonUppercase: true,
};

// ── Optional: auto-pick-up mode ───────────────────────────────────
// If the host site already exposes design tokens as CSS custom
// properties on :root (e.g. --color-primary, --font-heading), this
// helper reads them straight out of the live DOM so you don't even
// need to duplicate values by hand. Call it once, e.g. in App.jsx:
//
//   const theme = deriveFromCSSVars({
//     accent: '--color-primary',
//     ink: '--color-heading',
//     bg: '--color-background',
//   }, rokitTheme); // falls back to rokitTheme for anything not found
//
export function deriveFromCSSVars(varMap, fallback = rokitTheme) {
  if (typeof window === 'undefined') return fallback;
  const styles = getComputedStyle(document.documentElement);
  const resolved = { ...fallback };
  for (const [key, cssVar] of Object.entries(varMap)) {
    const value = styles.getPropertyValue(cssVar).trim();
    if (value) resolved[key] = value;
  }
  return resolved;
}

// Converts a theme object into the inline CSS custom properties the
// widget's stylesheet consumes (see enhancer.css — every rule uses
// var(--ae-*, fallback), so this is the single hand-off point).
export function themeToCSSVars(theme = rokitTheme) {
  return {
    '--ae-accent': theme.accent,
    '--ae-accent-dark': theme.accentDark,
    '--ae-accent-soft': theme.accentSoft,
    '--ae-gold': theme.gold,
    '--ae-ink': theme.ink,
    '--ae-body': theme.body,
    '--ae-bg': theme.bg,
    '--ae-surface': theme.surface,
    '--ae-border': theme.border,
    '--ae-success': theme.success,
    '--ae-danger': theme.danger,
    '--ae-radius': theme.radius,
    '--ae-font-display': theme.fontDisplay,
    '--ae-font-body': theme.fontBody,
    '--ae-font-mono': theme.fontMono,
  };
}
