import React, { useState } from 'react';
import { ArrowRight, Sparkles, Utensils, Scissors, Database, FileText, Bot, AlertCircle } from 'lucide-react';
import { samplePitches } from '../data/mockBrandData';

const PRESET_PITCHES = [
  {
    icon: Utensils,
    category: "Culinary & Dining",
    title: "Wood-Fired Pizzeria",
    pitch: "A neighborhood wood-fired sourdough pizzeria with giant wooden sharing tables, kid-friendly open kitchen counter, and zero pretentious wine snobbery."
  },
  {
    icon: Scissors,
    category: "Apparel & Craft",
    title: "Raw Selvedge Denim",
    pitch: "An obsessive raw selvedge denim label weaving 14oz shuttle-loom jeans with natural indigo fades, chainstitched hems, and lifetime free repairs."
  },
  {
    icon: Database,
    category: "Developer Tools",
    title: "In-Memory Time-Series DB",
    pitch: "An ultra-low latency in-memory time series database built in Rust for high-frequency trading telemetry with zero garbage collection pauses."
  },
  {
    icon: FileText,
    category: "Career & B2B",
    title: "Minimalist Resume Builder",
    pitch: "A hyper-minimalist markdown resume compiler designed to survive the brutal 6-second scan of Silicon Valley engineering hiring managers."
  }
];

export default function IntakeView({ onStartInterview, onPreviewMock, isExpanding = false, serverError = '' }) {
  const [pitch, setPitch] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!pitch.trim()) {
      setError('Please share what you are building or exploring.');
      return;
    }
    setError('');
    onStartInterview(pitch.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (pitch && pitch.trim().length > 0 && !isExpanding) {
        onStartInterview(pitch.trim());
      }
    }
  };

  const handleSelectSample = (sampleText) => {
    setPitch(sampleText);
    setError('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-14 animate-fade-in font-sans">
      
      {/* ── System Status & Studio Pill ── */}
      <div className="flex items-center justify-center mb-6">
        <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-medium tracking-wide bg-stone-100 text-stone-700 border border-stone-200 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
          Strategic Brand Studio
        </span>
      </div>

      {/* ── Editorial Header ── */}
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-zinc-900 tracking-tight leading-[1.05] mb-4">
          Turn an unformed thought into an <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-rose-600">enduring identity.</span>
        </h1>
        <p className="text-zinc-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          A focused Socratic dialogue to isolate your customer, challenge conventional compromises, and author a production visual and verbal system.
        </p>
      </div>

      {/* ── Input Surface: Liquid Glass Card ── */}
      <div className="liquid-glass-card rounded-[32px] p-8 md:p-12 mb-8 transition-all">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label htmlFor="pitchInput" className="text-xs sm:text-sm font-semibold tracking-wider text-stone-700 uppercase">
                What are you building in one sentence?
              </label>
              <span className="text-xs text-stone-600 font-mono hidden sm:inline">
                Enter ↵ to launch
              </span>
            </div>
            <textarea
              id="pitchInput"
              rows={3}
              value={pitch}
              onChange={(e) => {
                setPitch(e.target.value);
                if (error) setError('');
              }}
              onKeyDown={handleKeyDown}
              placeholder="e.g. An artisanal wood-fired sourdough pizzeria with giant communal tables and open crust counter..."
              className="w-full p-5 sm:p-6 rounded-2xl bg-white/70 border border-zinc-200/80 text-black placeholder:text-stone-400 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 text-base sm:text-lg leading-relaxed resize-none transition-all outline-none"
            />
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mt-2.5">
              {error ? (
                <p className="text-xs text-red-600 font-medium border-l-2 border-red-500 pl-2">
                  {error}
                </p>
              ) : <div />}
              <p className="text-xs text-stone-600 font-medium">
                Press Enter ↵ to launch, Shift + Enter for new line
              </p>
            </div>
          </div>

          {/* Gibberish / Fragmented Input Rejection Gate Banner */}
          {serverError && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs sm:text-sm font-medium flex items-start gap-3 animate-fade-in shadow-2xs">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-semibold text-amber-950 block uppercase tracking-wider text-[11px] font-mono">
                  Input Clarification Required
                </span>
                <p className="leading-relaxed text-amber-900">
                  {serverError}
                </p>
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={onPreviewMock}
              className="text-xs sm:text-sm font-medium text-stone-600 hover:text-black transition-colors order-2 sm:order-1 cursor-pointer"
            >
              Skip to sample brand monograph &rarr;
            </button>

            {/* Signature CTA: Dark rounded button */}
            <button
              type="submit"
              disabled={isExpanding}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#1a1a1a] hover:bg-zinc-800 text-white text-sm font-semibold transition-all shadow-sm active:scale-95 disabled:opacity-40 flex items-center justify-center gap-2 order-1 sm:order-2 cursor-pointer group"
            >
              {isExpanding ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Sharpening Concept...</span>
                </>
              ) : (
                <>
                  <span>Begin Socratic Dialogue</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* ── Preset Founder Pitch Cards ── */}
        <div className="mt-8 pt-6 border-t border-zinc-200/60">
          <div className="flex items-center justify-between mb-3.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-700">
              Quick Experimentation Cards:
            </span>
            <span className="text-xs text-stone-600 font-medium">Click to populate</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {PRESET_PITCHES.map((preset) => {
              const Icon = preset.icon;
              return (
                <button
                  key={preset.title}
                  type="button"
                  onClick={() => handleSelectSample(preset.pitch)}
                  className="text-left p-4 rounded-xl border border-zinc-200/80 hover:border-orange-400 bg-white/60 hover:bg-orange-50/30 transition-all flex items-start gap-3 group cursor-pointer shadow-2xs"
                >
                  <div className="w-9 h-9 rounded-lg bg-white border border-zinc-200 flex items-center justify-center shrink-0 text-zinc-700 group-hover:text-orange-600 group-hover:border-orange-300 transition-colors shadow-2xs">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-mono uppercase tracking-wider text-stone-500 block mb-0.5">
                      {preset.category}
                    </span>
                    <h4 className="text-xs font-semibold text-stone-900 leading-snug group-hover:text-orange-600 transition-colors">
                      {preset.title}
                    </h4>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Inspiration Pills */}
          <div className="flex flex-wrap gap-2 pt-2">
            {samplePitches.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSample(sample)}
                className="rounded-full border border-zinc-200/80 bg-white/80 text-stone-700 text-xs px-3.5 py-1.5 hover:border-orange-400 hover:text-black transition-all shadow-2xs cursor-pointer truncate max-w-xs font-medium"
              >
                {sample}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Three-Stage Editorial Footnote ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-center sm:text-left">
        <div className="p-5 rounded-2xl liquid-glass-card">
          <span className="text-xs uppercase font-mono tracking-widest text-orange-600 font-semibold block mb-1">Step 01</span>
          <h4 className="text-sm font-bold text-stone-900 leading-snug">Target User</h4>
          <p className="text-xs text-stone-600 mt-1 leading-relaxed">
            Isolating the core audience and defining their primary expectation.
          </p>
        </div>
        <div className="p-5 rounded-2xl liquid-glass-card">
          <span className="text-xs uppercase font-mono tracking-widest text-orange-600 font-semibold block mb-1">Step 02</span>
          <h4 className="text-sm font-bold text-stone-900 leading-snug">Differentiation</h4>
          <p className="text-xs text-stone-600 mt-1 leading-relaxed">
            Rejecting conventional incumbent compromises to reveal your distinct angle.
          </p>
        </div>
        <div className="p-5 rounded-2xl liquid-glass-card">
          <span className="text-xs uppercase font-mono tracking-widest text-orange-600 font-semibold block mb-1">Step 03</span>
          <h4 className="text-sm font-bold text-stone-900 leading-snug">Brand Edge</h4>
          <p className="text-xs text-stone-600 mt-1 leading-relaxed">
            Setting attitude boundaries and generating production visual & voice tokens.
          </p>
        </div>
      </div>
    </div>
  );
}
