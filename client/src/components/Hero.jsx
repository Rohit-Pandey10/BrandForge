import React, { useState } from 'react';
import { Sparkles, ArrowRight, Zap, Palette, Layers, CheckCircle2 } from 'lucide-react';

/**
 * Hero Component
 * Design System:
 * - Warm soft cream backdrop (#fbfaf9)
 * - Centered layout with massive typography
 * - Top Badge: Beige pill, orange pulsing dot, "AI-POWERED BRAND GENERATION"
 * - Main Headline: "Your brand, forged from a single idea." with "forged" in vibrant orange-red gradient
 * - Subheadline: Clean muted text
 * - Input Bar: White pill container with spark icon, input, and solid pill button "Forge Brand ->"
 * - Two absolute positioned floating cards (left tilted with pale yellow icon, right tilted with pale pink icon)
 */
export default function Hero({
  pitch = '',
  onPitchChange,
  onSubmit,
  isLoading = false
}) {
  const [internalPitch, setInternalPitch] = useState(pitch);

  const currentPitch = onPitchChange ? pitch : internalPitch;

  const handleChange = (e) => {
    const val = e.target.value;
    if (onPitchChange) {
      onPitchChange(val);
    } else {
      setInternalPitch(val);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(currentPitch);
    }
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-32 px-4 sm:px-6 lg:px-8">
      
      {/* ── Ambient Radial Glows (Subtle and Warm) ── */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-gradient-to-tr from-orange-200/30 via-amber-100/20 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* ── Outer Relative Container for Centered Content & Floating Cards ── */}
      <div className="max-w-5xl mx-auto text-center relative">

        {/* ── Left Floating Card (Tilted Slightly, Pale Yellow Icon) ── */}
        <div className="hidden lg:flex absolute -left-8 xl:-left-16 top-1/3 -rotate-6 bg-white rounded-2xl p-4 border border-zinc-200/60 shadow-sm hover:shadow-md transition-all duration-300 hover:rotate-0 hover:scale-105 z-20 items-center gap-3.5 select-none pointer-events-auto">
          {/* Pale yellow icon container */}
          <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600 shadow-inner">
            <Zap className="w-5 h-5 fill-amber-400/40 text-amber-600" />
          </div>
          <div className="text-left">
            <div className="text-xs uppercase tracking-wider text-amber-600 font-semibold mb-0.5">30s AI Engine</div>
            <div className="text-sm font-semibold text-zinc-900">Vector logos + JSON</div>
          </div>
        </div>

        {/* ── Right Floating Card (Tilted Slightly, Pale Pink Icon) ── */}
        <div className="hidden lg:flex absolute -right-8 xl:-right-16 top-1/2 rotate-6 bg-white rounded-2xl p-4 border border-zinc-200/60 shadow-sm hover:shadow-md transition-all duration-300 hover:rotate-0 hover:scale-105 z-20 items-center gap-3.5 select-none pointer-events-auto">
          {/* Pale pink icon container */}
          <div className="w-11 h-11 rounded-xl bg-rose-50 border border-rose-200/60 flex items-center justify-center text-rose-500 shadow-inner">
            <Palette className="w-5 h-5 fill-rose-300/30 text-rose-500" />
          </div>
          <div className="text-left">
            <div className="text-xs uppercase tracking-wider text-rose-500 font-semibold mb-0.5">Color &amp; Voice</div>
            <div className="text-sm font-semibold text-zinc-900">Full brand identity</div>
          </div>
        </div>

        {/* ── Top Pill Badge ── */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#f4efe8] border border-stone-200/80 mb-8 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-xs font-semibold tracking-wider text-zinc-700 uppercase">
            AI-POWERED BRAND GENERATION
          </span>
        </div>

        {/* ── Main Headline ── */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-zinc-900 tracking-tight leading-[1.08] mb-6">
          Your brand,{' '}
          <span className="bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 bg-clip-text text-transparent">
            forged
          </span>{' '}
          from a single idea.
        </h1>

        {/* ── Subheadline ── */}
        <p className="text-lg sm:text-xl text-zinc-500 max-w-2xl mx-auto font-normal leading-relaxed mb-10">
          Describe what you're building — even in rough, unfinished language. BrandForge turns your prompt into a complete brand identity in under 30 seconds.
        </p>

        {/* ── Input Bar ── */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-2xl mx-auto bg-white rounded-full p-2 pl-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-zinc-200/80 flex items-center gap-3 transition-all focus-within:shadow-[0_12px_36px_rgb(0,0,0,0.1)] focus-within:border-zinc-300"
        >
          {/* Spark Icon */}
          <Sparkles className="w-5 h-5 text-orange-500 shrink-0" />

          {/* Text Input */}
          <input
            type="text"
            value={currentPitch}
            onChange={handleChange}
            placeholder="Describe your brand idea..."
            className="w-full bg-transparent text-zinc-900 placeholder-zinc-400 text-sm sm:text-base focus:outline-none"
          />

          {/* Solid Gray Pill Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="bg-zinc-800 hover:bg-zinc-900 active:scale-95 text-white font-medium text-sm px-6 py-3 rounded-full flex items-center gap-2 transition-all shrink-0 shadow-sm cursor-pointer disabled:opacity-70 group"
          >
            <span>{isLoading ? 'Forging...' : 'Forge Brand'}</span>
            <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-0.5 group-hover:text-white transition-all" />
          </button>
        </form>

        {/* ── Social Proof / Micro-Specs ── */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-500">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Zero design skills required</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Export SVG, JSON &amp; CSS Tokens</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Commercial-use ready</span>
          </div>
        </div>

      </div>

    </section>
  );
}
