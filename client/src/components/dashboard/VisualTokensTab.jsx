/**
 * Visual Tokens Tab — Color System, WCAG Contrast, Typography, CSS :root Panel
 * 
 * Enhanced with:
 * - WCAG contrast ratio badges on palette swatches
 * - Viewport size toggle on typography specimen (Mobile / Tablet / Desktop)
 */

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { buildCssTokens } from '../../utils/exportUtils';

/**
 * Approximate WCAG contrast ratio of a hex color against white (#FFFFFF).
 * Uses simplified relative luminance formula. Returns a string like "4.5:1".
 */
function getContrastVsWhite(hex) {
  if (!hex || !hex.startsWith('#')) return null;
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const linearize = c => c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  const L = 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
  const ratio = (L + 0.05) / (0.05);
  return `${ratio.toFixed(1)}:1`;
}

function wcagLevel(hex) {
  if (!hex) return null;
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const linearize = c => c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  const L = 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
  const ratio = (L + 0.05) / 0.05;
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  if (ratio >= 3) return 'AA Large';
  return 'Fail';
}

const VIEWPORT_SIZES = {
  Mobile:  { label: 'Mobile',  class: 'text-xl sm:text-xl' },
  Tablet:  { label: 'Tablet',  class: 'text-2xl sm:text-3xl' },
  Desktop: { label: 'Desktop', class: 'text-3xl sm:text-4xl' }
};

export default function VisualTokensTab({ visualTokens }) {
  const [copiedHex, setCopiedHex] = useState(null);
  const [copiedIdentifier, setCopiedIdentifier] = useState(null);
  const [viewport, setViewport] = useState('Desktop');

  const { palette = [], typography = {}, stylePhilosophy, borderCurvature } = visualTokens || {};

  const fakeKit = { brandStrategy: {}, visualTokens };
  const compiledCss = buildCssTokens(fakeKit);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    if (id.startsWith('hex-')) {
      setCopiedHex(id.replace('hex-', ''));
      setTimeout(() => setCopiedHex(null), 2000);
    } else {
      setCopiedIdentifier(id);
      setTimeout(() => setCopiedIdentifier(null), 2000);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ── Color System ── */}
      <section className="bg-white rounded-[28px] border border-[#dbd7cd] p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-[#dbd7cd]">
          <div>
            <span className="text-xs font-mono font-medium uppercase tracking-wider text-stone-400 block mb-1">PALETTE SPECIFICATION</span>
            <h3 className="font-serif text-2xl font-light text-black tracking-[-0.03em]">Color System — Synthesized Palette</h3>
          </div>
          <span className="text-xs text-stone-500">Click any swatch to copy HEX · WCAG contrast vs. white</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
          {palette.map((color) => {
            const isCopied = copiedHex === color.hex;
            const contrast = getContrastVsWhite(color.hex);
            const level = wcagLevel(color.hex);
            const levelColor = level === 'AAA' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' :
                               level === 'AA'  ? 'text-blue-700 bg-blue-50 border-blue-200' :
                               level === 'AA Large' ? 'text-amber-700 bg-amber-50 border-amber-200' :
                               'text-stone-500 bg-stone-50 border-stone-200';
            return (
              <button
                key={color.hex}
                type="button"
                onClick={() => copyToClipboard(color.hex, `hex-${color.hex}`)}
                className="rounded-2xl border border-[#dbd7cd] overflow-hidden bg-white text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-black/40 group flex flex-col"
                title={`Copy ${color.hex}`}
              >
                {/* Color block */}
                <div className="h-24 w-full relative flex items-center justify-center" style={{ backgroundColor: color.hex }}>
                  <span className={`text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-white/95 text-black border border-black/10 transition-opacity ${isCopied ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    {isCopied ? 'Copied' : 'Copy'}
                  </span>
                </div>
                {/* Metadata */}
                <div className="p-3 bg-white flex flex-col gap-1 border-t border-[#dbd7cd]/40">
                  <span className="font-sans text-xs font-medium text-black truncate">{color.name}</span>
                  <span className="text-xs font-mono uppercase tracking-wider text-stone-400">{color.role}</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-mono text-xs text-stone-700">{color.hex}</span>
                    {isCopied ? <Check className="w-3 h-3 text-black" /> : <Copy className="w-3 h-3 text-stone-400 group-hover:text-black transition-colors" />}
                  </div>
                  {/* WCAG badge */}
                  {contrast && (
                    <span className={`text-xs font-mono px-1.5 py-0.5 rounded border mt-1 w-fit ${levelColor}`}>
                      WCAG {level} · {contrast}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Typography ── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Display */}
        <div className="bg-white rounded-[28px] border border-[#dbd7cd] p-6 sm:p-8 flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5">
          <div>
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-[#dbd7cd]">
              <span className="text-xs font-mono font-medium uppercase tracking-wider text-stone-400">DISPLAY TYPOGRAPHY</span>
              <span className="text-xs font-mono text-stone-500">{typography.headingFont || 'Cormorant Garamond'}</span>
            </div>

            {/* Viewport toggle */}
            <div className="flex items-center gap-1 mb-4">
              {Object.keys(VIEWPORT_SIZES).map(vp => (
                <button
                  key={vp}
                  onClick={() => setViewport(vp)}
                  className={`text-xs px-2.5 py-0.5 rounded-full border transition-all ${viewport === vp ? 'bg-black text-white border-black font-medium' : 'border-[#dbd7cd] text-stone-500 hover:border-black hover:text-black'}`}
                >
                  {vp}
                </button>
              ))}
            </div>

            <div
              className={`font-serif font-light text-black leading-tight tracking-[-0.03em] mb-4 ${VIEWPORT_SIZES[viewport].class}`}
              style={{ fontFamily: typography.headingFont ? `'${typography.headingFont}', serif` : 'inherit' }}
            >
              Conviction builds enduring value.
            </div>
            <div className="p-3 bg-[#faf9f6] rounded-xl border border-[#dbd7cd] font-mono text-xs text-stone-600 mb-4 leading-relaxed">
              Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz 0123456789
            </div>
          </div>
          <div className="pt-3 border-t border-[#dbd7cd] text-xs text-stone-500">
            {typography.rationale || 'Selected for razor-sharp editorial tension and stark modern authority.'}
          </div>
        </div>

        {/* Body */}
        <div className="bg-white rounded-[28px] border border-[#dbd7cd] p-6 sm:p-8 flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5">
          <div>
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-[#dbd7cd]">
              <span className="text-xs font-mono font-medium uppercase tracking-wider text-stone-400">BODY & UI TYPOGRAPHY</span>
              <span className="text-xs font-mono text-stone-500">{typography.bodyFont || 'Inter'}</span>
            </div>
            <p className="text-sm text-stone-700 leading-relaxed mb-4" style={{ fontFamily: typography.bodyFont ? `'${typography.bodyFont}', sans-serif` : 'inherit' }}>
              {typography.rationale || 'Balanced letterforms scaled for legible tactile menus, printed signage, and responsive mobile reservations.'}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="px-3 py-1 rounded-full text-xs bg-black text-white">Primary Action</span>
              <span className="px-3 py-1 rounded-full text-xs border border-[#dbd7cd] bg-white text-stone-800">Neutral Button</span>
              <span className="px-3 py-1 rounded-full text-xs bg-[#faf9f6] text-stone-600 border border-[#dbd7cd]">Tag Specimen</span>
            </div>
          </div>
          <div className="pt-3 border-t border-[#dbd7cd] text-xs text-stone-500">
            Weight: 400 Regular • Scaled for legible tactile materials and responsive viewports.
          </div>
        </div>
      </section>

      {/* ── Style Philosophy & Border Curvature ── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-[28px] border border-[#dbd7cd] p-6 sm:p-8 transition-all duration-200 hover:-translate-y-0.5">
          <span className="text-xs font-mono font-medium uppercase tracking-wider text-stone-400 block mb-2">AESTHETIC FOUNDATION</span>
          <h3 className="font-serif text-2xl font-light text-black tracking-[-0.03em] mb-3">Style Philosophy</h3>
          <p className="text-sm text-stone-700 leading-relaxed bg-[#fcfbf9] p-4 rounded-xl border border-[#dbd7cd]">
            {stylePhilosophy || 'Refined monochrome typography with disciplined whitespace, hairline boundaries, and high-contrast editorial clarity.'}
          </p>
        </div>

        <div className="bg-white rounded-[28px] border border-[#dbd7cd] p-6 sm:p-8 flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5">
          <div>
            <span className="text-xs font-mono font-medium uppercase tracking-wider text-stone-400 block mb-2">GEOMETRY RULES</span>
            <h3 className="font-serif text-2xl font-light text-black tracking-[-0.03em] mb-3">Border Curvature Spec</h3>
            <div className="flex items-center gap-4 bg-[#fcfbf9] p-4 rounded-xl border border-[#dbd7cd]">
              <div className={`w-14 h-14 bg-stone-900 border border-stone-800 flex items-center justify-center text-white text-xs font-mono ${borderCurvature || 'rounded-xl'}`}>
                Shape
              </div>
              <div>
                <span className="font-mono text-xs text-black font-medium block">{borderCurvature || 'rounded-xl'}</span>
                <span className="text-xs text-stone-500">Standardized container and interactive element radius.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CSS :root panel ── */}
      <section className="bg-white rounded-[28px] border border-[#dbd7cd] p-6 sm:p-8">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#dbd7cd]">
          <div>
            <span className="text-xs font-mono font-medium uppercase tracking-wider text-stone-400 block mb-1">COMPILED CODE SPECIFICATION</span>
            <h3 className="font-serif text-2xl font-light text-black tracking-[-0.03em]">CSS Custom Properties (:root)</h3>
          </div>
          <button
            type="button"
            onClick={() => copyToClipboard(compiledCss, 'css-tokens')}
            className="inline-flex items-center gap-1.5 text-xs text-stone-700 hover:text-black px-3.5 py-1.5 rounded-full border border-[#dbd7cd] bg-[#fcfbf9] hover:border-black transition-all"
          >
            {copiedIdentifier === 'css-tokens' ? <><Check className="w-3.5 h-3.5 text-black" /><span>Copied CSS</span></> : <><Copy className="w-3.5 h-3.5 text-stone-500" /><span>Copy CSS</span></>}
          </button>
        </div>
        <pre className="p-4 rounded-2xl bg-[#faf9f6] border border-[#dbd7cd] font-mono text-xs text-stone-800 overflow-x-auto leading-relaxed">
          <code>{compiledCss}</code>
        </pre>
      </section>
    </div>
  );
}
