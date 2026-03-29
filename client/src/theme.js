/**
 * theme.js — Rokit Media v3 Design System
 *
 * Single source of truth for all reusable Tailwind class compositions.
 * To restyle the whole site: edit here, not in individual components.
 *
 * Color / font tokens live in tailwind.config.js → theme.extend
 * Global component classes (.btn-primary, .form-input, etc.) live in index.css
 */

export const T = {

  // ─── Page-level hero strips (inner pages, below navbar) ─────────────────────
  pageHero:      'bg-rokit-cream border-b border-rokit-orange/10 pt-32 pb-16',
  pageHeroInner: 'max-w-7xl mx-auto px-6 lg:px-12',
  pageHeroCentered: 'text-center',

  // ─── Section wrappers ────────────────────────────────────────────────────────
  sectionCream:    'bg-rokit-cream py-24',
  sectionAlt:      'bg-rokit-cream-dark py-24',
  sectionDark:     'bg-rokit-dark py-24',
  sectionInner:    'max-w-7xl mx-auto px-6 lg:px-12',

  // ─── Section headers ─────────────────────────────────────────────────────────
  sectionHeaderCenter: 'text-center mb-14',
  divider:             'w-8 h-px bg-rokit-orange mx-auto mb-8',   // section-divider
  accentLine:          'w-8 h-px bg-rokit-orange',                // inline left-accent

  // ─── Typography ──────────────────────────────────────────────────────────────
  // Eyebrow / label above headings
  eyebrow:       'font-mono text-[10px] uppercase tracking-[0.22em] text-rokit-body',
  eyebrowOrange: 'font-mono text-[10px] uppercase tracking-[0.22em] text-rokit-orange',

  // Page H1s (hero strips)
  h1: 'font-display text-5xl md:text-6xl font-light text-rokit-dark leading-tight',
  // Section H2s
  h2: 'font-display text-4xl md:text-5xl font-light text-rokit-dark leading-tight',
  // Card / sub-section H3s
  h3: 'font-display text-2xl md:text-3xl font-light text-rokit-dark',
  // Label-level H4s
  h4: 'font-display text-xl font-light text-rokit-dark',
  // Body text
  body: 'text-lg text-rokit-body font-light leading-relaxed',

  // ─── Cards ───────────────────────────────────────────────────────────────────
  card:       'bg-white border border-rokit-orange/10',
  cardCream:  'bg-rokit-cream border border-rokit-orange/10',
  cardHover:  'hover:border-rokit-orange/30 hover:shadow-sm transition-colors duration-200',
  cardPad:    'p-6',

  // ─── Forms ───────────────────────────────────────────────────────────────────
  // The form card wrapper (replaces shadow + rounded-xl)
  formCard: 'bg-white p-8 border border-rokit-orange/10',
  // Individual input fields (matches .form-input minus border-radius)
  input:    'w-full px-4 py-3 border border-gray-200 focus:border-rokit-orange focus:outline-none focus:ring-2 focus:ring-rokit-orange/10 transition-colors duration-200 text-rokit-dark bg-white',
  label:    'block text-sm font-medium text-rokit-dark mb-1.5',

  // ─── Filter / tag chips ──────────────────────────────────────────────────────
  // Active filter chip
  chipActive:   'bg-rokit-orange text-white font-mono text-[10px] uppercase tracking-[0.12em] px-4 py-2',
  // Idle filter chip
  chipIdle:     'bg-white border border-rokit-orange/20 text-rokit-body font-mono text-[10px] uppercase tracking-[0.12em] px-4 py-2 hover:border-rokit-orange hover:text-rokit-dark transition-colors duration-200',
  // Decorative tag pill (ManifestoSection style)
  tag:          'font-mono text-[10px] uppercase tracking-[0.15em] text-rokit-dark border border-rokit-orange/20 px-3 py-1.5 hover:border-rokit-orange hover:text-rokit-orange transition-colors duration-200 cursor-default',

  // ─── Misc ────────────────────────────────────────────────────────────────────
  // Success / feedback box
  successBox: 'bg-rokit-green/10 border border-rokit-green/30 p-8 text-center',
  // Error / not-found container
  notFound:   'min-h-screen flex flex-col items-center justify-center bg-rokit-cream',
};
