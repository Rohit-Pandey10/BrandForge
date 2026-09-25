/**
 * Export Utilities — Brand Kit File Generation
 *
 * Handles SVG palette generation, CSS token extraction, JSON/file downloads,
 * and AI improvisation prompt generation.
 * Used by BrandKitDashboard and the global Header export actions.
 */

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Escapes unsafe XML/SVG characters so the browser's strict XML parser doesn't crash.
 */
export const cleanXml = (unsafe = '') =>
  String(unsafe).replace(/[<>&'"]/g, (c) => ({
    '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;'
  }[c]));

/**
 * Converts a hex color string to an "R, G, B" string for use in rgba().
 */
function hexToRgb(hex = '') {
  const h = hex.replace('#', '');
  if (h.length !== 6) return '0, 0, 0';
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}

/**
 * Calculates WCAG contrast text (black or white) for a given hex background.
 */
function contrastText(hex = '') {
  const h = hex.replace('#', '');
  if (h.length !== 6) return '#ffffff';
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 >= 140 ? '#000000' : '#ffffff';
}

/**
 * Triggers a browser file download.
 */
export function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// ─── CSS Token Builder ────────────────────────────────────────────────────────

/**
 * Compiles a brandKit into a production-grade CSS design token stylesheet.
 * Includes: primitive colors, RGB channels, semantic aliases, fluid type scale,
 * geometry tokens, and a dark-mode override block.
 */
export function buildCssTokens(brandKit) {
  const { brandStrategy = {}, visualTokens = {} } = brandKit || {};
  const palette    = visualTokens.palette    || [];
  const typography = visualTokens.typography || {};
  const curvature  = visualTokens.borderCurvature;

  const brandName = brandStrategy.brandName || 'Brand';

  const primary   = palette.find(c => c.role === 'primary')   || { hex: '#111111', name: 'Primary' };
  const secondary = palette.find(c => c.role === 'secondary') || { hex: '#555555', name: 'Secondary' };
  const accent    = palette.find(c => c.role === 'accent')    || { hex: '#888888', name: 'Accent' };
  const surface   = palette.find(c => c.role === 'surface')   || { hex: '#fcfbf9', name: 'Surface' };
  const text      = palette.find(c => c.role === 'text')      || { hex: '#111111', name: 'Text' };

  const radiusValue =
    curvature === 'rounded-none' ? '0px'    :
    curvature === 'rounded-full' ? '9999px' :
    curvature === 'rounded-2xl'  ? '24px'   :
    curvature === 'rounded-lg'   ? '12px'   : '16px';

  const headingFont = typography.headingFont || 'Cormorant Garamond';
  const bodyFont    = typography.bodyFont    || 'Inter';

  return `/**
 * ✦ ${brandName} — DESIGN SYSTEM TOKENS
 * Synthesized via BrandLoom Studio
 * Scalable for Web, Tailwind CSS, and Figma Variables
 *
 * Usage:
 *   color: var(--brand-primary);
 *   background: rgba(var(--brand-accent-rgb), 0.15);
 */

@import url('${typography.googleFontsUrl || `https://fonts.googleapis.com/css2?family=${encodeURIComponent(headingFont)}:wght@300;400;600&family=${encodeURIComponent(bodyFont)}:wght@400;500;600&display=swap`}');

:root {
  /* ======================================================================
     1. COLOR PALETTE — PRIMITIVES
     ====================================================================== */

  /* Primary — ${primary.name} */
  --brand-primary:       ${primary.hex};
  --brand-primary-rgb:   ${hexToRgb(primary.hex)};

  /* Secondary — ${secondary.name} */
  --brand-secondary:     ${secondary.hex};
  --brand-secondary-rgb: ${hexToRgb(secondary.hex)};

  /* Accent — ${accent.name} */
  --brand-accent:        ${accent.hex};
  --brand-accent-rgb:    ${hexToRgb(accent.hex)};

  /* Surface — ${surface.name} */
  --brand-surface:       ${surface.hex};
  --brand-surface-rgb:   ${hexToRgb(surface.hex)};

  /* Text — ${text.name} */
  --brand-text:          ${text.hex};
  --brand-text-rgb:      ${hexToRgb(text.hex)};

${palette.filter(c => !['primary','secondary','accent','surface','text'].includes(c.role)).map(c =>
  `  --brand-${c.role.toLowerCase().replace(/[^a-z0-9]/g, '-')}: ${c.hex}; /* ${c.name} */`
).join('\n')}

  /* ======================================================================
     2. SEMANTIC COMPONENT ALIASES
     ====================================================================== */

  /* Buttons */
  --btn-primary-bg:      var(--brand-primary);
  --btn-primary-text:    ${contrastText(primary.hex)};
  --btn-secondary-bg:    var(--brand-secondary);
  --btn-secondary-text:  ${contrastText(secondary.hex)};
  --btn-accent-bg:       var(--brand-accent);
  --btn-accent-text:     ${contrastText(accent.hex)};

  /* Badges & Tags */
  --badge-bg:            rgba(var(--brand-accent-rgb), 0.15);
  --badge-text:          var(--brand-accent);
  --badge-border:        rgba(var(--brand-accent-rgb), 0.35);

  /* Cards */
  --card-border:         rgba(var(--brand-secondary-rgb), 0.20);
  --card-surface:        var(--brand-surface);
  --card-hover-border:   var(--brand-primary);

  /* Announcement Ribbon */
  --ribbon-bg:           rgba(var(--brand-accent-rgb), 0.10);
  --ribbon-border:       rgba(var(--brand-accent-rgb), 0.30);
  --ribbon-text:         var(--brand-text);

  /* Navigation */
  --nav-bg:              var(--brand-surface);
  --nav-text:            var(--brand-text);
  --nav-accent:          var(--brand-secondary);

  /* Icons */
  --icon-primary:        var(--brand-primary);
  --icon-accent:         var(--brand-accent);
  --icon-muted:          rgba(var(--brand-text-rgb), 0.40);

  /* ======================================================================
     3. TYPOGRAPHY HIERARCHY & FLUID SCALE
     ====================================================================== */

  --font-display: '${headingFont}', Georgia, serif;
  --font-body:    '${bodyFont}', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono:    'JetBrains Mono', 'Fira Code', ui-monospace, monospace;

  --font-size-xs:   0.75rem;    /* 12px */
  --font-size-sm:   0.875rem;   /* 14px */
  --font-size-base: 1rem;       /* 16px */
  --font-size-lg:   1.125rem;   /* 18px */
  --font-size-xl:   1.25rem;    /* 20px */
  --font-size-2xl:  1.5rem;     /* 24px */
  --font-size-3xl:  2rem;       /* 32px */
  --font-size-4xl:  2.75rem;    /* 44px */
  --font-size-5xl:  3.75rem;    /* 60px */

  --line-height-tight:  1.05;
  --line-height-snug:   1.25;
  --line-height-normal: 1.5;
  --line-height-loose:  1.75;

  --letter-spacing-tight:   -0.03em;
  --letter-spacing-normal:  0;
  --letter-spacing-wide:    0.05em;
  --letter-spacing-widest:  0.15em;

  /* ======================================================================
     4. GEOMETRY, SHAPE & ELEVATION
     ====================================================================== */

  --border-radius-base:   ${radiusValue};
  --border-radius-card:   20px;
  --border-radius-pill:   9999px;
  --border-radius-sm:     8px;

  --shadow-sm:   0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04);
  --shadow-md:   0 4px 12px rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.06);
  --shadow-lg:   0 16px 40px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.06);

  /* ======================================================================
     5. SPACING SCALE (8pt grid)
     ====================================================================== */

  --space-1:  0.25rem;  /*  4px */
  --space-2:  0.5rem;   /*  8px */
  --space-3:  0.75rem;  /* 12px */
  --space-4:  1rem;     /* 16px */
  --space-6:  1.5rem;   /* 24px */
  --space-8:  2rem;     /* 32px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
}

/* ======================================================================
   DARK MODE ADAPTATION
   ====================================================================== */
@media (prefers-color-scheme: dark) {
  :root {
    --card-surface:  #121316;
    --brand-text:    #f5f5f5;
    --brand-text-rgb: 245, 245, 245;
    --nav-bg:        #0e1015;
    --ribbon-bg:     rgba(var(--brand-accent-rgb), 0.12);
  }
}

/* ======================================================================
   UTILITY CLASSES (drop into any project)
   ====================================================================== */

.brand-heading {
  font-family: var(--font-display);
  font-weight: 300;
  letter-spacing: var(--letter-spacing-tight);
  line-height: var(--line-height-tight);
  color: var(--brand-text);
}

.brand-body {
  font-family: var(--font-body);
  font-size: var(--font-size-base);
  line-height: var(--line-height-normal);
  color: var(--brand-text);
}

.btn-primary {
  background-color: var(--btn-primary-bg);
  color: var(--btn-primary-text);
  border-radius: var(--border-radius-base);
  padding: 0.75rem 1.5rem;
  font-family: var(--font-body);
  font-size: var(--font-size-sm);
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: opacity 0.15s ease;
}

.btn-primary:hover { opacity: 0.9; }

.badge-accent {
  background: var(--badge-bg);
  color: var(--badge-text);
  border: 1px solid var(--badge-border);
  border-radius: var(--border-radius-pill);
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  letter-spacing: var(--letter-spacing-wide);
  padding: 0.15rem 0.6rem;
  text-transform: uppercase;
}

.card {
  background: var(--card-surface);
  border: 1px solid var(--card-border);
  border-radius: var(--border-radius-card);
  padding: var(--space-6);
  transition: border-color 0.15s ease;
}

.card:hover { border-color: var(--card-hover-border); }

.announcement-ribbon {
  background: var(--ribbon-bg);
  border: 1px solid var(--ribbon-border);
  color: var(--ribbon-text);
  border-radius: var(--border-radius-pill);
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  letter-spacing: var(--letter-spacing-widest);
  padding: 0.25rem 0.85rem;
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}
`;
}

// ─── SVG Palette Builder ──────────────────────────────────────────────────────

export function buildPaletteSvg(brandKit) {
  const { brandStrategy = {}, visualTokens = {} } = brandKit || {};
  const palette = visualTokens.palette || [];
  const brandName = cleanXml(brandStrategy.brandName || 'Brand');

  const width = 1000;
  const height = 360;
  const swatchWidth = 160;
  const swatchHeight = 160;
  const gap = 24;
  const startX = (width - (palette.length * swatchWidth + (palette.length - 1) * gap)) / 2;

  const swatchesSvg = palette.map((c, i) => {
    const x = startX + i * (swatchWidth + gap);
    const y = 110;
    return `
      <g transform="translate(${x}, ${y})">
        <rect width="${swatchWidth}" height="${swatchHeight}" rx="20" fill="${cleanXml(c.hex)}" stroke="#dbd7cd" stroke-width="1" />
        <text x="${swatchWidth / 2}" y="${swatchHeight + 28}" fill="#737373" font-size="11" font-weight="400" text-anchor="middle" font-family="'Inter', sans-serif" letter-spacing="1">${cleanXml((c.role || '').toUpperCase())}</text>
        <text x="${swatchWidth / 2}" y="${swatchHeight + 48}" fill="#000000" font-size="13" font-weight="500" text-anchor="middle" font-family="'Inter', sans-serif">${cleanXml(c.name || 'Color')}</text>
        <text x="${swatchWidth / 2}" y="${swatchHeight + 68}" fill="#000000" font-size="12" font-weight="400" text-anchor="middle" font-family="monospace">${cleanXml(c.hex)}</text>
      </g>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <rect width="100%" height="100%" fill="#f2f1ed" />
  <text x="${width / 2}" y="50" fill="#000000" font-size="28" font-weight="300" text-anchor="middle" font-family="'Cormorant Garamond', Georgia, serif">${brandName} — Color System</text>
  <text x="${width / 2}" y="76" fill="#737373" font-size="12" font-weight="400" text-anchor="middle" font-family="'Inter', sans-serif">Synthesized Design Tokens</text>
  ${swatchesSvg}
</svg>`;
}

// ─── AI Improvisation Prompt Builder ─────────────────────────────────────────

/**
 * Builds the aiImprovisationPrompts block to embed inside tokens.json.
 */
function buildAiPrompts(brandKit) {
  const bs  = brandKit?.brandStrategy  || {};
  const vs  = brandKit?.voiceSystem    || {};
  const vt  = brandKit?.visualTokens   || {};
  const lc  = brandKit?.launchContent  || {};
  const bp  = brandKit?.websiteBlueprint || {};

  const brandName   = bs.brandName   || 'Brand';
  const tagline     = bs.tagline     || lc.heroHeadline || '';
  const audience    = bs.targetAudience || '';
  const antiHero    = bs.antiHero    || '';
  const differentiator = bs.differentiator || '';
  const cvp         = bs.coreValueProposition || '';
  const manifesto   = lc.manifesto   || cvp;
  const archetype   = vs.archetype   || 'authentic storyteller';
  const tone        = vs.tone        || 'clear, honest, and precise';
  const dos         = (vs.dos   || ['speak with clarity','use sensory language','stay grounded']).join('\n  - ');
  const donts       = (vs.donts || ['avoid buzzwords','never make empty claims','skip jargon']).join('\n  - ');
  const vocab       = (vs.vocabularyWords || ['clarity','craft','honest']).join(', ');

  const palette = vt.palette || [];
  const primary   = palette.find(c => c.role === 'primary')?.hex   || '#111';
  const accent    = palette.find(c => c.role === 'accent')?.hex    || '#888';
  const surface   = palette.find(c => c.role === 'surface')?.hex   || '#fcfbf9';
  const headingFont = vt.typography?.headingFont || 'Cormorant Garamond';
  const bodyFont    = vt.typography?.bodyFont    || 'Inter';

  const primaryCta  = bp.primaryCta  || lc.callToAction || 'Shop Now';
  const heroHeadline = lc.heroHeadline || '';

  return {
    _description: 'Ready-to-use AI prompts. Copy and paste into ChatGPT, Claude, Midjourney, or v0/Cursor.',

    chatGptCopywriterSystemPrompt: `You are the official in-house copywriter for ${brandName}.

BRAND IDENTITY:
- Brand name: ${brandName}
- Tagline: "${tagline}"
- Voice archetype: ${archetype}
- Tone: ${tone}

TARGET AUDIENCE:
${audience}

FOUNDING MANIFESTO:
"${manifesto}"

WHAT WE REJECT (anti-hero):
${antiHero}

WHAT MAKES US SINGULAR (onlyness differentiator):
${differentiator}

VOICE RULES:
DO:
  - ${dos}

NEVER:
  - ${donts}

SIGNATURE VOCABULARY (use these words; do not invent synonyms):
${vocab}

ALWAYS:
- Stay in character. You are ${brandName}, not a generic brand.
- Write in present tense. Be specific. Use concrete details, not vague adjectives.
- Every headline should be punchy (under 10 words). Every body copy under 40 words.
- If the task is an ad, end with CTA: "${primaryCta}".`,

    claudeContentStrategistPrompt: `You are the content strategist for ${brandName}.

Your goal: generate a 30-day organic social media calendar that attacks the industry anti-hero ("${antiHero}") and positions ${brandName} as the clear alternative.

Brand context:
- Tagline: "${tagline}"
- Differentiator: ${differentiator}
- Core value prop: ${cvp}
- Audience: ${audience}
- Voice: ${tone}
- DO say: ${dos}
- DO NOT say: ${donts}

Format: a JSON array of 30 posts. Each post object:
{
  "day": <number 1-30>,
  "platform": "Instagram" | "X" | "LinkedIn" | "TikTok",
  "type": "carousel" | "reel" | "static" | "story" | "thread",
  "caption": "<full caption under 250 chars>",
  "hook": "<first line that stops the scroll>",
  "hashtags": ["<3-5 relevant hashtags>"],
  "strategicAngle": "<1 sentence: what anti-hero truth this post attacks>"
}

Rules:
- Rotate platforms across all 30 days.
- Never use the words or phrases explicitly banned by the brand.
- At least 8 posts should directly compare ${brandName} vs the industry default without naming competitors.`,

    midjourneyProductShootPrompt: `Editorial product photography for ${brandName}.

Subject: ${brandName} product (${cvp}) on a clean studio surface.
Aesthetic: High-end CPG editorial — shot for ${audience}.

Color palette to reference in the scene:
- Dominant surface: ${surface}
- Primary color accent: ${primary}
- Warm accent highlight: ${accent}

Typography present on packaging: ${headingFont} for display, ${bodyFont} for body.
Brand feel: ${tone}. Differentiator in the shot: ${differentiator}.

Shot specs:
- Camera angle: 3/4 product view, shallow depth of field, f/2.2
- Lighting: soft diffused north-facing window light, natural and warm, no harsh shadows
- Background: textured handmade paper or linen surface in ${surface} tones
- Props: raw ingredients or material source that signals "${differentiator}" (keep minimal, editorial)
- Negative space: 40% of frame empty for headline overlay: "${heroHeadline}"

Style refs: Kinfolk magazine, Aesop product photography, Bottega Veneta lookbook
Resolution: 4K, --ar 4:5 --style raw --q 2`,

    cursorV0UiGenerationPrompt: `Build a responsive landing page for ${brandName} using the following exact design tokens. Do not invent new colors, fonts, or spacing values.

BRAND: ${brandName}
HEADLINE: "${heroHeadline || tagline}"
CTA: "${primaryCta}"
VALUE PROP: ${cvp}

CSS VARIABLES (already defined in :root — use them):
  --brand-primary: ${primary}
  --brand-accent: ${accent}
  --brand-surface: ${surface}
  --font-display: '${headingFont}', Georgia, serif
  --font-body: '${bodyFont}', sans-serif
  --border-radius-base: (per brand curvature token)

GOOGLE FONTS IMPORT:
${vt.typography?.googleFontsUrl || `https://fonts.googleapis.com/css2?family=${encodeURIComponent(headingFont)}:wght@300;400&family=${encodeURIComponent(bodyFont)}:wght@400;500&display=swap`}

PAGE SECTIONS (in order):
1. Sticky nav: wordmark (${brandName}) left, 3 nav links center, CTA button right using --brand-primary.
2. Hero: full-width, background --brand-surface, editorial serif headline (${heroHeadline || tagline}), 2-line subheadline, 2 CTAs.
3. Product grid: 3 columns, each card with --card-surface background, accent badge at top, price in bold.
4. Comparison table: ${brandName} vs. "Industry Default" — use checkmarks in --brand-accent for our column.
5. Footer: wordmark, tagline "${tagline}", 3 footer links.

RULES:
- Zero hardcoded hex values — use CSS variables exclusively.
- Mobile-first, fully responsive (breakpoint at 768px).
- No external icon libraries (use inline SVG).
- Accessible: ARIA labels on all buttons, contrast ratio WCAG AA minimum.
- Output: single self-contained HTML file with <style> block.`
  };
}

// ─── Public Export Functions ──────────────────────────────────────────────────

/**
 * Downloads a brandKit as a structured JSON file with AI improvisation prompts embedded.
 */
export function exportBrandKitJson(brandKit) {
  const name = (brandKit?.brandStrategy?.brandName || 'brand').toLowerCase().replace(/\s+/g, '-');
  const payload = {
    _meta: {
      exportedAt: new Date().toISOString(),
      exportedBy: 'BrandLoom Studio',
      version: '2.0',
      usage: 'Use aiImprovisationPrompts to extend this kit in ChatGPT, Claude, Midjourney, and v0/Cursor.'
    },
    brandStrategy:    brandKit?.brandStrategy    || {},
    voiceSystem:      brandKit?.voiceSystem      || {},
    visualTokens:     brandKit?.visualTokens     || {},
    launchContent:    brandKit?.launchContent    || {},
    websiteBlueprint: brandKit?.websiteBlueprint || {},
    aiImprovisationPrompts: buildAiPrompts(brandKit)
  };
  downloadFile(JSON.stringify(payload, null, 2), `${name}-tokens.json`, 'application/json');
}

/**
 * Downloads compiled production-grade CSS custom properties.
 */
export function exportCssTokens(brandKit) {
  const name = (brandKit?.brandStrategy?.brandName || 'brand').toLowerCase().replace(/\s+/g, '-');
  downloadFile(buildCssTokens(brandKit), `${name}-tokens.css`, 'text/css');
}

/**
 * Downloads an SVG palette sheet.
 */
export function exportPaletteSvg(brandKit) {
  const name = (brandKit?.brandStrategy?.brandName || 'brand').toLowerCase().replace(/\s+/g, '-');
  downloadFile(buildPaletteSvg(brandKit), `${name}-palette.svg`, 'image/svg+xml;charset=utf-8');
}

/**
 * Returns the structured AI prompts object for a brand kit.
 * Used by the AI Prompts drawer in BrandKitDashboard.
 */
export function getAiPrompts(brandKit) {
  return buildAiPrompts(brandKit);
}

/**
 * Generates an exhaustive, production-ready master prompt containing all Q&A transcript
 * context, design tokens, and component blueprints that can be pasted directly into
 * Bolt.new, Lovable, or Antigravity to build the full website.
 */
export function generateAiBuilderPrompt(kit, answers = []) {
  const strategy = kit?.brandStrategy || {};
  const tokens = kit?.visualTokens || {};
  const blueprint = kit?.websiteBlueprint || {};
  const palette = tokens.palette || [];
  const typography = tokens.typography || {};

  const primaryHex = palette.find(c => c.role === 'primary')?.hex || '#111111';
  const secondaryHex = palette.find(c => c.role === 'secondary')?.hex || '#555555';
  const accentHex = palette.find(c => c.role === 'accent')?.hex || '#EFAF3E';
  const surfaceHex = palette.find(c => c.role === 'surface')?.hex || '#FAF8F5';
  const textHex = palette.find(c => c.role === 'text')?.hex || '#18181B';

  const answersFormatted = Array.isArray(answers) && answers.length > 0
    ? answers.map((a, i) => `Q${i + 1} (${a.question || a.stageLabel || `Question ${i + 1}`}): "${a.answer}"`).join('\n')
    : '';

  return `
### ROLE & SYSTEM OBJECTIVE
You are an expert full-stack engineer and UI designer building a launch-ready landing page for "${strategy.brandName}".
Use React, Tailwind CSS, Lucide React icons, and modern responsive design.

### 1. BRAND STRATEGY & STRATEGIC CONTEXT
- Brand Name: ${strategy.brandName}
- Tagline: "${strategy.tagline}"
- Core Value Proposition: ${strategy.coreValueProposition}
- The Category Villain We Reject (Anti-Hero): ${strategy.antiHero}
- The "Onlyness" Differentiator: ${strategy.differentiator}
- Target Audience: ${strategy.targetAudience}

### 2. FOUNDER'S SOCRATIC DISCOVERY TRANSCRIPT
The following decisions were made during brand strategy discovery:
${answersFormatted || 'Direct positioning: Premium quality with no conventional compromises.'}

### 3. DESIGN SYSTEM & DESIGN TOKENS
- Primary Brand Color: ${primaryHex} (Buttons, active states, key highlights)
- Secondary Brand Color: ${secondaryHex} (Subtle borders, secondary actions)
- Accent Highlight: ${accentHex} (Badges, price highlights, announcement pill)
- Canvas Background: ${surfaceHex} (Page surface & card containers)
- Body & Heading Text: ${textHex} (High-contrast typography)
- Heading Google Font: "${typography.headingFont || 'Cormorant Garamond'}" (Include link in index.html)
- Body Google Font: "${typography.bodyFont || 'Inter'}"

### 4. MANDATORY WEBSITE ARCHITECTURE TO BUILD
Build a complete, single-page responsive application with these sections:
1. Navigation Bar: Wordmark in "${typography.headingFont}", nav links matching offerings, and a high-contrast action CTA.
2. Announcement Ribbon: "${blueprint.announcementBar || 'Handcrafted daily with transparent sourcing.'}"
3. Hero Section:
   - Display Headline: "${kit?.launchContent?.heroHeadline || strategy.coreValueProposition}"
   - Subheadline: "${kit?.launchContent?.heroSubheadline || strategy.tagline}"
   - Primary CTA Button: "${blueprint.primaryCta || 'Explore Collection'}"
4. Product / Menu Showcase Grid:
   - Render 3 dynamic item cards with realistic prices ($14 - $38), tags, descriptions, and "+ Add / Order" buttons.
5. Comparative Ledger (The Onlyness Test vs The Industry Default):
   - Contrast "${strategy.brandName}" against the rejected incumbent: "${strategy.antiHero}".
6. Sourcing & Craftsmanship Pillars:
   - 3 clean editorial cards highlighting origin, quality, and community commitment.
7. Footer:
   - Wordmark, copyright, newsletter intake, and transparency links.

### IMPLEMENTATION REQUIREMENTS
- Produce clean, self-contained React components with Tailwind CSS.
- NEVER use generic placeholders like "Lorem Ipsum". Use the exact brand copy and product context provided above.
`.trim();
}

/**
 * Google Antigravity & v0 UI Prompt
 */
export function generateAntigravityV0Prompt(kit, answers = []) {
  const strategy = kit?.brandStrategy || {};
  const tokens = kit?.visualTokens || {};
  const blueprint = kit?.websiteBlueprint || {};
  const lc = kit?.launchContent || {};
  const palette = tokens.palette || [];
  const typography = tokens.typography || {};

  const primaryHex = palette.find(c => c.role === 'primary')?.hex || '#111111';
  const secondaryHex = palette.find(c => c.role === 'secondary')?.hex || '#555555';
  const accentHex = palette.find(c => c.role === 'accent')?.hex || '#EFAF3E';
  const surfaceHex = palette.find(c => c.role === 'surface')?.hex || '#FAF8F5';
  const textHex = palette.find(c => c.role === 'text')?.hex || '#18181B';

  return `
### ROLE & SYSTEM OBJECTIVE
You are an expert UI engineer building a launch-ready web app in Google Antigravity or v0 for "${strategy.brandName}".

### DESIGN TOKENS
- Primary: ${primaryHex}
- Secondary: ${secondaryHex}
- Accent: ${accentHex}
- Surface: ${surfaceHex}
- Text: ${textHex}
- Display Font: "${typography.headingFont || 'Cormorant Garamond'}"
- Body Font: "${typography.bodyFont || 'Inter'}"

### STRATEGIC CONTEXT
- Brand: ${strategy.brandName}
- Tagline: "${strategy.tagline}"
- Core Value Prop: ${strategy.coreValueProposition}
- Villain Rejected: ${strategy.antiHero}
- Onlyness Differentiator: ${strategy.differentiator}

### SECTIONS TO BUILD
1. Announcement Ribbon: "${blueprint.announcementBar || 'Handcrafted daily with transparent sourcing.'}"
2. Wordmark Navbar: "${strategy.brandName}" in ${typography.headingFont}, navigation links, and primary CTA button.
3. Hero: Headline "${lc.heroHeadline || strategy.coreValueProposition}", Subheadline "${lc.heroSubheadline || strategy.tagline}", Button "${blueprint.primaryCta || 'Explore Collection'}".
4. Product / Menu Showcase Grid: 3 cards with price badges, descriptions, and "+ Add / Order" buttons.
5. Comparative Ledger: Contrast ${strategy.brandName} vs. "${strategy.antiHero}".
6. Sourcing & Craftsmanship: 3 cards highlighting origin and standards.
7. Footer: Wordmark, copyright, newsletter intake.

Build as clean, responsive components with Tailwind CSS.
`.trim();
}
