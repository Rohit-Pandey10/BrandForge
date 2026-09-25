import React, { useState } from 'react';
import { ArrowRight, HelpCircle, ChevronDown, ChevronUp, Sparkles, Check } from 'lucide-react';
import { QuestionResponse, InterviewStep } from '../types';
import { playPillClickSound } from '../utils/audio';

interface InterviewChatProps {
  currentQuestion: QuestionResponse;
  currentRound: number;
  pitch: string;
  history: InterviewStep[];
  onAnswerQuestion: (answer: string, selectedIndex?: number) => void;
  isLoading: boolean;
  onInstantSynthesize: () => void;
}

export const InterviewChat: React.FC<InterviewChatProps> = ({
  currentQuestion,
  currentRound,
  pitch,
  history,
  onAnswerQuestion,
  isLoading,
  onInstantSynthesize
}) => {
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [customAnswer, setCustomAnswer] = useState('');
  const [showReasoning, setShowReasoning] = useState(false);

  const handleSelectOption = (idx: number, optionText: string) => {
    playPillClickSound();
    setSelectedOptionIndex(idx);
    setCustomAnswer(optionText);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomAnswer(e.target.value);
    setSelectedOptionIndex(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customAnswer.trim() || isLoading) return;
    playPillClickSound();
    onAnswerQuestion(customAnswer.trim(), selectedOptionIndex ?? undefined);
    setSelectedOptionIndex(null);
    setCustomAnswer('');
  };

  const getStageTitle = (round: number) => {
    switch (round) {
      case 1:
        return 'Stage 1: Beachhead ICP & Acute Pain Discovery';
      case 2:
        return 'Stage 2: Differentiation & Incumbent Critique';
      case 3:
        return 'Stage 3: Attitude Boundaries & Aesthetic Edge';
      default:
        return `Stage ${round}: Socratic Strategy`;
    }
  };

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '860px',
        margin: '0 auto',
        padding: '0 var(--spacing-24) 64px var(--spacing-24)',
        display: 'flex',
        flexDirection: 'column',
        gap: '28px'
      }}
    >
      {/* Pitch Context Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          paddingBottom: '16px',
          borderBottom: '1px solid var(--color-warm-border)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="pill-tag">Value Claim</span>
          <span
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '14px',
              color: 'var(--color-stone-gray)'
            }}
          >
            "{pitch}"
          </span>
        </div>

        <button
          onClick={onInstantSynthesize}
          className="btn-pill-secondary"
          style={{ fontSize: '12px', padding: '4px 12px' }}
        >
          <Sparkles size={12} strokeWidth={1.5} />
          <span>Skip to Synthesis</span>
        </button>
      </div>

      {/* Main Socratic Question Card */}
      <div
        className="card-slab"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          padding: '36px',
          borderRadius: '28px'
        }}
      >
        {/* Stage metadata */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--color-stone-gray)'
            }}
          >
            {getStageTitle(currentRound)}
          </span>

          <span className="pill-tag">Round {currentRound} of 3</span>
        </div>

        {/* Sharp Socratic Question */}
        <h2
          className="serif-heading"
          style={{
            fontSize: '32px',
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            color: 'var(--color-ink-black)'
          }}
        >
          {currentQuestion.question}
        </h2>

        {/* Collapsible Under-the-hood Reasoning Drawer */}
        {currentQuestion.reasoning && (
          <div
            style={{
              borderRadius: '16px',
              backgroundColor: 'var(--color-paper-cream)',
              padding: '12px 18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}
          >
            <button
              type="button"
              onClick={() => setShowReasoning(!showReasoning)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HelpCircle size={14} strokeWidth={1.5} color="var(--color-stone-gray)" />
                <span
                  style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: '12px',
                    color: 'var(--color-stone-gray)'
                  }}
                >
                  Under-the-Hood Strategic Rationale
                </span>
              </div>
              {showReasoning ? <ChevronUp size={14} color="#737373" /> : <ChevronDown size={14} color="#737373" />}
            </button>

            {showReasoning && (
              <p
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '13px',
                  color: 'var(--color-ink-black)',
                  lineHeight: 1.45,
                  paddingTop: '6px'
                }}
              >
                {currentQuestion.reasoning}
              </p>
            )}
          </div>
        )}

        {/* Form with 3 Suggested Answer Pills + Custom Editor */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: '12px',
                color: 'var(--color-stone-gray)',
                letterSpacing: '0.02em'
              }}
            >
              Select one of 3 personality extremes, or craft your own answer below:
            </span>

            {/* 3 Clickable Suggested Answers */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {currentQuestion.suggestedAnswers.map((option, idx) => {
                const isSelected = selectedOptionIndex === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(idx, option)}
                    className={`pill-choice ${isSelected ? 'selected' : ''}`}
                  >
                    <span
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        border: `1px solid ${isSelected ? 'var(--color-ink-black)' : 'var(--color-warm-border)'}`,
                        backgroundColor: isSelected ? 'var(--color-ink-black)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '2px'
                      }}
                    >
                      {isSelected && <Check size={11} strokeWidth={2.5} color="#ffffff" />}
                    </span>

                    <span style={{ flex: 1, color: 'var(--color-ink-black)' }}>{option}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nuance / Freeform Edit field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: '12px',
                color: 'var(--color-stone-gray)'
              }}
            >
              Your final position / Nuanced answer:
            </span>
            <textarea
              className="editorial-textarea"
              placeholder="Refine the selected response or type your exact conviction..."
              value={customAnswer}
              onChange={handleCustomChange}
              style={{ minHeight: '85px', fontSize: '14px' }}
              disabled={isLoading}
            />
          </div>

          {/* Submit Action */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '8px' }}>
            <button
              type="submit"
              className="btn-pill-primary"
              disabled={!customAnswer.trim() || isLoading}
              style={{ padding: '12px 24px', fontSize: '14px' }}
            >
              <span>
                {isLoading
                  ? 'Processing...'
                  : currentRound === 3
                  ? 'Synthesize Brand Kit'
                  : `Proceed to Round ${currentRound + 1}`}
              </span>
              <ArrowRight size={14} strokeWidth={1.5} />
            </button>
          </div>
        </form>
      </div>

      {/* Prior Rounds Transcript Review */}
      {history.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <span
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--color-stone-gray)'
            }}
          >
            Socratic Transcript Record
          </span>

          {history.map((step, idx) => (
            <div
              key={idx}
              className="card-slab"
              style={{
                padding: '18px 24px',
                borderRadius: '18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                backgroundColor: 'var(--color-pure-white)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="pill-tag" style={{ fontSize: '10px', padding: '2px 8px' }}>
                  Round {step.round} Decision
                </span>
                <span style={{ fontSize: '11px', color: 'var(--color-stone-gray)' }}>
                  Confirmed
                </span>
              </div>
              <p
                style={{
                  fontFamily: 'var(--font-bureauserif)',
                  fontSize: '18px',
                  fontWeight: 450,
                  color: 'var(--color-ink-black)',
                  lineHeight: 1.2
                }}
              >
                {step.question}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '13px',
                  color: 'var(--color-stone-gray)',
                  lineHeight: 1.4
                }}
              >
                ↳ {step.userAnswer}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
