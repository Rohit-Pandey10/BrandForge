import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronDown, ChevronUp, Sparkles, RotateCcw, Settings } from 'lucide-react';
import ProgressStepper from './ProgressStepper';

const STAGE_NAMES = {
  1: 'BEACHHEAD & CORE PAIN',
  2: 'DIFFERENTIATION & INCUMBENT CRITIQUE',
  3: 'BRAND PERSONALITY & AESTHETIC POLARITY'
};

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
  const isComplete = currentQuestion?.isComplete || false;
  const stageName = STAGE_NAMES[currentRound] || 'STRATEGIC DISCOVERY';
  const suggestedAnswers = currentQuestion?.suggestedAnswers || [];
  const questionHeadline = currentQuestion?.question || 'What is your core strategic vision?';
  const reasoning = currentQuestion?.reasoning || '';

  // Clear selections when moving to a new question/round
  useEffect(() => {
    setSelectedOption(null);
    setInputText('');
    setShowRationale(false);
  }, [currentRound, questionHeadline]);

  const handleSelectOption = (answer, index) => {
    setSelectedOption(index);
    setInputText(answer);
  };

  const handleProceed = (e) => {
    e?.preventDefault();
    if (isLoading || isCompiling) return;

    const answerToSend = inputText.trim() || (selectedOption !== null ? suggestedAnswers[selectedOption] : '');
    if (!answerToSend) return;

    if (currentRound >= 3 || isComplete) {
      // Final round completion: send final answer then compile, or compile directly
      onSendMessage(answerToSend);
    } else {
      onSendMessage(answerToSend);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-4 sm:py-8 flex flex-col justify-center animate-fade-in font-sans">
      {/* Centered Stage Stepper */}
      <div className="mb-6 sm:mb-8">
        <ProgressStepper currentRound={currentRound} isComplete={isComplete} />
      </div>

      {/* Compiling Monograph Full-Card Overlay */}
      {isCompiling ? (
        <div className="bg-white rounded-[28px] border border-[#dbd7cd] p-10 sm:p-14 text-center max-w-2xl mx-auto shadow-sm animate-fade-in space-y-4">
          <div className="w-10 h-10 mx-auto rounded-full bg-[#f2f1ed] border border-[#dbd7cd] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-black animate-spin" />
          </div>
          <span className="text-[10px] uppercase tracking-widest text-stone-400 font-medium block">
            Synthesis in progress
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-light text-black tracking-[-0.03em] leading-tight">
            Authoring your Brand Monograph...
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
            Compiling typographic scales, contrasting color tokens, voice dos & don'ts, and the launch manifesto.
          </p>
        </div>
      ) : (
        /* The Single Focused Studio Decision Card */
        <div className="bg-white rounded-[28px] border border-[#dbd7cd]/80 p-6 sm:p-10 max-w-2xl mx-auto shadow-sm w-full transition-all">
          {/* Card Top Metadata Row */}
          <div className="flex items-center justify-between pb-3 border-b border-[#dbd7cd]/50">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-black" />
              <span className="font-sans text-[10px] tracking-widest uppercase text-stone-400 font-medium">
                STAGE {currentRound}: {stageName}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-sans text-[11px] text-stone-500">
                Round {currentRound} of 3
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

          {/* Structured Radio Selection Rows (Replacing Tiny Pills) */}
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
                      disabled={isLoading}
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
                  // If user edits manually, clear strict radio match if it deviates
                  if (selectedOption !== null && e.target.value !== suggestedAnswers[selectedOption]) {
                    setSelectedOption(null);
                  }
                }}
                disabled={isLoading}
                placeholder="Refine the selected response or type your exact conviction..."
                className="border border-[#dbd7cd] rounded-xl p-3 text-sm text-black focus:outline-none focus:border-black w-full bg-[#fcfbf9] min-h-[72px] resize-none transition-colors"
              />
            </div>

            {/* Bottom Action Row */}
            <div className="flex items-center justify-between pt-2">
              <div className="text-[11px] text-stone-400">
                {isLoading ? (
                  <span className="flex items-center gap-1.5 animate-pulse text-stone-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping" />
                    Formulating challenge...
                  </span>
                ) : (
                  <span>Shift + Enter or click button to proceed</span>
                )}
              </div>

              {/* Right-Aligned Primary CTA */}
              <div>
                {currentRound < 3 && !isComplete ? (
                  <button
                    type="button"
                    onClick={handleProceed}
                    disabled={isLoading || (!inputText.trim() && selectedOption === null)}
                    className="font-sans bg-black text-white px-6 py-2.5 rounded-full text-xs hover:bg-neutral-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 shadow-none"
                  >
                    <span>Proceed to Round {currentRound + 1}</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[1.5]" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleProceed}
                    disabled={isLoading || (!inputText.trim() && selectedOption === null)}
                    className="font-sans bg-black text-white px-7 py-2.5 rounded-full text-xs font-medium hover:bg-neutral-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 shadow-none"
                  >
                    <span>Synthesize Brand Kit ✦</span>
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
