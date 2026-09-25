import React, { useState } from 'react';
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle2, Edit3, Compass } from 'lucide-react';

export default function ConceptSelector({
  rawPitch = '',
  concepts = [],
  onSelectConcept,
  onBackToIntake,
  isLoadingDiscovery = false
}) {
  const [selectedId, setSelectedId] = useState(() => concepts[0]?.id || 'concept_a');
  const [customPitch, setCustomPitch] = useState(() => concepts[0]?.expandedPitch || '');
  const [isEditing, setIsEditing] = useState(false);

  const handleCardClick = (concept) => {
    setSelectedId(concept.id);
    setCustomPitch(concept.expandedPitch);
  };

  const handleProceed = (e) => {
    e.preventDefault();
    const finalPitch = (customPitch || '').trim() || concepts.find(c => c.id === selectedId)?.expandedPitch || rawPitch;
    onSelectConcept(finalPitch);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-10 animate-fade-in text-black font-sans">
      {/* Top Editorial Breadcrumb & Status */}
      <div className="text-center mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono tracking-wide uppercase bg-stone-100 text-stone-600 border border-[#dbd7cd] mb-3">
          <Compass className="w-3.5 h-3.5 text-stone-800" />
          <span>Strategic Refinement Gate</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-light text-black tracking-[-0.03em] leading-tight mb-3">
          We refined your premise into two distinct strategic directions.
        </h1>

        <p className="text-stone-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          Select the posture that matches your commercial ambition, or fine-tune the premise before launching discovery.
        </p>

        {rawPitch && (
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 border border-[#dbd7cd] text-xs text-stone-500">
            <span className="font-mono text-[11px] uppercase text-stone-400">Raw Premise:</span>
            <span className="italic text-stone-700 max-w-[320px] sm:max-w-md truncate">"{rawPitch}"</span>
          </div>
        )}
      </div>

      {/* Two High-Conviction Concept Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {concepts.map((concept, index) => {
          const isSelected = selectedId === concept.id;
          const directionNumber = index === 0 ? 'Direction 01' : 'Direction 02';

          return (
            <div
              key={concept.id || index}
              onClick={() => handleCardClick(concept)}
              className={`group relative p-6 sm:p-7 rounded-[24px] bg-white border transition-all cursor-pointer flex flex-col justify-between shadow-xs hover:shadow-md ${
                isSelected
                  ? 'border-black ring-2 ring-black/10'
                  : 'border-[#dbd7cd] hover:border-stone-400'
              }`}
            >
              <div>
                {/* Header Tag & Selection Indicator */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500">
                    {directionNumber}
                  </span>

                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-black text-white'
                        : 'border border-stone-300 text-transparent group-hover:border-stone-400'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                  </span>
                </div>

                {/* Concept Title */}
                <h3 className="font-serif text-2xl sm:text-[26px] font-normal text-black leading-tight mb-3">
                  {concept.title}
                </h3>

                {/* Expanded Pitch Copy */}
                <p className="text-stone-700 text-sm sm:text-[15px] leading-relaxed mb-4">
                  {concept.expandedPitch}
                </p>
              </div>

              <div>
                {/* Strategic Angle Pill */}
                {concept.strategicAngle && (
                  <div className="pt-3 border-t border-[#f2f1ed] mb-4">
                    <span className="block text-[11px] font-mono uppercase tracking-wider text-stone-400 mb-1">
                      Strategic Moat
                    </span>
                    <p className="text-xs text-stone-600 leading-snug">
                      {concept.strategicAngle}
                    </p>
                  </div>
                )}

                {/* Select Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(concept);
                  }}
                  className={`w-full py-2.5 px-4 rounded-full text-xs uppercase tracking-wider font-medium flex items-center justify-center gap-2 transition-all ${
                    isSelected
                      ? 'bg-black text-white hover:bg-stone-800'
                      : 'border border-[#dbd7cd] bg-[#fcfbf9] text-stone-700 hover:border-black hover:text-black'
                  }`}
                >
                  <span>{isSelected ? 'Selected Direction' : 'Choose this Direction'}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Editable Refinement Area */}
      <div className="bg-white rounded-[24px] border border-[#dbd7cd] p-5 sm:p-6 mb-8 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="customPitchInput" className="text-xs uppercase tracking-wider text-stone-500 font-mono flex items-center gap-1.5">
            <Edit3 className="w-3.5 h-3.5 text-stone-400" />
            <span>Refine Selected Concept (Optional)</span>
          </label>
          <span className="text-[11px] text-stone-400 font-mono">
            {customPitch.length} characters
          </span>
        </div>

        <textarea
          id="customPitchInput"
          rows={2}
          value={customPitch}
          onChange={(e) => {
            setCustomPitch(e.target.value);
            setIsEditing(true);
          }}
          placeholder="You can tweak or customize the chosen concept before starting the Socratic interview..."
          className="w-full p-3.5 rounded-xl bg-[#f2f1ed]/50 border border-[#dbd7cd] text-black text-sm sm:text-base leading-relaxed resize-none focus:outline-none focus:border-black transition-colors"
        />

        <p className="mt-2 text-sm text-zinc-500">
          This refined sentence will be used as the anchor context to generate your 7 strategic discovery questions.
        </p>
      </div>

      {/* Action Navigation Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBackToIntake}
          className="text-xs text-stone-500 hover:text-black transition-colors flex items-center gap-1.5 order-2 sm:order-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Premise Input</span>
        </button>

        <button
          type="button"
          onClick={handleProceed}
          disabled={isLoadingDiscovery || !customPitch.trim()}
          className="w-full sm:w-auto py-3.5 px-8 rounded-full bg-black text-white hover:bg-stone-800 disabled:bg-stone-300 disabled:text-stone-500 disabled:cursor-not-allowed text-xs uppercase tracking-[0.08em] font-medium flex items-center justify-center gap-2 transition-all shadow-sm order-1 sm:order-2"
        >
          {isLoadingDiscovery ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Generating Discovery Batch...</span>
            </>
          ) : (
            <>
              <span>Launch Socratic Discovery</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
