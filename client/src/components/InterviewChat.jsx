import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, ChevronDown, ChevronUp, Sparkles, RotateCcw, Settings, FastForward, Check } from 'lucide-react';
import ProgressStepper from './ProgressStepper';

export default function InterviewChat({
  questions = [],
  initialPitch = '',
  isLoading = false,
  isCompiling = false,
  onCompileBrandKit,
  onReset
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [inputText, setInputText] = useState('');
  const [showRationale, setShowRationale] = useState(false);

  const totalQuestions = questions.length || 7;
  const currentQ = questions[currentIndex] || {};
  const allowMultiple = Boolean(currentQ.allowMultiple);
  const currentRound = currentIndex + 1;
  const stageLabel = currentQ.stageLabel || `Stage ${currentRound}`;
  const suggestedAnswers = currentQ.suggestedAnswers || [];
  const questionHeadline = currentQ.question || 'Formulating discovery question...';
  const reasoning = currentQ.reasoning || '';
  const isLastQuestion = currentIndex === totalQuestions - 1;

  // Synchronize local input state whenever currentIndex or questions change
  useEffect(() => {
    const existingAnswer = userAnswers[currentIndex] || '';
    setInputText(existingAnswer);
    if (allowMultiple) {
      const existingParts = existingAnswer ? existingAnswer.split(', ').map(s => s.trim()) : [];
      const matched = suggestedAnswers.filter(a => existingParts.includes(a));
      setSelectedAnswers(matched);
      setSelectedOption(null);
    } else {
      const optionIndex = suggestedAnswers.findIndex(a => a === existingAnswer);
      setSelectedOption(optionIndex !== -1 ? optionIndex : null);
      setSelectedAnswers(optionIndex !== -1 ? [suggestedAnswers[optionIndex]] : []);
    }
    setShowRationale(false);
  }, [currentIndex, questions, allowMultiple]);

  const handleSelectOption = (answer, index) => {
    if (allowMultiple) {
      let nextSelected;
      if (selectedAnswers.includes(answer)) {
        nextSelected = selectedAnswers.filter(a => a !== answer);
      } else {
        nextSelected = [...selectedAnswers, answer];
      }
      setSelectedAnswers(nextSelected);
      setInputText(nextSelected.join(', '));
    } else {
      setSelectedOption(index);
      setSelectedAnswers([answer]);
      setInputText(answer);
    }
  };

  const getAnswerToCommit = () => {
    if (inputText.trim()) return inputText.trim();
    if (allowMultiple) return selectedAnswers.join(', ');
    if (selectedOption !== null && suggestedAnswers[selectedOption]) {
      return suggestedAnswers[selectedOption];
    }
    return '';
  };

  /**
   * Helper to format all recorded answers into structured Q&A pairs for synthesis
   */
  const buildQaPayload = (additionalCurrentAnswer) => {
    const activeAnswer = additionalCurrentAnswer !== undefined
      ? additionalCurrentAnswer
      : getAnswerToCommit();

    const mergedAnswers = {
      ...userAnswers,
      ...(activeAnswer ? { [currentIndex]: activeAnswer } : {})
    };

    const qaPairs = questions.map((q, idx) => ({
      id: q.id || idx + 1,
      stageLabel: q.stageLabel,
      question: q.question,
      answer: mergedAnswers[idx] || ''
    })).filter(pair => pair.answer && pair.answer.trim());

    return {
      initialPitch,
      answers: mergedAnswers,
      qaPairs
    };
  };

  /**
   * Advance to next question LOCALLY (0 network calls)
   */
  const handleNext = (e) => {
    e?.preventDefault();
    if (isLoading || isCompiling) return;

    const answerToCommit = getAnswerToCommit();
    const updatedAnswers = {
      ...userAnswers,
      [currentIndex]: answerToCommit
    };
    setUserAnswers(updatedAnswers);

    if (isLastQuestion) {
      // Reached the end of 7 questions -> trigger compilation
      onCompileBrandKit(buildQaPayload(answerToCommit));
    } else {
      // Step to next question instantaneously
      setCurrentIndex(prev => Math.min(prev + 1, totalQuestions - 1));
    }
  };

  /**
   * Go back to previous question locally
   */
  const handlePrevious = (e) => {
    e?.preventDefault();
    if (currentIndex <= 0 || isLoading || isCompiling) return;

    const answerToCommit = getAnswerToCommit();
    if (answerToCommit) {
      setUserAnswers(prev => ({ ...prev, [currentIndex]: answerToCommit }));
    }
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  /**
   * Trigger early compilation at any point
   */
  const handleSynthesizeEarly = (e) => {
    e?.preventDefault();
    if (isLoading || isCompiling) return;
    const answerToCommit = getAnswerToCommit();
    onCompileBrandKit(buildQaPayload(answerToCommit));
  };

  const hasCurrentAnswer = Boolean(inputText.trim() || selectedOption !== null || selectedAnswers.length > 0);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-4 sm:py-8 flex flex-col justify-center animate-fade-in font-sans">
      {/* 7-Stage Category Stepper */}
      <div className="mb-6 sm:mb-8">
        <ProgressStepper
          currentStep={currentRound}
          totalSteps={totalQuestions}
          activeLabel={stageLabel}
          onStepClick={(targetIdx) => {
            if (targetIdx < totalQuestions && !isLoading && !isCompiling) {
              const answerToCommit = inputText.trim() || (selectedOption !== null ? suggestedAnswers[selectedOption] : '');
              if (answerToCommit) {
                setUserAnswers(prev => ({ ...prev, [currentIndex]: answerToCommit }));
              }
              setCurrentIndex(targetIdx);
            }
          }}
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
            Synthesizing 7 discovery dimensions into typographic scales, contrasting color tokens, voice dos & don'ts, and launch manifesto.
          </p>
        </div>
      ) : isLoading ? (
        /* State 2: In-Flight Loading Card for Upfront Batch */
        <div className="bg-white rounded-[28px] border border-[#dbd7cd]/80 p-6 sm:p-10 max-w-2xl mx-auto shadow-sm w-full transition-all animate-fade-in space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#dbd7cd]/50">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-black animate-ping" />
              <span className="font-sans text-[10px] tracking-widest uppercase text-stone-500 font-medium">
                GENERATING 7 DISCOVERY DIMENSIONS
              </span>
            </div>
            <span className="font-sans text-[11px] text-stone-400">
              Batch Discovery Engine
            </span>
          </div>

          <div className="space-y-3 py-2">
            <div className="h-4 w-32 bg-stone-200/80 rounded-full animate-pulse" />
            <h2 className="font-serif text-2xl sm:text-[28px] font-light text-stone-800 tracking-tight leading-snug">
              Mapping strategic discovery questions...
            </h2>
            <p className="text-xs text-stone-500 leading-relaxed">
              Evaluating your concept to author 7 targeted inquiries across audience, villain, atmosphere, and competitive edge.
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-full h-14 rounded-xl border border-[#dbd7cd]/60 bg-[#f9f8f6] animate-pulse flex items-center px-4 gap-3">
                <div className="w-4 h-4 rounded-full border border-stone-300 shrink-0" />
                <div className="h-3 bg-stone-200 rounded w-2/3" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* State 3: Active Studio Decision Card (Local 0ms Navigation) */
        <div className="bg-white rounded-[28px] border border-[#dbd7cd]/80 p-6 sm:p-10 max-w-2xl mx-auto shadow-sm w-full transition-all">
          {/* Card Top Metadata Row */}
          <div className="flex items-center justify-between pb-3 border-b border-[#dbd7cd]/50">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-black" />
              <span className="font-sans text-[10px] tracking-widest uppercase text-stone-400 font-medium">
                DIMENSION {currentRound} OF {totalQuestions} &bull; {stageLabel.toUpperCase()}
              </span>
              {allowMultiple && (
                <span className="font-sans text-[10px] uppercase tracking-wider text-stone-400">
                  [Select all that apply]
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              {/* Early Synthesis Button */}
              <button
                type="button"
                onClick={handleSynthesizeEarly}
                className="font-sans text-[11px] text-stone-600 hover:text-black hover:bg-[#f2f1ed] px-2.5 py-1 rounded-full border border-[#dbd7cd] transition-all flex items-center gap-1"
                title="Synthesize early with completed answers"
              >
                <FastForward className="w-3 h-3 text-stone-500" />
                <span>Synthesize Early</span>
              </button>

              <button
                onClick={onReset}
                className="text-stone-400 hover:text-black transition-colors"
                title="Reset interview"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Question Headline */}
          <div className="mt-5 mb-4">
            <h2 className="font-serif text-2xl sm:text-[28px] font-light leading-[1.2] text-black tracking-[-0.03em]">
              {questionHeadline}
            </h2>
          </div>

          {/* Collapsible Strategic Rationale */}
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

          {/* Suggested Answer Pills */}
          {suggestedAnswers.length > 0 && (
            <div className="mb-6">
              <span className="font-sans text-[11px] text-stone-400 mb-2.5 block">
                {allowMultiple
                  ? `Select all that apply from the ${suggestedAnswers.length} strategic directions, or craft your own answer below:`
                  : `Select one of ${suggestedAnswers.length} strategic directions, or craft your own answer below:`}
              </span>

              <div className="space-y-2.5">
                {suggestedAnswers.map((answer, index) => {
                  const isSelected = allowMultiple
                    ? selectedAnswers.includes(answer)
                    : (selectedOption === index || userAnswers[currentIndex] === answer);

                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSelectOption(answer, index)}
                      className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all duration-200 hover:-translate-y-0.5 flex items-start gap-3 group ${
                        isSelected
                          ? 'border-black bg-[#faf9f6] ring-1 ring-black/5'
                          : 'border-[#dbd7cd] bg-white hover:bg-[#faf9f6] hover:border-black/50'
                      }`}
                    >
                      {allowMultiple ? (
                        <div
                          className={`w-4 h-4 rounded-md border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                            isSelected
                              ? 'bg-black border-black text-white'
                              : 'border-[#dbd7cd] bg-white group-hover:border-stone-400'
                          }`}
                        >
                          {isSelected && <Check className="w-[11px] h-[11px] text-white stroke-[2.5]" />}
                        </div>
                      ) : (
                        <div
                          className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                            isSelected ? 'border-black' : 'border-stone-300 group-hover:border-stone-400'
                          }`}
                        >
                          {isSelected && <div className="w-2 h-2 rounded-full bg-black" />}
                        </div>
                      )}

                      <div className="flex-1 font-sans text-[13px] text-stone-800 leading-snug">
                        {answer}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Nuanced Input Area */}
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
                  const val = e.target.value;
                  setInputText(val);
                  if (!allowMultiple) {
                    if (selectedOption !== null && val !== suggestedAnswers[selectedOption]) {
                      setSelectedOption(null);
                    }
                  }
                }}
                placeholder="Refine the selected response or type your exact conviction..."
                className="border border-[#dbd7cd] rounded-xl p-3 text-sm text-black focus:outline-none focus:border-black w-full bg-[#fcfbf9] min-h-[72px] resize-none transition-colors"
              />
            </div>

            {/* Bottom Stepping Bar: 0ms Local Transitions */}
            <div className="flex items-center justify-between gap-3 pt-2">
              {/* Previous Button */}
              <div>
                {currentIndex > 0 && (
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="text-xs text-stone-600 hover:text-black border border-[#dbd7cd] rounded-full px-4 py-2.5 bg-white hover:bg-[#fcfbf9] transition-all flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Previous</span>
                  </button>
                )}
              </div>

              {/* Next or Synthesize Button */}
              <div className="flex items-center gap-2">
                {isLastQuestion ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!hasCurrentAnswer}
                    className="font-sans bg-black text-white px-7 py-2.5 rounded-full text-xs font-medium hover:bg-neutral-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-none"
                  >
                    <span>Synthesize Brand Kit ✦</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!hasCurrentAnswer}
                    className="font-sans bg-black text-white px-6 py-2.5 rounded-full text-xs hover:bg-neutral-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-none"
                  >
                    <span>Next Question &rarr;</span>
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
