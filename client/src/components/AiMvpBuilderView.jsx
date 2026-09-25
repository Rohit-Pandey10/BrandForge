import React, { useState } from 'react';
import { Copy, Check, Sparkles, Code2, Terminal, Layers, ArrowUpRight, Zap, Bot, Laptop } from 'lucide-react';

/**
 * AiMvpBuilderView — 5th Dashboard Section: MVP AI Website Builder
 *
 * Assembles dynamic, production-grade system prompts ready to generate the full
 * synthesized web application inside Bolt.new, Lovable.dev, Google Antigravity, and v0.dev.
 *
 * Adheres strictly to the standardized typography:
 * - Headlines: Cormorant Garamond
 * - Interface / Body: Inter
 * - Metadata / Badges / Code: JetBrains Mono (text-xs)
 */
export default function AiMvpBuilderView({ brandKit, answers = [] }) {
  const [activeSubTab, setActiveSubTab] = useState('bolt-lovable');
  const [copied, setCopied] = useState(false);

  const strategy = brandKit?.brandStrategy || {};
  const voice = brandKit?.voiceSystem || {};
  const tokens = brandKit?.visualTokens || {};
  const launch = brandKit?.launchContent || {};
  const blueprint = brandKit?.websiteBlueprint || {};
  const swot = brandKit?.swotAnalysis || {};

  const palette = tokens.palette || [];
  const typography = tokens.typography || {};

  const primaryHex = palette.find(c => c.role === 'primary')?.hex || '#111111';
  const secondaryHex = palette.find(c => c.role === 'secondary')?.hex || '#555555';
  const accentHex = palette.find(c => c.role === 'accent')?.hex || '#EFAF3E';
  const surfaceHex = palette.find(c => c.role === 'surface')?.hex || '#FAF8F5';
  const textHex = palette.find(c => c.role === 'text')?.hex || '#18181B';

  const headingFont = typography.headingFont || 'Cormorant Garamond';
  const bodyFont = typography.bodyFont || 'Inter';
  const curvature = tokens.borderCurvature || 'rounded-2xl';

  // Format Socratic interview answers
  const formattedAnswers = Array.isArray(answers) && answers.length > 0
    ? answers.map((a, i) => `Q${i + 1} [${a.stageLabel || `Stage ${i + 1}`}]: "${a.question || ''}"\n   Founder Choice: "${a.answer || ''}"`).join('\n\n')
    : `1. Value Stance: Uncompromising craft and direct sourcing.\n2. Aesthetic Boundary: Disciplined warm editorial minimalism.\n3. Pricing: Premium craft tier reflecting ethical margins.`;

  // Catalog items
  const catalogItems = (blueprint.sections && blueprint.sections[0]?.items) || [
    { label: 'Edition 01: Core Release', description: strategy.coreValueProposition || 'Flagship offering crafted without compromise.', metricOrPrice: '$28' },
    { label: 'Edition 02: Reserve Bundle', description: 'Limited batch with numbered origin certificate and archive packaging.', metricOrPrice: '$48' },
    { label: 'Edition 03: Routine Tier', description: 'Monthly ritual delivery in compostable unbleached packaging.', metricOrPrice: '$24/mo' }
  ];

  /* ───────────────────────────────────────────────────────────────────────────
     PROMPT A: Bolt.new & Lovable Full-Stack Prompt (Vite + React + Tailwind)
     ─────────────────────────────────────────────────────────────────────────── */
  const boltLovablePrompt = `### ROLE & SYSTEM OBJECTIVE
You are an elite principal frontend systems engineer and design director building a complete, launch-ready web application for "${strategy.brandName || 'Brand Identity'}".
Stack: Vite + React 18 + Tailwind CSS + Lucide React icons.
Design System: Handhold Editorial (warm paper canvas, hairline borders, luxurious serif display headings, high-contrast typography, zero generic corporate filler).

---

### 1. STRATEGIC POSITIONING & BRAND TRUTH
- Brand Name: ${strategy.brandName || 'Brand'}
- Tagline: "${strategy.tagline || ''}"
- Core Value Proposition: ${strategy.coreValueProposition || ''}
- The Villain We Declare War Against (Anti-Hero): ${strategy.antiHero || ''}
- The Marty Neumeier "Onlyness" Differentiator: ${strategy.differentiator || ''}
- Target Audience & ICP: ${strategy.targetAudience || 'Discerning patrons'}
- Brand Archetype: ${voice.archetype || 'The Purist'}
- Voice Boundaries (Dos): ${(voice.dos || []).join('; ') || 'Crisp conviction, sensory clarity'}
- Banned Buzzwords (Don'ts): ${(voice.donts || []).join('; ') || 'No tech buzzwords, no corporate clichés'}

---

### 2. FOUNDER'S SOCRATIC INTERVIEW TRANSCRIPT (GROUND TRUTH)
The following decisions were made directly by the founder during the 7-dimension strategy interview. You MUST anchor feature copy, menu items, and value props directly to these choices:
${formattedAnswers}

---

### 3. DESIGN SYSTEM TOKENS
Include these exact design tokens in your Tailwind config or CSS custom properties:
- Canvas Surface: "${surfaceHex}" (Page background & cards)
- High-Contrast Text: "${textHex}" (Headings, primary body)
- Primary Brand Action: "${primaryHex}" (Buttons, active tabs, key highlights)
- Secondary Tone: "${secondaryHex}" (Hairline borders, subtle details)
- Warm Accent Highlight: "${accentHex}" (Badges, tags, price pills)
- Border Curvature: "${curvature}"

Google Fonts Imports to add to index.html:
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(headingFont)}:wght@300;400;500;600&family=${encodeURIComponent(bodyFont)}:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">

Typography Rules:
- Display Serif Headings: '${headingFont}', Georgia, serif (Weights 300, 400)
- Body & Interface: '${bodyFont}', sans-serif (Weights 400, 500)
- Numeric Tags & Badges: 'JetBrains Mono', monospace

---

### 4. APPLICATION ARCHITECTURE & MANDATORY SECTIONS
Build a complete, responsive single-page application with the following distinct sections:

1. Announcement Ribbon (Top):
   - Text: "${blueprint.announcementBar || 'Handcrafted daily with transparent sourcing and lifetime integrity.'}"
   - Subtle accent badge and dismiss trigger.

2. Navigation Bar:
   - Wordmark in '${headingFont}' with high-contrast text.
   - Navigation links: "Offerings", "The Onlyness Ledger", "Manifesto", "SWOT Defensibility".
   - Action CTA button: "${blueprint.primaryCta || 'Explore Collection'}" in ${primaryHex}.

3. Hero Section:
   - Micro-badge: "${blueprint.badge || 'Official Release'}"
   - Display Serif Headline: "${launch.heroHeadline || strategy.coreValueProposition}"
   - Subheadline: "${launch.heroSubheadline || strategy.tagline}"
   - Dual CTAs: Primary "${blueprint.primaryCta || 'Order Now'}" + Secondary "${blueprint.secondaryCta || 'Read Manifesto'}".

4. Product & Offerings Catalog Grid:
   - Render 3 dynamic, interactive SKU cards with real prices and details:
${catalogItems.map((item, i) => `     * Item 0${i + 1}: "${item.label}" | Price: "${item.metricOrPrice || '$28'}" | Description: "${item.description}"`).join('\n')}
   - Include quantity selector or "+ Add / Select" trigger with stateful cart counter in nav.

5. The Onlyness Test Comparison Ledger:
   - A high-signal side-by-side comparison table contrasting "${strategy.brandName}" vs "The Industry Default (${strategy.antiHero})".
   - Highlight our structural advantages with emerald checkmarks and incumbent compromises with subtle strike-outs.

6. Founding Manifesto & Ideology Card:
   - Warm paper quote block with serif manifesto text:
   "${launch.manifesto || strategy.mission || strategy.coreValueProposition}"

7. Strategic SWOT Defensibility Summary:
   - Executive verdict: "${swot.summary || 'High-conviction defensibility isolating key operational trade-offs.'}"
   - 4-quadrant preview of Strengths, Weaknesses, Opportunities, and Threats.

8. Footer:
   - Wordmark, brand mission tagline, newsletter signup with email validation, and social campaign hooks:
${(launch.socialHooks || []).slice(0, 3).map(h => `     * "${h}"`).join('\n')}

---

### 5. IMPLEMENTATION QUALITY CONSTRAINTS
- Zero "Lorem Ipsum" or generic placeholder text. Use the actual brand copy provided.
- Fully responsive across mobile (375px), tablet (768px), and desktop (1280px).
- Smooth interactions: hover transitions, active button feedback, and modal dialogs.
`.trim();

  /* ───────────────────────────────────────────────────────────────────────────
     PROMPT B: Google Antigravity & v0 Component Prompt (Modular UI)
     ─────────────────────────────────────────────────────────────────────────── */
  const antigravityV0Prompt = `### ROLE & SYSTEM OBJECTIVE
You are a senior UI designer and React component architect using Google Antigravity or v0.dev.
Generate modular, highly polished React components with inline Tailwind CSS classes and CSS custom variables for "${strategy.brandName || 'Brand Identity'}".

---

### DESIGN SYSTEM SPECIFICATIONS
\`\`\`css
:root {
  --brand-surface: ${surfaceHex};
  --brand-text: ${textHex};
  --brand-primary: ${primaryHex};
  --brand-secondary: ${secondaryHex};
  --brand-accent: ${accentHex};
  --font-serif: '${headingFont}', Georgia, serif;
  --font-sans: '${bodyFont}', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --radius-base: 1rem;
}
\`\`\`

---

### BRAND ESSENCE
- Name: "${strategy.brandName}"
- Value Proposition: "${strategy.coreValueProposition}"
- Opposing Cliché (Anti-Hero): "${strategy.antiHero}"
- Onlyness Differentiator: "${strategy.differentiator}"
- Tagline: "${strategy.tagline}"

---

### COMPONENT MODULES TO GENERATE

1. \`<Navbar />\`:
   - Wordmark in font-serif text-2xl tracking-tight text-[${textHex}].
   - Nav items with hover underline effects.
   - Primary pill button: bg-[${primaryHex}] text-white px-5 py-2 rounded-full font-sans text-xs uppercase tracking-wider.

2. \`<HeroSection />\`:
   - Background: bg-[${surfaceHex}] with subtle hairline border border-[#dbd7cd].
   - Eyebrow: text-xs font-mono uppercase tracking-[0.2em] text-[${accentHex}].
   - Headline: font-serif text-4xl sm:text-6xl font-light text-[${textHex}] tracking-tight leading-[1.05].
   - Subhead: text-stone-600 text-base sm:text-lg max-w-2xl font-sans mt-4.
   - CTA Group: High-contrast primary button + outlined secondary button.

3. \`<CatalogGrid />\`:
   - Responsive 3-column grid (\`grid grid-cols-1 md:grid-cols-3 gap-6\`).
   - Cards styled with Handhold Editorial aesthetic: bg-white border border-[#E5E0D8] rounded-[24px] p-6 hover:-translate-y-1 transition-transform.
   - Items to render:
${catalogItems.map(item => `     * ${item.label} (${item.metricOrPrice || '$28'}): ${item.description}`).join('\n')}

4. \`<ComparisonLedger />\`:
   - 2-column comparative ledger: "${strategy.brandName}" vs "Industry Incumbent".
   - Highlight the rejected villain: "${strategy.antiHero}".
   - Highlight the onlyness truth: "${strategy.differentiator}".

5. \`<SwotLedgerPreview />\`:
   - 2x2 grid previewing Strengths [S], Weaknesses [W], Opportunities [O], and Threats [T] with respective emerald, amber, indigo, and rose accent pills.

Provide clean, modular JSX ready to paste into production files.
`.trim();

  /* ───────────────────────────────────────────────────────────────────────────
     PROMPT C: ChatGPT & Claude Brand Copywriter Prompt (Copy Director)
     ─────────────────────────────────────────────────────────────────────────── */
  const copywriterPrompt = `### SYSTEM ROLE: HEAD OF BRAND VOICE & COPY DIRECTOR
You are the Creative Director and dedicated Head of Brand Voice for "${strategy.brandName || 'Brand Identity'}".
Your mandate is to craft every piece of external copy—from website headlines and email launches to product packaging microcopy and social hook campaigns—with authentic conviction.

---

### THE BRAND CONSTITUTION
1. Brand Name: ${strategy.brandName}
2. Commercial Tagline: "${strategy.tagline}"
3. Core Value Proposition: ${strategy.coreValueProposition}
4. The Category Cliché We Reject (Anti-Hero): ${strategy.antiHero}
5. The Onlyness Differentiator: ${strategy.differentiator}
6. Target Audience: ${strategy.targetAudience}
7. Brand Archetype: ${voice.archetype || 'The Purist'}

---

### VOICE DOS & DON'TS
- DO SPEAK LIKE THIS:
${(voice.dos || ['Speak with crisp, concrete conviction', 'Ground promises in tangible sensory reality', 'Stay clear, active, and jargon-free']).map(d => `  * ${d}`).join('\n')}

- STRICTLY BANNED (NEVER SPEAK LIKE THIS):
${(voice.donts || ['Never use corporate tech buzzwords', 'Avoid demographic caricature language', 'Never make unsubstantiated claims']).map(d => `  * ${d}`).join('\n')}

- SIGNATURE BRAND LEXICON:
  ${(voice.vocabularyWords || ['craft', 'conviction', 'essential', 'focused', 'honest']).join(', ')}

---

### THE FOUNDING MANIFESTO (YOUR NORTH STAR)
"${launch.manifesto || strategy.mission || strategy.coreValueProposition}"

---

### YOUR ASSIGNMENT INSTRUCTIONS
Whenever asked to write for ${strategy.brandName}:
1. Always establish high-contrast positioning against "${strategy.antiHero}".
2. Anchor claims to our specific differentiator: "${strategy.differentiator}".
3. Never write generic marketing fluff ("We are the best", "Supercharge your day", "Disrupting the industry").
4. Write with sensory rhythm, tight sentences, and uncompromising confidence.
`.trim();

  // Active prompt selector
  const activePromptText = activeSubTab === 'bolt-lovable'
    ? boltLovablePrompt
    : activeSubTab === 'antigravity-v0'
      ? antigravityV0Prompt
      : copywriterPrompt;

  const handleCopy = () => {
    navigator.clipboard.writeText(activePromptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans text-stone-900">

      {/* ── Top Hero Banner ── */}
      <div className="rounded-[28px] sm:rounded-[32px] p-6 sm:p-10 bg-[#FAF9F6] border border-[#E5E0D8] shadow-sm relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-orange-900 font-semibold">
              ✦ PRODUCTION AI SYSTEM PROMPTS • ZERO CODE DRIFT
            </span>
          </div>
          <span className="text-xs font-mono text-stone-500 bg-white px-3 py-1 rounded-full border border-[#E5E0D8]">
            Vite + React + Tailwind Ready
          </span>
        </div>

        <div className="max-w-3xl">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-stone-900 tracking-tight leading-[1.1] mb-3">
            MVP AI Website Builder
          </h2>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-sans">
            Export production-grade prompts engineered to reconstruct the exact synthesized brand—including 
            hex palettes, typography tokens, Socratic founder trade-offs, and component blueprints—in external AI builders.
          </p>
        </div>

        {/* Quick External Platform Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-5 mt-6 border-t border-[#E5E0D8]/60 text-xs font-medium text-stone-600">
          <span className="text-xs font-mono uppercase tracking-wider text-stone-400 mr-1">Target Engines:</span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-[#E5E0D8] text-xs">
            <Zap className="w-3 h-3 text-orange-500" /> Bolt.new
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-[#E5E0D8] text-xs">
            <Sparkles className="w-3 h-3 text-rose-500" /> Lovable.dev
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-[#E5E0D8] text-xs">
            <Laptop className="w-3 h-3 text-blue-500" /> Google Antigravity
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-[#E5E0D8] text-xs">
            <Code2 className="w-3 h-3 text-zinc-900" /> v0.dev
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-[#E5E0D8] text-xs">
            <Bot className="w-3 h-3 text-emerald-600" /> Claude & ChatGPT
          </span>
        </div>
      </div>

      {/* ── Sub-tabs & Action Toolbar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Tab Switcher */}
        <div className="inline-flex p-1.5 rounded-full bg-stone-100/90 border border-[#E5E0D8] max-w-full overflow-x-auto scrollbar-none gap-1">
          <button
            type="button"
            onClick={() => setActiveSubTab('bolt-lovable')}
            className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              activeSubTab === 'bolt-lovable'
                ? 'bg-stone-900 text-stone-100 shadow-sm font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Tab A: Bolt.new & Lovable
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('antigravity-v0')}
            className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              activeSubTab === 'antigravity-v0'
                ? 'bg-stone-900 text-stone-100 shadow-sm font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Tab B: Antigravity & v0
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('copywriter')}
            className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              activeSubTab === 'copywriter'
                ? 'bg-stone-900 text-stone-100 shadow-sm font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Tab C: Brand Copy Director
          </button>
        </div>

        {/* Primary Copy Button */}
        <button
          type="button"
          onClick={handleCopy}
          className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all shadow-sm cursor-pointer whitespace-nowrap ${
            copied
              ? 'bg-emerald-600 text-white font-semibold'
              : 'bg-stone-900 hover:bg-black text-white font-semibold hover:shadow-md'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>✓ Copied to Clipboard</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy Master Prompt</span>
            </>
          )}
        </button>
      </div>

      {/* ── Active Prompt Preview Container ── */}
      <div className="rounded-[28px] bg-stone-950 border border-stone-800 shadow-xl overflow-hidden text-stone-200">
        {/* Terminal Header */}
        <div className="px-5 py-3.5 bg-stone-900/90 border-b border-stone-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            <span className="ml-2 text-xs font-mono text-stone-400">
              {activeSubTab === 'bolt-lovable' && 'bolt-lovable-system-prompt.md'}
              {activeSubTab === 'antigravity-v0' && 'antigravity-v0-modular-spec.md'}
              {activeSubTab === 'copywriter' && 'brand-copy-director-instruction.md'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-stone-500 hidden sm:inline">
              Markdown • Ready to paste
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs font-mono text-stone-200 transition-colors"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Code Content */}
        <pre className="p-6 sm:p-8 font-mono text-xs sm:text-sm text-stone-300 overflow-x-auto max-h-[620px] scrollbar-thin leading-relaxed selection:bg-orange-500/30 whitespace-pre-wrap">
          <code>{activePromptText}</code>
        </pre>
      </div>

      {/* ── 3-Step Quick Guide Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        <div className="p-6 rounded-[24px] bg-white border border-[#E5E0D8] space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-orange-600 font-semibold block">
            Step 01 • Copy Master Prompt
          </span>
          <h4 className="text-base font-semibold text-stone-900 font-sans">
            Single-Click Export
          </h4>
          <p className="text-xs text-stone-600 leading-relaxed font-sans">
            Hit "Copy Master Prompt" above. Your clipboard will hold the full brand thesis, exact 5-role hex tokens, and component layout.
          </p>
        </div>

        <div className="p-6 rounded-[24px] bg-white border border-[#E5E0D8] space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-orange-600 font-semibold block">
            Step 02 • Open AI Builder
          </span>
          <h4 className="text-base font-semibold text-stone-900 font-sans">
            Paste into Bolt, Lovable or v0
          </h4>
          <p className="text-xs text-stone-600 leading-relaxed font-sans">
            Navigate to Bolt.new, Lovable.dev, Google Antigravity, or v0.dev. Paste the prompt directly into the initial project creation chatbox.
          </p>
        </div>

        <div className="p-6 rounded-[24px] bg-white border border-[#E5E0D8] space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-orange-600 font-semibold block">
            Step 03 • Zero Design Drift
          </span>
          <h4 className="text-base font-semibold text-stone-900 font-sans">
            Immediate Production Code
          </h4>
          <p className="text-xs text-stone-600 leading-relaxed font-sans">
            The external AI generates your full web app with exact fonts, catalog items, and comparison ledgers—with zero hallucination.
          </p>
        </div>
      </div>

    </div>
  );
}
