import React from 'react';

const STAGES = [
  {
    step: 1,
    label: 'Target Audience',
    sub: 'Beachhead ICP'
  },
  {
    step: 2,
    label: 'Differentiation',
    sub: 'Anti-Status-Quo'
  },
  {
    step: 3,
    label: 'Brand Edge',
    sub: 'Voice & Archetype'
  }
];

export default function ProgressStepper({ currentRound = 1, isComplete = false }) {
  return (
    <div className="w-full max-w-2xl mx-auto mb-10 px-4">
      <div className="relative flex items-center justify-between">
        {/* Hairline Divider Track */}
        <div className="absolute left-4 right-4 top-3 h-[1px] bg-[#dbd7cd] -z-0" />
        
        {/* Active Progress Hairline Fill */}
        <div 
          className="absolute left-4 top-3 h-[1px] bg-[#000000] transition-all duration-300 ease-out -z-0"
          style={{
            width: isComplete 
              ? 'calc(100% - 2rem)' 
              : currentRound === 1 
                ? '0%' 
                : currentRound === 2 
                  ? 'calc(50% - 1rem)' 
                  : 'calc(100% - 2rem)'
          }}
        />

        {STAGES.map((stage) => {
          const isDone = isComplete || currentRound > stage.step;
          const isActive = !isComplete && currentRound === stage.step;

          return (
            <div key={stage.step} className="relative z-10 flex flex-col items-center text-center">
              {/* Step Indicator Dot */}
              <div 
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 text-[11px] font-sans ${
                  isDone 
                    ? 'bg-black text-white' 
                    : isActive 
                      ? 'bg-black text-white ring-4 ring-[#f2f1ed]' 
                      : 'bg-[#f2f1ed] text-[#737373] border border-[#dbd7cd]'
                }`}
              >
                {stage.step}
              </div>

              {/* Step Labels */}
              <div className="mt-2.5">
                <span className={`block text-xs uppercase tracking-[0.05em] transition-colors ${
                  isActive ? 'text-black' : isDone ? 'text-black' : 'text-[#737373]'
                }`}>
                  {stage.label}
                </span>
                <span className="hidden sm:block text-[11px] text-[#999999] mt-0.5">
                  {stage.sub}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
