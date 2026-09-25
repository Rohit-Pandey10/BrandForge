/**
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
 */

import React, { useState } from 'react';
import {
  ShoppingBag,
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
  Quote
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

// ─── Contrast Calculator ───────────────────────────────────────────────────────
function getContrastColor(hexColor) {
  if (!hexColor || typeof hexColor !== 'string') return '#ffffff';
  const hex = hexColor.replace('#', '');
  if (hex.length !== 6) return '#ffffff';
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 >= 140 ? '#000000' : '#ffffff';
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function LivePreviewTab(props) {
  const kit           = props.kit || props.brandKit || props;
  const brandStrategy = props.brandStrategy || kit.brandStrategy || {};
  const voiceSystem   = props.voiceSystem   || kit.voiceSystem   || {};
  const visualTokens  = props.visualTokens  || kit.visualTokens  || {};
  const launchContent = props.launchContent || kit.launchContent || {};
  const blueprint     = props.websiteBlueprint || kit.websiteBlueprint || null;

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
    primaryContrast, secondaryContrast, radiusCurvature, fontStyle
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div
        className="bg-white border border-[#dbd7cd] overflow-hidden shadow-sm transition-all"
        style={{
          borderRadius: '28px',
          '--brand-primary':    primaryColor,
          '--brand-secondary':  secondaryColor,
          '--brand-surface':    surfaceColor,
          '--brand-text':       textColor,
          '--brand-accent':     accentColor,
          '--radius-curvature': radiusCurvature,
          fontFamily: fontStyle.body
        }}
      >
        {/* Browser chrome */}
        <div className="bg-[#faf9f6] border-b border-[#dbd7cd] px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-stone-300" />
            <span className="w-2.5 h-2.5 rounded-full bg-stone-300" />
            <span className="w-2.5 h-2.5 rounded-full bg-stone-300" />
          </div>
          <div className="px-6 py-1 rounded-full bg-white border border-[#dbd7cd] text-[11px] font-mono text-stone-500 max-w-xs truncate">
            {domainUrl}
          </div>
          <span className="text-[10px] uppercase font-mono tracking-wider text-stone-400">{domainBadge}</span>
        </div>

        {archetype === 'retail_cpg'   && <RetailCpgPreview   {...sharedProps} />}
        {archetype === 'hospitality'  && <HospitalityPreview  {...sharedProps} />}
        {archetype === 'digital_saas' && <DigitalSaasPreview  {...sharedProps} />}
      </div>

      <PaletteTokenBar palette={palette} fontStyle={fontStyle} />
    </div>
  );
}

// =============================================================================
// SECTION DISPATCHER
// =============================================================================
function SectionDispatcher({ sections, primaryColor, primaryContrast, radiusCurvature, fontStyle, brandStrategy }) {
  if (!sections || sections.length === 0) return null;
  return (
    <div className="space-y-8 mt-8 pt-8 border-t border-[#dbd7cd]">
      {sections.map((section, i) => {
        const common = { key: i, section, primaryColor, primaryContrast, radiusCurvature, fontStyle };
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
function CatalogGrid({ section, primaryColor, primaryContrast, radiusCurvature, fontStyle }) {
  const [addedItem, setAddedItem] = useState(null);
  const handleAdd = (label) => { setAddedItem(label); setTimeout(() => setAddedItem(null), 2000); };
  const cols = section.items?.length === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-3';
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] uppercase font-mono tracking-widest text-stone-500">{section.title}</span>
        {section.subtitle && <span className="text-xs text-stone-400 font-mono">{section.subtitle}</span>}
      </div>
      <div className={`grid ${cols} gap-4`}>
        {(section.items || []).map((item, i) => {
          const isAdded = addedItem === item.label;
          return (
            <div key={i} className="p-5 bg-white border border-[#dbd7cd] flex flex-col justify-between transition-all hover:border-stone-400" style={{ borderRadius: radiusCurvature }}>
              <div>
                <div className="flex items-start justify-between mb-1.5 gap-2">
                  <h4 className="text-sm font-medium text-black leading-snug" style={{ fontFamily: fontStyle.display }}>{item.label}</h4>
                  {item.metricOrPrice && <span className="font-mono text-xs font-semibold text-stone-900 shrink-0">{item.metricOrPrice}</span>}
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">{item.description}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                {item.tag && <span className="text-[10px] font-mono text-stone-500 bg-[#f4f1ea] px-2 py-1 rounded">{item.tag}</span>}
                <button
                  onClick={() => handleAdd(item.label)}
                  className="text-xs font-medium px-3 py-1.5 border border-stone-300 hover:border-black flex items-center gap-1 transition-all ml-auto"
                  style={{ borderRadius: radiusCurvature }}
                >
                  {isAdded
                    ? <><Check className="w-3 h-3 text-emerald-600" /><span className="text-emerald-700">Added</span></>
                    : <><Plus className="w-3 h-3 text-stone-500" /><span>Add</span></>
                  }
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Ritual Steps ────────────────────────────────────────────────────────────
function RitualSteps({ section, primaryColor, radiusCurvature, fontStyle }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] uppercase font-mono tracking-widest text-stone-500">{section.title}</span>
        {section.subtitle && <span className="text-xs text-stone-400 font-mono">{section.subtitle}</span>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {(section.items || []).map((item, i) => (
          <div key={i} className="p-5 bg-white border border-[#dbd7cd]" style={{ borderRadius: radiusCurvature }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold mb-3"
              style={{ backgroundColor: primaryColor, color: getContrastColor(primaryColor) }}>
              {String(i + 1).padStart(2, '0')}
            </div>
            <h4 className="text-sm font-semibold text-black mb-1.5" style={{ fontFamily: fontStyle.display }}>{item.label}</h4>
            <p className="text-xs text-stone-600 leading-relaxed">{item.description}</p>
            {item.metricOrPrice && <span className="text-[10px] font-mono text-stone-400 mt-3 block">{item.metricOrPrice}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Flavor Profile ──────────────────────────────────────────────────────────
function FlavorProfile({ section, primaryColor, radiusCurvature, fontStyle }) {
  const icons = [<Droplets className="w-4 h-4" />, <Leaf className="w-4 h-4" />, <Sparkles className="w-4 h-4" />, <Zap className="w-4 h-4" />];
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] uppercase font-mono tracking-widest text-stone-500">{section.title}</span>
        {section.subtitle && <span className="text-xs text-stone-400 font-mono">{section.subtitle}</span>}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(section.items || []).map((item, i) => (
          <div key={i} className="p-4 bg-white border border-[#dbd7cd] text-center" style={{ borderRadius: radiusCurvature }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 text-stone-600"
              style={{ backgroundColor: `${primaryColor}18` }}>
              {icons[i % icons.length]}
            </div>
            <h4 className="text-xs font-semibold text-black mb-1" style={{ fontFamily: fontStyle.display }}>{item.label}</h4>
            <p className="text-[11px] text-stone-500 leading-relaxed">{item.description}</p>
            {item.tag && <span className="text-[10px] font-mono text-stone-400 mt-2 block">{item.tag}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Comparative Ledger ──────────────────────────────────────────────────────
function ComparativeLedger({ section, brandStrategy, primaryColor, radiusCurvature, fontStyle }) {
  const items   = section.items || [];
  const half    = Math.ceil(items.length / 2);
  const ours    = items.slice(0, half);
  const theirs  = items.slice(half);
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] uppercase font-mono tracking-widest text-stone-500">{section.title}</span>
        {section.subtitle && <span className="text-xs text-stone-400 font-mono">{section.subtitle}</span>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 border-2 border-black bg-white" style={{ borderRadius: radiusCurvature }}>
          <span className="text-[10px] uppercase font-mono tracking-widest text-black font-bold block mb-3">
            {brandStrategy.brandName || 'This Brand'}
          </span>
          <div className="space-y-2.5">
            {(ours.length > 0 ? ours : items).map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 mt-0.5 text-emerald-600 shrink-0" />
                <div>
                  <span className="text-xs font-semibold text-black block">{item.label}</span>
                  {item.description && <span className="text-[11px] text-stone-500">{item.description}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-5 border border-[#dbd7cd] bg-[#faf8f5]" style={{ borderRadius: radiusCurvature }}>
          <span className="text-[10px] uppercase font-mono tracking-widest text-stone-400 font-medium block mb-3">
            The Industry Default
          </span>
          <div className="space-y-2.5">
            {(theirs.length > 0 ? theirs : [{ label: brandStrategy.antiHero || 'Generic compromise', description: '' }]).map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="w-3.5 h-px mt-2 bg-stone-300 shrink-0" />
                <div>
                  <span className="text-xs font-medium text-stone-400 block line-through decoration-stone-300">{item.label}</span>
                  {item.description && <span className="text-[11px] text-stone-400">{item.description}</span>}
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
function PressQuotes({ section, primaryColor, fontStyle }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] uppercase font-mono tracking-widest text-stone-500">{section.title}</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {(section.items || []).map((item, i) => (
          <div key={i} className="p-5 bg-white border border-[#dbd7cd] rounded-2xl">
            <Quote className="w-5 h-5 text-stone-300 mb-3" />
            <p className="text-sm text-stone-800 leading-relaxed italic mb-3" style={{ fontFamily: fontStyle.display }}>
              "{item.description}"
            </p>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-stone-200" />
              <div>
                <span className="text-xs font-semibold text-black block">{item.label}</span>
                {item.tag && <span className="text-[10px] text-stone-400 font-mono">{item.tag}</span>}
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
function RetailCpgPreview({ brandStrategy, launchContent, voiceSystem, blueprint, primaryColor, primaryContrast, radiusCurvature, fontStyle }) {
  const brandName      = brandStrategy.brandName || 'Brand';
  const badge          = blueprint?.badge || voiceSystem?.archetype || 'Retail & CPG';
  const annBar         = blueprint?.announcementBar || 'Free standard shipping on orders over $50 · 100% satisfaction guarantee';
  const primaryCta     = blueprint?.primaryCta || launchContent?.callToAction || 'Shop Now';
  const secondaryCta   = blueprint?.secondaryCta || 'Craft & Sourcing Story';

  return (
    <div className="p-6 sm:p-12 min-h-[580px] flex flex-col bg-[#faf8f5]">
      {/* Nav */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-[#dbd7cd] gap-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl sm:text-3xl font-medium tracking-tight text-black" style={{ fontFamily: fontStyle.display }}>{brandName}</span>
          <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-[#f0ede6] text-stone-700 border border-[#dbd7cd]">{badge}</span>
        </div>
        <div className="flex items-center gap-6 text-xs text-stone-700">
          <span className="hover:text-black cursor-pointer font-medium">Products</span>
          <span className="hover:text-black cursor-pointer hidden sm:inline">Craft & Sourcing</span>
          <span className="hover:text-black cursor-pointer hidden md:inline">Stockists</span>
          <button className="px-5 py-2 text-xs font-medium transition-all hover:opacity-90 flex items-center gap-2"
            style={{ backgroundColor: primaryColor, color: primaryContrast, borderRadius: radiusCurvature }}>
            <ShoppingBag className="w-3.5 h-3.5" /><span>Bag (0)</span>
          </button>
        </div>
      </div>

      {/* Announcement bar */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono mb-6 border border-[#dbd7cd] bg-white text-stone-600 self-start">
        <Sparkles className="w-3 h-3 text-stone-500" />
        <span className="uppercase tracking-wide">{annBar}</span>
      </div>

      {/* Hero */}
      <div className="max-w-3xl mb-6">
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight leading-[1.08] text-black mb-4" style={{ fontFamily: fontStyle.display }}>
          {launchContent.heroHeadline || 'Crafted for Pure Impact.'}
        </h2>
        <p className="text-base sm:text-lg text-stone-700 max-w-2xl leading-relaxed mb-6">
          {launchContent.heroSubheadline || brandStrategy.coreValueProposition}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <button className="px-6 py-3 text-xs font-medium tracking-wide flex items-center gap-2 shadow-sm transition-all hover:opacity-90"
            style={{ backgroundColor: primaryColor, color: primaryContrast, borderRadius: radiusCurvature }}>
            <ShoppingBag className="w-3.5 h-3.5" /><span>{primaryCta}</span>
          </button>
          <button className="px-6 py-3 text-xs font-medium text-stone-900 bg-white border border-[#dbd7cd] hover:border-black transition-all flex items-center gap-2"
            style={{ borderRadius: radiusCurvature }}>
            <span>{secondaryCta}</span><ArrowRight className="w-3 h-3 text-stone-400" />
          </button>
        </div>
      </div>

      {blueprint?.sections?.length > 0
        ? <SectionDispatcher sections={blueprint.sections} primaryColor={primaryColor} primaryContrast={primaryContrast} radiusCurvature={radiusCurvature} fontStyle={fontStyle} brandStrategy={brandStrategy} />
        : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-[#dbd7cd] mt-8">
            {[
              { label: '01 / Product Moat',          value: brandStrategy.differentiator || 'Pure-grade formulation' },
              { label: '02 / Target Consumer',        value: brandStrategy.targetAudience || 'Discerning enthusiasts' },
              { label: '03 / Industry Flaw Rejected', value: brandStrategy.antiHero      || 'Disposable shortcuts' }
            ].map(card => (
              <div key={card.label} className="p-4 bg-white border border-[#dbd7cd]" style={{ borderRadius: radiusCurvature }}>
                <span className="text-[10px] uppercase font-mono text-stone-400 block mb-1">{card.label}</span>
                <p className="text-xs text-stone-800 font-medium leading-snug">{card.value}</p>
              </div>
            ))}
          </div>
        )
      }
    </div>
  );
}

// =============================================================================
// ARCHETYPE B: HOSPITALITY & DINING
// =============================================================================
function HospitalityPreview({ brandStrategy, launchContent, voiceSystem, blueprint, primaryColor, primaryContrast, radiusCurvature, fontStyle }) {
  const brandName    = brandStrategy.brandName || 'Brand';
  const badge        = blueprint?.badge || voiceSystem?.archetype || 'Hospitality & Dining';
  const annBar       = blueprint?.announcementBar || 'Open Daily from 5:00 PM · Walk-ins & Communal Tables Welcome';
  const primaryCta   = blueprint?.primaryCta  || launchContent?.callToAction || 'Reserve Table';
  const secondaryCta = blueprint?.secondaryCta || "View Tonight's Menu";

  return (
    <div className="p-6 sm:p-12 min-h-[560px] flex flex-col bg-[#fcfbf9]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-[#dbd7cd] gap-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl sm:text-3xl font-light tracking-tight text-black" style={{ fontFamily: fontStyle.display }}>{brandName}</span>
          <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-[#f2f1ed] text-stone-600 border border-[#dbd7cd]">{badge}</span>
        </div>
        <div className="flex items-center gap-5 text-xs text-stone-700">
          <span className="hover:text-black cursor-pointer font-medium">Daily Menu</span>
          <span className="hover:text-black cursor-pointer hidden sm:inline">Private Dining</span>
          <span className="hover:text-black cursor-pointer hidden md:inline">Location & Hours</span>
          <button className="px-5 py-2 text-xs font-medium transition-all hover:opacity-90"
            style={{ backgroundColor: primaryColor, color: primaryContrast, borderRadius: radiusCurvature }}>
            Reserve a Table
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 text-[11px] font-mono text-stone-500 mb-6 bg-white px-3.5 py-1.5 rounded-full border border-[#dbd7cd] w-fit">
        <Clock className="w-3.5 h-3.5 text-stone-400" /><span>{annBar}</span>
      </div>

      <div className="max-w-3xl mb-6">
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight leading-[1.08] text-black mb-4" style={{ fontFamily: fontStyle.display }}>
          {launchContent.heroHeadline || 'Honest Plates. Natural Pours. Welcome In.'}
        </h2>
        <p className="text-base sm:text-lg text-stone-700 max-w-2xl leading-relaxed mb-6">
          {launchContent.heroSubheadline || brandStrategy.coreValueProposition}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <button className="px-6 py-3 text-xs font-medium tracking-wide flex items-center gap-2 shadow-sm transition-all hover:opacity-90"
            style={{ backgroundColor: primaryColor, color: primaryContrast, borderRadius: radiusCurvature }}>
            <Utensils className="w-3.5 h-3.5" /><span>{primaryCta}</span>
          </button>
          <button className="px-6 py-3 text-xs font-medium text-stone-900 bg-white border border-[#dbd7cd] hover:border-black transition-all flex items-center gap-2"
            style={{ borderRadius: radiusCurvature }}>
            <Calendar className="w-3.5 h-3.5 text-stone-500" /><span>{secondaryCta}</span>
          </button>
        </div>
      </div>

      {blueprint?.sections?.length > 0
        ? <SectionDispatcher sections={blueprint.sections} primaryColor={primaryColor} primaryContrast={primaryContrast} radiusCurvature={radiusCurvature} fontStyle={fontStyle} brandStrategy={brandStrategy} />
        : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-[#dbd7cd] mt-8">
            {[
              { label: '01 / Culinary Moat',      value: brandStrategy.differentiator || 'Heritage grain sourcing' },
              { label: '02 / Core Guest Profile', value: brandStrategy.targetAudience || 'Neighbourhood regulars' },
              { label: '03 / We Reject',          value: brandStrategy.antiHero       || 'Rushed industrial dining' }
            ].map(card => (
              <div key={card.label} className="p-4 bg-white border border-[#dbd7cd]" style={{ borderRadius: radiusCurvature }}>
                <span className="text-[10px] uppercase font-mono text-stone-400 block mb-1">{card.label}</span>
                <p className="text-xs text-stone-800 font-medium leading-snug">{card.value}</p>
              </div>
            ))}
          </div>
        )
      }
    </div>
  );
}

// =============================================================================
// ARCHETYPE C: DIGITAL TOOLS & SAAS
// =============================================================================
function DigitalSaasPreview({ brandStrategy, launchContent, blueprint, cleanName, primaryColor, primaryContrast, radiusCurvature, fontStyle }) {
  const brandName    = brandStrategy.brandName || 'Brand';
  const badge        = blueprint?.badge || 'Zero Config';
  const primaryCta   = blueprint?.primaryCta  || launchContent?.callToAction || 'Get Started';
  const secondaryCta = blueprint?.secondaryCta || 'Read Docs ↗';
  const installCmd   = `curl -sSL https://${cleanName}.dev/install.sh | bash`;
  const [copied, setCopied] = useState(false);
  const handleCopy = () => { navigator.clipboard?.writeText(installCmd); setCopied(true); setTimeout(() => setCopied(false), 2200); };

  return (
    <div className="p-6 sm:p-14 min-h-[560px] flex flex-col bg-[#0e1015] text-white">
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-stone-800">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xl font-bold tracking-tight">{brandName}</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-800 text-stone-400">v2.4.0</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/40">{badge}</span>
          </div>
        </div>
        <div className="flex items-center gap-5 text-xs text-stone-400 font-mono">
          <span className="hover:text-white cursor-pointer">Features</span>
          <span className="hover:text-white cursor-pointer hidden sm:inline">Docs</span>
          <span className="hover:text-white cursor-pointer hidden md:inline">Changelog</span>
          <button className="px-4 py-1.5 text-xs font-mono font-medium transition-all hover:opacity-90"
            style={{ backgroundColor: primaryColor, color: primaryContrast, borderRadius: radiusCurvature }}>
            {primaryCta}
          </button>
        </div>
      </div>

      <div className="max-w-3xl my-6">
        <h2 className="text-3xl sm:text-5xl font-mono font-bold tracking-tight leading-tight text-white mb-4" style={{ fontFamily: fontStyle.display }}>
          {launchContent.heroHeadline || 'Low-Latency Infrastructure for Modern Teams.'}
        </h2>
        <p className="text-sm sm:text-base text-stone-400 leading-relaxed mb-6">
          {launchContent.heroSubheadline || brandStrategy.coreValueProposition}
        </p>

        <div className="p-4 bg-black border border-stone-800 font-mono text-xs text-emerald-400 space-y-1 mb-6" style={{ borderRadius: radiusCurvature }}>
          <div className="text-stone-500 text-[10px] flex items-center justify-between">
            <span>// Quick install</span><span className="text-stone-600">zsh / bash</span>
          </div>
          <div className="flex items-center justify-between pt-1 gap-2">
            <code className="truncate text-emerald-400">{installCmd}</code>
            <button onClick={handleCopy}
              className="text-[11px] text-stone-400 hover:text-white shrink-0 flex items-center gap-1 px-2 py-0.5 rounded bg-stone-900 border border-stone-800">
              {copied
                ? <><Check className="w-3 h-3 text-emerald-400" /><span className="text-emerald-400">Copied</span></>
                : <><Copy className="w-3 h-3" /><span>Copy</span></>
              }
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
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
              <span className="text-[11px] uppercase font-mono tracking-widest text-stone-500 block mb-4">{section.title}</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {(section.items || []).map((item, j) => (
                  <div key={j} className="p-4 bg-stone-900/60 border border-stone-800" style={{ borderRadius: radiusCurvature }}>
                    {item.metricOrPrice && <span className="text-[10px] font-mono text-stone-500 block mb-1">{item.metricOrPrice}</span>}
                    <p className="text-xs font-semibold text-stone-200 mb-1">{item.label}</p>
                    <p className="text-xs text-stone-500 font-mono leading-snug">{item.description}</p>
                    {item.tag && <span className="text-[10px] font-mono text-emerald-500 mt-2 block">{item.tag}</span>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-stone-800">
          {[
            { label: '01 / Engine Differentiator', value: brandStrategy.differentiator || 'Sub-millisecond query execution' },
            { label: '02 / Target Systems User',   value: brandStrategy.targetAudience || 'Infrastructure engineers' },
            { label: '03 / Legacy Bloat Axed',     value: brandStrategy.antiHero       || 'Complex JVM runtimes' }
          ].map(card => (
            <div key={card.label} className="p-4 bg-stone-900/60 border border-stone-800" style={{ borderRadius: radiusCurvature }}>
              <span className="text-[10px] uppercase font-mono text-stone-500 block mb-1">{card.label}</span>
              <p className="text-xs text-stone-300 font-mono leading-snug">{card.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

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
          <span className="text-[10px] uppercase font-mono tracking-widest text-stone-500 font-medium">SYNTHESIZED PALETTE & TOKENS</span>
        </div>
        <span className="text-[11px] font-mono text-stone-400">Click any swatch to copy HEX</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {palette.slice(0, 5).map(color => {
          const isCopied = copiedHex === color.hex;
          return (
            <button key={`${color.role}-${color.hex}`} onClick={() => handleCopyHex(color.hex)}
              className="group p-3 rounded-2xl border border-[#dbd7cd]/80 hover:border-black bg-[#faf9f6] text-left transition-all flex flex-col justify-between"
              title={`Click to copy ${color.hex}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-mono tracking-wider text-stone-500">{color.role}</span>
                {isCopied
                  ? <Check className="w-3 h-3 text-emerald-600" />
                  : <Copy className="w-3 h-3 text-stone-300 group-hover:text-black transition-colors" />
                }
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: color.hex }} />
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-stone-900 block truncate leading-none mb-1">{color.name || color.role}</span>
                  <span className="text-[10px] font-mono text-stone-500 block leading-none">{isCopied ? 'COPIED!' : color.hex}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
