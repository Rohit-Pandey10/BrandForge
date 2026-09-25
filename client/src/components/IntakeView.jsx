import React, { useState } from 'react';
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
  const [pitch, setPitch] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!pitch.trim()) {
      setError('Please share what you are building or exploring.');
      return;
    }
    setError('');
    onStartInterview(pitch.trim());
  };

  const handleSelectSample = (sampleText) => {
    setPitch(sampleText);
    setError('');
  };

  return (
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
            <textarea
              id="pitchInput"
              rows={3}
              value={pitch}
              onChange={(e) => {
                setPitch(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. A minimalist resume builder designed for the 6-second glance of hiring managers..."
              className="w-full p-4 sm:p-5 rounded-2xl bg-[#f2f1ed]/50 border border-[#dbd7cd] text-black placeholder:text-stone-400 focus:outline-none focus:border-black text-base sm:text-lg leading-relaxed resize-none transition-colors"
            />
            {error && (
              <p className="mt-2.5 text-sm font-medium text-red-600 border-l-2 border-red-600 pl-2.5">
                {error}
              </p>
            )}
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
            <button
              type="button"
              onClick={onPreviewMock}
              className="text-sm sm:text-base text-stone-600 hover:text-black font-medium transition-colors order-2 sm:order-1"
            >
              Skip to sample brand monograph &rarr;
            </button>

            {/* Handhold Signature CTA: Black Pill */}
            <button
              type="submit"
              disabled={isExpanding}
              className="w-full sm:w-auto px-7 py-3 rounded-full bg-black text-white hover:bg-neutral-800 disabled:bg-stone-300 text-base sm:text-lg font-medium transition-all flex items-center justify-center gap-2.5 order-1 sm:order-2 shadow-sm"
            >
              {isExpanding ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Sharpening Concept...</span>
                </>
              ) : (
                <>
                  <span>Begin Dialogue</span>
                  <ArrowRight className="w-4 h-4 stroke-[2]" />
                </>
              )}
            </button>
          </div>
        </form>

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
                  </div>
                </button>
              );
            })}
          </div>

          {/* Prompt Pills */}
          <div className="flex flex-wrap gap-2.5">
            {samplePitches.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSample(sample)}
                className="rounded-full border border-stone-300 bg-stone-50 hover:bg-white text-stone-800 text-xs sm:text-sm font-medium px-4 py-2 hover:border-black transition-all text-left max-w-full truncate"
                title={sample}
              >
                {sample.length > 55 ? `${sample.slice(0, 52)}...` : sample}
              </button>
            ))}
          </div>
        </div>
      </div>

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
      </div>
    </div>
  );
}
