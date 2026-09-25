/**
 * Live Preview Tab — Adaptive Multi-Archetype Website Preview Engine
 *
 * Dynamically switches between 3 distinct living website layouts based on the
 * detected domain of the synthesized brand kit:
 *   1. Archetype A: Physical CPG & Retail (Beverages, Snacks, Bottles, Fashion, Consumer Goods)
 *   2. Archetype B: Hospitality & Dining (Restaurants, Cafes, Bars, Bakeries, Food)
 *   3. Archetype C: Digital Tools & SaaS (Software, APIs, Developer Tools, B2B)
 *
 * All layouts dynamically bind and showcase synthesized design tokens:
 *   - Primary, Secondary, Surface, Text, Accent palette roles
 *   - Curated Google Fonts typography (headingFont & bodyFont)
 *   - Border curvature styles
 * Includes a live interactive Palette Bar beneath the preview frame.
 */

import React, { useState } from 'react';
import { 
  ShoppingBag, 
  ArrowRight, 
  MapPin, 
  Clock, 
  Calendar, 
  Check, 
  Copy, 
  Terminal, 
  ShieldCheck, 
  Sparkles, 
  Utensils, 
  Box, 
  ChevronRight,
  Plus
} from 'lucide-react';

/**
 * Domain Detection Helper
 * Categorizes the kit into one of the 3 primary commercial archetypes.
 */
export function resolveArchetype(kit = {}) {
  const brandStrategy = kit.brandStrategy || {};
  const launchContent = kit.launchContent || {};
  const domain = (kit.domain || brandStrategy.domain || '').toLowerCase();
  const text = `${brandStrategy.brandName || ''} ${brandStrategy.tagline || ''} ${brandStrategy.coreValueProposition || ''} ${brandStrategy.differentiator || ''} ${launchContent.heroHeadline || ''} ${launchContent.heroSubheadline || ''}`.toLowerCase();

  // 1. Hospitality & Dining
  if (
    domain.includes('hospitality') || domain.includes('restaurant') || domain.includes('dining') ||
    domain.includes('bakery') || domain.includes('cafe') || domain.includes('bistro') ||
    text.includes('restaurant') || text.includes('bakery') || text.includes('sourdough') ||
    text.includes('pizza') || text.includes('dining') || text.includes('recipe') ||
    text.includes('tasting menu') || text.includes('communal table') || text.includes('wood-fired')
  ) {
    return 'hospitality';
  }

  // 2. Developer, Software & SaaS
  if (
    domain.includes('developer') || domain.includes('software') || domain.includes('saas') ||
    domain.includes('database') || domain.includes('api') || domain.includes('tech') ||
    text.includes('database') || text.includes('sql') || text.includes('api') ||
    text.includes('rust') || text.includes('bytecode') || text.includes('in-memory') ||
    text.includes('microservice') || text.includes('compiler') || text.includes('developer') ||
    text.includes('devops') || text.includes('cli') || text.includes('sub-millisecond') ||
    text.includes('infrastructure') || text.includes('query execution')
  ) {
    return 'digital_saas';
  }

  // 3. Physical CPG, Retail & Wellness — broad corpus, catches supplements/food/fashion
  if (
    domain.includes('cpg') || domain.includes('snack') || domain.includes('bottle') ||
    domain.includes('apparel') || domain.includes('fashion') || domain.includes('beverage') ||
    domain.includes('retail') || domain.includes('supplement') || domain.includes('wellness') ||
    domain.includes('protein') || domain.includes('nutrition') || domain.includes('fitness') ||
    domain.includes('skincare') || domain.includes('beauty') || domain.includes('cosmetic') ||
    /\b(wear|denim|chips|snack|drink|beverage|bottle|selvedge|jeans|tea|coffee|crunch|sip|hydration|whey|protein|powder|smoothie|latte|collagen|probiotic|supplement|vitamin|shake|capsule|serum|lotion|moisturiser|moisturizer|cleanser|sunscreen|gummies|bar|granola|oat|grain|flour|sauce|condiment|jam|honey|olive|oil|vinegar|spice|seasoning|baking|pouch|can|tin|jar|pet food|pet|bag|tote|hoodie|sneaker|shoe|boot|hat|cap|shirt|jacket|coat|dress|skirt|pant|legging|sock|underwear|swimsuit|bikini|activewear|sportswear|gym|workout)\b/i.test(text)
  ) {
    return 'retail_cpg';
  }

  // Final fallback: if nothing specific matched, default to retail/CPG
  // (avoids consumer products landing in the developer terminal layout)
  return 'retail_cpg';
}

/**
 * Utility: Contrast Calculator for text on dynamic colored buttons
 */
function getContrastColor(hexColor) {
  if (!hexColor || typeof hexColor !== 'string') return '#ffffff';
  const hex = hexColor.replace('#', '');
  if (hex.length !== 6) return '#ffffff';
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 140 ? '#000000' : '#ffffff';
}

export default function LivePreviewTab(props) {
  const kit = props.kit || props.brandKit || props;
  const brandStrategy = props.brandStrategy || kit.brandStrategy || {};
  const voiceSystem   = props.voiceSystem   || kit.voiceSystem   || {};
  const visualTokens  = props.visualTokens  || kit.visualTokens  || {};
  const launchContent = props.launchContent || kit.launchContent || {};

  const palette = visualTokens.palette || [];
  const typography = visualTokens.typography || {};
  const brandName = brandStrategy.brandName || 'Brand Monograph';
  const cleanName = brandName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'brand';

  // Extract core design tokens
  const primaryColor   = palette.find(c => c.role === 'primary')?.hex   || '#111111';
  const secondaryColor = palette.find(c => c.role === 'secondary')?.hex || '#555555';
  const accentColor    = palette.find(c => c.role === 'accent')?.hex    || '#888888';
  const surfaceColor   = palette.find(c => c.role === 'surface')?.hex   || '#fcfbf9';
  const textColor      = palette.find(c => c.role === 'text')?.hex      || '#111111';

  const primaryContrast   = getContrastColor(primaryColor);
  const secondaryContrast = getContrastColor(secondaryColor);

  const radiusCurvature =
    visualTokens.borderCurvature === 'rounded-none' ? '0px' :
    visualTokens.borderCurvature === 'rounded-full' ? '9999px' :
    visualTokens.borderCurvature === 'rounded-2xl'   ? '24px' :
    visualTokens.borderCurvature === 'rounded-lg'    ? '12px' : '16px';

  const headingFont = typography.headingFont || 'Cormorant Garamond';
  const bodyFont    = typography.bodyFont    || 'Inter';

  const fontStyle = {
    display: `'${headingFont}', Georgia, serif`,
    body:    `'${bodyFont}', system-ui, -apple-system, sans-serif`
  };

  const archetype = resolveArchetype({ ...kit, brandStrategy, launchContent });

  const domainUrl =
    archetype === 'retail_cpg'  ? `https://${cleanName}.shop` :
    archetype === 'hospitality' ? `https://${cleanName}.dining` :
                                  `https://${cleanName}.dev`;

  const domainBadge =
    archetype === 'retail_cpg'  ? 'RETAIL & CPG PREVIEW' :
    archetype === 'hospitality' ? 'HOSPITALITY PREVIEW' :
                                  'DIGITAL SAAS PREVIEW';

  const sharedProps = {
    brandStrategy,
    voiceSystem,
    visualTokens,
    launchContent,
    cleanName,
    primaryColor,
    secondaryColor,
    accentColor,
    surfaceColor,
    textColor,
    primaryContrast,
    secondaryContrast,
    radiusCurvature,
    fontStyle
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Simulated Browser Viewport ── */}
      <div
        className="bg-white border border-[#dbd7cd] overflow-hidden shadow-sm transition-all"
        style={{
          borderRadius: '28px',
          '--brand-primary': primaryColor,
          '--brand-secondary': secondaryColor,
          '--brand-surface': surfaceColor,
          '--brand-text': textColor,
          '--brand-accent': accentColor,
          '--radius-curvature': radiusCurvature,
          fontFamily: fontStyle.body
        }}
      >
        {/* Browser Chrome Bar */}
        <div className="bg-[#faf9f6] border-b border-[#dbd7cd] px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-stone-300" />
            <span className="w-2.5 h-2.5 rounded-full bg-stone-300" />
            <span className="w-2.5 h-2.5 rounded-full bg-stone-300" />
          </div>
          <div className="px-6 py-1 rounded-full bg-white border border-[#dbd7cd] text-[11px] font-mono text-stone-500 max-w-xs truncate">
            {domainUrl}
          </div>
          <span className="text-[10px] uppercase font-mono tracking-wider text-stone-400">
            {domainBadge}
          </span>
        </div>

        {/* Dynamic Archetype View */}
        {archetype === 'retail_cpg' && <RetailCpgPreview {...sharedProps} />}
        {archetype === 'hospitality' && <HospitalityPreview {...sharedProps} />}
        {archetype === 'digital_saas' && <DigitalSaasPreview {...sharedProps} />}
      </div>

      {/* ── Compact Design Token & Palette Bar ── */}
      <PaletteTokenBar palette={palette} fontStyle={fontStyle} />
    </div>
  );
}

// ===========================================================================
// ARCHETYPE A: PHYSICAL CPG & RETAIL LAYOUT
// ===========================================================================
function RetailCpgPreview({
  brandStrategy,
  launchContent,
  voiceSystem,
  primaryColor,
  primaryContrast,
  secondaryColor,
  radiusCurvature,
  fontStyle
}) {
  const brandName = brandStrategy.brandName || 'Brand';
  const [addedItem, setAddedItem] = useState(null);

  const handleQuickAdd = (itemName) => {
    setAddedItem(itemName);
    setTimeout(() => setAddedItem(null), 2000);
  };

  return (
    <div className="p-6 sm:p-12 min-h-[580px] flex flex-col justify-between bg-[#faf8f5]">
      {/* Store Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-[#dbd7cd] gap-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl sm:text-3xl font-medium tracking-tight text-black" style={{ fontFamily: fontStyle.display }}>
            {brandName}
          </span>
          <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-[#f0ede6] text-stone-700 border border-[#dbd7cd]">
            {voiceSystem.archetype || 'Retail & CPG'}
          </span>
        </div>
        <div className="flex items-center gap-6 text-xs text-stone-700">
          <span className="hover:text-black cursor-pointer font-medium">Products</span>
          <span className="hover:text-black cursor-pointer hidden sm:inline">Craft & Sourcing</span>
          <span className="hover:text-black cursor-pointer hidden md:inline">Stockists</span>
          <button
            className="px-5 py-2 text-xs font-medium transition-all hover:opacity-90 flex items-center gap-2"
            style={{
              backgroundColor: primaryColor,
              color: primaryContrast,
              borderRadius: radiusCurvature
            }}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Bag (0)</span>
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-3xl my-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono mb-4 border border-[#dbd7cd] bg-white text-stone-600">
          <Sparkles className="w-3 h-3 text-stone-500" />
          <span>FREE SHIPPING ON ORDERS OVER $50 • 100% SATISFACTION GUARANTEE</span>
        </div>
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight leading-[1.08] text-black mb-4" style={{ fontFamily: fontStyle.display }}>
          {launchContent.heroHeadline || 'Crafted for Pure Impact.'}
        </h2>
        <p className="text-base sm:text-lg text-stone-700 max-w-2xl leading-relaxed mb-6">
          {launchContent.heroSubheadline || brandStrategy.coreValueProposition}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <button
            className="px-6 py-3 text-xs font-medium tracking-wide flex items-center gap-2 shadow-sm transition-all hover:opacity-90"
            style={{
              backgroundColor: primaryColor,
              color: primaryContrast,
              borderRadius: radiusCurvature
            }}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{launchContent.callToAction || 'Shop the Collection →'}</span>
          </button>
          <button
            className="px-6 py-3 text-xs font-medium text-stone-900 bg-white border border-[#dbd7cd] hover:border-black transition-all flex items-center gap-2"
            style={{ borderRadius: radiusCurvature }}
          >
            <span>Craft & Sourcing Story</span>
            <ArrowRight className="w-3 h-3 text-stone-400" />
          </button>
        </div>
      </div>

      {/* Product Showcase Shelf (3 Curated Variant Cards) */}
      <div className="my-8 pt-8 border-t border-[#dbd7cd]">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[11px] uppercase font-mono tracking-widest text-stone-500">
            PRODUCT SHOWCASE SHELF
          </span>
          <span className="text-xs text-stone-400 font-mono">Small-Batch Edition</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              name: 'The Signature Edition',
              price: '$24.00',
              desc: 'Formulated with cold-pressed natural ingredients, built for daily routine and zero compromises.',
              tag: 'FLAGSHIP ITEM'
            },
            {
              name: 'Small-Batch Reserve',
              price: '$38.00',
              desc: 'Unfiltered, double-steeped craft batch with intensified texture and tactile sensory finish.',
              tag: 'LIMITED RUN'
            },
            {
              name: 'The Discovery 3-Pack',
              price: '$65.00',
              desc: 'Complete seasonal trio offering the full dynamic spectrum of flavors and textures in one box.',
              tag: 'BEST VALUE'
            }
          ].map(product => {
            const isAdded = addedItem === product.name;
            return (
              <div
                key={product.name}
                className="p-5 bg-white border border-[#dbd7cd] flex flex-col justify-between transition-all hover:border-stone-400"
                style={{ borderRadius: radiusCurvature }}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="text-base font-medium text-black" style={{ fontFamily: fontStyle.display }}>
                      {product.name}
                    </h4>
                    <span className="font-mono text-xs font-semibold text-stone-900">{product.price}</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">{product.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-stone-500 bg-[#f4f1ea] px-2 py-1 rounded">
                    {product.tag}
                  </span>
                  <button
                    onClick={() => handleQuickAdd(product.name)}
                    className="text-xs font-medium px-3 py-1.5 rounded-full border border-stone-300 hover:border-black flex items-center gap-1 transition-all"
                    style={{ borderRadius: radiusCurvature }}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-700">Added</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3 h-3 text-stone-500" />
                        <span>Quick Add</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Craft & Sourcing Anchor */}
      <div className="my-2 p-5 bg-white border border-[#dbd7cd] flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderRadius: radiusCurvature }}>
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-stone-700 shrink-0" />
          <div className="text-xs">
            <span className="font-semibold text-black block">100% Recyclable Packaging • Zero Artificial Additives</span>
            <span className="text-stone-600">Ethically sourced, independently verified supply chain, and carbon-neutral transit.</span>
          </div>
        </div>
        <span className="text-[11px] font-mono text-stone-500 whitespace-nowrap bg-[#faf8f5] px-3 py-1 rounded-full border border-[#dbd7cd]">
          VERIFIED ORIGIN
        </span>
      </div>

      {/* Strategic Narrative Specification */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[#dbd7cd]">
        {[
          { label: '01 / Product Moat', value: brandStrategy.differentiator || 'Pure-grade formulation' },
          { label: '02 / Target Consumer', value: brandStrategy.targetAudience || 'Discerning enthusiasts' },
          { label: '03 / Industry Flaw Rejected', value: brandStrategy.antiHero || 'Disposable shortcuts' }
        ].map(card => (
          <div key={card.label} className="p-4 bg-white border border-[#dbd7cd]" style={{ borderRadius: radiusCurvature }}>
            <span className="text-[10px] uppercase font-mono text-stone-400 block mb-1">{card.label}</span>
            <p className="text-xs text-stone-800 font-medium leading-snug">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===========================================================================
// ARCHETYPE B: HOSPITALITY & DINING LAYOUT
// ===========================================================================
function HospitalityPreview({
  brandStrategy,
  launchContent,
  voiceSystem,
  primaryColor,
  primaryContrast,
  radiusCurvature,
  fontStyle
}) {
  const brandName = brandStrategy.brandName || 'Brand';

  return (
    <div className="p-6 sm:p-12 min-h-[560px] flex flex-col justify-between bg-[#fcfbf9]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-[#dbd7cd] gap-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl sm:text-3xl font-light tracking-tight text-black" style={{ fontFamily: fontStyle.display }}>
            {brandName}
          </span>
          <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-[#f2f1ed] text-stone-600 border border-[#dbd7cd]">
            {voiceSystem.archetype || 'Hospitality & Dining'}
          </span>
        </div>
        <div className="flex items-center gap-5 text-xs text-stone-700">
          <span className="hover:text-black cursor-pointer font-medium">Daily Menu</span>
          <span className="hover:text-black cursor-pointer hidden sm:inline">Private Dining</span>
          <span className="hover:text-black cursor-pointer hidden md:inline">Location & Hours</span>
          <button
            className="px-5 py-2 text-xs font-medium transition-all hover:opacity-90"
            style={{
              backgroundColor: primaryColor,
              color: primaryContrast,
              borderRadius: radiusCurvature
            }}
          >
            Reserve a Table
          </button>
        </div>
      </div>

      {/* Ambient Opening Hours Pill */}
      <div className="flex items-center gap-2 text-[11px] font-mono text-stone-500 mb-6 bg-white px-3.5 py-1.5 rounded-full border border-[#dbd7cd] w-fit">
        <Clock className="w-3.5 h-3.5 text-stone-400" />
        <span>Open Daily from 5:00 PM • Walk-ins & Communal Tables Welcome</span>
      </div>

      {/* Hero Section */}
      <div className="max-w-3xl my-2">
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight leading-[1.08] text-black mb-4" style={{ fontFamily: fontStyle.display }}>
          {launchContent.heroHeadline || 'Honest Plates. Natural Pours. Welcome In.'}
        </h2>
        <p className="text-base sm:text-lg text-stone-700 max-w-2xl leading-relaxed mb-6">
          {launchContent.heroSubheadline || brandStrategy.coreValueProposition}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <button
            className="px-6 py-3 text-xs font-medium tracking-wide flex items-center gap-2 shadow-sm transition-all hover:opacity-90"
            style={{
              backgroundColor: primaryColor,
              color: primaryContrast,
              borderRadius: radiusCurvature
            }}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>{launchContent.callToAction || 'Reserve Table'}</span>
          </button>
          <button
            className="px-6 py-3 text-xs font-medium text-stone-900 bg-white border border-[#dbd7cd] hover:border-black transition-all flex items-center gap-2"
            style={{ borderRadius: radiusCurvature }}
          >
            <Calendar className="w-3.5 h-3.5 text-stone-500" />
            <span>View Tonight&apos;s Menu</span>
          </button>
        </div>
      </div>

      {/* Daily Menu Board (3 Curated Sections) */}
      <div className="my-8 pt-8 border-t border-[#dbd7cd]">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[11px] uppercase font-mono tracking-widest text-stone-500">
            CURATED DAILY MENU BOARD
          </span>
          <span className="text-xs text-stone-400 font-mono">Tonight&apos;s Service</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              name: 'Small Plates & Starters',
              price: '$14 – $18',
              desc: 'Wood-fired seasonal sourdough, cultured sea-salt butter, marinated castelvetrano olives, charred peppers.',
              tag: 'HEARTH STARTERS'
            },
            {
              name: 'Signature Mains',
              price: '$26 – $34',
              desc: 'Slow-braised heritage cuts, seasonal wild greens, charred broccolini, and house-milled polenta.',
              tag: 'CHEF SELECTION'
            },
            {
              name: 'Low-Intervention Pours',
              price: '$12 – $16',
              desc: 'Biodynamic orange pet-nats, chilled skin-contact whites, and botanical zero-proof spritzes.',
              tag: 'CELLAR & SPRITZ'
            }
          ].map(section => (
            <div
              key={section.name}
              className="p-5 bg-white border border-[#dbd7cd] flex flex-col justify-between"
              style={{ borderRadius: radiusCurvature }}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="text-base font-medium text-black" style={{ fontFamily: fontStyle.display }}>
                    {section.name}
                  </h4>
                  <span className="font-mono text-xs font-semibold text-stone-900">{section.price}</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">{section.desc}</p>
              </div>
              <span className="text-[10px] font-mono text-stone-400 mt-4 block">{section.tag}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Atmosphere & Location Strip */}
      <div className="my-2 p-5 bg-white border border-[#dbd7cd] flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderRadius: radiusCurvature }}>
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-stone-700 shrink-0" />
          <div className="text-xs">
            <span className="font-semibold text-black block">142 Mulberry Street • Lower Manhattan</span>
            <span className="text-stone-600">Counter seating, communal long-tables, and heated garden terrace. Call (212) 555-0194</span>
          </div>
        </div>
        <span className="text-[11px] font-mono text-stone-500 whitespace-nowrap bg-[#faf8f5] px-3 py-1 rounded-full border border-[#dbd7cd]">
          WALK-INS WELCOME
        </span>
      </div>

      {/* Strategic Foundation Footer */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[#dbd7cd]">
        {[
          { label: '01 / Culinary Moat', value: brandStrategy.differentiator || 'Wood-fired heritage grains' },
          { label: '02 / Core Guest Profile', value: brandStrategy.targetAudience || 'Neighborhood regulars & purists' },
          { label: '03 / Convention We Reject', value: brandStrategy.antiHero || 'Rushed, industrialized dining' }
        ].map(card => (
          <div key={card.label} className="p-4 bg-white border border-[#dbd7cd]" style={{ borderRadius: radiusCurvature }}>
            <span className="text-[10px] uppercase font-mono text-stone-400 block mb-1">{card.label}</span>
            <p className="text-xs text-stone-800 font-medium leading-snug">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===========================================================================
// ARCHETYPE C: DIGITAL TOOLS & SAAS LAYOUT
// ===========================================================================
function DigitalSaasPreview({
  brandStrategy,
  launchContent,
  cleanName,
  primaryColor,
  primaryContrast,
  radiusCurvature,
  fontStyle
}) {
  const brandName = brandStrategy.brandName || 'Brand';
  const [copiedCli, setCopiedCli] = useState(false);

  const installCommand = `curl -sSL https://${cleanName}.dev/install.sh | bash`;

  const handleCopyCli = () => {
    navigator.clipboard?.writeText(installCommand);
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2200);
  };

  return (
    <div className="p-6 sm:p-14 min-h-[560px] flex flex-col justify-between bg-[#0e1015] text-white">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-stone-800">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xl font-bold tracking-tight">{brandName}</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-800 text-stone-400">v2.4.0</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/40">Zero Config</span>
          </div>
        </div>
        <div className="flex items-center gap-5 text-xs text-stone-400 font-mono">
          <span className="hover:text-white cursor-pointer">Features</span>
          <span className="hover:text-white cursor-pointer hidden sm:inline">Docs</span>
          <span className="hover:text-white cursor-pointer hidden md:inline">Changelog</span>
          <button
            className="px-4 py-1.5 text-xs font-mono font-medium transition-all hover:opacity-90"
            style={{
              backgroundColor: primaryColor,
              color: primaryContrast,
              borderRadius: radiusCurvature
            }}
          >
            {launchContent.callToAction || 'Get Started'}
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-3xl my-6">
        <div className="flex items-center gap-2 mb-4">
          {['Sub-1ms Latency', 'Bare-Metal Engine', 'Single Binary'].map(tag => (
            <span key={tag} className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-stone-800 text-stone-300">
              {tag}
            </span>
          ))}
        </div>
        <h2 className="text-3xl sm:text-5xl font-mono font-bold tracking-tight leading-tight text-white mb-4" style={{ fontFamily: fontStyle.display }}>
          {launchContent.heroHeadline || 'Low-Latency Infrastructure for Modern Teams.'}
        </h2>
        <p className="text-sm sm:text-base text-stone-400 leading-relaxed mb-6">
          {launchContent.heroSubheadline || brandStrategy.coreValueProposition}
        </p>

        {/* Interactive CLI Terminal Box */}
        <div
          className="p-4 bg-black border border-stone-800 font-mono text-xs text-emerald-400 space-y-1 mb-6 shadow-inner"
          style={{ borderRadius: radiusCurvature }}
        >
          <div className="text-stone-500 text-[10px] flex items-center justify-between">
            <span>// Install CLI & initialize engine</span>
            <span className="text-stone-600">zsh / bash</span>
          </div>
          <div className="flex items-center justify-between pt-1 gap-2">
            <code className="truncate text-emerald-400">{installCommand}</code>
            <button
              onClick={handleCopyCli}
              className="text-[11px] text-stone-400 hover:text-white transition-colors shrink-0 flex items-center gap-1 px-2 py-0.5 rounded bg-stone-900 border border-stone-800"
            >
              {copiedCli ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="px-6 py-2.5 text-sm font-mono font-medium transition-all hover:opacity-90"
            style={{
              backgroundColor: primaryColor,
              color: primaryContrast,
              borderRadius: radiusCurvature
            }}
          >
            Get Started →
          </button>
          <a href="#docs" className="text-sm text-stone-400 hover:text-white transition-colors font-mono">
            Read Docs ↗
          </a>
        </div>
      </div>

      {/* Feature Matrix (3 Pillars) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-stone-800">
        {[
          { label: '01 / Engine Differentiator', value: brandStrategy.differentiator || 'Sub-millisecond query execution' },
          { label: '02 / Target Systems User', value: brandStrategy.targetAudience || 'Infrastructure & systems engineers' },
          { label: '03 / Legacy Bloat Eliminated', value: brandStrategy.antiHero || 'Complex JVM runtimes and heavyweight containers' }
        ].map(card => (
          <div key={card.label} className="p-4 bg-stone-900/60 border border-stone-800" style={{ borderRadius: radiusCurvature }}>
            <span className="text-[10px] uppercase font-mono text-stone-500 block mb-1">{card.label}</span>
            <p className="text-xs text-stone-300 font-mono leading-snug">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===========================================================================
// COMPACT DESIGN TOKEN & PALETTE BAR (Beneath Viewport Frame)
// ===========================================================================
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
          <span className="text-[10px] uppercase font-mono tracking-widest text-stone-500 font-medium">
            SYNTHESIZED PALETTE & TOKENS
          </span>
        </div>
        <span className="text-[11px] font-mono text-stone-400">
          Click any swatch to copy HEX
        </span>
      </div>

      {/* 5 Swatches Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {palette.slice(0, 5).map(color => {
          const isCopied = copiedHex === color.hex;
          return (
            <button
              key={`${color.role}-${color.hex}`}
              onClick={() => handleCopyHex(color.hex)}
              className="group p-3 rounded-2xl border border-[#dbd7cd]/80 hover:border-black bg-[#faf9f6] text-left transition-all flex flex-col justify-between"
              title={`Click to copy ${color.hex}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-mono tracking-wider text-stone-500">
                  {color.role}
                </span>
                {isCopied ? (
                  <Check className="w-3 h-3 text-emerald-600" />
                ) : (
                  <Copy className="w-3 h-3 text-stone-300 group-hover:text-black transition-colors" />
                )}
              </div>
              <div className="flex items-center gap-2.5">
                <div
                  className="w-5 h-5 rounded-full border border-black/10 shrink-0 shadow-xs"
                  style={{ backgroundColor: color.hex }}
                />
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-stone-900 block truncate leading-none mb-1">
                    {color.name || color.role}
                  </span>
                  <span className="text-[10px] font-mono text-stone-500 block leading-none">
                    {isCopied ? 'COPIED!' : color.hex}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
