import React from 'react';

const SEVEN_STAGES = [
  { step: 1, label: 'Target Audience', code: 'AUDIENCE' },
  { step: 2, label: 'Unmet Need',      code: 'EXPERIENCE' },
  { step: 3, label: 'Anti-Hero',       code: 'VILLAIN' },
  { step: 4, label: 'Atmosphere',      code: 'VIBE' },
  { step: 5, label: 'Price Posture',   code: 'PRICING' },
  { step: 6, label: 'Tone Limits',     code: 'TONE' },
  { step: 7, label: 'Unfair Edge',     code: 'EDGE' }
];

export default function ProgressStepper({
  currentStep = 1,
  totalSteps = 7,
  activeLabel = '',
  onStepClick
}) {
  const steps = SEVEN_STAGES.slice(0, totalSteps || 7);

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      {/* 7-Segment Progress Track */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2 mb-2">
        {steps.map((stage) => {
          const isDone = currentStep > stage.step;
          const isActive = currentStep === stage.step;

          return (
            <button
              key={stage.step}
              type="button"
              onClick={() => onStepClick && onStepClick(stage.step - 1)}
              className="flex flex-col gap-1 text-left group focus:outline-none"
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

              {/* Step code label (visible on tablet+) */}
              <div className="hidden sm:flex items-center justify-between">
                <span
                  className={`text-[9px] uppercase tracking-wider font-sans truncate transition-colors ${
                    isActive
                      ? 'text-black font-semibold'
                      : isDone
                        ? 'text-stone-700 font-medium'
                        : 'text-stone-400'
                  }`}
                >
                  0{stage.step} &bull; {stage.code}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Mobile Active Stage Indicator */}
      <div className="sm:hidden flex items-center justify-between text-[11px] text-stone-500 font-mono pt-1">
        <span>Question {currentStep} of {totalSteps}</span>
        <span className="text-black font-medium uppercase tracking-wider">
          {activeLabel || steps[currentStep - 1]?.code}
        </span>
      </div>
    </div>
  );
}
