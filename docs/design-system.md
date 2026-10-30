# rOKIt Design System Specification (v4 Vision)

> **Source of Truth**: Extracted directly from `okoriterokit-hue/rokit-homepage-vision` (`inspiration/src/styles.css` and associated component libraries).  
> **Philosophy**: Precision, stark editorial contrast, kinetic micro-interactions, brutalist architectural sharpness (`--radius: 0rem`), deep night canvas with warm paper typography, punctuated by electric signal orange.

---

## 1. Core Brand Color Tokens

All design colors are authored in modern wide-gamut `oklch()` format with exact hex/RGB fallbacks.

### Primary Color Palette
| Token Variable | CSS Value (`oklch`) | Approx Hex / RGB | Semantic Role |
| :--- | :--- | :--- | :--- |
| `--night` | `oklch(0.192 0 0)` | `#1D1D1D` | Primary deep charcoal/black canvas. Used for page background, dark sections, header/footer backgrounds. |
| `--paper` | `oklch(0.957 0.013 86.8)` | `#F6F4EE` | Warm tactile off-white / newsprint cream. Used for high-contrast typography, inverted light cards/sections, and borders. |
| `--signal` | `oklch(0.704 0.192 47.1)` | `#FF5B24` | Electric luminous orange. The unmistakable rOKIt accent. Focus rings, active dots, hover accents, key brand punctuation. |
| `--neutral` | `oklch(0.691 0.005 91.5)` | `#AAAAA6` | Muted editorial grey. Section labels, secondary copy, captions, inactive navigation links, metadata. |
| `--surface` | `oklch(0.254 0 0)` | `#2D2D2D` | Elevated dark charcoal surface. Orbit points, secondary dark containers, interactive cards, tool containers. |

### Semantic UI Mappings (`:root` Default)
- `--background`: `var(--night)`
- `--foreground`: `var(--paper)`
- `--card`: `oklch(1 0 0)` (Pure white, when rendered in light contrast mode)
- `--card-foreground`: `oklch(0.129 0.042 264.695)`
- `--popover`: `oklch(1 0 0)`
- `--popover-foreground`: `oklch(0.129 0.042 264.695)`
- `--primary`: `var(--signal)`
- `--primary-foreground`: `var(--night)`
- `--secondary`: `oklch(0.968 0.007 247.896)`
- `--secondary-foreground`: `oklch(0.208 0.042 265.755)`
- `--muted`: `oklch(0.968 0.007 247.896)`
- `--muted-foreground`: `oklch(0.554 0.046 257.417)`
- `--accent`: `oklch(0.968 0.007 247.896)`
- `--accent-foreground`: `oklch(0.208 0.042 265.755)`
- `--destructive`: `oklch(0.577 0.245 27.325)`
- `--destructive-foreground`: `oklch(0.984 0.003 247.858)`
- `--border`: `oklch(0.957 0.013 86.8 / 15%)` (`paper` at 15% opacity)
- `--input`: `oklch(0.929 0.013 255.508)`
- `--ring`: `oklch(0.704 0.04 256.788)`

### Opacity & Surface Tiers
- Hairline Dividers: `border-paper/15` (`color-mix(in oklab, var(--paper) 15%, transparent)`)
- Interactive Borders: `border-paper/20` and `border-paper/25`
- Low-Emphasis Subtext: `text-night/70`, `text-night/60`, `text-night/50` on paper backgrounds; `text-paper/70` and `text-paper/75` on night backgrounds.

---

## 2. Typography Specification

### Font Families
- **Display Serif**: `"Libre Baskerville", Georgia, serif` (`--font-display`)
  - Weights: `400` (Regular), `700` (Bold), `400 Italic`
  - Usage: Display headlines, hero statements, manifesto headers, large numeric callouts, section editorial titles.
- **Body & Sans**: `"IBM Plex Sans", system-ui, sans-serif` (`--font-body`)
  - Weights: `400` (Normal), `500` (Medium), `600` (Semi-bold)
  - Usage: Body copy, navigation links, section labels, form labels, inputs, tabular data, metadata.

### Google Fonts Preconnect & Stylesheet
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
```

### Type Hierarchy & Scales
| Style Level | Font Family | Size / Line-Height | Tracking / Style |
| :--- | :--- | :--- | :--- |
| **Hero Display** | Libre Baskerville | `clamp(3.6rem, 8.7vw, 8rem)` / `0.94` | Normal, tight leading, dramatic scale |
| **Headline XL** | Libre Baskerville | `clamp(3rem, 6vw, 5.75rem)` / `1.02` | Normal, section closing headlines |
| **Headline L (H2)** | Libre Baskerville | `text-4xl md:text-5xl` (`clamp(2.25rem, 4vw, 3rem)`) / `1.15` | Normal, max-width bounded (12–14ch) |
| **Headline M (H3)** | Libre Baskerville | `text-2xl md:text-3xl` / `1.3` | Normal |
| **Headline S / Quote** | Libre Baskerville | `text-xl md:text-2xl` / `1.4` | Editorial callouts & founder notes |
| **Section Label** | IBM Plex Sans | `0.6875rem` (`11px`) / `1.4` | Uppercase, `text-neutral`, left dash pseudo-element |
| **Body Large** | IBM Plex Sans | `1rem` - `1.0625rem` (`16–17px`) / `1.65` | Editorial body copy, intro paragraphs |
| **Body Default** | IBM Plex Sans | `0.875rem` (`14px`) / `1.55` | General UI descriptions, list items |
| **Action Link** | IBM Plex Sans | `0.75rem` (`12px`) / `1.2` | Uppercase or Title, gap `0.6rem`, arrow indicator |
| **Micro / Metadata** | IBM Plex Sans | `0.625rem` (`10px`) / `1.4` | Uppercase, tracking wider, timestamps/status tags |

---

## 3. Layout, Spacing & Container Geometry

### Site Boundaries & Spacing Variables
- **Container Maximum Width**: `--container-site: 82.5rem` (`1320px`), centered via `max-w-site mx-auto`.
- **Horizontal Screen Gutter**: `--spacing-gutter: clamp(1.25rem, 4vw, 3.75rem)` (Fluid 20px on mobile to 60px on wide desktop).
- **Vertical Section Spacing**: `--spacing-section: clamp(4rem, 8vw, 7.5rem)` (Fluid 64px on mobile to 120px on wide desktop).
- **Corner Radii**: `--radius: 0rem`.
  - All site cards, buttons, tabs, input fields, badges, and containers are intentionally **architectural and square** (`rounded-none`). No pill buttons or soft bubbly cards.

### Grid Framework
- Standard section layout is a responsive 12-column grid: `grid grid-cols-12 gap-x-6 gap-y-10`.
- Mobile fallback: Columns collapse to full width `col-span-12`, with single-column rhythm.

---

## 4. Recurring Component Specifications

### A. Site Header (`RokitSiteHeader`)
- **Structure**: Sticky/relative `header` with `z-20`, `bg-night`, `border-b border-paper/15`.
- **Height**: `h-16 md:h-20` (`py-3 md:py-4`).
- **Inner Content**:
  - Left: rOKIt wordmark logo (`h-10 w-auto max-w-[185px] object-contain object-left`).
  - Center/Right Desktop: Primary links (`Made by rOKIt`, `Services`, `Shop`, `Ideas`, `About`), styled in `text-xs text-neutral hover:text-paper`.
  - Dropdown: Hover/focus flyout for `Services`, floating panel with dark backdrop, 2-column service list + "Explore all services".
  - Right: `Start a Project` action link (`action-link border border-paper/25 px-4 min-h-11 hover:border-signal hover:text-signal`).
  - Mobile: Hamburger button with `size-11 rounded-none text-paper hover:bg-surface hover:text-signal`, expanding into full-width vertical stack.

### B. Kinetic Hero (`KineticHeroGrid`)
- **Structure**: Interactive HTML5 `<canvas>` positioned absolutely behind hero content (`inset: 0`, `pointer-events: none`).
- **Interaction**: Mouse movement creates smooth point warping (radius: 210px, spacing: 52px). Click/tap emits propagating ripple wave.
- **Accessibility**: Automatically disables animation when `(prefers-reduced-motion: reduce)` is active; falls back to coarse grid (spacing 64px) on mobile touch.

### C. Buttons (`Button`)
- **Geometry**: Sharp rectangular borders (`rounded-none` or `rounded-md`), `cursor-pointer`, `whitespace-nowrap`.
- **Variants**:
  - `default`: `bg-primary text-primary-foreground shadow hover:bg-primary/90` (Signal orange background with night dark text).
  - `outline`: `border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground`.
  - `ghost`: `hover:bg-accent hover:text-accent-foreground` (zero border, subtle highlight).
  - `link`: `text-primary underline-offset-4 hover:underline`.
- **Focus**: `:focus-visible { outline: 2px solid var(--signal); outline-offset: 4px; }`.

### D. Action Links (`action-link`)
- **CSS**:
  ```css
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  font-size: 0.75rem;
  line-height: 1.2;
  transition: color 180ms ease, border-color 180ms ease, background-color 180ms ease;
  ```
- **Icon**: Followed by `ArrowRight` or `ArrowDownRight` icon (`size-3.5`).

### E. Section Labels (`section-label`)
- **CSS**:
  ```css
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.6875rem;
  line-height: 1.4;
  text-transform: uppercase;
  color: var(--neutral);
  ```
- **Pseudo-Element**: `&::before { content: ""; width: 2rem; height: 1px; flex: none; background: var(--signal); }` (A 32px signal orange horizontal indicator rule).

### F. Form Fields (`.form-field`)
- **CSS**:
  ```css
  .form-field {
    display: grid;
    gap: 0.65rem;
    color: var(--paper);
    font-size: 0.875rem;
  }
  .form-field > span:first-child {
    text-transform: uppercase;
    font-size: 0.6875rem;
    color: var(--neutral);
    letter-spacing: 0.05em;
  }
  .form-field input:not([type="file"]),
  .form-field textarea {
    min-height: 3rem;
    width: 100%;
    border: 1px solid color-mix(in oklab, var(--paper) 25%, transparent);
    background: transparent;
    padding: 0.8rem 0.9rem;
    color: var(--paper);
    font: inherit;
  }
  .form-field input:not([type="file"]):focus-visible,
  .form-field textarea:focus-visible {
    outline: 2px solid var(--signal);
    outline-offset: 3px;
    border-color: var(--signal);
  }
  ```

### G. Site Footer (`RokitSiteFooter` & `FooterWordmark`)
- **Columns**: 4 columns (Start something, Explore, Ideas & knowledge, Founder statement).
- **Wordmark Interaction**: Giant full-width monochrome rOKIt wordmark at the bottom. When scrolled into view, an `IntersectionObserver` triggers the `.is-active` state, resolving the crisp white wordmark and briefly pulsing the inner circular `O` in electric signal orange.

---

## 5. Motion, Keyframes & Animation Tokens

- **Timing & Curves**: Standard easing is `cubic-bezier(.22, .61, .36, 1)` (Swift acceleration with natural, damped deceleration).
- **Keyframes**:
  - `@keyframes rise`: `from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; }` (650ms).
  - `@keyframes image-reveal`: `from { clip-path: inset(0 0 100% 0); } to { clip-path: inset(0); }` (1s, delay 120ms).
  - `@keyframes transform-in`: `from { opacity: 0.15; transform: translateY(0.35em); } to { opacity: 1; transform: none; }` (420ms).
  - `@keyframes footer-activate`: scale and pulse for wordmark highlight.
  - `@keyframes sketch-draw`: SVG path drawing animation (`stroke-dasharray`, `stroke-dashoffset`).
- **Reduced Motion Support**:
  All transitions, particle warps, sticky reveals, and keyframe loops are wrapped in `@media (prefers-reduced-motion: reduce) { animation: none; transform: none; ... }`.

---

## 6. Admin Panel Styling Rules (Derived Extension)

Since the inspiration repo is a public homepage vision without an admin backend, authenticated portals (`/portal` and `/admin`) will strictly adopt the design system without inventing novel palettes:
1. **Background**: Dark canvas `bg-night` with crisp elevated card containers in `bg-surface` bordered by `border-paper/15`.
2. **Typography**: Headings use `Libre Baskerville` (`font-display`); data tables, forms, filters, and KPI figures use `IBM Plex Sans` (`font-body`).
3. **Data Density**: Table rows utilize hairline borders `border-paper/10`, hover state `hover:bg-surface/60`.
4. **Status Badges**:
   - Success / Published: `border border-emerald-500/30 text-emerald-400 bg-emerald-500/10`
   - Active / In Progress: `border border-signal/30 text-signal bg-signal/10`
   - Pending / Draft: `border border-amber-500/30 text-amber-400 bg-amber-500/10`
   - Neutral / Suspended: `border border-paper/20 text-neutral bg-surface`
5. **Modals & Drawers**: Deep backdrop `bg-night/80 backdrop-blur-sm`, sharp rectangular dialogs in `bg-night border border-paper/20`.
