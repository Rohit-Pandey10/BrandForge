import React from 'react';

export default function ProgressStepper({
  currentStep = 1,
  totalSteps = 7,
  activeLabel = '',
  questions = [],
  currentQuestion = null,
  onStepClick
}) {
  const count = totalSteps || (questions.length || 7);
  const steps = Array.from({ length: count }, (_, idx) => {
    const stepNum = idx + 1;
    const q = questions[idx];
    const label = q?.stageLabel || (stepNum === currentStep && activeLabel ? activeLabel : `DIMENSION ${stepNum}`);
    return {
      step: stepNum,
      label
    };
  });

  const activeQ = currentQuestion || questions[currentStep - 1] || null;
  const displayLabel = activeLabel || activeQ?.stageLabel || `DIMENSION ${currentStep} OF ${count}`;

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      {/* Dynamic Stage Indicator Header */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono uppercase tracking-widest text-stone-500 font-semibold truncate max-w-[260px] sm:max-w-none">
            {displayLabel}
          </span>
          <span className="text-stone-300">•</span>
          <span className="text-xs font-mono text-stone-400">
            Step {currentStep} of {count}
          </span>
        </div>
      </div>

      {/* 7-Segment Dynamic Progress Track */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2 mb-2">
        {steps.map((stage) => {
          const isDone = currentStep > stage.step;
          const isActive = currentStep === stage.step;

          return (
            <button
              key={stage.step}
              type="button"
              onClick={() => onStepClick && onStepClick(stage.step - 1)}
              className="flex flex-col gap-1 text-left group focus:outline-none cursor-pointer"
              title={`${stage.step}. ${stage.label}`}
            >
              {/* Pill bar segment */}
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  isDone
                    ? 'bg-black'
                    : isActive
                      ? 'bg-black ring-2 ring-black/20'
                      : 'bg-[#dbd7cd] group-hover:bg-stone-300'
                }`}
              />

              {/* Step label (visible on tablet+) */}
              <div className="hidden sm:flex items-center justify-between overflow-hidden">
                <span
                  className={`text-[11px] uppercase tracking-wider font-mono truncate transition-colors ${
                    isActive
                      ? 'text-black font-semibold'
                      : isDone
                        ? 'text-stone-700 font-medium'
                        : 'text-stone-400'
                  }`}
                  title={stage.label}
                >
                  0{stage.step} &bull; {stage.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Mobile Active Stage Indicator */}
      <div className="sm:hidden flex items-center justify-between text-[11px] text-stone-500 font-mono pt-1">
        <span>Question {currentStep} of {count}</span>
        <span className="text-black font-medium uppercase tracking-wider truncate max-w-[180px]">
          {displayLabel}
        </span>
      </div>
    </div>
  );
}
