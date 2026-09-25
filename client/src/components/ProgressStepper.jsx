import React from 'react';
import { RotateCcw, Check } from 'lucide-react';

const DEFAULT_STAGES = [
  { step: 1, label: 'Audience',   code: 'AUDIENCE' },
  { step: 2, label: 'Problem',    code: 'EXPERIENCE' },
  { step: 3, label: 'Anti-Hero',  code: 'VILLAIN' },
  { step: 4, label: 'Vibe',       code: 'VIBE' },
  { step: 5, label: 'Pricing',    code: 'PRICING' },
  { step: 6, label: 'Tone',       code: 'TONE' },
  { step: 7, label: 'Edge',       code: 'EDGE' }
];

/**
 * ProgressStepper Component
 * BrandForge Design System:
 * - Top Header: "Start Over" button (text-zinc-400 hover:text-zinc-900), "DISCOVERY PILLAR X OF 7"
 * - Progress Bar: Track in bg-zinc-200, fill in bg-gradient-to-r from-orange-500 to-red-500
 * - Stepper Pills (1 to 7):
 *     Active: bg-zinc-900 text-white border-transparent
 *     Inactive: bg-white text-zinc-500 border border-zinc-200
 */
export default function ProgressStepper({
  currentStep = 1,
  totalSteps = 7,
  activeLabel = '',
  onStepClick,
  onReset,
  stages = DEFAULT_STAGES
}) {
  const steps = stages.slice(0, totalSteps || 7);
  const progressPercent = Math.min(100, Math.max(0, (currentStep / (totalSteps || 7)) * 100));

  return (
    <div className="w-full max-w-2xl mx-auto mb-6">
      
      {/* ── Top Header Row ── */}
      <div className="flex items-center justify-between mb-4">
        {/* Start Over Action */}
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-900 transition-colors cursor-pointer group"
          title="Reset to brand idea"
        >
          <RotateCcw className="w-3.5 h-3.5 transition-transform group-hover:-rotate-45" />
          <span>Start Over</span>
        </button>

        {/* Discovery Pillar Label */}
        <span className="text-xs font-bold tracking-widest text-zinc-400 uppercase">
          DISCOVERY PILLAR {currentStep} OF {totalSteps}
        </span>
      </div>

      {/* ── Progress Bar ── */}
      <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden mb-5">
        <div
          className="bg-gradient-to-r from-orange-500 to-red-500 h-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* ── Stepper Pills (1 to 7) ── */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {steps.map((stage) => {
          const isActive = currentStep === stage.step;
          const isDone = currentStep > stage.step;

          return (
            <button
              key={stage.step}
              type="button"
              onClick={() => onStepClick && onStepClick(stage.step - 1)}
              className={`py-2 px-1 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-zinc-900 text-white border-transparent shadow-xs scale-[1.02]'
                  : isDone
                  ? 'bg-white text-zinc-700 border border-zinc-200 hover:border-zinc-300'
                  : 'bg-white text-zinc-500 border border-zinc-200 hover:border-zinc-300'
              }`}
              title={`Pillar ${stage.step}: ${stage.label}`}
            >
              {isDone ? (
                <Check className="w-3.5 h-3.5 text-orange-500 shrink-0" />
              ) : (
                <span className="font-mono text-[11px]">{stage.step}</span>
              )}
              <span className="hidden md:inline truncate text-[11px]">
                {stage.code || stage.label}
              </span>
            </button>
          );
        })}
      </div>

    </div>
  );
}
