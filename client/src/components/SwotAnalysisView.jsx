import React from 'react';
import { ShieldCheck, AlertTriangle, Sparkles, ShieldAlert, Quote, ArrowUpRight, Compass, Shield } from 'lucide-react';

/**
 * SwotAnalysisView — Strategic SWOT Analysis Component
 *
 * Implements the 4th dashboard view toggle in BrandLoom.
 * Grounded in the Handhold Editorial aesthetic: warm cream paper (#FAF9F6),
 * hairline stone borders (#E5E0D8), Cormorant Garamond display serif headings,
 * and Inter regular body text with mono metadata accents.
 */
export default function SwotAnalysisView({ swotAnalysis, brandKit }) {
  const swot = swotAnalysis || brandKit?.swotAnalysis || {};
  const summary = swot.summary || "High-conviction commercial positioning isolating key defensibility wedges and market hedges.";

  const strengths = Array.isArray(swot.strengths) ? swot.strengths : [];
  const weaknesses = Array.isArray(swot.weaknesses) ? swot.weaknesses : [];
  const opportunities = Array.isArray(swot.opportunities) ? swot.opportunities : [];
  const threats = Array.isArray(swot.threats) ? swot.threats : [];

  const brandName = brandKit?.brandStrategy?.brandName || 'Brand';

  return (
    <div className="space-y-8 animate-fade-in font-sans text-zinc-900">
      
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
          <blockquote className="text-xl sm:text-2xl md:text-3xl font-light text-zinc-900 leading-[1.3] font-serif tracking-[-0.02em]">
            "{summary}"
          </blockquote>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 mt-4 border-t border-[#E5E0D8]/60 text-xs text-zinc-500 font-mono">
          <span className="flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-zinc-400" />
            Commercial Defensibility Matrix
          </span>
          <span className="text-[11px] text-zinc-400">
            Synthesized from 7-Dimension Socratic Interview Transcript
          </span>
        </div>
      </div>

      {/* ── 2x2 Editorial Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* ── Quadrant 1: Strengths (S) — Emerald/Sage ── */}
        <div className="rounded-[28px] p-6 sm:p-8 bg-[#FAF9F6] border border-[#E5E0D8] shadow-2xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-3">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 flex items-center justify-center font-mono font-bold text-xs">
                  S
                </span>
                <div>
                  <h3 className="text-lg sm:text-xl font-medium text-zinc-900 font-serif leading-none">
                    Core Strengths & Wedges
                  </h3>
                  <span className="text-[11px] font-mono text-emerald-700 tracking-wide">
                    Chosen Operational Trade-Offs ({strengths.length})
                  </span>
                </div>
              </div>
              <ShieldCheck className="w-5 h-5 text-emerald-600 stroke-[1.8]" />
            </div>

            <p className="text-xs text-zinc-600 leading-relaxed">
              Deliberate choices and structural advantages derived directly from your transcript trade-offs that competitors cannot easily copy.
            </p>

            <div className="space-y-4 pt-2">
              {strengths.length > 0 ? (
                strengths.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="p-4 rounded-2xl bg-white border border-[#E5E0D8] shadow-2xs space-y-2 hover:border-emerald-300/80 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-semibold text-zinc-900 leading-snug">
                        {item.title}
                      </h4>
                      <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 shrink-0 font-medium">
                        Wedge 0{idx + 1}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-700 leading-relaxed">
                      {item.description}
                    </p>

                    {item.transcriptAnchor && (
                      <div className="pt-1.5 flex items-center gap-1.5 text-[11px] font-mono text-emerald-900 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                        <span className="text-emerald-700 shrink-0 font-semibold">Anchor:</span>
                        <span className="truncate italic">"{item.transcriptAnchor}"</span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-zinc-400 italic">No explicit strengths compiled.</p>
              )}
            </div>
          </div>
        </div>

        {/* ── Quadrant 2: Weaknesses (W) — Amber/Sandstone ── */}
        <div className="rounded-[28px] p-6 sm:p-8 bg-[#FAF9F6] border border-[#E5E0D8] shadow-2xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-3">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 flex items-center justify-center font-mono font-bold text-xs">
                  W
                </span>
                <div>
                  <h3 className="text-lg sm:text-xl font-medium text-zinc-900 font-serif leading-none">
                    Commercial Vulnerabilities
                  </h3>
                  <span className="text-[11px] font-mono text-amber-800 tracking-wide">
                    Operational Costs & Friction ({weaknesses.length})
                  </span>
                </div>
              </div>
              <AlertTriangle className="w-5 h-5 text-amber-600 stroke-[1.8]" />
            </div>

            <p className="text-xs text-zinc-600 leading-relaxed">
              Honest commercial penalties and friction created by your strategic choices, paired with tactical hedge mitigations.
            </p>

            <div className="space-y-4 pt-2">
              {weaknesses.length > 0 ? (
                weaknesses.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="p-4 rounded-2xl bg-white border border-[#E5E0D8] shadow-2xs space-y-2 hover:border-amber-300/80 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-semibold text-zinc-900 leading-snug">
                        {item.title}
                      </h4>
                      <span className="text-[10px] font-mono text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60 shrink-0 font-medium">
                        Risk 0{idx + 1}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-700 leading-relaxed">
                      {item.description}
                    </p>

                    {item.mitigation && (
                      <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-0.5">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-amber-900 font-semibold block">
                          Actionable Mitigation Hedge:
                        </span>
                        <p className="text-xs text-amber-950 leading-relaxed">
                          {item.mitigation}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-zinc-400 italic">No explicit weaknesses compiled.</p>
              )}
            </div>
          </div>
        </div>

        {/* ── Quadrant 3: Opportunities (O) — Indigo/Slate ── */}
        <div className="rounded-[28px] p-6 sm:p-8 bg-[#FAF9F6] border border-[#E5E0D8] shadow-2xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-3">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-800 flex items-center justify-center font-mono font-bold text-xs">
                  O
                </span>
                <div>
                  <h3 className="text-lg sm:text-xl font-medium text-zinc-900 font-serif leading-none">
                    Expansion Vectors
                  </h3>
                  <span className="text-[11px] font-mono text-indigo-700 tracking-wide">
                    Cultural & Retail Wedges ({opportunities.length})
                  </span>
                </div>
              </div>
              <Sparkles className="w-5 h-5 text-indigo-600 stroke-[1.8]" />
            </div>

            <p className="text-xs text-zinc-600 leading-relaxed">
              High-conviction growth channels, product expansions, and cultural rituals that fit your exact brand archetype.
            </p>

            <div className="space-y-4 pt-2">
              {opportunities.length > 0 ? (
                opportunities.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="p-4 rounded-2xl bg-white border border-[#E5E0D8] shadow-2xs space-y-2 hover:border-indigo-300/80 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-semibold text-zinc-900 leading-snug">
                        {item.title}
                      </h4>
                      <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200/60 shrink-0 font-medium">
                        Vector 0{idx + 1}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-700 leading-relaxed">
                      {item.description}
                    </p>

                    {item.growthVector && (
                      <div className="pt-1.5 flex items-center gap-1.5 text-[11px] font-mono text-indigo-900 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                        <ArrowUpRight className="w-3.5 h-3.5 text-indigo-700 shrink-0" />
                        <span className="text-indigo-700 shrink-0 font-semibold">Growth Vector:</span>
                        <span className="truncate">{item.growthVector}</span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-zinc-400 italic">No explicit opportunities compiled.</p>
              )}
            </div>
          </div>
        </div>

        {/* ── Quadrant 4: Threats (T) — Rose/Terracotta ── */}
        <div className="rounded-[28px] p-6 sm:p-8 bg-[#FAF9F6] border border-[#E5E0D8] shadow-2xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-3">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-800 flex items-center justify-center font-mono font-bold text-xs">
                  T
                </span>
                <div>
                  <h3 className="text-lg sm:text-xl font-medium text-zinc-900 font-serif leading-none">
                    Incumbent Counter-Measures
                  </h3>
                  <span className="text-[11px] font-mono text-rose-800 tracking-wide">
                    Market Threats & Defense Playbook ({threats.length})
                  </span>
                </div>
              </div>
              <ShieldAlert className="w-5 h-5 text-rose-600 stroke-[1.8]" />
            </div>

            <p className="text-xs text-zinc-600 leading-relaxed">
              Structural market threats from fast followers, commodity price inflation, and corporate greenwashing.
            </p>

            <div className="space-y-4 pt-2">
              {threats.length > 0 ? (
                threats.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="p-4 rounded-2xl bg-white border border-[#E5E0D8] shadow-2xs space-y-2 hover:border-rose-300/80 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-semibold text-zinc-900 leading-snug">
                        {item.title}
                      </h4>
                      <span className="text-[10px] font-mono text-rose-800 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200/60 shrink-0 font-medium">
                        Threat 0{idx + 1}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-700 leading-relaxed">
                      {item.description}
                    </p>

                    {item.defensivePlay && (
                      <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-0.5">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-rose-900 font-semibold flex items-center gap-1">
                          <Shield className="w-3 h-3 text-rose-700" />
                          Defensive Playbook:
                        </span>
                        <p className="text-xs text-rose-950 leading-relaxed">
                          {item.defensivePlay}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-zinc-400 italic">No explicit threats compiled.</p>
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
