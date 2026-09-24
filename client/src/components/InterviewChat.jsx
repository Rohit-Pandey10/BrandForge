import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronDown, ChevronUp, Sparkles, RotateCcw, Settings, Layers } from 'lucide-react';
import ProgressStepper from './ProgressStepper';

export default function InterviewChat({
  messages = [],
  currentQuestion,
  isLoading,
  isCompiling,
  onSendMessage,
  onCompileBrandKit,
  onReset
}) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [inputText, setInputText] = useState('');
  const [showRationale, setShowRationale] = useState(false);

  const currentRound = currentQuestion?.currentRound || 1;
  const stageLabel = currentQuestion?.stageLabel || (
    currentRound === 1 ? 'Target Beachhead' :
    currentRound === 2 ? 'Incumbent Critique' :
    currentRound === 3 ? 'Brand Edge' : 'Strategic Moat'
  );
  const readyForSynthesis = Boolean(currentQuestion?.readyForSynthesis || currentRound >= 3);
  const suggestedAnswers = currentQuestion?.suggestedAnswers || [];
  const questionHeadline = currentQuestion?.question || '';
  const reasoning = currentQuestion?.reasoning || '';

  // Reset local state when a new question arrives
  useEffect(() => {
    setSelectedOption(null);
    setInputText('');
    setShowRationale(false);
  }, [currentRound, questionHeadline]);

  const handleSelectOption = (answer, index) => {
    setSelectedOption(index);
    setInputText(answer);
  };

  const handleProceedNextRound = (e) => {
    e?.preventDefault();
    if (isLoading || isCompiling) return;
    const answerToSend = inputText.trim() || (selectedOption !== null ? suggestedAnswers[selectedOption] : '');
    if (!answerToSend) return;
    onSendMessage(answerToSend, false); // false = don't synthesize, continue discovery
  };

  const handleSynthesizeNow = (e) => {
    e?.preventDefault();
    if (isLoading || isCompiling) return;
    const answerToSend = inputText.trim() || (selectedOption !== null ? suggestedAnswers[selectedOption] : '');
    onCompileBrandKit(answerToSend);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-4 sm:py-8 flex flex-col justify-center animate-fade-in font-sans">
      {/* Centered Stage Stepper */}
      <div className="mb-6 sm:mb-8">
        <ProgressStepper 
          currentRound={currentRound} 
          readyForSynthesis={readyForSynthesis}
          stageLabel={stageLabel}
        />
      </div>

      {/* State 1: Synthesis In-Progress Monograph Overlay */}
      {isCompiling ? (
        <div className="bg-white rounded-[28px] border border-[#dbd7cd] p-10 sm:p-14 text-center max-w-2xl mx-auto shadow-sm animate-fade-in space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#f2f1ed] border border-[#dbd7cd] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-black animate-spin" />
          </div>
          <span className="text-[10px] uppercase tracking-widest text-stone-400 font-medium block">
            SYNTHESIS IN PROGRESS
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-light text-black tracking-[-0.03em] leading-tight">
            Authoring your Brand Monograph...
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
            Compiling typographic scales, contrasting color tokens, voice dos & don'ts, and the launch manifesto.
          </p>
        </div>
      ) : isLoading ? (
        /* State 2: Dedicated In-Flight Loading Card (Never Blank or Frozen) */
        <div className="bg-white rounded-[28px] border border-[#dbd7cd]/80 p-6 sm:p-10 max-w-2xl mx-auto shadow-sm w-full transition-all animate-fade-in space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#dbd7cd]/50">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-black animate-ping" />
              <span className="font-sans text-[10px] tracking-widest uppercase text-stone-500 font-medium">
                STAGE {currentRound}: {stageLabel.toUpperCase()} &bull; DIAGNOSTIC IN PROGRESS
              </span>
            </div>
            <span className="font-sans text-[11px] text-stone-400">
              Round {currentRound}
            </span>
          </div>

          <div className="space-y-3 py-2">
            <div className="h-4 w-32 bg-stone-200/80 rounded-full animate-pulse" />
            <h2 className="font-serif text-2xl sm:text-[28px] font-light text-stone-800 tracking-tight leading-snug">
              Synthesizing strategic trade-offs...
            </h2>
            <p className="text-xs text-stone-500 leading-relaxed">
              Evaluating your position against market incumbents and formulating the next challenge.
            </p>
          </div>

          {/* Shimmer skeleton option rows */}
          <div className="space-y-2.5 pt-2">
            <div className="w-full h-14 rounded-xl border border-[#dbd7cd]/60 bg-[#f9f8f6] animate-pulse flex items-center px-4 gap-3">
              <div className="w-4 h-4 rounded-full border border-stone-300 shrink-0" />
              <div className="h-3 bg-stone-200 rounded w-3/4" />
            </div>
            <div className="w-full h-14 rounded-xl border border-[#dbd7cd]/60 bg-[#f9f8f6] animate-pulse flex items-center px-4 gap-3">
              <div className="w-4 h-4 rounded-full border border-stone-300 shrink-0" />
              <div className="h-3 bg-stone-200 rounded w-1/2" />
            </div>
            <div className="w-full h-14 rounded-xl border border-[#dbd7cd]/60 bg-[#f9f8f6] animate-pulse flex items-center px-4 gap-3">
              <div className="w-4 h-4 rounded-full border border-stone-300 shrink-0" />
              <div className="h-3 bg-stone-200 rounded w-2/3" />
            </div>
          </div>
        </div>
      ) : (
        /* State 3: Active Studio Decision Card */
        <div className="bg-white rounded-[28px] border border-[#dbd7cd]/80 p-6 sm:p-10 max-w-2xl mx-auto shadow-sm w-full transition-all">
          {/* Card Top Metadata Row */}
          <div className="flex items-center justify-between pb-3 border-b border-[#dbd7cd]/50">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-black" />
              <span className="font-sans text-[10px] tracking-widest uppercase text-stone-400 font-medium">
                STAGE {currentRound}: {stageLabel.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-sans text-[11px] text-stone-500">
                Round {currentRound}
              </span>
              <button
                onClick={onReset}
                className="text-stone-400 hover:text-black transition-colors"
                title="Reset interview"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Display Question Headline */}
          <div className="mt-5 mb-4">
            <h2 className="font-serif text-2xl sm:text-[28px] font-light leading-[1.2] text-black tracking-[-0.03em]">
              {questionHeadline}
            </h2>
          </div>

          {/* Collapsible Strategic Context / Rationale */}
          {reasoning && (
            <div className="mb-6">
              <button
                type="button"
                onClick={() => setShowRationale(!showRationale)}
                className="font-sans text-[11px] text-stone-500 hover:text-stone-800 bg-[#f2f1ed] rounded-lg px-3 py-1.5 border border-[#dbd7cd] inline-flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Settings className="w-3 h-3 text-stone-400" />
                <span>Under-the-Hood Strategic Rationale</span>
                {showRationale ? (
                  <ChevronUp className="w-3 h-3 text-stone-400" />
                ) : (
                  <ChevronDown className="w-3 h-3 text-stone-400" />
                )}
              </button>

              {showRationale && (
                <div className="mt-2.5 p-3.5 rounded-xl bg-[#fcfbf9] border border-[#dbd7cd]/70 text-xs text-stone-600 leading-relaxed animate-fade-in">
                  <span className="font-medium text-stone-700 block mb-0.5">Strategist Diagnostic:</span>
                  {reasoning}
                </div>
              )}
            </div>
          )}

          {/* Structured Radio Selection Rows */}
          {suggestedAnswers.length > 0 && (
            <div className="mb-6">
              <span className="font-sans text-[11px] text-stone-400 mb-2.5 block">
                Select one of {suggestedAnswers.length} strategic directions, or craft your own answer below:
              </span>

              <div className="space-y-2.5">
                {suggestedAnswers.map((answer, index) => {
                  const isSelected = selectedOption === index;
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSelectOption(answer, index)}
                      className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all flex items-start gap-3 group ${
                        isSelected
                          ? 'border-black bg-[#faf9f6] ring-1 ring-black/5'
                          : 'border-[#dbd7cd] bg-white hover:bg-[#faf9f6] hover:border-black/50'
                      }`}
                    >
                      {/* Radio Circle Indicator */}
                      <div
                        className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                          isSelected ? 'border-black' : 'border-stone-300 group-hover:border-stone-400'
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-black" />}
                      </div>

                      {/* Option Text */}
                      <div className="flex-1 font-sans text-[13px] text-stone-800 leading-snug">
                        {answer}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Nuanced Input Area & Action Bar */}
          <div className="space-y-4 pt-2">
            <div>
              <label
                htmlFor="nuancedAnswer"
                className="font-sans text-[11px] text-stone-500 block mb-1.5"
              >
                Your final position / Nuanced answer:
              </label>
              <textarea
                id="nuancedAnswer"
                rows={2}
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  if (selectedOption !== null && e.target.value !== suggestedAnswers[selectedOption]) {
                    setSelectedOption(null);
                  }
                }}
                placeholder="Refine the selected response or type your exact conviction..."
                className="border border-[#dbd7cd] rounded-xl p-3 text-sm text-black focus:outline-none focus:border-black w-full bg-[#fcfbf9] min-h-[72px] resize-none transition-colors"
              />
            </div>

            {/* Bottom Action Row: Multi-Directional User Agency */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
              {/* Secondary Option / Status */}
              <div>
                {readyForSynthesis ? (
                  <button
                    type="button"
                    onClick={handleProceedNextRound}
                    disabled={!inputText.trim() && selectedOption === null}
                    className="text-xs text-stone-600 hover:text-black border border-[#dbd7cd] rounded-full px-4 py-2 bg-white hover:bg-[#fcfbf9] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                  >
                    <span>Deepen Strategy (Round {currentRound + 1})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSynthesizeNow}
                    className="text-xs text-stone-500 hover:text-black transition-colors flex items-center justify-center gap-1.5 py-1.5"
                  >
                    <span>Synthesize now with current insights &rarr;</span>
                  </button>
                )}
              </div>

              {/* Primary Action Button */}
              <div>
                {readyForSynthesis ? (
                  <button
                    type="button"
                    onClick={handleSynthesizeNow}
                    disabled={!inputText.trim() && selectedOption === null}
                    className="w-full sm:w-auto font-sans bg-black text-white px-7 py-2.5 rounded-full text-xs font-medium hover:bg-neutral-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-none"
                  >
                    <span>Synthesize Brand Kit ✦</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleProceedNextRound}
                    disabled={!inputText.trim() && selectedOption === null}
                    className="w-full sm:w-auto font-sans bg-black text-white px-6 py-2.5 rounded-full text-xs hover:bg-neutral-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-none"
                  >
                    <span>Proceed to Round {currentRound + 1}</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[1.5]" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
