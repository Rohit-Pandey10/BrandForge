import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { samplePitches } from '../data/mockBrandData';

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
    <div className="w-full max-w-[720px] mx-auto px-4 py-6 sm:py-12 animate-fade-in">
      {/* Editorial Header */}
      <div className="text-center mb-10 sm:mb-14">
        <span className="block text-[11px] uppercase tracking-[0.08em] text-[#737373] mb-4">
          Brand Architecture &bull; Monograph 01
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl md:text-[68px] font-light text-black tracking-[-0.03em] leading-[1.0] mb-5">
          Turn an unformed thought into an enduring identity.
        </h1>
        <p className="text-[#737373] text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
          A focused Socratic dialogue to isolate your customer, challenge conventional compromises, and author a distinct visual and verbal system.
        </p>
      </div>

      {/* Input Surface: Clean White Card Floating on Paper Canvas */}
      <div className="bg-white rounded-[28px] border border-[#dbd7cd] p-6 sm:p-8 mb-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="pitchInput" className="block text-xs uppercase tracking-[0.05em] text-[#737373] mb-2">
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
              className="w-full p-4 rounded-xl bg-[#f2f1ed]/50 border border-[#dbd7cd] text-black placeholder-[#999999] focus:outline-none focus:border-black text-sm sm:text-base leading-relaxed resize-none transition-colors"
            />
            {error && (
              <p className="mt-2 text-xs text-[#000000] border-l-2 border-black pl-2">
                {error}
              </p>
            )}
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={onPreviewMock}
              className="text-xs text-[#737373] hover:text-black transition-colors order-2 sm:order-1"
            >
              Skip to sample brand monograph &rarr;
            </button>

            {/* Handhold Signature CTA: Black Pill */}
            <button
              type="submit"
              disabled={isExpanding}
              className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-black text-white hover:bg-neutral-800 disabled:bg-stone-300 text-sm font-normal transition-all flex items-center justify-center gap-2 order-1 sm:order-2"
            >
              {isExpanding ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Sharpening Concept...</span>
                </>
              ) : (
                <>
                  <span>Begin Dialogue</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[1.5]" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Quick Inspiration Pills */}
        <div className="mt-8 pt-6 border-t border-[#dbd7cd]">
          <span className="block text-[11px] uppercase tracking-[0.05em] text-[#737373] mb-3">
            Inspiration examples
          </span>
          <div className="flex flex-wrap gap-2">
            {samplePitches.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSample(sample)}
                className="rounded-full border border-[#dbd7cd] bg-transparent text-[#737373] text-xs px-3.5 py-1.5 hover:border-black hover:text-black transition text-left"
              >
                {sample}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quiet Three-Stage Editorial Footnote */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 text-center sm:text-left border-t border-[#dbd7cd]">
        <div>
          <span className="text-[11px] uppercase tracking-[0.05em] text-[#999999] block mb-1">Step 01</span>
          <h4 className="font-serif text-lg text-black font-light leading-snug">Target User</h4>
          <p className="text-xs text-[#737373] mt-1 leading-relaxed">
            Isolating the core audience and defining their primary expectation.
          </p>
        </div>
        <div>
          <span className="text-[11px] uppercase tracking-[0.05em] text-[#999999] block mb-1">Step 02</span>
          <h4 className="font-serif text-lg text-black font-light leading-snug">Differentiation</h4>
          <p className="text-xs text-[#737373] mt-1 leading-relaxed">
            Rejecting conventional incumbent compromises to reveal your distinct angle.
          </p>
        </div>
        <div>
          <span className="text-[11px] uppercase tracking-[0.05em] text-[#999999] block mb-1">Step 03</span>
          <h4 className="font-serif text-lg text-black font-light leading-snug">Brand Edge</h4>
          <p className="text-xs text-[#737373] mt-1 leading-relaxed">
            Setting attitude boundaries and generating production visual & voice tokens.
          </p>
        </div>
      </div>
    </div>
  );
}
