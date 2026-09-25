import React, { useState } from 'react';
import { ArrowRight, Sparkles, Utensils, Scissors, Database, FileText, Bot } from 'lucide-react';
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

export default function IntakeView({ onStartInterview, onPreviewMock, isExpanding = false }) {
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
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white border border-zinc-200 shadow-2xs text-xs text-zinc-600">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-zinc-800">
            Socratic Brand Studio
          </span>
          <span className="text-zinc-300">•</span>
          <span className="text-zinc-500">
            Gemini 2.5 Flash & Groq LLaMA 3.3
          </span>
        </div>
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

      {/* ── Input Surface: Clean White Card with Shaurya's Design Tokens ── */}
      <div className="bg-white/95 rounded-3xl border border-zinc-200/80 shadow-xs p-6 sm:p-10 mb-8 backdrop-blur-sm transition-all">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label htmlFor="pitchInput" className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                What are you building in one sentence?
              </label>
              <span className="text-[11px] text-zinc-400 font-mono hidden sm:inline">
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
              className="w-full p-4 sm:p-5 rounded-2xl bg-zinc-50/70 border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 text-sm sm:text-base leading-relaxed resize-none transition-all outline-none"
            />
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mt-2">
              {error ? (
                <p className="text-xs text-red-600 font-medium border-l-2 border-red-500 pl-2">
                  {error}
                </p>
              ) : <div />}
              <p className="text-[11px] text-zinc-400 font-normal">
                Press Enter ↵ to launch, Shift + Enter for new line
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={onPreviewMock}
              className="text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors order-2 sm:order-1 cursor-pointer"
            >
              Skip to sample brand monograph &rarr;
            </button>

            {/* Signature CTA: Dark rounded button */}
            <button
              type="submit"
              disabled={isExpanding}
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-[#1a1a1a] hover:bg-zinc-800 text-white text-sm font-semibold transition-all shadow-sm active:scale-95 disabled:opacity-40 flex items-center justify-center gap-2 order-1 sm:order-2 cursor-pointer group"
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

        {/* ── Preset Founder Pitch Cards (Shaurya's Curated Cards) ── */}
        <div className="mt-8 pt-6 border-t border-zinc-100">
          <div className="flex items-center justify-between mb-3.5">
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
              Quick Experimentation Cards:
            </span>
            <span className="text-[11px] text-zinc-400">Click to populate</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {PRESET_PITCHES.map((preset) => {
              const Icon = preset.icon;
              return (
                <button
                  key={preset.title}
                  type="button"
                  onClick={() => handleSelectSample(preset.pitch)}
                  className="text-left p-3.5 rounded-xl border border-zinc-200/80 hover:border-orange-400 bg-zinc-50/50 hover:bg-orange-50/20 transition-all flex items-start gap-3 group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-white border border-zinc-200 flex items-center justify-center shrink-0 text-zinc-700 group-hover:text-orange-600 group-hover:border-orange-300 transition-colors shadow-2xs">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block mb-0.5">
                      {preset.category}
                    </span>
                    <h4 className="text-xs font-semibold text-zinc-900 leading-snug group-hover:text-orange-600 transition-colors">
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
                className="rounded-full border border-zinc-200 bg-white text-zinc-600 text-xs px-3.5 py-1 hover:border-orange-400 hover:text-zinc-900 transition-all shadow-2xs cursor-pointer truncate max-w-xs"
              >
                {sample}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Three-Stage Editorial Footnote ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-center sm:text-left">
        <div className="p-4 rounded-2xl bg-white border border-zinc-200/60 shadow-2xs">
          <span className="text-[10px] uppercase font-mono tracking-widest text-orange-600 font-semibold block mb-1">Step 01</span>
          <h4 className="text-sm font-bold text-zinc-900 leading-snug">Target User</h4>
          <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
            Isolating the core audience and defining their primary expectation.
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-zinc-200/60 shadow-2xs">
          <span className="text-[10px] uppercase font-mono tracking-widest text-orange-600 font-semibold block mb-1">Step 02</span>
          <h4 className="text-sm font-bold text-zinc-900 leading-snug">Differentiation</h4>
          <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
            Rejecting conventional incumbent compromises to reveal your distinct angle.
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-zinc-200/60 shadow-2xs">
          <span className="text-[10px] uppercase font-mono tracking-widest text-orange-600 font-semibold block mb-1">Step 03</span>
          <h4 className="text-sm font-bold text-zinc-900 leading-snug">Brand Edge</h4>
          <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
            Setting attitude boundaries and generating production visual & voice tokens.
          </p>
        </div>
      </div>
    </div>
  );
}
