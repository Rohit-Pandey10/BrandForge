import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Sparkles,
  CheckCircle2,
  FastForward,
  Layers
} from 'lucide-react';
import ProgressStepper from './ProgressStepper.jsx';

/**
 * SocraticWizard Component
 * Step 2: Interactive 7-Stage Socratic Discovery Flow
 * BrandForge Design System:
 * - Card: Pure white (bg-white), rounded-2xl, shadow-sm, border border-zinc-200/60
 * - Top Meta Row: Warm pill (bg-orange-50 text-orange-600 border border-orange-100), italic text-zinc-400
 * - Main Question Headline: text-3xl md:text-4xl font-extrabold text-zinc-900 tracking-tight leading-tight (Sans-serif)
 * - Diagnostic Accordion: bg-zinc-50 border border-zinc-100 rounded-xl text-sm text-zinc-600 hover:bg-zinc-100
 * - Section Labels: text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3
 * - Answer Pills: Default (bg-white border border-zinc-200 rounded-xl text-zinc-700 hover:border-orange-400 hover:shadow-md)
 *                 Selected (ring-2 ring-orange-500 bg-orange-50/50 border-orange-500 text-zinc-900)
 * - Custom Answer Textarea: bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400
 *                           focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10
 */
export default function SocraticWizard({
  questions = [],
  initialPitch = '',
  currentIndex = 0,
  userAnswers = {},
  onAnswerChange,
  onGoToQuestion,
  onCompileKit,
  onReset
}) {
  const [inputText, setInputText] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [showRationale, setShowRationale] = useState(false);

  const totalQuestions = questions.length || 7;
  const currentQ = questions[currentIndex] || {};
  const currentRound = currentIndex + 1;
  const stageLabel = currentQ.stageLabel || `Stage ${currentRound}`;
  const suggestedAnswers = currentQ.suggestedAnswers || [];
  const questionText = currentQ.question || 'Formulating Socratic inquiry...';
  const reasoning = currentQ.reasoning || '';
  const isLastQuestion = currentIndex === totalQuestions - 1;

  // Sync internal state when currentIndex or question changes
  useEffect(() => {
    const existing = userAnswers[currentIndex] || '';
    setInputText(existing);
    const matchedIdx = suggestedAnswers.findIndex((a) => a === existing);
    setSelectedOption(matchedIdx !== -1 ? matchedIdx : null);
    setShowRationale(false);
  }, [currentIndex, questions, userAnswers]);

  const handleSelectOption = (optionText, idx) => {
    setSelectedOption(idx);
    setInputText(optionText);
    onAnswerChange(currentIndex, optionText);
  };

  const handleTextChange = (e) => {
    const val = e.target.value;
    setInputText(val);
    const matchedIdx = suggestedAnswers.findIndex((a) => a === val);
    setSelectedOption(matchedIdx !== -1 ? matchedIdx : null);
    onAnswerChange(currentIndex, val);
  };

  const handleNext = (e) => {
    e?.preventDefault();
    const finalAnswer =
      inputText.trim() || (selectedOption !== null ? suggestedAnswers[selectedOption] : '');
    onAnswerChange(currentIndex, finalAnswer);

    if (isLastQuestion) {
      onCompileKit(finalAnswer);
    } else {
      onGoToQuestion(currentIndex + 1);
    }
  };

  const handlePrevious = (e) => {
    e?.preventDefault();
    if (currentIndex > 0) {
      const finalAnswer =
        inputText.trim() || (selectedOption !== null ? suggestedAnswers[selectedOption] : '');
      if (finalAnswer) onAnswerChange(currentIndex, finalAnswer);
      onGoToQuestion(currentIndex - 1);
    }
  };

  const handleStepClick = (targetIdx) => {
    const finalAnswer =
      inputText.trim() || (selectedOption !== null ? suggestedAnswers[selectedOption] : '');
    if (finalAnswer) onAnswerChange(currentIndex, finalAnswer);
    onGoToQuestion(targetIdx);
  };

  const hasCurrentAnswer = Boolean(inputText.trim() || selectedOption !== null);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-4 sm:py-8 font-sans antialiased text-zinc-900">
      
      {/* ── Component 1: Progress & Stepper ── */}
      <ProgressStepper
        currentStep={currentRound}
        totalSteps={totalQuestions}
        activeLabel={stageLabel}
        onReset={onReset}
        onStepClick={handleStepClick}
      />

      {/* ── Component 2: Main Interview Card ── */}
      <div className="bg-white rounded-2xl border border-zinc-200/60 shadow-sm p-6 sm:p-10 mb-6 transition-all">
        
        {/* Top Meta Row */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100 mb-6 gap-2">
          <div className="flex items-center gap-3">
            {/* Stage Badge: Warm orange pill with small orange icon */}
            <div className="bg-orange-50 text-orange-600 border border-orange-100 font-semibold text-xs tracking-wide px-3 py-1 rounded-full inline-flex items-center gap-1.5 shadow-xs">
              <Layers className="w-3.5 h-3.5 text-orange-500" />
              <span>{stageLabel.toUpperCase()}</span>
            </div>

            {/* Context Text: Italic, text-zinc-400 */}
            {initialPitch && (
              <span className="text-xs text-zinc-400 italic truncate max-w-[180px] sm:max-w-xs">
                "{initialPitch}"
              </span>
            )}
          </div>

          {/* Quick Action: Skip & Synthesize immediately */}
          <button
            type="button"
            onClick={() => {
              const finalAnswer =
                inputText.trim() || (selectedOption !== null ? suggestedAnswers[selectedOption] : '');
              onCompileKit(finalAnswer);
            }}
            className="text-xs text-zinc-500 hover:text-zinc-900 bg-zinc-50 hover:bg-zinc-100 px-3 py-1.5 rounded-lg border border-zinc-200 transition-colors flex items-center gap-1 cursor-pointer font-medium"
            title="Skip remaining questions and synthesize now"
          >
            <FastForward className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline">Synthesize Early</span>
          </button>
        </div>

        {/* Main Question Headline: Massive, bold sans-serif */}
        <div className="mb-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-900 tracking-tight leading-tight">
            {questionText}
          </h2>
        </div>

        {/* Diagnostic Accordion ("Why we are asking this") */}
        {reasoning && (
          <div className="mb-6">
            <button
              type="button"
              onClick={() => setShowRationale(!showRationale)}
              className="w-full text-left bg-zinc-50 border border-zinc-100 rounded-xl text-sm text-zinc-600 hover:bg-zinc-100 p-3.5 flex items-center justify-between transition-colors cursor-pointer"
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
              <div className="mt-2.5 p-4 rounded-xl bg-zinc-50/70 border border-zinc-100 text-sm text-zinc-600 leading-relaxed transition-all">
                <span className="font-semibold text-zinc-800 block mb-1">
                  Strategist Rationale:
                </span>
                {reasoning}
              </div>
            )}
          </div>
        )}

        {/* Section Labels & Suggested High-Signal Options */}
        {suggestedAnswers.length > 0 && (
          <div className="mb-6">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3 block">
              SUGGESTED HIGH-SIGNAL OPTIONS:
            </label>

            <div className="space-y-3">
              {suggestedAnswers.map((answer, idx) => {
                const isSelected = selectedOption === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(answer, idx)}
                    className={`w-full text-left p-4 rounded-xl transition-all flex items-start gap-3.5 group cursor-pointer ${
                      isSelected
                        ? 'ring-2 ring-orange-500 bg-orange-50/50 border border-orange-500 text-zinc-900 shadow-sm'
                        : 'bg-white border border-zinc-200 text-zinc-700 hover:border-orange-400 hover:shadow-md'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? 'border-orange-500 bg-orange-500'
                          : 'border-zinc-300 group-hover:border-orange-400'
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>

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

        {/* Custom Answer Input / Refinement Textarea */}
        <div className="space-y-4 pt-2">
          <div>
            <label
              htmlFor="customAnswerTextarea"
              className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2 block"
            >
              Refine or type custom answer:
            </label>
            <textarea
              id="customAnswerTextarea"
              rows={3}
              value={inputText}
              onChange={handleTextChange}
              placeholder="Refine the selected response or type your exact conviction..."
              className="bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400 p-3.5 text-sm w-full min-h-[84px] resize-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none"
            />
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between gap-3 pt-3">
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

    </div>
  );
}
