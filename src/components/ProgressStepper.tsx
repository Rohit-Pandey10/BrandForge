import React from 'react';
import { Check } from 'lucide-react';

interface ProgressStepperProps {
  currentStage: number; // 1: Intake/Round 1, 2: Round 2, 3: Round 3, 4: Synthesis
}

export const ProgressStepper: React.FC<ProgressStepperProps> = ({ currentStage }) => {
  const stages = [
    { num: 1, title: 'Intake & ICP', desc: 'Beachhead user & urgent pain' },
    { num: 2, title: 'Differentiation', desc: 'Status quo & the villain' },
    { num: 3, title: 'Attitude & Edge', desc: 'Aesthetic & polarization' },
    { num: 4, title: 'Token Synthesis', desc: 'Narrative & design kit' }
  ];

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '860px',
        margin: '0 auto 40px auto',
        padding: '0 var(--spacing-16)'
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px'
        }}
      >
        {stages.map((stage) => {
          const isComplete = currentStage > stage.num;
          const isActive = currentStage === stage.num;

          return (
            <div
              key={stage.num}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                padding: '12px 14px',
                borderRadius: '16px',
                backgroundColor: isActive ? 'var(--color-pure-white)' : 'transparent',
                border: `1px solid ${isActive ? 'var(--color-ink-black)' : isComplete ? 'var(--color-ink-black)' : 'var(--color-warm-border)'}`,
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: '11px',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    color: isActive ? 'var(--color-ink-black)' : 'var(--color-stone-gray)'
                  }}
                >
                  Stage {stage.num}
                </span>

                {isComplete && (
                  <span
                    style={{
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-ink-black)',
                      color: 'var(--color-pure-white)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Check size={9} strokeWidth={2} />
                  </span>
                )}
              </div>

              <span
                style={{
                  fontFamily: 'var(--font-bureauserif)',
                  fontSize: '16px',
                  fontWeight: 450,
                  letterSpacing: '-0.02em',
                  color: 'var(--color-ink-black)',
                  lineHeight: 1.1
                }}
              >
                {stage.title}
              </span>

              <span
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '11px',
                  color: 'var(--color-stone-gray)',
                  lineHeight: 1.3
                }}
              >
                {stage.desc}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
