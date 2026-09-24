import React from 'react';

const STAGES = [
  { step: 1, label: 'Beachhead ICP', code: 'TARGET AUDIENCE' },
  { step: 2, label: 'Anti-Status-Quo', code: 'DIFFERENTIATION' },
  { step: 3, label: 'Voice & Aesthetic', code: 'BRAND EDGE' }
];

export default function ProgressStepper({ currentRound = 1, isComplete = false }) {
  return (
    <div className="w-full max-w-xl mx-auto px-4">
      {/* Centered Segmented Step Indicators */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-2">
        {STAGES.map((stage) => {
          const isDone = isComplete || currentRound > stage.step;
          const isActive = !isComplete && currentRound === stage.step;

          return (
            <div key={stage.step} className="flex flex-col gap-1.5">
              {/* Segmented bar indicator */}
              <div 
                className={`h-1 rounded-full transition-all duration-300 ${
                  isDone 
                    ? 'bg-black' 
                    : isActive 
                      ? 'bg-black' 
                      : 'bg-[#dbd7cd]'
                }`}
              />
              <div className="flex items-center justify-between">
                <span className={`text-[10px] uppercase tracking-wider font-sans transition-colors ${
                  isActive ? 'text-black font-medium' : isDone ? 'text-stone-700' : 'text-stone-400'
                }`}>
                  0{stage.step} &bull; {stage.code}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
