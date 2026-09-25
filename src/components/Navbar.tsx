import React from 'react';
import { Volume2, VolumeX, Sparkles, RefreshCw, Key, Sun, Moon } from 'lucide-react';
import { isSoundEnabled, toggleSound } from '../utils/audio';

interface NavbarProps {
  useMock: boolean;
  onToggleMock: () => void;
  onReset: () => void;
  onOpenKeyModal: () => void;
  activeStage: number; // 0: intake, 1-3: interview, 4: dashboard
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  useMock,
  onToggleMock,
  onReset,
  onOpenKeyModal,
  activeStage,
  theme,
  onToggleTheme
}) => {
  const [sound, setSound] = React.useState(isSoundEnabled());

  const handleToggleSound = () => {
    const newState = toggleSound();
    setSound(newState);
  };

  return (
    <header
      style={{
        width: '100%',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 var(--spacing-24)',
        backgroundColor: 'transparent',
        borderBottom: '1px solid var(--color-warm-border)'
      }}
    >
      {/* Brand Wordmark */}
      <div
        onClick={onReset}
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: '12px',
          cursor: 'pointer'
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-bureauserif)',
            fontSize: '22px',
            fontWeight: 450,
            letterSpacing: '-0.03em',
            color: 'var(--color-ink-black)',
            lineHeight: 1
          }}
        >
          Brand Builder
        </span>
        <span
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 'var(--text-caption)',
            color: 'var(--color-stone-gray)',
            fontWeight: 400
          }}
        >
          / Socratic Synthesis
        </span>
      </div>

      {/* Nav Actions */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Mock Hydration Toggle */}
        <button
          onClick={onToggleMock}
          className="btn-pill-secondary"
          style={{
            fontSize: 'var(--text-caption)',
            padding: '6px 14px',
            borderColor: useMock ? 'var(--color-ink-black)' : 'var(--color-warm-border)'
          }}
          title={useMock ? 'Using instant deterministic mock' : 'Using live Gemini API'}
        >
          <Sparkles size={13} strokeWidth={1.5} />
          <span>{useMock ? 'Mock: Active' : 'Mock: Off'}</span>
        </button>

        {/* API Key settings */}
        <button
          onClick={onOpenKeyModal}
          className="btn-pill-secondary"
          style={{ fontSize: 'var(--text-caption)', padding: '6px 14px' }}
          title="Configure Gemini API Key"
        >
          <Key size={13} strokeWidth={1.5} />
          <span>Key</span>
        </button>

        {/* Sound toggle */}
        <button
          onClick={handleToggleSound}
          className="btn-pill-secondary"
          style={{ fontSize: 'var(--text-caption)', padding: '6px 10px' }}
          title={sound ? 'Mute sound effects' : 'Enable sound effects'}
        >
          {sound ? <Volume2 size={13} strokeWidth={1.5} /> : <VolumeX size={13} strokeWidth={1.5} />}
        </button>

        {/* Dark / Light Mode Toggle */}
        <button
          onClick={onToggleTheme}
          className="btn-pill-secondary"
          style={{ fontSize: 'var(--text-caption)', padding: '6px 12px' }}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle dark/light theme"
        >
          {theme === 'dark' ? <Sun size={13} strokeWidth={1.5} /> : <Moon size={13} strokeWidth={1.5} />}
          <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
        </button>

        {/* Reset button if not in intake */}
        {activeStage > 0 && (
          <button
            onClick={onReset}
            className="btn-pill-secondary"
            style={{ fontSize: 'var(--text-caption)', padding: '6px 14px' }}
            title="Start new brand interview"
          >
            <RefreshCw size={13} strokeWidth={1.5} />
            <span>Reset</span>
          </button>
        )}
      </nav>
    </header>
  );
};
