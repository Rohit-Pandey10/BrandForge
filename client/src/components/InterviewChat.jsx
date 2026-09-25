import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Sparkles,
  RotateCcw,
  FastForward,
  Check,
  Layers,
  CheckCircle2
} from 'lucide-react';
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
      onCompileBrandKit(buildQaPayload(answerToCommit));
    } else {
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
        <div className="bg-white rounded-3xl border border-zinc-200/80 p-10 sm:p-14 text-center max-w-2xl mx-auto shadow-xs animate-fade-in space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-orange-600 animate-spin" />
          </div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-orange-600 font-semibold block">
            SYNTHESIS IN PROGRESS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight leading-tight">
            Authoring your Brand Monograph...
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto leading-relaxed">
            Synthesizing 7 discovery dimensions into typographic scales, contrasting color tokens, voice dos & don'ts, and launch manifesto.
          </p>
        </div>
      ) : isLoading ? (
        /* State 2: In-Flight Loading Card for Upfront Batch */
        <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 sm:p-10 max-w-2xl mx-auto shadow-xs w-full transition-all animate-fade-in space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
              <span className="text-[10px] tracking-widest uppercase font-mono text-zinc-500 font-semibold">
                GENERATING 7 DISCOVERY DIMENSIONS
              </span>
            </div>
            <span className="text-[11px] font-mono text-zinc-400">
              Batch Discovery Engine
            </span>
          </div>

          <div className="space-y-3 py-2">
            <div className="h-4 w-32 bg-zinc-200/80 rounded-full animate-pulse" />
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight leading-snug">
              Mapping strategic discovery questions...
            </h2>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Evaluating your concept to author 7 targeted inquiries across audience, villain, atmosphere, and competitive edge.
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-full h-14 rounded-xl border border-zinc-200/70 bg-zinc-50/60 animate-pulse flex items-center px-4 gap-3">
                <div className="w-4 h-4 rounded-full border border-zinc-300 shrink-0" />
                <div className="h-3 bg-zinc-200 rounded w-2/3" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* State 3: Active Studio Decision Card (Local 0ms Navigation) */
        <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 sm:p-10 max-w-2xl mx-auto shadow-xs w-full transition-all">
          {/* Card Top Metadata Row */}
          <div className="flex items-center justify-between pb-4 border-b border-zinc-100 mb-6 gap-2">
            <div className="flex items-center gap-3">
              {/* Stage Badge: Warm orange pill */}
              <div className="bg-orange-50 text-orange-600 border border-orange-100 font-semibold text-xs tracking-wide px-3 py-1 rounded-full inline-flex items-center gap-1.5 shadow-2xs">
                <Layers className="w-3.5 h-3.5 text-orange-500" />
                <span>{stageLabel.toUpperCase()}</span>
              </div>
              {allowMultiple && (
                <span className="text-[10px] font-mono uppercase text-orange-700 bg-orange-100/60 px-2 py-0.5 rounded-full font-medium">
                  Multi-Select
                </span>
              )}
              {initialPitch && (
                <span className="text-xs text-zinc-400 italic truncate max-w-[140px] sm:max-w-xs hidden sm:inline">
                  "{initialPitch}"
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Early Synthesis Button */}
              <button
                type="button"
                onClick={handleSynthesizeEarly}
                className="text-xs text-zinc-500 hover:text-zinc-900 bg-zinc-50 hover:bg-zinc-100 px-3 py-1.5 rounded-lg border border-zinc-200 transition-colors flex items-center gap-1 cursor-pointer font-medium"
                title="Synthesize early with completed answers"
              >
                <FastForward className="w-3.5 h-3.5 text-zinc-400" />
                <span className="hidden sm:inline">Synthesize Early</span>
              </button>

              <button
                onClick={onReset}
                className="p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
                title="Reset interview"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Question Headline: Sans-serif high-contrast headline */}
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight leading-tight">
              {questionHeadline}
            </h2>
          </div>

          {/* Collapsible Strategic Rationale ("Why we ask this") */}
          {reasoning && (
            <div className="mb-6">
              <button
                type="button"
                onClick={() => setShowRationale(!showRationale)}
                className="w-full text-left bg-zinc-50 border border-zinc-100 rounded-xl text-xs sm:text-sm text-zinc-600 hover:bg-zinc-100 p-3.5 flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2 font-medium">
                  <Sparkles className="w-4 h-4 text-orange-500" />
                  <span>Why we are asking this (Strategic Diagnostic)</span>
                </div>
                {showRationale ? (
                  <ChevronUp className="w-4 h-4 text-zinc-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-zinc-400" />
                )}
              </button>

              {showRationale && (
                <div className="mt-2.5 p-4 rounded-xl bg-zinc-50/70 border border-zinc-100 text-xs sm:text-sm text-zinc-600 leading-relaxed animate-fade-in">
                  <span className="font-semibold text-zinc-800 block mb-1">Strategist Diagnostic:</span>
                  {reasoning}
                </div>
              )}
            </div>
          )}

          {/* Suggested Answer Pills */}
          {suggestedAnswers.length > 0 && (
            <div className="mb-6">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3 block">
                {allowMultiple
                  ? `SUGGESTED DIRECTIONS (SELECT MULTIPLE OR TYPE CUSTOM):`
                  : `SUGGESTED HIGH-SIGNAL OPTIONS:`}
              </label>

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
                      className={`w-full text-left p-4 rounded-xl transition-all flex items-start gap-3.5 group cursor-pointer ${
                        isSelected
                          ? 'ring-2 ring-orange-500 bg-orange-50/50 border border-orange-500 text-zinc-900 shadow-2xs'
                          : 'bg-white border border-zinc-200 text-zinc-700 hover:border-orange-400 hover:shadow-2xs'
                      }`}
                    >
                      {allowMultiple ? (
                        <div
                          className={`w-4 h-4 rounded-md border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                            isSelected
                              ? 'bg-orange-500 border-orange-500 text-white'
                              : 'border-zinc-300 bg-white group-hover:border-orange-400'
                          }`}
                        >
                          {isSelected && <Check className="w-[11px] h-[11px] text-white stroke-[2.5]" />}
                        </div>
                      ) : (
                        <div
                          className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                            isSelected ? 'border-orange-500 bg-orange-500' : 'border-zinc-300 group-hover:border-orange-400'
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      )}

                      <div className="flex-1 text-sm font-medium leading-relaxed">
                        {answer}
                      </div>

                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Custom Answer Input Area */}
          <div className="space-y-4 pt-2">
            <div>
              <label
                htmlFor="nuancedAnswer"
                className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2 block"
              >
                Refine or type custom answer:
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
                className="bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400 p-3.5 text-sm w-full min-h-[80px] resize-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none"
              />
            </div>

            {/* Bottom Stepping Bar: 0ms Local Transitions */}
            <div className="flex items-center justify-between gap-3 pt-3">
              {/* Previous Button */}
              <div>
                {currentIndex > 0 && (
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="border border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:bg-stone-50 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
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
                    className="bg-[#1a1a1a] hover:bg-zinc-800 text-white rounded-xl px-7 py-3 text-sm font-semibold transition-all shadow-sm active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Synthesize Brand Kit</span>
                    <Sparkles className="w-4 h-4 text-orange-400" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!hasCurrentAnswer}
                    className="bg-[#1a1a1a] hover:bg-zinc-800 text-white rounded-xl px-6 py-3 text-sm font-semibold transition-all shadow-sm active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer group"
                  >
                    <span>Next Question</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
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
