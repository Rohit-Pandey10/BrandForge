import React, { useState } from 'react';
import { ArrowRight, Sparkles, Terminal, HeartPulse, ShieldCheck, Shuffle } from 'lucide-react';
import { WaveIllustration } from './WaveIllustration';
import { PRESET_PITCHES, PresetPitch } from '../../server/mockData';
import { playPillClickSound } from '../utils/audio';

interface IntakeViewProps {
  onStartInterview: (pitch: string, presetId?: string) => void;
  onInstantSynthesize: (pitch?: string, presetId?: string, forceShuffle?: boolean) => void;
  useMock: boolean;
  isLoading: boolean;
}

export const IntakeView: React.FC<IntakeViewProps> = ({
  onStartInterview,
  onInstantSynthesize,
  useMock,
  isLoading
}) => {
  const [pitch, setPitch] = useState('');
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);

  const handleSelectPreset = (preset: typeof PRESET_PITCHES[0]) => {
    playPillClickSound();
    setPitch(preset.pitch);
    setSelectedPresetId(preset.id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pitch.trim()) return;
    playPillClickSound();
    onStartInterview(pitch.trim(), selectedPresetId || undefined);
  };

  const handleQuickSynthesize = () => {
    playPillClickSound();
    if (selectedPresetId) {
      onInstantSynthesize(pitch.trim(), selectedPresetId, false);
    } else {
      // Shuffle through prebuilt demo brands
      onInstantSynthesize(pitch.trim() || undefined, undefined, true);
    }
  };

  const getPresetIcon = (id: string) => {
    switch (id) {
      case 'developer-first-db':
        return <Terminal size={18} strokeWidth={1.5} />;
      case 'ai-nutritionist-for-gamers':
        return <HeartPulse size={18} strokeWidth={1.5} />;
      case 'anti-saas-accounting':
        return <ShieldCheck size={18} strokeWidth={1.5} />;
      default:
        return <Sparkles size={18} strokeWidth={1.5} />;
    }
  };

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Centered Single-Column Hero */}
      <section
        style={{
          width: '100%',
          maxWidth: '960px',
          textAlign: 'center',
          padding: '64px var(--spacing-24) 36px var(--spacing-24)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px'
        }}
      >
        {/* Stage 1 Tag */}
        <div className="pill-tag">
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-ink-black)' }} />
          <span>Stage 1 Intake — Socratic Brand Interviewer</span>
        </div>

        {/* Editorial Display Headline */}
        <h1
          className="text-display serif-heading"
          style={{
            maxWidth: '880px',
            color: 'var(--color-ink-black)'
          }}
        >
          Whispered conviction. Built to endure.
        </h1>

        {/* Body Subtitle */}
        <p
          className="text-body"
          style={{
            maxWidth: '680px',
            color: 'var(--color-ink-black)',
            margin: '0 auto'
          }}
        >
          Most brands drown in chromatic noise and borrowed corporate slogans. Brand Builder interrogates your core value proposition across three sharp Socratic rounds, distilling your conviction into an unyielding voice and design token system.
        </p>

        {/* Founder 1-Sentence Pitch Input */}
        <form
          onSubmit={handleSubmit}
          style={{
            width: '100%',
            maxWidth: '760px',
            marginTop: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          <div style={{ position: 'relative', width: '100%' }}>
            <textarea
              className="editorial-textarea"
              placeholder="State your single-sentence value claim (e.g. An edge-native, sub-millisecond document database that replaces MongoDB and Redis with zero operational maintenance)..."
              value={pitch}
              onChange={(e) => {
                setPitch(e.target.value);
                setSelectedPresetId(null);
              }}
              style={{
                height: '110px',
                fontSize: '15px',
                lineHeight: '1.5',
                padding: '18px 20px',
                borderRadius: '16px'
              }}
              disabled={isLoading}
            />
          </div>

          {/* Action CTAs */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '14px'
            }}
          >
            <button
              type="submit"
              className="btn-pill-primary"
              disabled={!pitch.trim() || isLoading}
              style={{ padding: '12px 26px', fontSize: '15px' }}
            >
              <span>{isLoading ? 'Interrogating...' : 'Begin Socratic Interview'}</span>
              <ArrowRight size={15} strokeWidth={1.5} />
            </button>

            <button
              type="button"
              onClick={handleQuickSynthesize}
              className="btn-pill-secondary"
              disabled={isLoading}
              style={{ padding: '11px 22px', fontSize: '15px' }}
              title="Instantly generate complete brand kit — shuffles between prebuilt demo brands"
            >
              <Shuffle size={15} strokeWidth={1.5} />
              <span>Instant Mock Synthesize (Shuffle Demo)</span>
            </button>
          </div>
        </form>
      </section>

      {/* Decorative Wave/Ribbon Illustration — Sole Chromatic Anchor */}
      <WaveIllustration />

      {/* 3 Preset Founder Pitch Cards */}
      <section
        style={{
          width: '100%',
          maxWidth: '1100px',
          padding: '24px var(--spacing-24) 64px var(--spacing-24)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h2
              className="serif-heading"
              style={{ fontSize: '26px', color: 'var(--color-ink-black)', marginBottom: '4px' }}
            >
              Preset Founder Archetypes
            </h2>
            <p className="text-body-sm" style={{ color: 'var(--color-stone-gray)' }}>
              Select a benchmark founder claim to inspect how the Socratic interviewer deconstructs assumptions.
            </p>
          </div>

          <span className="pill-tag">Click to Load & Experiment</span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
            gap: '20px'
          }}
        >
          {PRESET_PITCHES.map((preset: PresetPitch) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <div
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`card-slab card-slab-interactive`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  padding: '28px',
                  borderRadius: '24px',
                  borderColor: isSelected ? 'var(--color-ink-black)' : 'var(--color-warm-border)',
                  backgroundColor: isSelected ? 'var(--surface-card-hover)' : 'var(--surface-card)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-inter)',
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      color: 'var(--color-stone-gray)'
                    }}
                  >
                    {preset.category}
                  </span>
                  <span style={{ color: 'var(--color-ink-black)' }}>{getPresetIcon(preset.id)}</span>
                </div>

                <h3
                  className="serif-heading"
                  style={{
                    fontSize: '22px',
                    lineHeight: 1.1,
                    color: 'var(--color-ink-black)'
                  }}
                >
                  {preset.title}
                </h3>

                <p
                  className="text-body-sm"
                  style={{
                    color: 'var(--color-stone-gray)',
                    flex: 1,
                    lineHeight: 1.5
                  }}
                >
                  "{preset.pitch}"
                </p>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '12px',
                    borderTop: '1px solid var(--color-warm-border)'
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-inter)',
                      fontSize: '12px',
                      color: isSelected ? 'var(--color-ink-black)' : 'var(--color-stone-gray)'
                    }}
                  >
                    {isSelected ? 'Loaded in Editor' : 'Click to select'}
                  </span>
                  <ArrowRight size={13} strokeWidth={1.5} color={isSelected ? 'var(--color-ink-black)' : 'var(--color-stone-gray)'} />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
