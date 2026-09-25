/**
<<<<<<< HEAD
 * Live Preview Tab — Dynamic Brand-Palette-Grounded Industry Previews
 *
 * Renders domain-specific website preview mockups based on the detected industry
 * from the synthesized brand kit (Apparel / Hospitality / Developer / Editorial).
 *
 * ALL styles, canvas backgrounds, card surfaces, typography colors, borders,
 * buttons, and badges are derived dynamically from the suggested brand color palette
 * (primary, secondary, accent, surface, text) — zero preset static colors.
=======
 * Live Preview Tab — Semantic Component Tree Renderer
 *
 * Renders a live website preview from the LLM-generated `kit.websiteBlueprint`.
 * Zero hardcoded product strings — everything comes from the synthesized kit.
 *
 * Supports:
 *   Hero Layouts  : centered_minimal | split_editorial | bold_monograph
 *   Section Types : catalog_grid | ritual_steps | flavor_profile |
 *                   comparative_ledger | press_quotes
 *
 * Archetype detection routes the outer chrome (nav labels, color tone);
 * CONTENT is 100% driven by websiteBlueprint from the LLM.
 * Falls back gracefully to launchContent/brandStrategy if blueprint absent.
 *
 * Includes Desktop vs Mobile (390px Viewport) switcher with dynamic island notch.
>>>>>>> dc9bada763cc7d97945289cc141d87886243899d
 */

import React, { useState } from 'react';
import {
  ShoppingBag,
<<<<<<< HEAD
  Scissors,
  ShieldCheck,
  ArrowRight,
  MapPin,
  Clock,
  Calendar,
  Monitor,
  Smartphone,
  Copy,
  Check
} from 'lucide-react';
import { extractClientDomain } from '../../data/mockBrandData';

// Helper: Convert HEX to RGBA with alpha
const hexToRgba = (hex, alpha = 1) => {
  if (!hex || typeof hex !== 'string') return `rgba(0, 0, 0, ${alpha})`;
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('');
  }
  if (clean.length !== 6) return hex;
  const num = parseInt(clean, 16);
  if (isNaN(num)) return hex;
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Helper: Determine if color is perceptually light (YIQ standard)
const isLightColor = (hex) => {
  if (!hex || typeof hex !== 'string') return true;
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('');
  }
  if (clean.length !== 6) return true;
  const num = parseInt(clean, 16);
  if (isNaN(num)) return true;
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 135;
};

// Helper: High contrast readable text color (#0f1115 or #ffffff)
const getContrastColor = (hex) => {
  return isLightColor(hex) ? '#0f1115' : '#ffffff';
};

export default function LivePreviewTab({ brandStrategy, visualTokens, launchContent }) {
  const [device, setDevice] = useState('desktop');
  const [copiedHex, setCopiedHex] = useState(null);

  const palette = visualTokens?.palette || [];
  const typography = visualTokens?.typography || {};
  const brandName = brandStrategy?.brandName || 'Brand Monograph';
  const cleanName = brandName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  // Extract individual roles from the suggested brand palette
  const primarySwatch   = palette.find(c => c.role === 'primary')   || palette[0] || { hex: '#111215', name: 'Primary',   role: 'primary' };
  const secondarySwatch = palette.find(c => c.role === 'secondary') || palette[1] || { hex: '#71717a', name: 'Secondary', role: 'secondary' };
  const accentSwatch    = palette.find(c => c.role === 'accent')    || palette[2] || { hex: '#00e599', name: 'Accent',    role: 'accent' };
  const surfaceSwatch   = palette.find(c => c.role === 'surface')   || palette[3] || { hex: '#fdfcf9', name: 'Surface',   role: 'surface' };
  const textSwatch      = palette.find(c => c.role === 'text')      || palette[4] || { hex: '#0a0a0c', name: 'Text',      role: 'text' };

  const primaryHex   = primarySwatch.hex;
  const secondaryHex = secondarySwatch.hex;
  const accentHex    = accentSwatch.hex;
  const surfaceHex   = surfaceSwatch.hex;
  let textHex        = textSwatch.hex;

  // Safeguard: Ensure perceived contrast between surface and text so readability is always pristine
  const isSurfaceLight = isLightColor(surfaceHex);
  if (isSurfaceLight && isLightColor(textHex)) {
    textHex = '#111217';
  } else if (!isSurfaceLight && !isLightColor(textHex)) {
    textHex = '#f8fafc';
  }

  // Derive palette-grounded design tokens for the entire website preview
  const theme = {
    canvas: surfaceHex,
    cardBg: isSurfaceLight ? '#ffffff' : hexToRgba('#ffffff', 0.06),
    cardBgElevated: isSurfaceLight ? hexToRgba('#ffffff', 0.95) : hexToRgba('#ffffff', 0.1),
    subtleBg: isSurfaceLight ? hexToRgba(secondaryHex, 0.09) : hexToRgba(secondaryHex, 0.22),
    border: hexToRgba(secondaryHex, 0.35),
    borderSubtle: hexToRgba(secondaryHex, 0.18),
    text: textHex,
    textMuted: hexToRgba(textHex, 0.74),
    textSubtle: hexToRgba(textHex, 0.5),
    primary: primaryHex,
    primaryText: getContrastColor(primaryHex),
    secondary: secondaryHex,
    secondaryText: getContrastColor(secondaryHex),
    accent: accentHex,
    accentText: getContrastColor(accentHex),
    accentTint: hexToRgba(accentHex, 0.14),
    accentBorder: hexToRgba(accentHex, 0.42),
    isSurfaceLight
  };

  const radiusCurvature =
    visualTokens?.borderCurvature === 'rounded-none' ? '0px' :
    visualTokens?.borderCurvature === 'rounded-full' ? '9999px' :
    visualTokens?.borderCurvature === 'rounded-2xl'   ? '24px' :
    visualTokens?.borderCurvature === 'rounded-lg'   ? '12px' : '16px';

  const combinedContext = [
    brandStrategy?.brandName, brandStrategy?.tagline, brandStrategy?.mission,
    brandStrategy?.targetAudience, brandStrategy?.differentiator,
    launchContent?.heroHeadline, launchContent?.heroSubheadline
  ].join(' ');
  const detectedDomain = extractClientDomain(combinedContext);

  const domainUrl =
    detectedDomain === 'fashion'     ? `https://${cleanName}.shop` :
    detectedDomain === 'hospitality' ? `https://${cleanName}.restaurant` :
    detectedDomain === 'developer'   ? `https://${cleanName}.dev` :
                                       `https://${cleanName}.com`;
=======
  ArrowRight,
  Clock,
  Calendar,
  Check,
  Copy,
  Sparkles,
  Utensils,
  Plus,
  Droplets,
  Leaf,
  Zap,
  Quote,
  Monitor,
  Smartphone
} from 'lucide-react';

// ─── Domain Resolver ──────────────────────────────────────────────────────────
export function resolveArchetype(kit = {}) {
  const brandStrategy = kit.brandStrategy || {};
  const launchContent = kit.launchContent || {};
  const domain = (kit.domain || brandStrategy.domain || '').toLowerCase();
  const text = [
    brandStrategy.brandName, brandStrategy.tagline,
    brandStrategy.coreValueProposition, brandStrategy.differentiator,
    launchContent.heroHeadline, launchContent.heroSubheadline
  ].join(' ').toLowerCase();

  if (
    domain.includes('hospitality') || domain.includes('restaurant') || domain.includes('dining') ||
    domain.includes('bakery') || domain.includes('cafe') || domain.includes('bistro') ||
    text.includes('restaurant') || text.includes('bakery') || text.includes('sourdough') ||
    text.includes('pizza') || text.includes('dining') || text.includes('tasting menu') ||
    text.includes('communal table') || text.includes('wood-fired')
  ) return 'hospitality';

  if (
    domain.includes('developer') || domain.includes('software') || domain.includes('saas') ||
    domain.includes('database') || domain.includes('api') || domain.includes('tech') ||
    text.includes('database') || text.includes('sql') || text.includes(' api ') ||
    text.includes('bytecode') || text.includes('in-memory') || text.includes('microservice') ||
    text.includes('compiler') || text.includes('devops') || text.includes('cli') ||
    text.includes('sub-millisecond') || text.includes('infrastructure') ||
    text.includes('query execution')
  ) return 'digital_saas';

  // Default: everything else is retail/CPG (never falls into dev terminal)
  return 'retail_cpg';
}

// ─── Luminance & Contrast Calculator ──────────────────────────────────────────
export function isDarkColor(hex) {
  if (!hex || typeof hex !== 'string') return false;
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return false;
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.55;
}

export function getContrastColor(hexColor) {
  return isDarkColor(hexColor) ? '#ffffff' : '#000000';
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function LivePreviewTab(props) {
  const kit           = props.kit || props.brandKit || props;
  const brandStrategy = props.brandStrategy || kit.brandStrategy || {};
  const voiceSystem   = props.voiceSystem   || kit.voiceSystem   || {};
  const visualTokens  = props.visualTokens  || kit.visualTokens  || {};
  const launchContent = props.launchContent || kit.launchContent || {};
  const blueprint     = props.websiteBlueprint || kit.websiteBlueprint || null;

  const [previewDevice, setPreviewDevice] = useState('desktop'); // 'desktop' | 'mobile'
  const isMobile = previewDevice === 'mobile';

  const palette    = visualTokens.palette || [];
  const typography = visualTokens.typography || {};
  const brandName  = brandStrategy.brandName || 'Brand';
  const cleanName  = brandName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'brand';

  const primaryColor   = palette.find(c => c.role === 'primary')?.hex   || '#111111';
  const secondaryColor = palette.find(c => c.role === 'secondary')?.hex || '#555555';
  const accentColor    = palette.find(c => c.role === 'accent')?.hex    || '#888888';
  const surfaceColor   = palette.find(c => c.role === 'surface')?.hex   || '#fcfbf9';
  const textColor      = palette.find(c => c.role === 'text')?.hex      || '#111111';
  const primaryContrast   = getContrastColor(primaryColor);
  const secondaryContrast = getContrastColor(secondaryColor);

  const radiusCurvature =
    visualTokens.borderCurvature === 'rounded-none' ? '0px'    :
    visualTokens.borderCurvature === 'rounded-full' ? '9999px' :
    visualTokens.borderCurvature === 'rounded-2xl'  ? '24px'   :
    visualTokens.borderCurvature === 'rounded-lg'   ? '12px'   : '16px';
>>>>>>> dc9bada763cc7d97945289cc141d87886243899d

  const headingFont = typography.headingFont || 'Cormorant Garamond';
  const bodyFont    = typography.bodyFont    || 'Inter';
  const fontStyle = {
    display: `'${headingFont}', Georgia, serif`,
    body:    `'${bodyFont}', system-ui, -apple-system, sans-serif`
  };

  const archetype  = resolveArchetype({ ...kit, brandStrategy, launchContent });
  const domainUrl  = archetype === 'retail_cpg' ? `https://${cleanName}.shop` :
                     archetype === 'hospitality' ? `https://${cleanName}.dining` :
                     `https://${cleanName}.dev`;
  const domainBadge = archetype === 'retail_cpg'  ? 'RETAIL & CPG PREVIEW'  :
                      archetype === 'hospitality' ? 'HOSPITALITY PREVIEW'    : 'DIGITAL SAAS PREVIEW';

  const sharedProps = {
    brandStrategy, voiceSystem, visualTokens, launchContent, blueprint,
    cleanName, primaryColor, secondaryColor, accentColor, surfaceColor, textColor,
    primaryContrast, secondaryContrast, radiusCurvature, fontStyle, isMobile
  };

  const handleCopyHex = (hex) => {
    navigator.clipboard?.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  const isMobile = device === 'mobile';

  return (
<<<<<<< HEAD
    <div className="space-y-6 animate-fade-in">
      {/* ── Active Suggested Palette Specimen Bar ── */}
      <div className="bg-white rounded-2xl border border-[#dbd7cd] p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-[11px] uppercase font-mono tracking-wider text-stone-500 font-semibold pr-2 border-r border-[#dbd7cd]">
            Applied Suggested Palette
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            {palette.map((swatch, idx) => {
              const isCopied = copiedHex === swatch.hex;
              return (
                <button
                  key={idx}
                  onClick={() => handleCopyHex(swatch.hex)}
                  title={`Click to copy ${swatch.name} (${swatch.hex}) — Role: ${swatch.role}`}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-stone-200 bg-white hover:border-black transition-all text-xs"
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/15 shadow-inner"
                    style={{ backgroundColor: swatch.hex }}
                  />
                  <span className="font-mono text-[11px] text-stone-700 font-medium">{swatch.hex}</span>
                  <span className="text-[9px] uppercase font-mono text-stone-400">({swatch.role})</span>
                  {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-2.5 h-2.5 text-stone-300" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Viewport Device Toggle */}
        <div className="flex items-center gap-1 bg-[#f4f2ee] p-1 rounded-xl self-start sm:self-auto border border-[#dbd7cd]">
          <button
            onClick={() => setDevice('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              device === 'desktop' ? 'bg-white text-black shadow-sm' : 'text-stone-500 hover:text-black'
            }`}
            title="Desktop Preview"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desktop</span>
          </button>
          <button
            onClick={() => setDevice('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              device === 'mobile' ? 'bg-white text-black shadow-sm' : 'text-stone-500 hover:text-black'
            }`}
            title="Mobile Preview (390px)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mobile</span>
          </button>
        </div>
      </div>

      {/* ── Simulated Browser Viewport ── */}
      <div
        className="mx-auto transition-all duration-300"
        style={{
          maxWidth: isMobile ? '420px' : '100%',
        }}
      >
        <div
          className="border overflow-hidden shadow-sm transition-all"
          style={{
            borderRadius: isMobile ? '36px' : '28px',
            borderColor: theme.border,
            backgroundColor: theme.canvas
          }}
        >
          {/* Browser Chrome Bar */}
          <div
            className="px-5 py-3 flex items-center justify-between border-b transition-colors"
            style={{
              backgroundColor: isSurfaceLight ? hexToRgba('#000000', 0.03) : hexToRgba('#ffffff', 0.04),
              borderBottomColor: theme.borderSubtle
            }}
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: hexToRgba(theme.text, 0.25) }} />
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: hexToRgba(theme.text, 0.25) }} />
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: hexToRgba(theme.text, 0.25) }} />
            </div>
            <div
              className="px-5 py-1 rounded-full text-[11px] font-mono max-w-xs truncate border"
              style={{
                backgroundColor: theme.cardBg,
                borderColor: theme.borderSubtle,
                color: theme.textMuted
              }}
            >
              {domainUrl}
            </div>
            <span
              className="text-[10px] uppercase font-mono tracking-wider font-semibold"
              style={{ color: theme.textSubtle }}
            >
              {detectedDomain === 'fashion' ? 'APPAREL PREVIEW' : `${detectedDomain.toUpperCase()} PREVIEW`}
            </span>
          </div>

          {/* DOMAIN ARCHETYPE SWITCHER — 100% STYLED FROM SUGGESTED BRAND PALETTE */}
          {detectedDomain === 'fashion' ? (
            <ApparelPreview
              brandStrategy={brandStrategy}
              launchContent={launchContent}
              theme={theme}
              radiusCurvature={radiusCurvature}
              fontStyle={fontStyle}
              palette={palette}
              isMobile={isMobile}
            />
          ) : detectedDomain === 'hospitality' ? (
            <HospitalityPreview
              brandStrategy={brandStrategy}
              launchContent={launchContent}
              theme={theme}
              radiusCurvature={radiusCurvature}
              fontStyle={fontStyle}
              palette={palette}
              isMobile={isMobile}
            />
          ) : detectedDomain === 'developer' ? (
            <DeveloperPreview
              brandStrategy={brandStrategy}
              launchContent={launchContent}
              cleanName={cleanName}
              theme={theme}
              radiusCurvature={radiusCurvature}
              fontStyle={fontStyle}
              palette={palette}
              isMobile={isMobile}
            />
          ) : (
            <EditorialPreview
              brandStrategy={brandStrategy}
              launchContent={launchContent}
              theme={theme}
              radiusCurvature={radiusCurvature}
              fontStyle={fontStyle}
              palette={palette}
              isMobile={isMobile}
            />
          )}
        </div>
=======
    <div className="space-y-6 animate-fade-in pb-28">
      {/* ── Viewport Simulator Toolbar (Above Preview Frame) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold tracking-wider uppercase text-stone-700 font-mono">
            Viewport Simulator
          </span>
          <span className="text-stone-300 hidden sm:inline">•</span>
          <span className="text-xs font-mono text-stone-500 hidden sm:inline">
            {isMobile ? 'iPhone 15 Pro (390px Viewport)' : 'MacBook Pro Desktop (Full Canvas)'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Segmented Device Switcher */}
          <div className="flex items-center p-0.5 bg-stone-200/80 border border-stone-300/80 rounded-xl shadow-2xs">
            <button
              type="button"
              onClick={() => setPreviewDevice('desktop')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-lg transition-all cursor-pointer ${
                !isMobile
                  ? 'bg-black text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
              }`}
              title="Desktop View (Full Width)"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop</span>
            </button>

            <button
              type="button"
              onClick={() => setPreviewDevice('mobile')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-lg transition-all cursor-pointer ${
                isMobile
                  ? 'bg-black text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
              }`}
              title="Mobile View (390px Viewport)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile</span>
            </button>
          </div>

          <span className="text-xs uppercase font-mono tracking-wider text-stone-600 font-semibold hidden md:inline">
            {domainBadge}
          </span>
        </div>
      </div>

      {/* ── Viewport Specimen Frame (Desktop vs Mobile) ── */}
      <div
        className={`w-full transition-all duration-300 ${
          isMobile
            ? 'max-w-[390px] mx-auto h-[780px] rounded-[48px] border-[6px] border-[#222222] shadow-2xl overflow-hidden my-4 flex flex-col relative'
            : 'w-full bg-white border border-[#dbd7cd] overflow-hidden shadow-sm rounded-[28px]'
        }`}
        style={{
          borderRadius: isMobile ? '48px' : '28px',
          backgroundColor: isMobile ? surfaceColor : undefined,
          '--brand-primary':    primaryColor,
          '--brand-secondary':  secondaryColor,
          '--brand-surface':    surfaceColor,
          '--brand-text':       textColor,
          '--brand-accent':     accentColor,
          '--radius-curvature': radiusCurvature,
          fontFamily: fontStyle.body
        }}
      >
        {/* Desktop Browser Chrome: Only rendered in desktop view */}
        {!isMobile && (
          <div className="bg-[#faf9f6] border-b border-[#dbd7cd] px-4 sm:px-5 py-2.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-stone-300" />
              <span className="w-2.5 h-2.5 rounded-full bg-stone-300" />
              <span className="w-2.5 h-2.5 rounded-full bg-stone-300" />
            </div>

            <div className="px-5 py-1 rounded-full bg-white border border-[#dbd7cd] text-xs font-mono text-stone-600 max-w-xs truncate">
              {domainUrl}
            </div>

            <span className="text-xs uppercase font-mono tracking-wider text-stone-500 hidden sm:inline font-medium">
              {domainBadge}
            </span>
          </div>
        )}

        {/* Mobile Camera Notch / Dynamic Island Chassis */}
        {isMobile && (
          <div className="pt-2.5 pb-2 bg-[#222222] flex items-center justify-center shrink-0 z-20">
            <div className="w-24 h-4 bg-[#111111] rounded-full mx-auto shadow-inner flex items-center justify-end px-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1e293b]/70 inline-block" />
            </div>
          </div>
        )}

        {/* Inner Scrollable Viewport */}
        <div
          className={isMobile ? 'w-full max-w-full flex-1 overflow-x-hidden overflow-y-auto relative box-border [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden' : 'w-full max-w-full'}
          style={isMobile ? {
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
            backgroundColor: surfaceColor
          } : {}}
        >
          {archetype === 'retail_cpg'   && <RetailCpgPreview   {...sharedProps} />}
          {archetype === 'hospitality'  && <HospitalityPreview  {...sharedProps} />}
          {archetype === 'digital_saas' && <DigitalSaasPreview  {...sharedProps} />}
        </div>

        {/* Mobile Home Indicator Bar */}
        {isMobile && (
          <div className="py-2 bg-[#222222] flex items-center justify-center shrink-0 z-20">
            <div className="w-32 h-1 bg-[#444444] rounded-full mx-auto" />
          </div>
        )}
>>>>>>> dc9bada763cc7d97945289cc141d87886243899d
      </div>

      <PaletteTokenBar palette={palette} fontStyle={fontStyle} />
    </div>
  );
}

<<<<<<< HEAD
// ---------------------------------------------------------------------------
// 1. APPAREL & FASHION PREVIEW — PALETTE GROUNDED
// ---------------------------------------------------------------------------
function ApparelPreview({ brandStrategy, launchContent, theme, radiusCurvature, fontStyle, palette, isMobile }) {
  const brandName = brandStrategy?.brandName || 'Brand';

  return (
    <div
      className="flex flex-col justify-between transition-colors"
      style={{
        backgroundColor: theme.canvas,
        color: theme.text,
        padding: isMobile ? '20px' : '40px'
      }}
    >
      {/* Store Header Navigation */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b gap-4"
        style={{ borderBottomColor: theme.borderSubtle }}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl sm:text-3xl font-medium tracking-tight" style={{ fontFamily: fontStyle.display, color: theme.text }}>
            {brandName}
          </span>
          <span
            className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full border"
            style={{
              backgroundColor: theme.subtleBg,
              borderColor: theme.borderSubtle,
              color: theme.textMuted
            }}
          >
            Apparel & Goods
          </span>
        </div>
        <div className="flex items-center gap-5 text-xs" style={{ color: theme.textMuted }}>
          <span className="hover:opacity-100 cursor-pointer font-medium" style={{ color: theme.text }}>Collection</span>
          <span className="hover:opacity-100 cursor-pointer hidden sm:inline">Raw Selvedge</span>
          <span className="hover:opacity-100 cursor-pointer hidden md:inline">Our Fit Guide</span>
          <button
            className="px-5 py-2 text-xs font-medium transition-all hover:opacity-90 flex items-center gap-2 shadow-sm"
            style={{
              backgroundColor: theme.primary,
              color: theme.primaryText,
              borderRadius: radiusCurvature
            }}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{launchContent?.callToAction || 'Shop Collection'}</span>
          </button>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="max-w-3xl my-2">
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono mb-4 border"
          style={{
            backgroundColor: theme.accentTint,
            borderColor: theme.accentBorder,
            color: theme.text
          }}
        >
          <Scissors className="w-3 h-3" style={{ color: theme.accent }} />
          <span>SHUTTLE-LOOM CRAFT • ZERO SYNTHETIC STRETCH • LIFETIME REPAIRS</span>
        </div>
        <h2
          className="text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight leading-[1.08] mb-4"
          style={{ fontFamily: fontStyle.display, color: theme.text }}
        >
          {launchContent?.heroHeadline || 'Built to Fade. Made to Endure.'}
        </h2>
        <p
          className="text-base sm:text-lg max-w-2xl leading-relaxed mb-6"
          style={{ fontFamily: fontStyle.body, color: theme.textMuted }}
        >
          {launchContent?.heroSubheadline || brandStrategy?.coreValueProposition}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <button
            className="px-6 py-3 text-xs font-medium tracking-wide flex items-center gap-2 shadow-sm transition-all hover:opacity-90"
            style={{
              backgroundColor: theme.primary,
              color: theme.primaryText,
              borderRadius: radiusCurvature
            }}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{launchContent?.callToAction || 'Shop Collection'}</span>
          </button>
          <button
            className="px-6 py-3 text-xs font-medium border transition-all flex items-center gap-2 hover:opacity-90"
            style={{
              backgroundColor: theme.cardBg,
              borderColor: theme.border,
              color: theme.text,
              borderRadius: radiusCurvature
            }}
          >
            <span>Our Fit Guide</span>
            <ArrowRight className="w-3 h-3" style={{ color: theme.textSubtle }} />
          </button>
        </div>
      </div>

      {/* Section 1: Apparel Product Showcase */}
      <div className="my-8 pt-8 border-t" style={{ borderTopColor: theme.borderSubtle }}>
        <div className="flex items-center justify-between mb-4">
          <span className="text-[11px] uppercase font-mono tracking-widest font-semibold" style={{ color: theme.textSubtle }}>
            SIGNATURE EDITIONS & CORE PIECES
          </span>
          <span className="text-xs font-mono" style={{ color: theme.textSubtle }}>Small-Batch Production</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              name: 'Raw Selvedge Straight-Leg',
              price: '$185',
              desc: '14oz narrow-loom Japanese selvedge denim, custom solid copper hardware, and zero synthetic stretch.',
              tag: '14OZ TOYODA SHUTTLE LOOM'
            },
            {
              name: 'Relaxed Taper Work Pant',
              price: '$165',
              desc: 'Heavyweight organic cotton duck canvas, triple-needle chainstitch construction, reinforced pockets.',
              tag: 'HEAVYWEIGHT DUCK CANVAS'
            },
            {
              name: 'Type III Selvedge Jacket',
              price: '$245',
              desc: '15.5oz unwashed raw denim, vintage brass shank buttons, interior selvedge ID line, tailored boxy fit.',
              tag: 'HEIRLOOM 15.5OZ'
            }
          ].map(product => (
            <div
              key={product.name}
              className="p-5 border flex flex-col justify-between transition-all hover:scale-[1.01]"
              style={{
                backgroundColor: theme.cardBg,
                borderColor: theme.borderSubtle,
                borderRadius: radiusCurvature
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="text-base font-medium" style={{ fontFamily: fontStyle.display, color: theme.text }}>
                    {product.name}
                  </h4>
                  <span className="font-mono text-xs font-semibold" style={{ color: theme.primary }}>
                    {product.price}
                  </span>
                </div>
                <p className="text-xs leading-relaxed" style={{ fontFamily: fontStyle.body, color: theme.textMuted }}>
                  {product.desc}
                </p>
              </div>
              <span
                className="text-[10px] font-mono px-2 py-1 rounded w-fit mt-4 block border"
                style={{
                  backgroundColor: theme.subtleBg,
                  borderColor: theme.borderSubtle,
                  color: theme.textSubtle
                }}
              >
                {product.tag}
              </span>
=======
// =============================================================================
// SECTION DISPATCHER
// =============================================================================
function SectionDispatcher({
  sections,
  primaryColor,
  primaryContrast,
  secondaryColor,
  accentColor,
  radiusCurvature,
  fontStyle,
  brandStrategy,
  isDarkTheme = false,
  isMobile = false,
  headingTextColor = '#111111',
  bodyTextColor = '#4b5563',
  subtleTextColor = '#6b7280',
  cardBgColor = '#ffffff',
  cardBorderColor = '#dbd7cd'
}) {
  if (!sections || sections.length === 0) return null;
  return (
    <div className="space-y-8 mt-8 pt-8 border-t" style={{ borderColor: cardBorderColor }}>
      {sections.map((section, i) => {
        const common = {
          key: i,
          section,
          primaryColor,
          primaryContrast,
          secondaryColor,
          accentColor,
          radiusCurvature,
          fontStyle,
          isDarkTheme,
          isMobile,
          headingTextColor,
          bodyTextColor,
          subtleTextColor,
          cardBgColor,
          cardBorderColor
        };
        switch (section.type) {
          case 'catalog_grid':       return <CatalogGrid {...common} />;
          case 'ritual_steps':       return <RitualSteps {...common} />;
          case 'flavor_profile':     return <FlavorProfile {...common} />;
          case 'comparative_ledger': return <ComparativeLedger {...common} brandStrategy={brandStrategy} />;
          case 'press_quotes':       return <PressQuotes {...common} />;
          default:                   return <CatalogGrid {...common} />;
        }
      })}
    </div>
  );
}

// ─── Catalog Grid ────────────────────────────────────────────────────────────
function CatalogGrid({
  section,
  accentColor,
  radiusCurvature,
  fontStyle,
  isDarkTheme = false,
  isMobile = false,
  headingTextColor = '#111111',
  bodyTextColor = '#4b5563',
  subtleTextColor = '#6b7280',
  cardBgColor = '#ffffff',
  cardBorderColor = '#dbd7cd'
}) {
  const [addedItem, setAddedItem] = useState(null);
  const handleAdd = (label) => { setAddedItem(label); setTimeout(() => setAddedItem(null), 2000); };
  const cols = isMobile
    ? 'grid-cols-1'
    : (section.items?.length === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-3');

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs uppercase font-mono tracking-wider font-semibold" style={{ color: subtleTextColor }}>
          {section.title}
        </span>
        {section.subtitle && (
          <span className="text-xs font-mono" style={{ color: subtleTextColor }}>
            {section.subtitle}
          </span>
        )}
      </div>
      <div className={`grid ${cols} gap-4`}>
        {(section.items || []).map((item, i) => {
          const isAdded = addedItem === item.label;
          return (
            <div
              key={i}
              className="p-5 flex flex-col justify-between transition-all border"
              style={{
                borderRadius: radiusCurvature,
                backgroundColor: cardBgColor,
                borderColor: cardBorderColor
              }}
            >
              <div>
                <div className="flex items-start justify-between mb-1.5 gap-2">
                  <h4
                    className="text-sm font-medium leading-snug"
                    style={{ color: headingTextColor, fontFamily: fontStyle.display }}
                  >
                    {item.label}
                  </h4>
                  {/* Price highlighted in accent color */}
                  {item.metricOrPrice && (
                    <span
                      className="font-mono text-xs font-bold shrink-0 px-1.5 py-0.5 rounded"
                      style={{
                        backgroundColor: `${accentColor}18`,
                        color: accentColor,
                        border: isDarkTheme ? `1px solid ${accentColor}40` : 'none'
                      }}
                    >
                      {item.metricOrPrice}
                    </span>
                  )}
                </div>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: bodyTextColor, fontFamily: fontStyle.body }}
                >
                  {item.description}
                </p>
              </div>
              <div
                className="mt-4 pt-3 border-t flex items-center justify-between"
                style={{ borderColor: isDarkTheme ? cardBorderColor : '#f3f4f6' }}
              >
                {/* Tag badge using accent tint */}
                {item.tag && (
                  <span
                    className="text-xs font-mono px-2 py-1 rounded font-semibold"
                    style={{
                      backgroundColor: `${accentColor}15`,
                      color: accentColor,
                      border: isDarkTheme ? `1px solid ${accentColor}30` : 'none'
                    }}
                  >
                    {item.tag}
                  </span>
                )}
                <button
                  onClick={() => handleAdd(item.label)}
                  className="text-xs font-medium px-3 py-1.5 flex items-center gap-1 transition-all ml-auto border"
                  style={{
                    borderRadius: radiusCurvature,
                    borderColor: isAdded ? 'transparent' : (isDarkTheme ? cardBorderColor : `${accentColor}60`),
                    backgroundColor: isAdded ? `${accentColor}20` : 'transparent',
                    color: isAdded ? accentColor : headingTextColor
                  }}
                >
                  {isAdded
                    ? <><Check className="w-3 h-3" style={{ color: accentColor }} /><span>Added</span></>
                    : <><Plus className="w-3 h-3" style={{ color: subtleTextColor }} /><span>Add</span></>
                  }
                </button>
              </div>
>>>>>>> dc9bada763cc7d97945289cc141d87886243899d
            </div>
          );
        })}
      </div>
    </div>
  );
}

<<<<<<< HEAD
      {/* Section 2: Craftsmanship Pillars */}
      <div
        className="my-2 p-5 border flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{
          backgroundColor: theme.cardBg,
          borderColor: theme.border,
          borderRadius: radiusCurvature
        }}
      >
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 shrink-0" style={{ color: theme.accent }} />
          <div className="text-xs">
            <span className="font-semibold block" style={{ color: theme.text }}>The Zero-Obsolescence Vow</span>
            <span style={{ color: theme.textMuted }}>100% natural fibers, zero elastane blowout, and free lifetime repairs on all seams.</span>
          </div>
        </div>
        <span
          className="text-[11px] font-mono whitespace-nowrap px-3 py-1 rounded-full border"
          style={{
            backgroundColor: theme.subtleBg,
            borderColor: theme.borderSubtle,
            color: theme.textMuted
          }}
        >
          KOJIMA MILL SOURCING
=======
// ─── Ritual Steps ────────────────────────────────────────────────────────────
function RitualSteps({
  section,
  primaryColor,
  radiusCurvature,
  fontStyle,
  isMobile = false,
  headingTextColor = '#111111',
  bodyTextColor = '#4b5563',
  subtleTextColor = '#6b7280',
  cardBgColor = '#ffffff',
  cardBorderColor = '#dbd7cd'
}) {
  const cols = isMobile ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-3';
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs uppercase font-mono tracking-wider font-semibold" style={{ color: subtleTextColor }}>
          {section.title}
>>>>>>> dc9bada763cc7d97945289cc141d87886243899d
        </span>
        {section.subtitle && (
          <span className="text-xs font-mono" style={{ color: subtleTextColor }}>
            {section.subtitle}
          </span>
        )}
      </div>
<<<<<<< HEAD

      {/* Section 3: Strategic Narrative Footers */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t" style={{ borderTopColor: theme.borderSubtle }}>
        {[
          { label: '01 / The Textile Edge', value: brandStrategy?.differentiator },
          { label: '02 / Core Creative Audience', value: brandStrategy?.targetAudience },
          { label: '03 / Fast-Fashion Antidote', value: brandStrategy?.antiHero }
        ].map(card => (
          <div
            key={card.label}
            className="p-4 border"
            style={{
              backgroundColor: theme.cardBg,
              borderColor: theme.borderSubtle,
              borderRadius: radiusCurvature
            }}
          >
            <span className="text-[10px] uppercase font-mono block mb-1 font-semibold" style={{ color: theme.accent }}>
              {card.label}
            </span>
            <p className="text-xs font-medium leading-snug" style={{ color: theme.text }}>{card.value}</p>
=======
      <div className={`grid ${cols} gap-4`}>
        {(section.items || []).map((item, i) => (
          <div
            key={i}
            className="p-5 border transition-all"
            style={{
              backgroundColor: cardBgColor,
              borderColor: cardBorderColor,
              borderRadius: radiusCurvature
            }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold mb-3"
              style={{ backgroundColor: primaryColor, color: getContrastColor(primaryColor) }}
            >
              {String(i + 1).padStart(2, '0')}
            </div>
            <h4
              className="text-sm font-semibold mb-1.5"
              style={{ color: headingTextColor, fontFamily: fontStyle.display }}
            >
              {item.label}
            </h4>
            <p
              className="text-xs leading-relaxed"
              style={{ color: bodyTextColor, fontFamily: fontStyle.body }}
            >
              {item.description}
            </p>
            {item.metricOrPrice && (
              <span className="text-xs font-mono mt-3 block" style={{ color: subtleTextColor }}>
                {item.metricOrPrice}
              </span>
            )}
>>>>>>> dc9bada763cc7d97945289cc141d87886243899d
          </div>
        ))}
      </div>

      {/* Brand Website Footer */}
      <BrandWebsiteFooter brandStrategy={brandStrategy} theme={theme} palette={palette} fontStyle={fontStyle} isMobile={isMobile} />
    </div>
  );
}

<<<<<<< HEAD
// ---------------------------------------------------------------------------
// 2. HOSPITALITY & CULINARY PREVIEW — PALETTE GROUNDED
// ---------------------------------------------------------------------------
function HospitalityPreview({ brandStrategy, launchContent, theme, radiusCurvature, fontStyle, palette, isMobile }) {
  const brandName = brandStrategy?.brandName || 'Brand';

  return (
    <div
      className="flex flex-col justify-between transition-colors"
      style={{
        backgroundColor: theme.canvas,
        color: theme.text,
        padding: isMobile ? '20px' : '40px'
      }}
    >
      {/* Nav */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b gap-4"
        style={{ borderBottomColor: theme.borderSubtle }}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl sm:text-3xl font-light tracking-tight" style={{ fontFamily: fontStyle.display, color: theme.text }}>
            {brandName}
          </span>
          <span
            className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full border"
            style={{
              backgroundColor: theme.subtleBg,
              borderColor: theme.borderSubtle,
              color: theme.textMuted
            }}
          >
            Hospitality & Culinary
          </span>
        </div>
        <div className="flex items-center gap-5 text-xs" style={{ color: theme.textMuted }}>
          <span className="hover:opacity-100 cursor-pointer font-medium" style={{ color: theme.text }}>Daily Menu</span>
          <span className="hover:opacity-100 cursor-pointer hidden sm:inline">The Table</span>
          <span className="hover:opacity-100 cursor-pointer hidden md:inline">Private Dining</span>
          <button
            className="px-5 py-2 text-xs font-medium transition-all hover:opacity-90 shadow-sm"
            style={{
              backgroundColor: theme.primary,
              color: theme.primaryText,
              borderRadius: radiusCurvature
            }}
=======
// ─── Flavor Profile ──────────────────────────────────────────────────────────
function FlavorProfile({
  section,
  primaryColor,
  radiusCurvature,
  fontStyle,
  isDarkTheme = false,
  isMobile = false,
  headingTextColor = '#111111',
  bodyTextColor = '#4b5563',
  subtleTextColor = '#6b7280',
  cardBgColor = '#ffffff',
  cardBorderColor = '#dbd7cd'
}) {
  const icons = [<Droplets className="w-4 h-4" />, <Leaf className="w-4 h-4" />, <Sparkles className="w-4 h-4" />, <Zap className="w-4 h-4" />];
  const cols = isMobile ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-4';

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs uppercase font-mono tracking-wider font-semibold" style={{ color: subtleTextColor }}>
          {section.title}
        </span>
        {section.subtitle && (
          <span className="text-xs font-mono" style={{ color: subtleTextColor }}>
            {section.subtitle}
          </span>
        )}
      </div>
      <div className={`grid ${cols} gap-3`}>
        {(section.items || []).map((item, i) => (
          <div
            key={i}
            className="p-4 border text-center transition-all"
            style={{
              backgroundColor: cardBgColor,
              borderColor: cardBorderColor,
              borderRadius: radiusCurvature
            }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2"
              style={{
                backgroundColor: `${primaryColor}20`,
                color: isDarkTheme ? '#ffffff' : primaryColor
              }}
            >
              {icons[i % icons.length]}
            </div>
            <h4
              className="text-xs font-semibold mb-1"
              style={{ color: headingTextColor, fontFamily: fontStyle.display }}
            >
              {item.label}
            </h4>
            <p
              className="text-xs leading-relaxed"
              style={{ color: bodyTextColor, fontFamily: fontStyle.body }}
            >
              {item.description}
            </p>
            {item.tag && (
              <span className="text-xs font-mono mt-2 block" style={{ color: subtleTextColor }}>
                {item.tag}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Comparative Ledger ──────────────────────────────────────────────────────
function ComparativeLedger({
  section,
  brandStrategy,
  radiusCurvature,
  isDarkTheme = false,
  isMobile = false,
  headingTextColor = '#111111',
  subtleTextColor = '#6b7280',
  cardBgColor = '#ffffff',
  cardBorderColor = '#dbd7cd'
}) {
  const items   = section.items || [];
  const half    = Math.ceil(items.length / 2);
  const ours    = items.slice(0, half);
  const theirs  = items.slice(half);
  const cols    = isMobile ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2';

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold uppercase font-mono tracking-wider" style={{ color: subtleTextColor }}>
          {section.title}
        </span>
        {section.subtitle && (
          <span className="text-xs font-mono" style={{ color: subtleTextColor }}>
            {section.subtitle}
          </span>
        )}
      </div>
      <div className={`grid ${cols} gap-4`}>
        {/* Brand column */}
        <div
          className="p-5 transition-all"
          style={{
            borderRadius: radiusCurvature,
            backgroundColor: cardBgColor,
            borderColor: isDarkTheme ? 'rgba(255, 255, 255, 0.4)' : '#000000',
            borderWidth: '2px',
            borderStyle: 'solid'
          }}
        >
          <span
            className="text-xs uppercase font-mono tracking-wider font-bold block mb-3"
            style={{ color: headingTextColor }}
          >
            {brandStrategy?.brandName || 'This Brand'}
          </span>
          <div className="space-y-2.5">
            {(ours.length > 0 ? ours : items).map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 mt-0.5 text-emerald-500 shrink-0" />
                <div>
                  <span className="text-sm font-semibold block" style={{ color: headingTextColor }}>
                    {item.label}
                  </span>
                  {item.description && (
                    <span className="text-xs" style={{ color: subtleTextColor }}>
                      {item.description}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Industry default column */}
        <div
          className="p-5 border transition-all"
          style={{
            borderRadius: radiusCurvature,
            backgroundColor: isDarkTheme ? 'rgba(0, 0, 0, 0.25)' : '#faf8f5',
            borderColor: cardBorderColor
          }}
        >
          <span
            className="text-xs uppercase font-mono tracking-wider font-semibold block mb-3"
            style={{ color: subtleTextColor }}
          >
            The Industry Default
          </span>
          <div className="space-y-2.5">
            {(theirs.length > 0 ? theirs : [{ label: brandStrategy?.antiHero || 'Generic compromise', description: '' }]).map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <span
                  className="w-3.5 h-px mt-2 shrink-0"
                  style={{ backgroundColor: subtleTextColor }}
                />
                <div>
                  <span
                    className="text-sm font-medium block line-through"
                    style={{
                      color: subtleTextColor,
                      textDecorationColor: subtleTextColor
                    }}
                  >
                    {item.label}
                  </span>
                  {item.description && (
                    <span className="text-xs" style={{ color: subtleTextColor }}>
                      {item.description}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Press Quotes ────────────────────────────────────────────────────────────
function PressQuotes({
  section,
  radiusCurvature,
  fontStyle,
  isMobile = false,
  headingTextColor = '#111111',
  subtleTextColor = '#6b7280',
  cardBgColor = '#ffffff',
  cardBorderColor = '#dbd7cd'
}) {
  const cols = isMobile ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2';
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs uppercase font-mono tracking-wider font-semibold" style={{ color: subtleTextColor }}>
          {section.title}
        </span>
      </div>
      <div className={`grid ${cols} gap-4`}>
        {(section.items || []).map((item, i) => (
          <div
            key={i}
            className="p-5 border transition-all"
            style={{
              backgroundColor: cardBgColor,
              borderColor: cardBorderColor,
              borderRadius: radiusCurvature || '16px'
            }}
          >
            <Quote className="w-5 h-5 mb-3" style={{ color: subtleTextColor }} />
            <p
              className="text-sm leading-relaxed italic mb-3"
              style={{ color: headingTextColor, fontFamily: fontStyle.display }}
            >
              "{item.description}"
            </p>
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-full shrink-0"
                style={{ backgroundColor: isDarkTheme ? 'rgba(255, 255, 255, 0.15)' : '#e5e7eb' }}
              />
              <div>
                <span className="text-xs font-semibold block" style={{ color: headingTextColor }}>
                  {item.label}
                </span>
                {item.tag && (
                  <span className="text-xs font-mono" style={{ color: subtleTextColor }}>
                    {item.tag}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// ARCHETYPE A: PHYSICAL CPG & RETAIL
// =============================================================================
function RetailCpgPreview({
  brandStrategy,
  launchContent,
  voiceSystem,
  blueprint,
  primaryColor,
  primaryContrast,
  secondaryColor,
  secondaryContrast,
  accentColor,
  surfaceColor,
  textColor,
  radiusCurvature,
  fontStyle,
  isMobile = false
}) {
  const isDarkTheme = isDarkColor(surfaceColor);
  const headingTextColor = isDarkTheme ? '#ffffff' : (textColor || '#111111');
  const bodyTextColor    = isDarkTheme ? '#d1d5db' : '#4b5563';
  const subtleTextColor  = isDarkTheme ? '#9ca3af' : '#6b7280';
  const cardBgColor      = isDarkTheme ? 'rgba(255, 255, 255, 0.05)' : '#ffffff';
  const cardBorderColor  = isDarkTheme ? 'rgba(255, 255, 255, 0.12)' : '#dbd7cd';

  const brandName    = brandStrategy?.brandName || 'Brand';
  const badge        = blueprint?.badge || voiceSystem?.archetype || 'Retail & CPG';
  const annBar       = blueprint?.announcementBar || 'Free standard shipping on orders over $50 · 100% satisfaction guarantee';
  const primaryCta   = blueprint?.primaryCta || launchContent?.callToAction || 'Shop Now';
  const secondaryCta = blueprint?.secondaryCta || 'Craft & Sourcing Story';

  const ghostBorderColor = isDarkTheme
    ? (isDarkColor(secondaryColor) ? 'rgba(255, 255, 255, 0.3)' : secondaryColor)
    : secondaryColor;
  const ghostTextColor = isDarkTheme
    ? (isDarkColor(secondaryColor) ? '#ffffff' : secondaryColor)
    : secondaryColor;

  return (
    <div
      className={`w-full max-w-full box-border min-h-[580px] flex flex-col transition-all overflow-x-hidden ${
        isMobile ? 'p-4 sm:p-6' : 'p-6 sm:p-12'
      }`}
      style={{ backgroundColor: surfaceColor }}
    >
      {/* Stacked Header Layout (Zero Clipping) */}
      <div className="pb-4 mb-6 border-b space-y-3" style={{ borderColor: cardBorderColor }}>
        {/* Row 1: Brand Name (Prominent Display, Full Width) */}
        <div className="w-full">
          <span
            className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight block truncate"
            style={{ color: headingTextColor, fontFamily: fontStyle.display }}
          >
            {brandName}
          </span>
        </div>

        {/* Row 2: Sub-Nav Links & Action CTA */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-3 sm:gap-5 text-xs font-medium" style={{ color: bodyTextColor }}>
            <span className="cursor-pointer hover:opacity-80 transition-opacity">Products</span>
            <span className="cursor-pointer hover:opacity-80 transition-opacity">Craft</span>
            <span className="cursor-pointer hover:opacity-80 transition-opacity hidden sm:inline">Stockists</span>
          </div>
          <button
            className="px-3.5 py-1.5 text-xs font-medium flex items-center gap-1.5 shrink-0 rounded-full transition-opacity hover:opacity-90 shadow-2xs"
            style={{ backgroundColor: primaryColor, color: primaryContrast }}
>>>>>>> dc9bada763cc7d97945289cc141d87886243899d
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="text-xs">Bag (0)</span>
          </button>
        </div>
      </div>

<<<<<<< HEAD
      {/* Location pill */}
      <div
        className="flex items-center gap-2 text-[11px] font-mono mb-6 px-3.5 py-1.5 rounded-full border w-fit"
        style={{
          backgroundColor: theme.cardBg,
          borderColor: theme.borderSubtle,
          color: theme.textMuted
        }}
      >
        <MapPin className="w-3.5 h-3.5" style={{ color: theme.accent }} />
        <span>Neighborhood Dining • Wed–Sun 4pm–10pm • Walk-ins & Tables Welcome</span>
      </div>

      {/* Hero headline & story */}
      <div className="max-w-3xl my-2">
        <h2
          className="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight leading-[1.08] mb-4"
          style={{ fontFamily: fontStyle.display, color: theme.text }}
        >
          {launchContent?.heroHeadline || 'Big Tables. Honest Slices. Bring Everyone.'}
        </h2>
        <p
          className="text-base sm:text-lg max-w-2xl leading-relaxed mb-6"
          style={{ fontFamily: fontStyle.body, color: theme.textMuted }}
        >
          {launchContent?.heroSubheadline || brandStrategy?.coreValueProposition}
=======
      {/* Announcement bar — accent tint */}
      <div
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium mb-6 self-start max-w-full font-mono"
        style={{ backgroundColor: `${accentColor}15`, border: `1px solid ${accentColor}40`, color: accentColor }}
      >
        <Sparkles className="w-3 h-3 shrink-0" style={{ color: accentColor }} />
        <span className="uppercase tracking-wide truncate">{annBar}</span>
      </div>

      {/* Hero */}
      <div className="max-w-3xl mb-6">
        <h2
          className={`font-normal tracking-tight leading-[1.08] mb-4 ${
            isMobile ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-5xl md:text-6xl'
          }`}
          style={{ color: headingTextColor, fontFamily: fontStyle.display }}
        >
          {launchContent.heroHeadline || 'Crafted for Pure Impact.'}
        </h2>
        <p
          className={`max-w-2xl leading-relaxed mb-6 ${isMobile ? 'text-sm' : 'text-base sm:text-lg'}`}
          style={{ color: bodyTextColor, fontFamily: fontStyle.body }}
        >
          {launchContent.heroSubheadline || brandStrategy.coreValueProposition}
>>>>>>> dc9bada763cc7d97945289cc141d87886243899d
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <button
            className="px-6 py-3 text-xs font-medium tracking-wide flex items-center gap-2 shadow-sm transition-all hover:opacity-90"
<<<<<<< HEAD
            style={{
              backgroundColor: theme.primary,
              color: theme.primaryText,
              borderRadius: radiusCurvature
            }}
=======
            style={{ backgroundColor: primaryColor, color: primaryContrast, borderRadius: radiusCurvature }}
>>>>>>> dc9bada763cc7d97945289cc141d87886243899d
          >
            <ShoppingBag className="w-3.5 h-3.5" /><span>{primaryCta}</span>
          </button>
          {/* Secondary color on ghost CTA */}
          <button
<<<<<<< HEAD
            className="px-6 py-3 text-xs font-medium border transition-all flex items-center gap-2 hover:opacity-90"
            style={{
              backgroundColor: theme.cardBg,
              borderColor: theme.border,
              color: theme.text,
              borderRadius: radiusCurvature
            }}
          >
            <Clock className="w-3.5 h-3.5" style={{ color: theme.accent }} />
            <span>Order Ahead</span>
          </button>
          <button
            className="px-6 py-3 text-xs transition-all flex items-center gap-2 hover:opacity-90"
            style={{ color: theme.accent }}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>View Daily Menu</span>
=======
            className="px-6 py-3 text-xs font-medium transition-all flex items-center gap-2"
            style={{
              borderRadius: radiusCurvature,
              border: `1.5px solid ${ghostBorderColor}`,
              color: ghostTextColor,
              background: 'transparent'
            }}
          >
            <span>{secondaryCta}</span>
            <ArrowRight className="w-3 h-3" style={{ color: ghostTextColor }} />
>>>>>>> dc9bada763cc7d97945289cc141d87886243899d
          </button>
        </div>
      </div>

<<<<<<< HEAD
      {/* Daily menu board */}
      <div className="my-8 pt-8 border-t" style={{ borderTopColor: theme.borderSubtle }}>
        <div className="flex items-center justify-between mb-4">
          <span className="text-[11px] uppercase font-mono tracking-widest font-semibold" style={{ color: theme.textSubtle }}>
            SEASONAL HIGHLIGHTS & SPECIALS
          </span>
          <span className="text-xs font-mono" style={{ color: theme.textSubtle }}>Daily Board</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              name: 'House Signature Dish',
              price: '$18',
              desc: 'Prepared fresh daily with locally sourced seasonal ingredients and zero shortcuts.',
              tag: 'CHEF FAVORITE'
            },
            {
              name: 'Wood-Fired Special',
              price: '$22',
              desc: 'High-heat blistering technique, hand-crafted seasonings, and rich savory finish.',
              tag: 'NEIGHBORHOOD STAPLE'
            },
            {
              name: 'Seasonal Sharing Platter',
              price: '$14',
              desc: 'Generous sharing portion built for the table, crisp herbs, and house-made dressing.',
              tag: 'TABLE SHARING'
            }
          ].map(item => (
            <div
              key={item.name}
              className="p-5 border flex flex-col justify-between transition-all hover:scale-[1.01]"
              style={{
                backgroundColor: theme.cardBg,
                borderColor: theme.borderSubtle,
                borderRadius: radiusCurvature
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="text-base font-medium" style={{ fontFamily: fontStyle.display, color: theme.text }}>
                    {item.name}
                  </h4>
                  <span className="font-mono text-xs font-semibold" style={{ color: theme.primary }}>
                    {item.price}
                  </span>
                </div>
                <p className="text-xs leading-relaxed" style={{ fontFamily: fontStyle.body, color: theme.textMuted }}>
                  {item.desc}
                </p>
              </div>
              <span className="text-[10px] font-mono mt-4 block font-semibold" style={{ color: theme.accent }}>
                {item.tag}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t" style={{ borderTopColor: theme.borderSubtle }}>
        {[
          { label: '01 / The Distinct Edge', value: brandStrategy?.differentiator },
          { label: '02 / Core Guest Profile', value: brandStrategy?.targetAudience },
          { label: '03 / Standard We Break', value: brandStrategy?.antiHero }
        ].map(card => (
          <div
            key={card.label}
            className="p-4 border"
            style={{
              backgroundColor: theme.cardBg,
              borderColor: theme.borderSubtle,
              borderRadius: radiusCurvature
            }}
          >
            <span className="text-[10px] uppercase font-mono block mb-1 font-semibold" style={{ color: theme.accent }}>
              {card.label}
            </span>
            <p className="text-xs font-medium leading-snug" style={{ color: theme.text }}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Brand Website Footer */}
      <BrandWebsiteFooter brandStrategy={brandStrategy} theme={theme} palette={palette} fontStyle={fontStyle} isMobile={isMobile} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// 3. DEVELOPER TOOLS & SAAS PREVIEW — PALETTE GROUNDED
// ---------------------------------------------------------------------------
function DeveloperPreview({ brandStrategy, launchContent, cleanName, theme, radiusCurvature, fontStyle, palette, isMobile }) {
  const brandName = brandStrategy?.brandName || 'Brand';
  return (
    <div
      className="flex flex-col justify-between transition-colors"
      style={{
        backgroundColor: theme.canvas,
        color: theme.text,
        padding: isMobile ? '20px' : '44px'
      }}
    >
      {/* Nav */}
      <div
        className="flex items-center justify-between pb-6 mb-6 border-b"
        style={{ borderBottomColor: theme.borderSubtle }}
      >
        <div className="flex items-center gap-3">
          <span className="font-mono text-xl font-bold tracking-tight" style={{ color: theme.text }}>
            {brandName}
          </span>
          <div className="flex items-center gap-1.5">
            <span
              className="text-[10px] font-mono px-2 py-0.5 rounded border"
              style={{
                backgroundColor: theme.subtleBg,
                borderColor: theme.borderSubtle,
                color: theme.textMuted
              }}
            >
              v1.2.0
            </span>
            <span
              className="text-[10px] font-mono px-2 py-0.5 rounded border"
              style={{
                backgroundColor: theme.accentTint,
                borderColor: theme.accentBorder,
                color: theme.accent
              }}
            >
              Zero Config
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono" style={{ color: theme.textMuted }}>
          <span className="hover:opacity-100 cursor-pointer">Docs</span>
          <span className="hover:opacity-100 cursor-pointer hidden sm:inline">Benchmarks</span>
          <span className="hover:opacity-100 cursor-pointer hidden md:inline">GitHub ★ 2.4k</span>
          <button
            className="px-4 py-1.5 text-xs font-mono font-medium shadow-sm transition-all hover:opacity-90"
            style={{
              backgroundColor: theme.primary,
              color: theme.primaryText,
              borderRadius: radiusCurvature
            }}
          >
            {launchContent?.callToAction || 'Install'}
          </button>
        </div>
      </div>

      {/* Hero */}
      <div className="max-w-3xl my-6">
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {['Rust-Engine', 'Sub-1ms Latency', 'Single Binary'].map(tag => (
            <span
              key={tag}
              className="text-[10px] font-mono px-2.5 py-0.5 rounded border"
              style={{
                backgroundColor: theme.subtleBg,
                borderColor: theme.borderSubtle,
                color: theme.textMuted
              }}
            >
              {tag}
            </span>
          ))}
        </div>
        <h2
          className="text-3xl sm:text-5xl font-mono font-bold tracking-tight leading-tight mb-4"
          style={{ fontFamily: fontStyle.display, color: theme.text }}
        >
          {launchContent?.heroHeadline}
        </h2>
        <p
          className="text-sm sm:text-base leading-relaxed mb-6"
          style={{ fontFamily: fontStyle.body, color: theme.textMuted }}
        >
          {launchContent?.heroSubheadline || brandStrategy?.coreValueProposition}
        </p>

        {/* Terminal install */}
        <div
          className="p-4 border font-mono text-xs space-y-1 mb-6"
          style={{
            backgroundColor: theme.cardBgElevated,
            borderColor: theme.border,
            borderRadius: radiusCurvature
          }}
        >
          <div className="text-[10px]" style={{ color: theme.textSubtle }}>
            // Install CLI & compile bare-metal engine
          </div>
          <div className="flex items-center justify-between">
            <code style={{ color: theme.accent }}>$ curl -fsSL https://{cleanName}.dev/install.sh | sh</code>
            <button className="text-[10px] hover:opacity-100 transition-opacity" style={{ color: theme.textMuted }}>
              copy
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="px-6 py-2.5 text-sm font-mono font-medium shadow-sm transition-all hover:opacity-90"
            style={{
              backgroundColor: theme.primary,
              color: theme.primaryText,
              borderRadius: radiusCurvature
            }}
          >
            Get Started →
          </button>
          <a
            href="#"
            className="text-sm hover:underline transition-colors font-mono"
            style={{ color: theme.accent }}
          >
            Read Docs ↗
          </a>
        </div>
      </div>

      {/* Bottom cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t" style={{ borderTopColor: theme.borderSubtle }}>
        {[
          { label: '01 / Engine Differentiator', value: brandStrategy?.differentiator },
          { label: '02 / Target Systems User',   value: brandStrategy?.targetAudience },
          { label: '03 / Legacy Bloat Eliminated', value: brandStrategy?.antiHero }
        ].map(card => (
          <div
            key={card.label}
            className="p-4 border"
            style={{
              backgroundColor: theme.cardBg,
              borderColor: theme.borderSubtle,
              borderRadius: radiusCurvature
            }}
          >
            <span className="text-[10px] uppercase font-mono block mb-1 font-semibold" style={{ color: theme.accent }}>
              {card.label}
            </span>
            <p className="text-xs font-mono leading-snug" style={{ color: theme.text }}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Brand Website Footer */}
      <BrandWebsiteFooter brandStrategy={brandStrategy} theme={theme} palette={palette} fontStyle={fontStyle} isMobile={isMobile} />
=======
      {/* ── Body Sections ── */}
      {(() => {
        const sections = blueprint?.sections || [];
        const hasManySections = sections.length > 1;
        return (
          <>
            {/* Always dispatch whatever the LLM returned */}
            {sections.length > 0 && (
              <SectionDispatcher
                sections={sections}
                primaryColor={primaryColor}
                primaryContrast={primaryContrast}
                secondaryColor={secondaryColor}
                accentColor={accentColor}
                radiusCurvature={radiusCurvature}
                fontStyle={fontStyle}
                brandStrategy={brandStrategy}
                isDarkTheme={isDarkTheme}
                isMobile={isMobile}
                headingTextColor={headingTextColor}
                bodyTextColor={bodyTextColor}
                subtleTextColor={subtleTextColor}
                cardBgColor={cardBgColor}
                cardBorderColor={cardBorderColor}
              />
            )}

            {/* If only 0–1 sections came back, pad with an inline comparative ledger */}
            {!hasManySections && (
              <div className="mt-8 pt-8 border-t space-y-6" style={{ borderColor: cardBorderColor }}>
                {/* Comparative Positioning Ledger */}
                <div>
                  <span className="text-xs font-semibold uppercase font-mono tracking-wider block mb-4" style={{ color: subtleTextColor }}>
                    THE STANDARD WE REJECT
                  </span>
                  <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
                    {/* Brand side */}
                    <div
                      className="p-5 transition-all"
                      style={{
                        borderRadius: radiusCurvature,
                        backgroundColor: cardBgColor,
                        borderColor: isDarkTheme ? 'rgba(255, 255, 255, 0.4)' : '#000000',
                        borderWidth: '2px',
                        borderStyle: 'solid'
                      }}
                    >
                      <span
                        className="text-xs uppercase font-mono tracking-wider font-bold block mb-3"
                        style={{ color: headingTextColor }}
                      >
                        {brandName}
                      </span>
                      <div className="space-y-2">
                        {[
                          { label: brandStrategy.differentiator || 'Pure-grade formulation', desc: 'Our core promise' },
                          { label: 'Fully transparent ingredient sourcing', desc: 'Independently verified' },
                          { label: 'Compostable & zero-waste packaging', desc: 'Built-in from day one' }
                        ].map((row, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 mt-0.5 text-emerald-500 shrink-0" />
                            <div>
                              <span className="text-sm font-semibold block" style={{ color: headingTextColor }}>
                                {row.label}
                              </span>
                              <span className="text-xs" style={{ color: subtleTextColor }}>
                                {row.desc}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Anti-hero side */}
                    <div
                      className="p-5 border transition-all"
                      style={{
                        borderRadius: radiusCurvature,
                        backgroundColor: isDarkTheme ? 'rgba(0, 0, 0, 0.25)' : '#faf8f5',
                        borderColor: cardBorderColor
                      }}
                    >
                      <span
                        className="text-xs uppercase font-mono tracking-wider font-semibold block mb-3"
                        style={{ color: subtleTextColor }}
                      >
                        The Industry Default
                      </span>
                      <div className="space-y-2">
                        {[
                          { label: brandStrategy.antiHero || 'Generic compromise' },
                          { label: 'Opaque supply chains and recycled buzzwords' },
                          { label: 'Plastic excess and greenwashing' }
                        ].map((row, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="w-3.5 h-px mt-2 shrink-0" style={{ backgroundColor: subtleTextColor }} />
                            <span
                              className="text-sm font-medium line-through"
                              style={{
                                color: subtleTextColor,
                                textDecorationColor: subtleTextColor
                              }}
                            >
                              {row.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Craft / Mission Pillars */}
                <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-3'}`}>
                  {[
                    { label: '01 / Sourcing & Craft',      value: brandStrategy.coreValueProposition || 'Uncompromising formulation' },
                    { label: '02 / Customer Commitment',   value: brandStrategy.targetAudience      || 'Discerning enthusiasts' },
                    { label: '03 / The Standard We Reject', value: brandStrategy.antiHero            || 'Disposable shortcuts' }
                  ].map(card => (
                    <div
                      key={card.label}
                      className="p-4 border transition-all"
                      style={{
                        borderRadius: radiusCurvature,
                        backgroundColor: cardBgColor,
                        borderColor: cardBorderColor
                      }}
                    >
                      <span className="text-xs uppercase font-mono font-semibold tracking-wider block mb-1" style={{ color: subtleTextColor }}>
                        {card.label}
                      </span>
                      <p className="text-sm font-medium leading-relaxed" style={{ color: headingTextColor }}>
                        {card.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Fallback base grid when no blueprint at all */}
            {sections.length === 0 && (
              <div className={`grid gap-4 pt-8 border-t mt-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-3'}`} style={{ borderColor: cardBorderColor }}>
                {[
                  { label: '01 / Product Moat',          value: brandStrategy.differentiator || 'Pure-grade formulation' },
                  { label: '02 / Target Consumer',        value: brandStrategy.targetAudience || 'Discerning enthusiasts' },
                  { label: '03 / Industry Flaw Rejected', value: brandStrategy.antiHero      || 'Disposable shortcuts' }
                ].map(card => (
                  <div
                    key={card.label}
                    className="p-4 border transition-all"
                    style={{
                      borderRadius: radiusCurvature,
                      backgroundColor: cardBgColor,
                      borderColor: cardBorderColor
                    }}
                  >
                    <span className="text-xs uppercase font-mono font-semibold tracking-wider block mb-1" style={{ color: subtleTextColor }}>
                      {card.label}
                    </span>
                    <p className="text-sm font-medium leading-relaxed" style={{ color: headingTextColor }}>
                      {card.value}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </>
        );
      })()}

      {/* ── Editorial In-Frame Footer ── */}
      <div
        className="mt-10 pt-5 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
        style={{ borderColor: cardBorderColor }}
      >
        <div>
          <span
            className="text-sm font-medium block"
            style={{ color: headingTextColor, fontFamily: fontStyle.display }}
          >
            {brandName}
          </span>
          <span className="text-xs font-mono" style={{ color: subtleTextColor }}>
            {brandStrategy.tagline || launchContent.heroHeadline || ''}
          </span>
        </div>
        <div className={`flex items-center text-xs font-mono ${isMobile ? 'flex-col items-start gap-1.5' : 'gap-4'}`} style={{ color: subtleTextColor }}>
          <span className="hover:opacity-80 cursor-pointer">Shipping & Returns</span>
          <span className="hover:opacity-80 cursor-pointer">Wholesale Inquiries</span>
          <span className="hover:opacity-80 cursor-pointer">Ingredient Transparency</span>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// ARCHETYPE B: HOSPITALITY & DINING
// =============================================================================
function HospitalityPreview({
  brandStrategy,
  launchContent,
  voiceSystem,
  blueprint,
  primaryColor,
  primaryContrast,
  secondaryColor,
  secondaryContrast,
  accentColor,
  surfaceColor,
  textColor,
  radiusCurvature,
  fontStyle,
  isMobile = false
}) {
  const isDarkTheme = isDarkColor(surfaceColor);
  const headingTextColor = isDarkTheme ? '#ffffff' : (textColor || '#111111');
  const bodyTextColor    = isDarkTheme ? '#d1d5db' : '#4b5563';
  const subtleTextColor  = isDarkTheme ? '#9ca3af' : '#6b7280';
  const cardBgColor      = isDarkTheme ? 'rgba(255, 255, 255, 0.05)' : '#ffffff';
  const cardBorderColor  = isDarkTheme ? 'rgba(255, 255, 255, 0.12)' : '#dbd7cd';

  const brandName    = brandStrategy?.brandName || 'Brand';
  const badge        = blueprint?.badge || voiceSystem?.archetype || 'Hospitality & Dining';
  const annBar       = blueprint?.announcementBar || 'Open Daily from 5:00 PM · Walk-ins & Communal Tables Welcome';
  const primaryCta   = blueprint?.primaryCta  || launchContent?.callToAction || 'Reserve Table';
  const secondaryCta = blueprint?.secondaryCta || "View Tonight's Menu";

  const ghostBorderColor = isDarkTheme
    ? (isDarkColor(secondaryColor) ? 'rgba(255, 255, 255, 0.3)' : secondaryColor)
    : secondaryColor;
  const ghostTextColor = isDarkTheme
    ? (isDarkColor(secondaryColor) ? '#ffffff' : secondaryColor)
    : secondaryColor;

  return (
    <div
      className={`w-full max-w-full box-border min-h-[560px] flex flex-col transition-all overflow-x-hidden ${
        isMobile ? 'p-4 sm:p-6' : 'p-6 sm:p-12'
      }`}
      style={{ backgroundColor: surfaceColor }}
    >
      {/* Stacked Header Layout (Zero Clipping) */}
      <div className="pb-4 mb-6 border-b space-y-3" style={{ borderColor: cardBorderColor }}>
        {/* Row 1: Brand Name (Prominent Display, Full Width) */}
        <div className="w-full">
          <span
            className="text-2xl sm:text-3xl md:text-4xl font-light tracking-tight block truncate"
            style={{ color: headingTextColor, fontFamily: fontStyle.display }}
          >
            {brandName}
          </span>
        </div>

        {/* Row 2: Sub-Nav Links & Action CTA */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-3 sm:gap-5 text-xs font-medium" style={{ color: bodyTextColor }}>
            <span className="cursor-pointer hover:opacity-80 transition-opacity">Daily Menu</span>
            <span className="cursor-pointer hover:opacity-80 transition-opacity">Private Dining</span>
            <span className="cursor-pointer hover:opacity-80 transition-opacity hidden sm:inline">Hours</span>
          </div>
          <button
            className="px-3.5 py-1.5 text-xs font-medium flex items-center gap-1.5 shrink-0 rounded-full transition-opacity hover:opacity-90 shadow-2xs"
            style={{ backgroundColor: primaryColor, color: primaryContrast }}
          >
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs">{primaryCta || 'Reserve'}</span>
          </button>
        </div>
      </div>

      {/* Announcement ribbon — accent tint */}
      <div
        className="inline-flex items-center gap-2 text-xs font-medium font-mono mb-6 px-3.5 py-1.5 rounded-full w-fit max-w-full"
        style={{ backgroundColor: `${accentColor}15`, border: `1px solid ${accentColor}40`, color: accentColor }}
      >
        <Clock className="w-3.5 h-3.5 shrink-0" style={{ color: accentColor }} />
        <span className="truncate">{annBar}</span>
      </div>

      <div className="max-w-3xl mb-6">
        <h2
          className={`font-light tracking-tight leading-[1.08] mb-4 ${
            isMobile ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-5xl md:text-6xl'
          }`}
          style={{ color: headingTextColor, fontFamily: fontStyle.display }}
        >
          {launchContent.heroHeadline || 'Honest Plates. Natural Pours. Welcome In.'}
        </h2>
        <p
          className={`max-w-2xl leading-relaxed mb-6 ${isMobile ? 'text-sm' : 'text-base sm:text-lg'}`}
          style={{ color: bodyTextColor, fontFamily: fontStyle.body }}
        >
          {launchContent.heroSubheadline || brandStrategy.coreValueProposition}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <button
            className="px-6 py-3 text-xs font-medium tracking-wide flex items-center gap-2 shadow-sm transition-all hover:opacity-90"
            style={{ backgroundColor: primaryColor, color: primaryContrast, borderRadius: radiusCurvature }}
          >
            <Utensils className="w-3.5 h-3.5" /><span>{primaryCta}</span>
          </button>
          <button
            className="px-6 py-3 text-xs font-medium transition-all flex items-center gap-2"
            style={{
              borderRadius: radiusCurvature,
              border: `1.5px solid ${ghostBorderColor}`,
              color: ghostTextColor,
              background: 'transparent'
            }}
          >
            <Calendar className="w-3.5 h-3.5" style={{ color: ghostTextColor }} />
            <span>{secondaryCta}</span>
          </button>
        </div>
      </div>

      {/* ── Body Sections ── */}
      {(() => {
        const sections = blueprint?.sections || [];
        const hasManySections = sections.length > 1;
        return (
          <>
            {sections.length > 0 && (
              <SectionDispatcher
                sections={sections}
                primaryColor={primaryColor}
                primaryContrast={primaryContrast}
                secondaryColor={secondaryColor}
                accentColor={accentColor}
                radiusCurvature={radiusCurvature}
                fontStyle={fontStyle}
                brandStrategy={brandStrategy}
                isDarkTheme={isDarkTheme}
                isMobile={isMobile}
                headingTextColor={headingTextColor}
                bodyTextColor={bodyTextColor}
                subtleTextColor={subtleTextColor}
                cardBgColor={cardBgColor}
                cardBorderColor={cardBorderColor}
              />
            )}

            {!hasManySections && (
              <div className="mt-8 pt-8 border-t space-y-6" style={{ borderColor: cardBorderColor }}>
                {/* Tonight's culinary philosophy ledger */}
                <div>
                  <span className="text-xs font-semibold uppercase font-mono tracking-wider block mb-4" style={{ color: subtleTextColor }}>
                    OUR KITCHEN PHILOSOPHY
                  </span>
                  <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
                    <div
                      className="p-5 transition-all"
                      style={{
                        borderRadius: radiusCurvature,
                        backgroundColor: cardBgColor,
                        borderColor: isDarkTheme ? 'rgba(255, 255, 255, 0.4)' : '#000000',
                        borderWidth: '2px',
                        borderStyle: 'solid'
                      }}
                    >
                      <span
                        className="text-xs uppercase font-mono tracking-wider font-bold block mb-3"
                        style={{ color: headingTextColor }}
                      >
                        {brandName}
                      </span>
                      <div className="space-y-2">
                        {[
                          { label: brandStrategy.differentiator || 'Heritage grain sourcing', desc: 'Our culinary moat' },
                          { label: 'Seasonal supplier partnerships, updated weekly', desc: 'From named local farms' },
                          { label: 'Zero industrial additives or stabilisers', desc: 'In every plate, every service' }
                        ].map((row, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 mt-0.5 text-emerald-500 shrink-0" />
                            <div>
                              <span className="text-sm font-semibold block" style={{ color: headingTextColor }}>
                                {row.label}
                              </span>
                              <span className="text-xs" style={{ color: subtleTextColor }}>
                                {row.desc}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div
                      className="p-5 border transition-all"
                      style={{
                        borderRadius: radiusCurvature,
                        backgroundColor: isDarkTheme ? 'rgba(0, 0, 0, 0.25)' : '#faf8f5',
                        borderColor: cardBorderColor
                      }}
                    >
                      <span
                        className="text-xs uppercase font-mono tracking-wider font-semibold block mb-3"
                        style={{ color: subtleTextColor }}
                      >
                        The Industry Default
                      </span>
                      <div className="space-y-2">
                        {[
                          { label: brandStrategy.antiHero || 'Rushed, industrialised dining' },
                          { label: 'Frozen or par-cooked mass-produced proteins' },
                          { label: 'Formulaic menus that never change by season' }
                        ].map((row, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="w-3 h-px mt-2 shrink-0" style={{ backgroundColor: subtleTextColor }} />
                            <span
                              className="text-sm font-medium line-through"
                              style={{
                                color: subtleTextColor,
                                textDecorationColor: subtleTextColor
                              }}
                            >
                              {row.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dining Pillars */}
                <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-3'}`}>
                  {[
                    { label: '01 / Culinary Moat',      value: brandStrategy.differentiator || 'Heritage grain sourcing' },
                    { label: '02 / Core Guest Profile', value: brandStrategy.targetAudience || 'Neighbourhood regulars' },
                    { label: '03 / Convention We Reject', value: brandStrategy.antiHero    || 'Rushed industrial dining' }
                  ].map(card => (
                    <div
                      key={card.label}
                      className="p-4 border transition-all"
                      style={{
                        borderRadius: radiusCurvature,
                        backgroundColor: cardBgColor,
                        borderColor: cardBorderColor
                      }}
                    >
                      <span className="text-xs uppercase font-mono font-semibold tracking-wider block mb-1" style={{ color: subtleTextColor }}>
                        {card.label}
                      </span>
                      <p className="text-sm font-medium leading-relaxed" style={{ color: headingTextColor }}>
                        {card.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {sections.length === 0 && (
              <div className={`grid gap-4 pt-8 border-t mt-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-3'}`} style={{ borderColor: cardBorderColor }}>
                {[
                  { label: '01 / Culinary Moat',      value: brandStrategy.differentiator || 'Heritage grain sourcing' },
                  { label: '02 / Core Guest Profile', value: brandStrategy.targetAudience || 'Neighbourhood regulars' },
                  { label: '03 / We Reject',          value: brandStrategy.antiHero       || 'Rushed industrial dining' }
                ].map(card => (
                  <div
                    key={card.label}
                    className="p-4 border transition-all"
                    style={{
                      borderRadius: radiusCurvature,
                      backgroundColor: cardBgColor,
                      borderColor: cardBorderColor
                    }}
                  >
                    <span className="text-xs uppercase font-mono font-semibold tracking-wider block mb-1" style={{ color: subtleTextColor }}>
                      {card.label}
                    </span>
                    <p className="text-sm font-medium leading-relaxed" style={{ color: headingTextColor }}>
                      {card.value}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </>
        );
      })()}

      {/* ── Editorial In-Frame Footer ── */}
      <div
        className="mt-10 pt-5 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
        style={{ borderColor: cardBorderColor }}
      >
        <div>
          <span
            className="text-sm font-medium block"
            style={{ color: headingTextColor, fontFamily: fontStyle.display }}
          >
            {brandName}
          </span>
          <span className="text-xs font-mono" style={{ color: subtleTextColor }}>
            {brandStrategy.tagline || launchContent.heroHeadline || ''}
          </span>
        </div>
        <div className={`flex items-center text-xs font-mono ${isMobile ? 'flex-col items-start gap-1.5' : 'gap-4'}`} style={{ color: subtleTextColor }}>
          <span className="hover:opacity-80 cursor-pointer">Booking & Reservations</span>
          <span className="hover:opacity-80 cursor-pointer">Private Events</span>
          <span className="hover:opacity-80 cursor-pointer">Sourcing Philosophy</span>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// ARCHETYPE C: DIGITAL TOOLS & SAAS
// =============================================================================
function DigitalSaasPreview({
  brandStrategy,
  launchContent,
  blueprint,
  cleanName,
  primaryColor,
  primaryContrast,
  radiusCurvature,
  fontStyle,
  isMobile = false
}) {
  const brandName    = brandStrategy.brandName || 'Brand';
  const badge        = blueprint?.badge || 'Zero Config';
  const primaryCta   = blueprint?.primaryCta  || launchContent?.callToAction || 'Get Started';
  const secondaryCta = blueprint?.secondaryCta || 'Read Docs ↗';
  const installCmd   = `curl -sSL https://${cleanName}.dev/install.sh | bash`;
  const [copied, setCopied] = useState(false);
  const handleCopy = () => { navigator.clipboard?.writeText(installCmd); setCopied(true); setTimeout(() => setCopied(false), 2200); };

  return (
    <div
      className={`w-full max-w-full box-border min-h-[560px] flex flex-col bg-[#0e1015] text-white transition-all overflow-x-hidden ${
        isMobile ? 'p-4 sm:p-6' : 'p-6 sm:p-14'
      }`}
    >
      {/* Stacked Header Layout (Zero Clipping) */}
      <div className="pb-4 mb-6 border-b border-stone-800 space-y-3">
        {/* Row 1: Brand Name & Badge (Prominent Display, Full Width) */}
        <div className="flex items-center justify-between gap-3 w-full">
          <span className="font-mono text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white block truncate">
            {brandName}
          </span>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/40 shrink-0">
            {badge}
          </span>
        </div>

        {/* Row 2: Sub-Nav Links & Action CTA */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-4 text-xs text-stone-400 font-mono">
            <span className="hover:text-white cursor-pointer transition-colors">Features</span>
            <span className="hover:text-white cursor-pointer transition-colors">Docs</span>
            <span className="hover:text-white cursor-pointer transition-colors hidden sm:inline">Changelog</span>
          </div>
          <button
            className="px-3.5 py-1.5 text-xs font-mono font-medium rounded-md transition-all hover:opacity-90 shrink-0 shadow-2xs"
            style={{ backgroundColor: primaryColor, color: primaryContrast, borderRadius: radiusCurvature }}
          >
            {primaryCta}
          </button>
        </div>
      </div>

      <div className="max-w-3xl my-6">
        <h2
          className={`font-mono font-bold tracking-tight leading-tight text-white mb-4 ${
            isMobile ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-5xl'
          }`}
          style={{ fontFamily: fontStyle.display }}
        >
          {launchContent.heroHeadline || 'Low-Latency Infrastructure for Modern Teams.'}
        </h2>
        <p className={`text-stone-300 leading-relaxed mb-6 ${isMobile ? 'text-sm' : 'text-base'}`}>
          {launchContent.heroSubheadline || brandStrategy.coreValueProposition}
        </p>

        <div className="p-4 bg-black border border-stone-800 font-mono text-xs text-emerald-400 space-y-1 mb-6" style={{ borderRadius: radiusCurvature }}>
          <div className="text-stone-400 text-xs flex items-center justify-between">
            <span>// Quick install</span><span className="text-stone-500">zsh / bash</span>
          </div>
          <div className="flex items-center justify-between pt-1 gap-2">
            <code className="truncate text-emerald-400">{installCmd}</code>
            <button onClick={handleCopy}
              className="text-xs text-stone-300 hover:text-white shrink-0 flex items-center gap-1 px-2.5 py-1 rounded bg-stone-900 border border-stone-800">
              {copied
                ? <><Check className="w-3.5 h-3.5 text-emerald-400" /><span className="text-emerald-400">Copied</span></>
                : <><Copy className="w-3.5 h-3.5" /><span>Copy</span></>
              }
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="px-6 py-2.5 text-sm font-mono font-medium transition-all hover:opacity-90"
            style={{ backgroundColor: primaryColor, color: primaryContrast, borderRadius: radiusCurvature }}>
            {primaryCta} →
          </button>
          <a href="#docs" className="text-sm text-stone-400 hover:text-white transition-colors font-mono">{secondaryCta}</a>
        </div>
      </div>

      {blueprint?.sections?.length > 0 ? (
        <div className="space-y-8 mt-6 pt-6 border-t border-stone-800">
          {blueprint.sections.map((section, i) => (
            <div key={i}>
              <span className="text-xs font-semibold uppercase font-mono tracking-wider text-stone-400 block mb-4">{section.title}</span>
              <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-3'}`}>
                {(section.items || []).map((item, j) => (
                  <div key={j} className="p-4 bg-stone-900/60 border border-stone-800" style={{ borderRadius: radiusCurvature }}>
                    {item.metricOrPrice && <span className="text-xs font-mono text-stone-400 block mb-1">{item.metricOrPrice}</span>}
                    <p className="text-sm font-semibold text-stone-200 mb-1">{item.label}</p>
                    <p className="text-xs text-stone-400 font-mono leading-relaxed">{item.description}</p>
                    {item.tag && <span className="text-xs font-mono text-emerald-400 mt-2 block">{item.tag}</span>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={`grid gap-4 pt-6 border-t border-stone-800 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-3'}`}>
          {[
            { label: '01 / Engine Differentiator', value: brandStrategy.differentiator || 'Sub-millisecond query execution' },
            { label: '02 / Target Systems User',   value: brandStrategy.targetAudience || 'Infrastructure engineers' },
            { label: '03 / Legacy Bloat Axed',     value: brandStrategy.antiHero       || 'Complex JVM runtimes' }
          ].map(card => (
            <div key={card.label} className="p-4 bg-stone-900/60 border border-stone-800" style={{ borderRadius: radiusCurvature }}>
              <span className="text-xs uppercase font-mono font-semibold tracking-wider text-stone-400 block mb-1">{card.label}</span>
              <p className="text-sm text-stone-200 font-mono leading-relaxed">{card.value}</p>
            </div>
          ))}
        </div>
      )}
>>>>>>> dc9bada763cc7d97945289cc141d87886243899d
    </div>
  );
}

<<<<<<< HEAD
// ---------------------------------------------------------------------------
// 4. EDITORIAL & GENERAL PREVIEW — PALETTE GROUNDED
// ---------------------------------------------------------------------------
function EditorialPreview({ brandStrategy, launchContent, theme, radiusCurvature, fontStyle, palette, isMobile }) {
  const brandName = brandStrategy?.brandName || 'Brand';
  return (
    <div
      className="flex flex-col justify-between transition-colors"
      style={{
        backgroundColor: theme.canvas,
        color: theme.text,
        padding: isMobile ? '20px' : '44px'
      }}
    >
      {/* Nav */}
      <div
        className="flex items-center justify-between pb-8 mb-8 border-b"
        style={{ borderBottomColor: theme.borderSubtle }}
      >
        <span className="text-2xl font-light tracking-tight" style={{ fontFamily: fontStyle.display, color: theme.text }}>
          {brandName}.
        </span>
        <div className="flex items-center gap-4 text-xs" style={{ color: theme.textMuted }}>
          <span className="hover:opacity-100 cursor-pointer">Monograph</span>
          <span className="hover:opacity-100 cursor-pointer hidden sm:inline">Evidence</span>
          <button
            className="px-4 py-1.5 text-xs font-medium shadow-sm transition-all hover:opacity-90"
            style={{
              backgroundColor: theme.primary,
              color: theme.primaryText,
              borderRadius: radiusCurvature
            }}
          >
            {launchContent?.callToAction || 'Get Started'}
          </button>
=======

// =============================================================================
// PALETTE & TOKEN BAR
// =============================================================================
function PaletteTokenBar({ palette, fontStyle }) {
  const [copiedHex, setCopiedHex] = useState(null);
  if (!palette || palette.length === 0) return null;
  const handleCopyHex = (hex) => {
    navigator.clipboard?.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };
  return (
    <div className="bg-white border border-[#dbd7cd] rounded-[24px] p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-[#dbd7cd]/60">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-black" />
          <span className="text-xs uppercase font-mono tracking-wider text-stone-700 font-semibold">SYNTHESIZED PALETTE & TOKENS</span>
>>>>>>> dc9bada763cc7d97945289cc141d87886243899d
        </div>
        <span className="text-xs font-mono text-stone-500">Click any swatch to copy HEX</span>
      </div>
<<<<<<< HEAD

      {/* Hero */}
      <div className="max-w-3xl my-auto py-4">
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs mb-6 border"
          style={{
            backgroundColor: theme.accentTint,
            borderColor: theme.accentBorder,
            color: theme.text
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.primary }} />
          <span>Curated Edition • {brandStrategy?.tagline || 'Enduring Identity'}</span>
        </div>
        <h2
          className="text-4xl sm:text-6xl font-light tracking-tight leading-[1.05] mb-6"
          style={{ fontFamily: fontStyle.display, color: theme.text }}
        >
          {launchContent?.heroHeadline}
        </h2>
        <p
          className="text-base sm:text-lg max-w-2xl leading-relaxed mb-8"
          style={{ fontFamily: fontStyle.body, color: theme.textMuted }}
        >
          {launchContent?.heroSubheadline || brandStrategy?.coreValueProposition}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <button
            className="px-6 py-3 text-xs font-medium tracking-wide flex items-center gap-1.5 shadow-sm transition-all hover:opacity-90"
            style={{
              backgroundColor: theme.primary,
              color: theme.primaryText,
              borderRadius: radiusCurvature
            }}
          >
            <span>{launchContent?.callToAction || 'Explore Archive'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            className="px-6 py-3 text-xs border transition-all hover:opacity-90"
            style={{
              backgroundColor: theme.cardBg,
              borderColor: theme.border,
              color: theme.text,
              borderRadius: radiusCurvature
            }}
          >
            Read Manifesto
          </button>
        </div>
      </div>

      {/* Bottom cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-10 border-t" style={{ borderTopColor: theme.borderSubtle }}>
        {[
          { label: '01 / The Distinct Edge', value: brandStrategy?.differentiator },
          { label: '02 / Core Audience',     value: brandStrategy?.targetAudience },
          { label: '03 / Standard We Break', value: brandStrategy?.antiHero }
        ].map(card => (
          <div
            key={card.label}
            className="p-4 border"
            style={{
              backgroundColor: theme.cardBg,
              borderColor: theme.borderSubtle,
              borderRadius: radiusCurvature
            }}
          >
            <span className="text-[10px] uppercase font-mono block mb-1 font-semibold" style={{ color: theme.accent }}>
              {card.label}
            </span>
            <p className="text-xs font-medium leading-snug" style={{ color: theme.text }}>{card.value}</p>
          </div>
        ))}
=======
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {palette.slice(0, 5).map(color => {
          const isCopied = copiedHex === color.hex;
          return (
            <button key={`${color.role}-${color.hex}`} onClick={() => handleCopyHex(color.hex)}
              className="group p-3 rounded-2xl border border-[#dbd7cd]/80 hover:border-black bg-[#faf9f6] text-left transition-all flex flex-col justify-between"
              title={`Click to copy ${color.hex}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase font-mono tracking-wider text-stone-600 font-medium">{color.role}</span>
                {isCopied
                  ? <Check className="w-3 h-3 text-emerald-600" />
                  : <Copy className="w-3 h-3 text-stone-300 group-hover:text-black transition-colors" />
                }
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: color.hex }} />
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-stone-900 block truncate leading-none mb-1">{color.name || color.role}</span>
                  <span className="text-xs font-mono text-stone-500 block leading-none">{isCopied ? 'COPIED!' : color.hex}</span>
                </div>
              </div>
            </button>
          );
        })}
>>>>>>> dc9bada763cc7d97945289cc141d87886243899d
      </div>

      {/* Brand Website Footer */}
      <BrandWebsiteFooter brandStrategy={brandStrategy} theme={theme} palette={palette} fontStyle={fontStyle} isMobile={isMobile} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// 5. BRAND WEBSITE FOOTER — PALETTE SPECIMEN STRIP
// ---------------------------------------------------------------------------
function BrandWebsiteFooter({ brandStrategy, theme, palette, fontStyle, isMobile }) {
  return (
    <footer
      className="mt-10 pt-6 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
      style={{
        borderTopColor: theme.borderSubtle,
        color: theme.textSubtle
      }}
    >
      <div>
        <span className="font-semibold block" style={{ color: theme.text, fontFamily: fontStyle.display }}>
          {brandStrategy?.brandName || 'Brand'}
        </span>
        <span className="text-[11px]">{brandStrategy?.tagline}</span>
      </div>

      {/* Active Palette Dot Specimen in Footer */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: theme.textSubtle }}>
          Palette Tokens:
        </span>
        {palette.map((swatch, idx) => (
          <span
            key={idx}
            className="w-3.5 h-3.5 rounded-full border border-black/10 inline-block shadow-sm"
            style={{ backgroundColor: swatch.hex }}
            title={`${swatch.name} (${swatch.role}): ${swatch.hex}`}
          />
        ))}
      </div>

      <span className="text-[11px] font-mono">
        © {new Date().getFullYear()} {brandStrategy?.brandName || 'Brand'}.
      </span>
    </footer>
  );
}
