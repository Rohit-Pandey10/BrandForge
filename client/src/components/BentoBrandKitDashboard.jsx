/**
 * BentoBrandKitDashboard — Step 4: Final Brand Kit Bento-Box Dashboard
 * Location: client/src/components/BentoBrandKitDashboard.jsx
 *
 * Implements the comprehensive Bento-Box Brand Kit view:
 *   1. Dynamic CSS Token Injector & Theme Previewer (Google Fonts injection, 5-swatch palette with click-to-copy hex codes, CSS variables code block, and live UI preview applying borderCurvature and fonts).
 *   2. Strategy & Voice Grid (Mission, Anti-Hero, Core Value Proposition, Differentiator, Tone, Dos & Don'ts, Lexicon).
 *   3. Launch Assets & Manifesto (Full-length prose manifesto, Hero copy cards with "Copy Asset", Elevator pitch, Social hooks).
 *   4. Multi-format export toolbar (JSON, CSS, SVG, PDF).
 */

import React, { useState, useEffect } from 'react';
import {
  Copy,
  Check,
  Download,
  Printer,
  RotateCcw,
  Sparkles,
  Palette,
  Type,
  ShieldAlert,
  Target,
  Volume2,
  FileText,
  Share2,
  Code2,
  Layers,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { exportBrandKitJson, exportCssTokens, exportPaletteSvg } from '../utils/exportUtils.js';

export default function BentoBrandKitDashboard({ brandKit, onStartNew }) {
  const [copiedKey, setCopiedKey] = useState(null);
  const [activePreviewMode, setActivePreviewMode] = useState('card'); // 'card' | 'hero'

  const {
    brandStrategy = {},
    voiceSystem = {},
    visualTokens = {},
    launchContent = {}
  } = brandKit || {};

  const typography = visualTokens.typography || {};
  const palette = visualTokens.palette || [];
  const borderCurvature = visualTokens.borderCurvature || 'rounded-2xl';

  // Inject Google Fonts dynamically into <head>
  useEffect(() => {
    if (!typography.googleFontsUrl) return;
    const linkId = 'dynamic-bento-brand-fonts';
    let link = document.getElementById(linkId);
    if (!link) {
      link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    link.href = typography.googleFontsUrl;
  }, [typography.googleFontsUrl]);

  // Copy helper with feedback
  const handleCopy = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Find color tokens by role
  const getColor = (role, fallback) => {
    const found = palette.find(c => c.role === role);
    return found ? found.hex : fallback;
  };

  const primaryColor = getColor('primary', '#1e293b');
  const secondaryColor = getColor('secondary', '#475569');
  const accentColor = getColor('accent', '#4f46e5');
  const surfaceColor = getColor('surface', '#f8fafc');
  const textColor = getColor('text', '#0f172a');

  // Convert borderCurvature class to CSS pixel radius
  const getRadiusPx = (cls = '') => {
    if (cls.includes('none')) return '0px';
    if (cls.includes('sm')) return '4px';
    if (cls.includes('md')) return '8px';
    if (cls.includes('lg')) return '12px';
    if (cls.includes('xl')) return '16px';
    if (cls.includes('2xl')) return '24px';
    if (cls.includes('3xl')) return '32px';
    if (cls.includes('full')) return '9999px';
    return '16px';
  };

  const radiusPx = getRadiusPx(borderCurvature);

  // Generate :root CSS
  const cssVariables = `:root {
  /* Brand: ${brandStrategy.brandName || 'Brand'} */
${palette.map(c => `  --color-${(c.role || 'color').toLowerCase()}: ${c.hex}; /* ${c.name} */`).join('\n')}

  /* Typography */
  --font-heading: '${typography.headingFont || 'Inter'}', sans-serif;
  --font-body: '${typography.bodyFont || 'Inter'}', sans-serif;

  /* Border Curvature */
  --radius-curvature: ${radiusPx};
}`;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 pb-32 animate-fade-in font-sans">
      
      {/* ── Top Bar & Export Actions ── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 mb-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            Synthesized Brand Specification
          </div>
          <h1
            className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight"
            style={{ fontFamily: typography.headingFont ? `'${typography.headingFont}', serif` : 'inherit' }}
          >
            {brandStrategy.brandName || 'Brand Monograph'}
          </h1>
          <p
            className="text-sm sm:text-base text-slate-600 max-w-2xl mt-1 leading-relaxed"
            style={{ fontFamily: typography.bodyFont ? `'${typography.bodyFont}', sans-serif` : 'inherit' }}
          >
            {brandStrategy.tagline || 'Autonomous brand architecture synthesized from first-principles conviction.'}
          </p>
        </div>

        {/* Global Toolbar */}
        <div className="flex flex-wrap items-center gap-2 shrink-0 no-print">
          <button
            onClick={() => exportBrandKitJson(brandKit)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>JSON</span>
          </button>

          <button
            onClick={() => exportCssTokens(brandKit)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>CSS Tokens</span>
          </button>

          <button
            onClick={() => exportPaletteSvg(brandKit)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <Palette className="w-3.5 h-3.5" />
            <span>SVG Palette</span>
          </button>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print PDF</span>
          </button>

          <button
            onClick={onStartNew}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-sm ml-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Discovery</span>
          </button>
        </div>
      </div>

      {/* ── BENTO GRID LAYOUT ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ========================================================================= */}
        {/* ROW 1: Visual Tokens & Theme Previewer (Bento Box Section 1)              */}
        {/* ========================================================================= */}

        {/* 1A: 5-Token Color Palette (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                  Visual Design Tokens (5-Color Palette)
                </h3>
              </div>
              <span className="text-xs text-slate-500">Click swatch to copy HEX</span>
            </div>

            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              {visualTokens.stylePhilosophy || 'Harmonized color roles configured for high contrast and brand coherence.'}
            </p>

            {/* 5 Swatches */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
              {palette.map((color, idx) => {
                const isCopied = copiedKey === `hex-${idx}`;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleCopy(color.hex, `hex-${idx}`)}
                    className="group text-left p-2.5 rounded-xl border border-slate-200 hover:border-slate-400 hover:shadow-md transition-all relative flex flex-col"
                  >
                    <div
                      className="w-full h-16 rounded-lg mb-2 shadow-inner border border-black/5 relative flex items-center justify-center transition-transform group-hover:scale-[1.02]"
                      style={{ backgroundColor: color.hex }}
                    >
                      {isCopied && (
                        <span className="px-2 py-0.5 rounded bg-black/80 text-white text-[10px] font-bold">
                          Copied!
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      {color.role}
                    </span>
                    <span className="text-xs font-semibold text-slate-900 truncate">
                      {color.name}
                    </span>
                    <span className="text-[11px] font-mono text-slate-600 group-hover:text-indigo-600 transition-colors">
                      {color.hex}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Typography Pairings Card */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4 text-slate-500" />
              <span className="font-semibold text-slate-900">Heading:</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 font-serif font-bold text-slate-800">
                {typography.headingFont || 'Cormorant Garamond'}
              </span>
              <span className="text-slate-300">•</span>
              <span className="font-semibold text-slate-900">Body:</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 font-sans text-slate-800">
                {typography.bodyFont || 'Inter'}
              </span>
            </div>

            <span className="text-[11px] text-slate-500 italic">
              Curvature: <span className="font-mono font-bold text-slate-700">{borderCurvature}</span> ({radiusPx})
            </span>
          </div>
        </div>

        {/* 1B: Live Component Theme Previewer Sandbox (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                  Live Theme Sandbox
                </h3>
              </div>
              <span className="text-xs text-slate-500">Interactive Preview</span>
            </div>

            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Rendered in real-time applying the synthesized hex palette, Google font, and border curvature:
            </p>

            {/* Sandbox Canvas */}
            <div
              className="p-5 border border-slate-200 shadow-sm transition-all mb-4"
              style={{
                backgroundColor: surfaceColor,
                borderRadius: radiusPx,
                color: textColor
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white"
                  style={{ backgroundColor: accentColor, borderRadius: radiusPx }}
                >
                  Featured
                </span>
                <span className="text-xs font-mono opacity-60">Live CSS Tokens</span>
              </div>

              <h4
                className="text-lg font-bold mb-1 leading-snug"
                style={{
                  fontFamily: typography.headingFont ? `'${typography.headingFont}', serif` : 'inherit',
                  color: primaryColor
                }}
              >
                {launchContent.heroHeadline || brandStrategy.brandName}
              </h4>

              <p
                className="text-xs opacity-80 mb-4 leading-relaxed line-clamp-2"
                style={{ fontFamily: typography.bodyFont ? `'${typography.bodyFont}', sans-serif` : 'inherit' }}
              >
                {launchContent.heroSubheadline || brandStrategy.coreValueProposition}
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm flex items-center gap-1.5 transition-opacity hover:opacity-90"
                  style={{
                    backgroundColor: primaryColor,
                    borderRadius: radiusPx
                  }}
                >
                  <span>{launchContent.callToAction || 'Get Started'}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>

                <button
                  type="button"
                  className="px-3 py-1.5 text-xs font-semibold border transition-opacity hover:opacity-90"
                  style={{
                    borderColor: secondaryColor,
                    color: secondaryColor,
                    borderRadius: radiusPx
                  }}
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>

          {/* Inspect :root CSS block */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-slate-700">Compiled :root CSS</span>
              <button
                type="button"
                onClick={() => handleCopy(cssVariables, 'css-vars')}
                className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
              >
                {copiedKey === 'css-vars' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'css-vars' ? 'Copied' : 'Copy CSS'}</span>
              </button>
            </div>
            <pre className="p-3 bg-slate-900 text-slate-100 rounded-xl text-[11px] font-mono overflow-x-auto max-h-24 scrollbar-none">
              {cssVariables}
            </pre>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ROW 2: Brand Strategy & Voice Grid (Bento Box Section 2)                  */}
        {/* ========================================================================= */}

        {/* 2A: Strategic Positioning (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Brand Strategy & Conviction
            </h3>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Core Mission
            </span>
            <p className="text-xs sm:text-sm font-medium text-slate-900 leading-relaxed">
              {brandStrategy.mission || 'No mission statement synthesized.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Target Beachhead Audience
              </span>
              <p className="text-xs text-slate-800 leading-relaxed">
                {brandStrategy.targetAudience || 'Early adopters'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Unfair Differentiator
              </span>
              <p className="text-xs text-slate-800 leading-relaxed">
                {brandStrategy.differentiator || 'Proprietary moat'}
              </p>
            </div>
          </div>

          {/* Anti-Hero Oppositional Stance */}
          <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200">
            <div className="flex items-center gap-1.5 mb-1 text-rose-800">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                The Incumbent Anti-Hero (What We Oppose)
              </span>
            </div>
            <p className="text-xs text-rose-950 font-medium leading-relaxed">
              "{brandStrategy.antiHero || 'Conventional market compromises and bloated legacy practices.'}"
            </p>
          </div>
        </div>

        {/* 2B: Voice & Verbal System (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Voice & Verbal System
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold">
              {voiceSystem.archetype || 'The Architect'}
            </span>
          </div>

          {/* Tone Attributes */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
              Tone Attributes
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(voiceSystem.tone || ['Convincing', 'Direct', 'Uncompromising']).map((t, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-800 text-xs font-medium"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Concrete Dos & Don'ts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block mb-2">
                Mandatory Dos
              </span>
              <ul className="space-y-1.5 text-xs text-emerald-950">
                {(voiceSystem.dos || []).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 leading-snug">
                    <span className="text-emerald-600 font-bold shrink-0">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block mb-2">
                Strict Don'ts
              </span>
              <ul className="space-y-1.5 text-xs text-amber-950">
                {(voiceSystem.donts || []).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 leading-snug">
                    <span className="text-amber-600 font-bold shrink-0">✕</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Lexicon / Vocabulary */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
              Curated Lexicon & Vocabulary Words
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(voiceSystem.vocabularyWords || []).map((word, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-mono"
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ROW 3: Launch Assets & Manifesto (Bento Box Section 3)                    */}
        {/* ========================================================================= */}

        {/* 3A: Full-Length Launch Manifesto (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                  Launch Manifesto
                </h3>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(launchContent.manifesto, 'manifesto')}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
              >
                {copiedKey === 'manifesto' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'manifesto' ? 'Copied' : 'Copy Manifesto'}</span>
              </button>
            </div>

            <div
              className="p-6 rounded-xl bg-slate-50/70 border border-slate-200/90 text-slate-900 text-sm sm:text-base leading-relaxed whitespace-pre-line italic font-serif"
              style={{ fontFamily: typography.headingFont ? `'${typography.headingFont}', serif` : 'Georgia, serif' }}
            >
              {launchContent.manifesto || 'Our manifesto articulates the reason we refuse to accept the current status quo.'}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Elevator Pitch:</span>
            <span className="font-normal text-slate-800 truncate max-w-md ml-2">
              "{launchContent.elevatorPitch || brandStrategy.coreValueProposition}"
            </span>
          </div>
        </div>

        {/* 3B: Launch Copy & Social Hooks (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Launch Copy & Social Hooks
              </h3>
            </div>
          </div>

          {/* Hero Headline Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Hero Headline
              </span>
              <button
                type="button"
                onClick={() => handleCopy(launchContent.heroHeadline, 'hero-h1')}
                className="text-slate-500 hover:text-slate-900"
              >
                {copiedKey === 'hero-h1' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
            <p className="text-sm font-bold text-slate-900 leading-snug">
              {launchContent.heroHeadline || brandStrategy.tagline}
            </p>
          </div>

          {/* Hero Subheadline Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Hero Subheadline
              </span>
              <button
                type="button"
                onClick={() => handleCopy(launchContent.heroSubheadline, 'hero-sub')}
                className="text-slate-500 hover:text-slate-900"
              >
                {copiedKey === 'hero-sub' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              {launchContent.heroSubheadline || brandStrategy.coreValueProposition}
            </p>
          </div>

          {/* Social Hooks */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
              High-Conversion Social Hooks
            </span>
            <div className="space-y-2">
              {(launchContent.socialHooks || []).map((hook, idx) => {
                const isCopied = copiedKey === `hook-${idx}`;
                return (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-start justify-between gap-2"
                  >
                    <p className="text-xs text-slate-800 leading-snug">
                      "{hook}"
                    </p>
                    <button
                      type="button"
                      onClick={() => handleCopy(hook, `hook-${idx}`)}
                      className="text-slate-400 hover:text-slate-900 shrink-0 mt-0.5"
                    >
                      {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
