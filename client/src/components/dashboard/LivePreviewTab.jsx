/**
 * Live Preview Tab — Dynamic Industry Archetype Previews
 *
 * Renders domain-specific website preview mockups based on the detected industry
 * from the synthesized brand kit (Apparel / Hospitality / Developer / Editorial).
 * All previews bind synthesized CSS custom properties and color tokens dynamically.
 */

import React from 'react';
import { ShoppingBag, Scissors, ShieldCheck, ArrowRight, MapPin, Clock, Calendar, CheckCircle2 } from 'lucide-react';
import { extractClientDomain } from '../../data/mockBrandData';

export default function LivePreviewTab({ brandStrategy, voiceSystem, visualTokens, launchContent }) {
  const palette = visualTokens?.palette || [];
  const typography = visualTokens?.typography || {};
  const brandName = brandStrategy?.brandName || 'Brand Monograph';
  const cleanName = brandName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const primaryColor = palette.find(c => c.role === 'primary')?.hex || '#000000';
  const radiusCurvature =
    visualTokens?.borderCurvature === 'rounded-none' ? '0px' :
    visualTokens?.borderCurvature === 'rounded-full' ? '9999px' :
    visualTokens?.borderCurvature === 'rounded-2xl' ? '24px' :
    visualTokens?.borderCurvature === 'rounded-lg' ? '12px' : '16px';

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

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Simulated Browser Viewport */}
      <div
        className="bg-white border border-[#dbd7cd] overflow-hidden shadow-sm"
        style={{
          borderRadius: '28px',
          '--color-primary': primaryColor,
          '--radius-curvature': radiusCurvature,
          '--font-display': fontStyle.display,
          '--font-body': fontStyle.body
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
            {detectedDomain === 'fashion' ? 'APPAREL PREVIEW' : `${detectedDomain.toUpperCase()} PREVIEW`}
          </span>
        </div>

        {/* DOMAIN ARCHETYPE SWITCHER */}
        {detectedDomain === 'fashion' ? (
          <ApparelPreview
            brandStrategy={brandStrategy}
            launchContent={launchContent}
            voiceSystem={voiceSystem}
            primaryColor={primaryColor}
            radiusCurvature={radiusCurvature}
            fontStyle={fontStyle}
          />
        ) : detectedDomain === 'hospitality' ? (
          <HospitalityPreview
            brandStrategy={brandStrategy}
            launchContent={launchContent}
            voiceSystem={voiceSystem}
            primaryColor={primaryColor}
            radiusCurvature={radiusCurvature}
            fontStyle={fontStyle}
          />
        ) : detectedDomain === 'developer' ? (
          <DeveloperPreview
            brandStrategy={brandStrategy}
            launchContent={launchContent}
            cleanName={cleanName}
            primaryColor={primaryColor}
            radiusCurvature={radiusCurvature}
            fontStyle={fontStyle}
          />
        ) : (
          <EditorialPreview
            brandStrategy={brandStrategy}
            launchContent={launchContent}
            voiceSystem={voiceSystem}
            primaryColor={primaryColor}
            radiusCurvature={radiusCurvature}
            fontStyle={fontStyle}
          />
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 1. APPAREL & FASHION PREVIEW (e.g. Raw Denim, Modern Basics, Streetwear)
// ---------------------------------------------------------------------------
function ApparelPreview({ brandStrategy, launchContent, voiceSystem, primaryColor, radiusCurvature, fontStyle }) {
  const brandName = brandStrategy?.brandName || 'Brand';

  return (
    <div className="p-6 sm:p-12 min-h-[540px] flex flex-col justify-between bg-[#faf8f5]">
      {/* Store Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-[#dbd7cd] gap-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl sm:text-3xl font-medium tracking-tight text-black" style={{ fontFamily: fontStyle.display }}>
            {brandName}
          </span>
          <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-[#f0ede6] text-stone-700 border border-[#dbd7cd]">
            {voiceSystem?.archetype || 'Apparel & Goods'}
          </span>
        </div>
        <div className="flex items-center gap-6 text-xs text-stone-700">
          <span className="hover:text-black cursor-pointer font-medium">Collection</span>
          <span className="hover:text-black cursor-pointer hidden sm:inline">Raw Selvedge</span>
          <span className="hover:text-black cursor-pointer hidden md:inline">Our Fit Guide</span>
          <button
            className="px-5 py-2 text-xs font-medium text-white transition-all hover:opacity-90 flex items-center gap-2"
            style={{ backgroundColor: primaryColor, borderRadius: radiusCurvature }}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{launchContent?.callToAction || 'Shop Collection'}</span>
          </button>
        </div>
      </div>

      {/* Hero Banner (Clean, editorial, strictly apparel) */}
      <div className="max-w-3xl my-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono mb-4 border border-[#dbd7cd] bg-white text-stone-600">
          <Scissors className="w-3 h-3 text-stone-500" />
          <span>SHUTTLE-LOOM CRAFT • ZERO SYNTHETIC STRETCH • LIFETIME REPAIRS</span>
        </div>
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight leading-[1.08] text-black mb-4" style={{ fontFamily: fontStyle.display }}>
          {launchContent?.heroHeadline || 'Built to Fade. Made to Endure.'}
        </h2>
        <p className="text-base sm:text-lg text-stone-700 max-w-2xl leading-relaxed mb-6" style={{ fontFamily: fontStyle.body }}>
          {launchContent?.heroSubheadline || brandStrategy?.coreValueProposition}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <button
            className="px-6 py-3 text-xs font-medium tracking-wide text-white flex items-center gap-2 shadow-sm transition-all hover:opacity-90"
            style={{ backgroundColor: primaryColor, borderRadius: radiusCurvature }}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{launchContent?.callToAction || 'Shop Collection'}</span>
          </button>
          <button
            className="px-6 py-3 text-xs font-medium text-stone-900 bg-white border border-[#dbd7cd] hover:border-black transition-all flex items-center gap-2"
            style={{ borderRadius: radiusCurvature }}
          >
            <span>Our Fit Guide</span>
            <ArrowRight className="w-3 h-3 text-stone-400" />
          </button>
        </div>
      </div>

      {/* Section 1: Apparel Product Showcase */}
      <div className="my-8 pt-8 border-t border-[#dbd7cd]">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[11px] uppercase font-mono tracking-widest text-stone-500">SIGNATURE EDITIONS & CORE PIECES</span>
          <span className="text-xs text-stone-400 font-mono">Small-Batch Production</span>
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
              className="p-5 bg-white border border-[#dbd7cd] flex flex-col justify-between transition-all hover:border-stone-400"
              style={{ borderRadius: radiusCurvature }}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="text-base font-medium text-black" style={{ fontFamily: fontStyle.display }}>{product.name}</h4>
                  <span className="font-mono text-xs font-semibold text-stone-900">{product.price}</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed" style={{ fontFamily: fontStyle.body }}>{product.desc}</p>
              </div>
              <span className="text-[10px] font-mono text-stone-500 bg-[#f4f1ea] px-2 py-1 rounded w-fit mt-4 block">
                {product.tag}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Craftsmanship Pillars */}
      <div className="my-2 p-5 bg-white border border-[#dbd7cd] flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderRadius: radiusCurvature }}>
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-stone-700 shrink-0" />
          <div className="text-xs">
            <span className="font-semibold text-black block">The Zero-Obsolescence Vow</span>
            <span className="text-stone-600">100% natural fibers, zero elastane blowout, and free lifetime repairs on all seams.</span>
          </div>
        </div>
        <span className="text-[11px] font-mono text-stone-500 whitespace-nowrap bg-[#faf8f5] px-3 py-1 rounded-full border border-[#dbd7cd]">
          KOJIMA MILL SOURCING
        </span>
      </div>

      {/* Section 3: Strategic Narrative Footers */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[#dbd7cd]">
        {[
          { label: '01 / The Textile Edge', value: brandStrategy?.differentiator },
          { label: '02 / Core Creative Audience', value: brandStrategy?.targetAudience },
          { label: '03 / Fast-Fashion Antidote', value: brandStrategy?.antiHero }
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

// ---------------------------------------------------------------------------
// 2. HOSPITALITY & CULINARY PREVIEW (Clean, no hardcoded image placeholders)
// ---------------------------------------------------------------------------
function HospitalityPreview({ brandStrategy, launchContent, voiceSystem, primaryColor, radiusCurvature, fontStyle }) {
  const brandName = brandStrategy?.brandName || 'Brand';

  return (
    <div className="p-6 sm:p-12 min-h-[520px] flex flex-col justify-between bg-[#fcfbf9]">
      {/* Nav */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-[#dbd7cd] gap-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl sm:text-3xl font-light tracking-tight text-black" style={{ fontFamily: fontStyle.display }}>
            {brandName}
          </span>
          <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-[#f2f1ed] text-stone-600 border border-[#dbd7cd]">
            {voiceSystem?.archetype || 'Hospitality'}
          </span>
        </div>
        <div className="flex items-center gap-5 text-xs text-stone-700">
          <span className="hover:text-black cursor-pointer font-medium">Daily Menu</span>
          <span className="hover:text-black cursor-pointer hidden sm:inline">The Table</span>
          <span className="hover:text-black cursor-pointer hidden md:inline">Private Dining</span>
          <button
            className="px-5 py-2 text-xs font-medium text-white transition-all hover:opacity-90"
            style={{ backgroundColor: primaryColor, borderRadius: radiusCurvature }}
          >
            {launchContent?.callToAction || 'Reserve Table'}
          </button>
        </div>
      </div>

      {/* Location pill */}
      <div className="flex items-center gap-2 text-[11px] font-mono text-stone-500 mb-6 bg-white px-3.5 py-1.5 rounded-full border border-[#dbd7cd] w-fit">
        <MapPin className="w-3.5 h-3.5 text-stone-400" />
        <span>Neighborhood Dining • Wed–Sun 4pm–10pm • Walk-ins & Tables Welcome</span>
      </div>

      {/* Hero headline & story */}
      <div className="max-w-3xl my-2">
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight leading-[1.08] text-black mb-4" style={{ fontFamily: fontStyle.display }}>
          {launchContent?.heroHeadline || 'Big Tables. Honest Slices. Bring Everyone.'}
        </h2>
        <p className="text-base sm:text-lg text-stone-700 max-w-2xl leading-relaxed mb-6" style={{ fontFamily: fontStyle.body }}>
          {launchContent?.heroSubheadline || brandStrategy?.coreValueProposition}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <button
            className="px-6 py-3 text-xs font-medium tracking-wide text-white flex items-center gap-2"
            style={{ backgroundColor: primaryColor, borderRadius: radiusCurvature }}
          >
            <span>{launchContent?.callToAction || 'Reserve Table'}</span>
          </button>
          <button
            className="px-6 py-3 text-xs font-medium text-stone-900 bg-white border border-[#dbd7cd] hover:border-black transition-all flex items-center gap-2"
            style={{ borderRadius: radiusCurvature }}
          >
            <Clock className="w-3.5 h-3.5 text-stone-500" />
            <span>Order Ahead</span>
          </button>
          <button className="px-6 py-3 text-xs text-stone-700 hover:text-black transition-all flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-stone-400" />
            <span>View Daily Menu</span>
          </button>
        </div>
      </div>

      {/* Daily menu board */}
      <div className="my-8 pt-8 border-t border-[#dbd7cd]">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[11px] uppercase font-mono tracking-widest text-stone-500">SEASONAL HIGHLIGHTS & SPECIALS</span>
          <span className="text-xs text-stone-400 font-mono">Daily Board</span>
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
            <div key={item.name} className="p-5 bg-white border border-[#dbd7cd] flex flex-col justify-between" style={{ borderRadius: radiusCurvature }}>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="text-base font-medium text-black" style={{ fontFamily: fontStyle.display }}>{item.name}</h4>
                  <span className="font-mono text-xs font-semibold text-stone-900">{item.price}</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed" style={{ fontFamily: fontStyle.body }}>{item.desc}</p>
              </div>
              <span className="text-[10px] font-mono text-stone-400 mt-4 block">{item.tag}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[#dbd7cd]">
        {[
          { label: '01 / The Distinct Edge', value: brandStrategy?.differentiator },
          { label: '02 / Core Guest Profile', value: brandStrategy?.targetAudience },
          { label: '03 / Standard We Break', value: brandStrategy?.antiHero }
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

// ---------------------------------------------------------------------------
// 3. DEVELOPER TOOLS & SAAS PREVIEW
// ---------------------------------------------------------------------------
function DeveloperPreview({ brandStrategy, launchContent, cleanName, primaryColor, radiusCurvature, fontStyle }) {
  const brandName = brandStrategy?.brandName || 'Brand';
  return (
    <div className="p-6 sm:p-14 min-h-[500px] flex flex-col justify-between bg-[#0e1015] text-white">
      {/* Nav */}
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-stone-800">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xl font-bold tracking-tight">{brandName}</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-800 text-stone-400">v1.2.0</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/40">Zero Config</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-stone-400 font-mono">
          <span>Docs</span>
          <span>Benchmarks</span>
          <span>GitHub ★ 2.4k</span>
          <button className="px-4 py-1.5 text-xs font-mono font-medium text-white" style={{ backgroundColor: primaryColor, borderRadius: radiusCurvature }}>
            {launchContent?.callToAction || 'Install'}
          </button>
        </div>
      </div>

      {/* Hero */}
      <div className="max-w-3xl my-6">
        <div className="flex items-center gap-2 mb-4">
          {['Rust-Engine', 'Sub-1ms Latency', 'Single Binary'].map(tag => (
            <span key={tag} className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-stone-800 text-stone-300">{tag}</span>
          ))}
        </div>
        <h2 className="text-3xl sm:text-5xl font-mono font-bold tracking-tight leading-tight text-white mb-4" style={{ fontFamily: fontStyle.display }}>
          {launchContent?.heroHeadline}
        </h2>
        <p className="text-sm sm:text-base text-stone-400 leading-relaxed mb-6" style={{ fontFamily: fontStyle.body }}>
          {launchContent?.heroSubheadline || brandStrategy?.coreValueProposition}
        </p>

        {/* Terminal install */}
        <div className="p-4 bg-black border border-stone-800 font-mono text-xs text-emerald-400 space-y-1 mb-6" style={{ borderRadius: radiusCurvature }}>
          <div className="text-stone-500 text-[10px]">// Install CLI & compile bare-metal engine</div>
          <div className="flex items-center justify-between">
            <code>$ curl -fsSL https://{cleanName}.dev/install.sh | sh</code>
            <button className="text-[10px] text-stone-500 hover:text-stone-300 transition-colors">copy</button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-6 py-2.5 text-sm font-mono font-medium text-white" style={{ backgroundColor: primaryColor, borderRadius: radiusCurvature }}>
            Get Started →
          </button>
          <a href="#" className="text-sm text-stone-400 hover:text-white transition-colors font-mono">Read Docs ↗</a>
        </div>
      </div>

      {/* Bottom cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-stone-800">
        {[
          { label: '01 / Engine Differentiator', value: brandStrategy?.differentiator },
          { label: '02 / Target Systems User',   value: brandStrategy?.targetAudience },
          { label: '03 / Legacy Bloat Eliminated', value: brandStrategy?.antiHero }
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

// ---------------------------------------------------------------------------
// 4. EDITORIAL & GENERAL PREVIEW
// ---------------------------------------------------------------------------
function EditorialPreview({ brandStrategy, launchContent, voiceSystem, primaryColor, radiusCurvature, fontStyle }) {
  const brandName = brandStrategy?.brandName || 'Brand';
  return (
    <div className="p-8 sm:p-16 min-h-[480px] flex flex-col justify-between bg-white">
      {/* Nav */}
      <div className="flex items-center justify-between pb-8 mb-8 border-b border-stone-200">
        <span className="text-2xl font-light tracking-tight text-black" style={{ fontFamily: fontStyle.display }}>
          {brandName}.
        </span>
        <div className="flex items-center gap-4 text-xs text-stone-600">
          <span>Monograph</span>
          <span>Evidence</span>
          <button className="px-4 py-1.5 text-xs font-medium text-white transition-all" style={{ backgroundColor: primaryColor, borderRadius: radiusCurvature }}>
            {launchContent?.callToAction || 'Get Started'}
          </button>
        </div>
      </div>

      {/* Hero */}
      <div className="max-w-3xl my-auto py-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs mb-6 border border-stone-300 bg-stone-50 text-stone-700">
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }} />
          <span>Archetype: {voiceSystem?.archetype || 'The Master Artisan'}</span>
        </div>
        <h2 className="text-4xl sm:text-6xl font-light tracking-tight leading-[1.05] text-black mb-6" style={{ fontFamily: fontStyle.display }}>
          {launchContent?.heroHeadline}
        </h2>
        <p className="text-base sm:text-lg text-stone-600 max-w-2xl leading-relaxed mb-8" style={{ fontFamily: fontStyle.body }}>
          {launchContent?.heroSubheadline || brandStrategy?.coreValueProposition}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <button className="px-6 py-3 text-xs font-medium tracking-wide text-white flex items-center gap-1.5" style={{ backgroundColor: primaryColor, borderRadius: radiusCurvature }}>
            <span>{launchContent?.callToAction || 'Explore Archive'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button className="px-6 py-3 text-xs text-stone-800 bg-white border border-[#dbd7cd] hover:border-black transition-all" style={{ borderRadius: radiusCurvature }}>
            Read Manifesto
          </button>
        </div>
      </div>

      {/* Bottom cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-10 border-t border-stone-200">
        {[
          { label: '01 / The Distinct Edge', value: brandStrategy?.differentiator },
          { label: '02 / Core Audience',     value: brandStrategy?.targetAudience },
          { label: '03 / Standard We Break', value: brandStrategy?.antiHero }
        ].map(card => (
          <div key={card.label} className="p-4 bg-stone-50 border border-stone-200" style={{ borderRadius: radiusCurvature }}>
            <span className="text-[10px] uppercase font-mono text-stone-400 block mb-1">{card.label}</span>
            <p className="text-xs text-stone-800 font-medium leading-snug">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
