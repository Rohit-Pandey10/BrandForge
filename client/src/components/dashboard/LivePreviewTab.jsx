/**
 * Live Preview Tab — Dynamic Brand-Palette-Grounded Industry Previews
 *
 * Renders domain-specific website preview mockups based on the detected industry
 * from the synthesized brand kit (Apparel / Hospitality / Developer / Editorial).
 *
 * ALL styles, canvas backgrounds, card surfaces, typography colors, borders,
 * buttons, and badges are derived dynamically from the suggested brand color palette
 * (primary, secondary, accent, surface, text) — zero preset static colors.
 */

import React, { useState } from 'react';
import {
  ShoppingBag,
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

  const fontStyle = {
    display: typography.headingFont ? `'${typography.headingFont}', Georgia, serif` : 'inherit',
    body:    typography.bodyFont    ? `'${typography.bodyFont}', system-ui, sans-serif` : 'inherit',
  };

  const handleCopyHex = (hex) => {
    navigator.clipboard?.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  const isMobile = device === 'mobile';

  return (
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
      </div>
    </div>
  );
}

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
            </div>
          ))}
        </div>
      </div>

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
        </span>
      </div>

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
          </div>
        ))}
      </div>

      {/* Brand Website Footer */}
      <BrandWebsiteFooter brandStrategy={brandStrategy} theme={theme} palette={palette} fontStyle={fontStyle} isMobile={isMobile} />
    </div>
  );
}

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
          >
            {launchContent?.callToAction || 'Reserve Table'}
          </button>
        </div>
      </div>

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
            <span>{launchContent?.callToAction || 'Reserve Table'}</span>
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
            <Clock className="w-3.5 h-3.5" style={{ color: theme.accent }} />
            <span>Order Ahead</span>
          </button>
          <button
            className="px-6 py-3 text-xs transition-all flex items-center gap-2 hover:opacity-90"
            style={{ color: theme.accent }}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>View Daily Menu</span>
          </button>
        </div>
      </div>

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
    </div>
  );
}

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
        </div>
      </div>

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
