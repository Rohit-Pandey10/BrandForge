import React from 'react';

interface AnnouncementBarProps {
  useMock: boolean;
  model: string;
  hasCustomKey: boolean;
  onOpenKeyModal: () => void;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({
  useMock,
  model,
  hasCustomKey,
  onOpenKeyModal
}) => {
  return (
    <div
      style={{
        width: '100%',
        padding: '8px var(--spacing-24)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: 'var(--text-caption)',
        fontFamily: 'var(--font-inter)',
        fontWeight: 400,
        color: 'var(--color-ink-black)',
        borderBottom: '1px solid var(--color-warm-border)',
        backgroundColor: 'transparent'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span
          style={{
            display: 'inline-block',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: useMock ? 'var(--color-stone-gray)' : 'var(--color-ink-black)'
          }}
        />
        <span>
          Brand Builder v1.0 — Socratic Brand Interviewer & Token Synthesizer
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span>
          Runtime:{' '}
          <span style={{ color: 'var(--color-stone-gray)' }}>
            {useMock ? 'Deterministic Mock Hydration' : `${model} (Live GenAI)`}
          </span>
        </span>
        <button
          onClick={onOpenKeyModal}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'var(--font-inter)',
            fontSize: 'var(--text-caption)',
            color: 'var(--color-ink-black)',
            textDecoration: 'underline',
            padding: 0
          }}
        >
          {hasCustomKey ? 'Key Active' : 'API Key / Model Settings'}
        </button>
      </div>
    </div>
  );
};
