# DESIGN.md — Handhold Editorial Design System

> **Visual Paradigm:** Luxury Print Catalog, Design Monograph, Warm Editorial Spread.  
> **Aesthetic Principles:** Zero Chromatic Noise, Strict Monochrome, Flat Surfaces, Whisper Typography.

---

## 1. Color Palette (Zero Chromatic Noise — Strict Monochrome)

| Token Name | CSS Variable | Hex Code | Purpose |
| :--- | :--- | :--- | :--- |
| **Canvas Base** | `--color-paper-cream` | `#f2f1ed` | Primary page & canvas background. (Pure `#ffffff` is banned for page backgrounds). |
| **Card Surfaces** | `--color-pure-white` | `#ffffff` | Elevated panels, dialogue cards, and dashboard sections. |
| **Ink Black** | `--color-ink-black` | `#000000` | Headings, primary copy, card strokes, filled pill CTAs. |
| **Hairline Dividers** | `--color-warm-border`| `#dbd7cd` | Delicate 1px structural separator lines and borders. |
| **Muted Text** | `--color-stone-gray` | `#737373` | Secondary editorial copy, step labels, and subtitles. |
| **Tertiary Text** | `--color-ash-gray`   | `#999999` | Captions, card labels, and subtle metadata. |

### Critical Rules:
- **No Drop Shadows:** All `shadow-*` utility classes are prohibited. Surfaces rely on flat `#ffffff` slabs floating on the warm `#f2f1ed` paper canvas.
- **No Chromatic Gradients or Glows:** All cyan, indigo, purple, and emerald ambient radial gradients or glow effects are banned.

---

## 2. Typography Contract (Two Fonts, Two Weights Only)

### Display Headlines
- **Typeface:** `Cormorant Garamond` (Google Fonts fallback for `bureauSerif`).
- **Weight:** Strictly `300` (Light) — extra-light hairline whisper.
- **Line Height:** Locked to exactly `1.0` (tight, overlapping baselines).
- **Letter Spacing:** Uniformly `-0.03em` across all headline sizes.
- **Hierarchy Scale:**
  - `72px` – `80px`: Hero & Monograph Display Titles (`text-5xl sm:text-7xl`)
  - `40px`: Section Headings (`text-3xl sm:text-4xl`)
  - `28px`: Card & Dialogue Headings (`text-2xl`)
  - `20px`: Editorial Subheadings (`text-xl`)

### Body & Interface
- **Typeface:** `Inter`.
- **Weight:** Strictly `400` (Regular). Never use Medium, Semibold, or Bold variants.
- **Letter Spacing:** `-0.01em`.
- **Sizes:**
  - `12px`: Captions & Step indicators (`text-xs`)
  - `14px`: Buttons, Navigation, Inputs (`text-sm`)
  - `16px`: Body copy & Subtitles (`text-base`)

---

## 3. Geometry, Shapes & Elevation

- **Card Surfaces:** Rounded with `24px` to `32px` border radius (`rounded-[28px]` or `rounded-[32px]`), border `1px solid #dbd7cd`, generous internal padding (`24px` to `32px`).
- **Action Buttons & Pills:** Strictly pill-shaped (`rounded-full` / `9999px`).
- **Inputs:** Pill-shaped or `rounded-xl` with subtle `#dbd7cd` borders, focusing to `#000000`.
- **Flat Elevation:** Zero box-shadows throughout the DOM.

---

## 4. Component Manifest

- **Navigation Header (`client/src/App.jsx`):** Minimalist 56–64px height, warm `#f2f1ed` canvas, lowercase serif wordmark (`brand builder.`), and black pill navigation.
- **Progress Stepper (`client/src/components/ProgressStepper.jsx`):** Ultra-thin horizontal hairline divider (`#dbd7cd`) with monochrome step number dots and stone-gray labels.
- **Intake View (`client/src/components/IntakeView.jsx`):** Centered editorial layout with Cormorant Garamond 68px title, white card surface, signature black pill button, and translucent pill chips.
- **Interview Chat (`client/src/components/InterviewChat.jsx`):** Flat white dialogue container, Cormorant Garamond 28px interrogation headlines, hairline strategy notes, 3-column responsive quick-reply pill grid with multi-line wrapping, and pill-shaped input bar.
- **Brand Kit Dashboard (`client/src/components/BrandKitDashboard.jsx`):** Gallery monograph print spread, Cormorant Garamond 72px cover title, 5 flat swatch blocks, zero gradients, and paper-cream SVG palette export.
