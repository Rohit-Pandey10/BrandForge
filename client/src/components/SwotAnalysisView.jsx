import React from 'react';
import { ShieldCheck, AlertTriangle, Sparkles, ShieldAlert, Quote, ArrowUpRight, Compass, Shield } from 'lucide-react';

/**
 * SwotAnalysisView — Strategic SWOT Analysis Component
 *
 * Implements a balanced 2x2 grid with exactly 4 distinct, grounded analytical
 * points per quadrant. Eradicates sparse/empty boxes using intelligent heuristic
 * fallbacks grounded in the founder's brandStrategy.
 *
 * Adheres strictly to the 2-font system:
 * - Headlines: Cormorant Garamond
 * - Interface / Body: Inter
 * - Micro tags / Badges: JetBrains Mono (text-[11px])
 */
export default function SwotAnalysisView({ swotAnalysis, brandKit }) {
  const swot = swotAnalysis || brandKit?.swotAnalysis || {};
  const strategy = brandKit?.brandStrategy || {};
  const brandName = strategy.brandName || 'Brand';
  const diff = strategy.differentiator || 'Craft-first production and direct sourcing';
  const antiHero = strategy.antiHero || 'Generic mass-market commodities';
  const valProp = strategy.coreValueProposition || 'High-integrity experience';
  const audience = strategy.targetAudience || 'Discerning patrons';

  const summary = swot.summary || `High-conviction positioning built around "${diff.slice(0, 80)}", establishing defensible pricing power against "${antiHero.slice(0, 60)}" while requiring defensive hedges around unit cost friction and customer education.`;

  // Contextual fallback pools if LLM returned < 4 items
  const fallbackStrengths = [
    {
      title: "Distinct Operational Differentiator",
      analysis: `Deliberate commitment to ${diff.toLowerCase().slice(0, 110)}, creating authentic commercial defensibility that generic competitors cannot easily replicate.`,
      transcriptAnchor: diff.slice(0, 45)
    },
    {
      title: "Polarizing Anti-Hero Stance",
      analysis: `Explicit rejection of ${antiHero.toLowerCase().slice(0, 95)}, forging immediate trust and emotional tribal alignment with core users.`,
      transcriptAnchor: antiHero.slice(0, 45)
    },
    {
      title: "High-Margin Core Proposition",
      analysis: `Value proposition grounded in ${valProp.toLowerCase().slice(0, 100)}, commanding premium price inelasticity over mass-produced alternatives.`,
      transcriptAnchor: valProp.slice(0, 45)
    },
    {
      title: "Targeted Audience Resonance",
      analysis: `Direct focus on ${audience.toLowerCase().slice(0, 100)}, driving organic word-of-mouth adoption without wasted broad-reach ad spend.`,
      transcriptAnchor: audience.slice(0, 40)
    }
  ];

  const fallbackWeaknesses = [
    {
      title: "Higher Unit Production & Operating Costs",
      analysis: "Uncompromising ingredient/material selection and non-standard processes compress initial gross margins at lower volumes.",
      mitigation: "Establish numbered limited batch runs and pre-order deposit mechanics to lock in forward cash flow."
    },
    {
      title: "Customer Education Barrier",
      analysis: "Refusal to adopt conventional shortcuts requires educating buyers on why the product feels, tastes, or operates differently.",
      mitigation: "Publish transparent sourcing breakdowns, process dossiers, and tactile unboxing guides."
    },
    {
      title: "Niche Subculture Friction",
      analysis: "High-conviction aesthetic posture risks appearing intimidating or exclusionary to broader adjacent segments.",
      mitigation: "Maintain welcoming, grounded service touchpoints and clear introductory product tiers."
    },
    {
      title: "Longer Replenishment & Purchase Cycles",
      analysis: "Durable design or deep fulfillment rituals reduce short-term transactional churn and repeat re-order velocity.",
      mitigation: "Develop recurring companion consumables, refills, or seasonal archive collaborations."
    }
  ];

  const fallbackOpportunities = [
    {
      title: "Bespoke Physical Studio & Tasting Spaces",
      analysis: "Transform physical spaces into sensorial brand epicenters featuring live workshops, tastings, and community salons.",
      vector: "Pop-up architectural flagships in culturally aligned cultural capitals."
    },
    {
      title: "Limited-Run Archive Capsule Editions",
      analysis: "Release rare micro-batches and experimental formulas celebrating seasonal or technical craft breakthroughs.",
      vector: "Numbered collectors' capsules with digital provenance certificates."
    },
    {
      title: "Curated Strategic Wholesale & Stockist Network",
      analysis: "Partner with independent specialty boutiques, boutique hotels, and design galleries over indiscriminate retail distribution.",
      vector: "Selective global placement in top-tier design destination stockists."
    },
    {
      title: "Direct-to-Consumer Customization Programs",
      analysis: "Offer tailored calibrations, custom packaging monograms, or bespoke formulation choices at checkout.",
      vector: "High-AOV concierge customization tier for devoted brand patrons."
    }
  ];

  const fallbackThreats = [
    {
      title: "Mass-Market Incumbent Greenwashing",
      analysis: "Legacy conglomerate competitors launching superficial clone lines that mimic the aesthetic without the genuine craft.",
      defense: "Publish radical ingredient transparency, open-source lab tests, and mill/farm audit certificates."
    },
    {
      title: "Raw Material & Commodity Price Volatility",
      analysis: "Fluctuating agricultural harvest yields or specialized material costs threatening unit economics.",
      defense: "Secure multi-year fixed forward agreements and build strategic safety inventory reserves."
    },
    {
      title: "Fast-Follower Low-Cost Copycats",
      analysis: "Aggressive copycats deploying cheap synthetic replicas and subsidized digital ad spend.",
      defense: "Deepen trademark protections and anchor brand value in tangible physical rituals that cannot be dropshipped."
    },
    {
      title: "Counterfeit & Grey Market Resale Leakage",
      analysis: "Unauthorized third-party sellers diluting the unboxing experience and customer service guarantees.",
      defense: "Enforce direct-only fulfillment and register verified serial numbers with lifetime warranties."
    }
  ];

  // Helper to ensure exactly 4 items per quadrant
  const ensureFourItems = (rawItems, fallbackPool, specificKey, aliasKey) => {
    const list = Array.isArray(rawItems) ? [...rawItems] : [];
    const normalized = list.map(item => ({
      title: item.title || 'Strategic Ledger Point',
      analysis: item.analysis || item.description || 'Deep commercial trade-off analysis synthesized from founder discovery.',
      [specificKey]: item[specificKey] || item[aliasKey] || ''
    }));

    // Pad with fallbacks if fewer than 4
    for (let i = normalized.length; i < 4; i++) {
      normalized.push(fallbackPool[i % fallbackPool.length]);
    }
    return normalized.slice(0, 4);
  };

  const strengths = ensureFourItems(swot.strengths, fallbackStrengths, 'transcriptAnchor', 'transcriptAnchor');
  const weaknesses = ensureFourItems(swot.weaknesses, fallbackWeaknesses, 'mitigation', 'mitigation');
  const opportunities = ensureFourItems(swot.opportunities, fallbackOpportunities, 'vector', 'growthVector');
  const threats = ensureFourItems(swot.threats, fallbackThreats, 'defense', 'defensivePlay');

  return (
    <div className="space-y-8 animate-fade-in font-sans text-stone-900">
      
      {/* ── Executive Verdict Banner ── */}
      <div className="rounded-[28px] sm:rounded-[32px] p-6 sm:p-10 bg-[#FAF9F6] border border-[#E5E0D8] shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-amber-800 font-semibold">
            EXECUTIVE STRATEGIC VERDICT • DEFICIT & ADVANTAGE LEDGER
          </span>
        </div>

        <div className="relative pl-6 sm:pl-8 border-l-2 border-amber-600/40 my-3">
          <Quote className="w-6 h-6 text-amber-700/25 absolute -left-3 -top-2.5 -scale-x-100 fill-amber-700/10" />
          <blockquote className="text-xl sm:text-2xl md:text-3xl font-normal text-stone-900 leading-[1.3] font-serif tracking-[-0.02em]">
            "{summary}"
          </blockquote>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 mt-4 border-t border-[#E5E0D8]/60 text-xs text-stone-500 font-mono">
          <span className="flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-stone-400" />
            Commercial Defensibility Matrix ({brandName})
          </span>
          <span className="text-[11px] text-stone-400">
            Synthesized from 7-Dimension Socratic Interview Transcript
          </span>
        </div>
      </div>

      {/* ── 2x2 Editorial Grid (Balanced 4 items per quadrant) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* ── Quadrant 1: Strengths (S) — Sage / Emerald ── */}
        <div className="rounded-[28px] p-6 sm:p-8 bg-[#FAF9F6] border border-[#E5E0D8] shadow-2xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-3">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 flex items-center justify-center font-mono font-bold text-xs">
                  S
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-medium text-stone-900 font-sans leading-none">
                    [S] STRENGTHS & WEDGES
                  </h3>
                  <span className="text-[11px] font-mono text-emerald-700 tracking-wide mt-1 block">
                    Operational Trade-Offs (04 Wedges)
                  </span>
                </div>
              </div>
              <ShieldCheck className="w-5 h-5 text-emerald-600 stroke-[1.8]" />
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Deliberate choices and structural advantages derived directly from your transcript trade-offs that competitors cannot easily copy.
            </p>

            <div className="space-y-3.5 pt-1">
              {strengths.map((item, idx) => (
                <div 
                  key={idx} 
                  className="p-4 rounded-2xl bg-white border border-[#E5E0D8] shadow-2xs space-y-2 hover:border-emerald-300/80 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60 font-semibold shrink-0">
                        0{idx + 1}
                      </span>
                      <h4 className="text-sm font-semibold text-stone-900 leading-snug">
                        {item.title}
                      </h4>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed mt-1">
                    {item.analysis}
                  </p>

                  {item.transcriptAnchor && (
                    <div className="pt-1.5 flex items-center gap-1.5 text-[11px] font-mono text-emerald-900 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                      <span className="text-emerald-700 shrink-0 font-semibold">Anchor:</span>
                      <span className="truncate italic">"{item.transcriptAnchor}"</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Quadrant 2: Weaknesses (W) — Sandstone / Amber ── */}
        <div className="rounded-[28px] p-6 sm:p-8 bg-[#FAF9F6] border border-[#E5E0D8] shadow-2xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-3">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 flex items-center justify-center font-mono font-bold text-xs">
                  W
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-medium text-stone-900 font-sans leading-none">
                    [W] OPERATIONAL VULNERABILITIES
                  </h3>
                  <span className="text-[11px] font-mono text-amber-800 tracking-wide mt-1 block">
                    Commercial Penalties (04 Hedges)
                  </span>
                </div>
              </div>
              <AlertTriangle className="w-5 h-5 text-amber-600 stroke-[1.8]" />
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Honest commercial penalties and friction created by your strategic choices, paired with tactical hedge mitigations.
            </p>

            <div className="space-y-3.5 pt-1">
              {weaknesses.map((item, idx) => (
                <div 
                  key={idx} 
                  className="p-4 rounded-2xl bg-white border border-[#E5E0D8] shadow-2xs space-y-2 hover:border-amber-300/80 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60 font-semibold shrink-0">
                        0{idx + 1}
                      </span>
                      <h4 className="text-sm font-semibold text-stone-900 leading-snug">
                        {item.title}
                      </h4>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed mt-1">
                    {item.analysis}
                  </p>

                  {item.mitigation && (
                    <div className="pt-1.5 flex items-center gap-1.5 text-[11px] font-mono text-amber-900 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                      <span className="text-amber-800 shrink-0 font-semibold">Hedge:</span>
                      <span className="truncate">{item.mitigation}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Quadrant 3: Opportunities (O) — Slate / Indigo ── */}
        <div className="rounded-[28px] p-6 sm:p-8 bg-[#FAF9F6] border border-[#E5E0D8] shadow-2xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-3">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-800 flex items-center justify-center font-mono font-bold text-xs">
                  O
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-medium text-stone-900 font-sans leading-none">
                    [O] EXPANSION VECTORS
                  </h3>
                  <span className="text-[11px] font-mono text-indigo-700 tracking-wide mt-1 block">
                    Growth Channels (04 Vectors)
                  </span>
                </div>
              </div>
              <Sparkles className="w-5 h-5 text-indigo-600 stroke-[1.8]" />
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              High-conviction growth channels, product expansions, and cultural rituals that fit your exact brand archetype.
            </p>

            <div className="space-y-3.5 pt-1">
              {opportunities.map((item, idx) => (
                <div 
                  key={idx} 
                  className="p-4 rounded-2xl bg-white border border-[#E5E0D8] shadow-2xs space-y-2 hover:border-indigo-300/80 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200/60 font-semibold shrink-0">
                        0{idx + 1}
                      </span>
                      <h4 className="text-sm font-semibold text-stone-900 leading-snug">
                        {item.title}
                      </h4>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed mt-1">
                    {item.analysis}
                  </p>

                  {item.vector && (
                    <div className="pt-1.5 flex items-center gap-1.5 text-[11px] font-mono text-indigo-900 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                      <ArrowUpRight className="w-3.5 h-3.5 text-indigo-700 shrink-0" />
                      <span className="text-indigo-700 shrink-0 font-semibold">Vector:</span>
                      <span className="truncate">{item.vector}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Quadrant 4: Threats (T) — Terracotta / Rose ── */}
        <div className="rounded-[28px] p-6 sm:p-8 bg-[#FAF9F6] border border-[#E5E0D8] shadow-2xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-3">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-800 flex items-center justify-center font-mono font-bold text-xs">
                  T
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-medium text-stone-900 font-sans leading-none">
                    [T] MARKET THREATS & COUNTER-MEASURES
                  </h3>
                  <span className="text-[11px] font-mono text-rose-800 tracking-wide mt-1 block">
                    Tactical Defenses (04 Defenses)
                  </span>
                </div>
              </div>
              <ShieldAlert className="w-5 h-5 text-rose-600 stroke-[1.8]" />
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Structural market threats from fast followers, commodity price inflation, and corporate greenwashing.
            </p>

            <div className="space-y-3.5 pt-1">
              {threats.map((item, idx) => (
                <div 
                  key={idx} 
                  className="p-4 rounded-2xl bg-white border border-[#E5E0D8] shadow-2xs space-y-2 hover:border-rose-300/80 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200/60 font-semibold shrink-0">
                        0{idx + 1}
                      </span>
                      <h4 className="text-sm font-semibold text-stone-900 leading-snug">
                        {item.title}
                      </h4>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed mt-1">
                    {item.analysis}
                  </p>

                  {item.defense && (
                    <div className="pt-1.5 flex items-center gap-1.5 text-[11px] font-mono text-rose-900 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20">
                      <Shield className="w-3.5 h-3.5 text-rose-700 shrink-0" />
                      <span className="text-rose-900 shrink-0 font-semibold">Defense:</span>
                      <span className="truncate">{item.defense}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
