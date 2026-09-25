import React from 'react';

/**
 * HowItWorks Component
 * Design System:
 * - Top Badge: Pill reading "HOW IT WORKS"
 * - Headline: "Three steps to a full brand" with "full brand" in orange-to-red gradient
 * - 3-column grid of white rounded-2xl cards with subtle borders:
 *     Card 1: Small red text "STEP 01", Title "Describe", description
 *     Card 2: Small red text "STEP 02", Title "Generate", description
 *     Card 3: Small red text "STEP 03", Title "Refine & Export", description
 */
export default function HowItWorks() {
  const steps = [
    {
      step: 'STEP 01',
      title: 'Describe',
      description:
        'Share your raw idea, audience, or aesthetic preference in a single conversational prompt. No tedious questionnaires or design jargon required.'
    },
    {
      step: 'STEP 02',
      title: 'Generate',
      description:
        'Our brand intelligence engine synthesizes your complete identity — colors, typography scales, voice pillars, and vector marks — in under 30 seconds.'
    },
    {
      step: 'STEP 03',
      title: 'Refine & Export',
      description:
        'Inspect the brand in interactive context, tweak details with real-time previewing, and export code-ready tokens (CSS/JSON) and SVG logos.'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 relative bg-stone-50/50">
      <div className="max-w-7xl mx-auto">
        
        {/* ── Section Header ── */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          
          {/* Top Badge */}
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#f4efe8] border border-stone-200/80 mb-5 shadow-xs">
            <span className="text-xs font-semibold tracking-wider text-zinc-700 uppercase">
              HOW IT WORKS
            </span>
          </div>

          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-zinc-900 tracking-tight leading-tight">
            Three steps to a{' '}
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              full brand
            </span>
          </h2>
        </div>

        {/* ── 3-Column Steps Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-zinc-200/60 p-8 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 relative group"
            >
              {/* Step Pill / Badge */}
              <div className="text-xs font-bold text-red-500 uppercase tracking-widest mb-4">
                {item.step}
              </div>

              {/* Step Title */}
              <h3 className="text-2xl font-bold text-zinc-900 tracking-tight mb-3">
                {item.title}
              </h3>

              {/* Step Description */}
              <p className="text-sm sm:text-base text-zinc-500 leading-relaxed">
                {item.description}
              </p>

              {/* Subtle bottom indicator */}
              <div className="mt-8 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-400 font-medium">
                <span>Phase {idx + 1} of 3</span>
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-200 group-hover:bg-orange-500 transition-colors" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
