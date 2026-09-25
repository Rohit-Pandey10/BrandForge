import React, { useState } from 'react';
<<<<<<< HEAD
import { 
  ArrowRight, 
  Utensils, 
  Scissors, 
  Database, 
  FileText 
} from 'lucide-react';
import { samplePitches } from '../data/mockBrandData';

const QUICK_CARDS = [
  {
    category: 'CULINARY & DINING',
    title: 'Wood-Fired Pizzeria',
    icon: Utensils,
    pitch: 'A cozy family-friendly wood-fired pizza restaurant with long communal tables and honest ingredients.'
  },
  {
    category: 'APPAREL & CRAFT',
    title: 'Raw Selvedge Denim',
    icon: Scissors,
    pitch: 'Heirloom 14oz Japanese raw selvedge denim jeans crafted with solid copper hardware and zero synthetic stretch.'
  },
  {
    category: 'DEVELOPER TOOLS',
    title: 'In-Memory Time-Series DB',
    icon: Database,
    pitch: 'An in-memory developer database compiling complex SQL into bare-metal Rust in under 1 millisecond.'
  },
  {
    category: 'CAREER & B2B',
    title: 'Minimalist Resume Builder',
    icon: FileText,
    pitch: 'A minimalist resume builder tailored for the 6-second glance of engineering managers.'
  }
];

const STEPS = [
  {
    step: 'STEP 01',
    title: 'Target User',
    description: 'Isolating the core audience and defining their primary expectation.'
  },
  {
    step: 'STEP 02',
    title: 'Differentiation',
    description: 'Rejecting conventional incumbent compromises to reveal your distinct angle.'
  },
  {
    step: 'STEP 03',
    title: 'Brand Edge',
    description: 'Setting attitude boundaries and generating production visual & voice tokens.'
  }
];

export default function IntakeView({ onStartInterview, onPreviewMock, isExpanding = false }) {
=======
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
>>>>>>> dc9bada763cc7d97945289cc141d87886243899d
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
<<<<<<< HEAD
    <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-14 animate-fade-in">
      {/* Editorial Header */}
      <div className="text-center mb-10 sm:mb-14">
        <span className="inline-block text-xs sm:text-sm font-semibold uppercase tracking-[0.14em] text-stone-600 mb-4 font-mono">
          Brand Architecture &bull; Monograph 01
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal text-black tracking-[-0.025em] leading-[1.08] mb-5">
          Turn an unformed thought into an enduring identity.
        </h1>
        <p className="text-stone-700 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed font-normal">
          A focused Socratic dialogue to isolate your customer, challenge conventional compromises, and author a distinct visual and verbal system.
        </p>
      </div>

      {/* Input Surface: Clean White Card Floating on Paper Canvas */}
      <div className="bg-white rounded-[32px] border border-[#dbd7cd] p-6 sm:p-10 mb-8 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="pitchInput" className="block text-sm sm:text-base font-semibold text-stone-900 tracking-normal mb-2.5">
              What are you building in one sentence?
            </label>
=======
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
>>>>>>> dc9bada763cc7d97945289cc141d87886243899d
            <textarea
              id="pitchInput"
              rows={3}
              value={pitch}
              onChange={(e) => {
                setPitch(e.target.value);
                if (error) setError('');
              }}
<<<<<<< HEAD
              placeholder="e.g. A minimalist resume builder designed for the 6-second glance of hiring managers..."
              className="w-full p-4 sm:p-5 rounded-2xl bg-[#f2f1ed]/50 border border-[#dbd7cd] text-black placeholder:text-stone-400 focus:outline-none focus:border-black text-base sm:text-lg leading-relaxed resize-none transition-colors"
            />
            {error && (
              <p className="mt-2.5 text-sm font-medium text-red-600 border-l-2 border-red-600 pl-2.5">
                {error}
=======
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
>>>>>>> dc9bada763cc7d97945289cc141d87886243899d
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
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
            <button
              type="button"
              onClick={onPreviewMock}
<<<<<<< HEAD
              className="text-sm sm:text-base text-stone-600 hover:text-black font-medium transition-colors order-2 sm:order-1"
=======
              className="text-xs sm:text-sm font-medium text-stone-600 hover:text-black transition-colors order-2 sm:order-1 cursor-pointer"
>>>>>>> dc9bada763cc7d97945289cc141d87886243899d
            >
              Skip to sample brand monograph &rarr;
            </button>

            {/* Signature CTA: Dark rounded button */}
            <button
              type="submit"
              disabled={isExpanding}
<<<<<<< HEAD
              className="w-full sm:w-auto px-7 py-3 rounded-full bg-black text-white hover:bg-neutral-800 disabled:bg-stone-300 text-base sm:text-lg font-medium transition-all flex items-center justify-center gap-2.5 order-1 sm:order-2 shadow-sm"
=======
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#1a1a1a] hover:bg-zinc-800 text-white text-sm font-semibold transition-all shadow-sm active:scale-95 disabled:opacity-40 flex items-center justify-center gap-2 order-1 sm:order-2 cursor-pointer group"
>>>>>>> dc9bada763cc7d97945289cc141d87886243899d
            >
              {isExpanding ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Sharpening Concept...</span>
                </>
              ) : (
                <>
<<<<<<< HEAD
                  <span>Begin Dialogue</span>
                  <ArrowRight className="w-4 h-4 stroke-[2]" />
=======
                  <span>Begin Socratic Dialogue</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
>>>>>>> dc9bada763cc7d97945289cc141d87886243899d
                </>
              )}
            </button>
          </div>
        </form>

<<<<<<< HEAD
        {/* Quick Experimentation Cards */}
        <div className="mt-10 pt-8 border-t border-[#dbd7cd]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs sm:text-sm font-bold tracking-wider uppercase text-stone-900 font-mono">
              QUICK EXPERIMENTATION CARDS:
            </span>
            <span className="text-xs sm:text-sm text-stone-600 font-medium">
              Click to populate
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 mb-6">
            {QUICK_CARDS.map((card, idx) => {
              const Icon = card.icon;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSample(card.pitch)}
                  className="p-4 sm:p-5 rounded-2xl border border-stone-200 bg-white hover:border-black hover:shadow-md transition-all text-left flex items-center gap-4 group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center text-stone-700 group-hover:bg-black group-hover:text-white transition-colors flex-shrink-0">
                    <Icon className="w-6 h-6 stroke-[1.8]" />
                  </div>
                  <div>
                    <span className="block text-xs font-mono uppercase font-bold tracking-wider text-stone-600 group-hover:text-stone-900 transition-colors">
                      {card.category}
                    </span>
                    <span className="block text-base sm:text-lg font-semibold text-stone-900 leading-snug mt-0.5">
                      {card.title}
                    </span>
=======
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
                    <h4 className="text-lg font-semibold text-stone-900 leading-snug group-hover:text-orange-600 transition-colors">
                      {preset.title}
                    </h4>
>>>>>>> dc9bada763cc7d97945289cc141d87886243899d
                  </div>
                </button>
              );
            })}
          </div>

<<<<<<< HEAD
          {/* Prompt Pills */}
          <div className="flex flex-wrap gap-2.5">
=======
          {/* Quick Inspiration Pills */}
          <div className="flex flex-wrap gap-2 pt-2">
>>>>>>> dc9bada763cc7d97945289cc141d87886243899d
            {samplePitches.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSample(sample)}
<<<<<<< HEAD
                className="rounded-full border border-stone-300 bg-stone-50 hover:bg-white text-stone-800 text-xs sm:text-sm font-medium px-4 py-2 hover:border-black transition-all text-left max-w-full truncate"
                title={sample}
=======
                className="rounded-full border border-zinc-200/80 bg-white/80 text-stone-700 text-xs px-3.5 py-1.5 hover:border-orange-400 hover:text-black transition-all shadow-2xs cursor-pointer truncate max-w-xs font-medium"
>>>>>>> dc9bada763cc7d97945289cc141d87886243899d
              >
                {sample.length > 55 ? `${sample.slice(0, 52)}...` : sample}
              </button>
            ))}
          </div>
        </div>
      </div>

<<<<<<< HEAD
      {/* Floating Three-Stage Editorial Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {STEPS.map((s, idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl border border-[#dbd7cd] p-6 sm:p-7 shadow-xs hover:shadow-sm transition-shadow"
          >
            <span className="text-xs sm:text-sm font-mono font-bold tracking-widest text-[#ea580c] uppercase block mb-2">
              {s.step}
            </span>
            <h4 className="font-serif text-2xl sm:text-3xl text-black font-normal leading-snug mb-2.5">
              {s.title}
            </h4>
            <p className="text-sm sm:text-base text-stone-700 leading-relaxed font-normal">
              {s.description}
            </p>
          </div>
        ))}
=======
      {/* ── Three-Stage Editorial Footnote ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-center sm:text-left">
        <div className="p-5 rounded-2xl liquid-glass-card">
          <span className="text-xs uppercase font-mono tracking-widest text-orange-600 font-semibold block mb-1">Step 01</span>
          <h4 className="text-2xl font-extrabold text-stone-900 leading-tight mb-3">Target User</h4>
          <p className="text-base text-stone-600 leading-relaxed">
            Isolating the core audience and defining their primary expectation.
          </p>
        </div>
        <div className="p-5 rounded-2xl liquid-glass-card">
          <span className="text-xs uppercase font-mono tracking-widest text-orange-600 font-semibold block mb-1">Step 02</span>
          <h4 className="text-2xl font-extrabold text-stone-900 leading-tight mb-3">Differentiation</h4>
          <p className="text-base text-stone-600 leading-relaxed">
            Rejecting conventional incumbent compromises to reveal your distinct angle.
          </p>
        </div>
        <div className="p-5 rounded-2xl liquid-glass-card">
          <span className="text-xs uppercase font-mono tracking-widest text-orange-600 font-semibold block mb-1">Step 03</span>
          <h4 className="text-2xl font-extrabold text-stone-900 leading-tight mb-3">Brand Edge</h4>
          <p className="text-base text-stone-600 leading-relaxed">
            Setting attitude boundaries and generating production visual & voice tokens.
          </p>
        </div>
>>>>>>> dc9bada763cc7d97945289cc141d87886243899d
      </div>
    </div>
  );
}
