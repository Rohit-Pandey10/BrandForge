import React from 'react';
import { Sparkles, Presentation, Pencil } from 'lucide-react';

/**
 * Features Component
 * Design System:
 * - Top Badge: Pill reading "WHAT BRANDFORGE DOES"
 * - Headline: "Everything a brand needs. Nothing you don't." with "Nothing you don't." in orange-to-red gradient
 * - Subhead: "From first concept to export-ready kit — the full identity pipeline, automated."
 * - 3-column grid of pure white rounded-2xl cards with subtle borders & soft shadows:
 *     1. Spark icon -> AI Brand Intelligence
 *     2. Presentation board icon -> Complete Identity Suite
 *     3. Pencil icon -> Refine Iteratively
 */
export default function Features() {
  const featureList = [
    {
      icon: Sparkles,
      iconBg: 'bg-orange-50 text-orange-500 border-orange-200/60',
      title: 'AI Brand Intelligence',
      description:
        'Synthesizes your initial concept into coherent brand archetypes, strategic core values, and market positioning that truly resonate with your audience.'
    },
    {
      icon: Presentation,
      iconBg: 'bg-red-50 text-red-500 border-red-200/60',
      title: 'Complete Identity Suite',
      description:
        'Generates harmonious color palettes with contrast verification, calibrated typography pairings, voice guidelines, and geometric vector logos.'
    },
    {
      icon: Pencil,
      iconBg: 'bg-amber-50 text-amber-600 border-amber-200/60',
      title: 'Refine Iteratively',
      description:
        'Fine-tune color tokens, typography scales, and brand tone in real time. Effortlessly export production-ready JSON, CSS variables, and SVG assets.'
    }
  ];

  return (
    <section id="features" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* ── Section Header ── */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          
          {/* Top Badge */}
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#f4efe8] border border-stone-200/80 mb-5 shadow-xs">
            <span className="text-xs font-semibold tracking-wider text-zinc-700 uppercase">
              WHAT BRANDFORGE DOES
            </span>
          </div>

          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-zinc-900 tracking-tight leading-tight mb-5">
            Everything a brand needs.{' '}
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent block sm:inline">
              Nothing you don't.
            </span>
          </h2>

          {/* Subhead */}
          <p className="text-base sm:text-lg text-zinc-500 leading-relaxed">
            From first concept to export-ready kit — the full identity pipeline, automated.
          </p>
        </div>

        {/* ── 3-Column Features Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featureList.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-zinc-200/60 p-8 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group"
              >
                {/* Feature Icon */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center border mb-6 transition-transform duration-300 group-hover:scale-110 ${item.iconBg}`}
                >
                  <Icon className="w-6 h-6" />
                </div>

                {/* Feature Title */}
                <h3 className="text-xl font-bold text-zinc-900 tracking-tight mb-3">
                  {item.title}
                </h3>

                {/* Feature Description */}
                <p className="text-sm sm:text-base text-zinc-500 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
