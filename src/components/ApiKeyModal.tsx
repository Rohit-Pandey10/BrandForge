import React, { useState } from 'react';
import { X, Key, Zap, ShieldCheck } from 'lucide-react';
import { playPillClickSound } from '../utils/audio';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  groqApiKey?: string;
  onSaveApiKeys: (geminiKey: string, groqKey?: string) => void;
  selectedModel: string;
  onSelectModel: (model: string) => void;
  useMock: boolean;
  onToggleMock: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  groqApiKey = '',
  onSaveApiKeys,
  selectedModel,
  onSelectModel,
  useMock,
  onToggleMock
}) => {
  const [tempGeminiKey, setTempGeminiKey] = useState(apiKey);
  const [tempGroqKey, setTempGroqKey] = useState(groqApiKey);

  if (!isOpen) return null;

  const handleSave = () => {
    playPillClickSound();
    onSaveApiKeys(tempGeminiKey.trim(), tempGroqKey.trim());
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: 'var(--spacing-16)'
      }}
    >
      <div
        className="card-slab"
        style={{
          width: '100%',
          maxWidth: '540px',
          padding: '32px',
          borderRadius: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          backgroundColor: 'var(--color-pure-white)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Key size={16} strokeWidth={1.5} />
            <h3 className="serif-heading" style={{ fontSize: '22px' }}>
              LLM Provider & Runtime Settings
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Runtime Mode Selector */}
        <div
          style={{
            padding: '16px',
            borderRadius: '16px',
            backgroundColor: 'var(--color-paper-cream)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-ink-black)' }}>
              Deterministic Domain Mock
            </span>
            <p style={{ fontSize: '11px', color: 'var(--color-stone-gray)', marginTop: '2px' }}>
              Zero-dependency offline mode with tailored questions for restaurants, fashion, etc.
            </p>
          </div>

          <button
            type="button"
            onClick={onToggleMock}
            className="btn-pill-secondary"
            style={{
              fontSize: '12px',
              padding: '4px 14px',
              borderColor: useMock ? 'var(--color-ink-black)' : 'var(--color-warm-border)',
              backgroundColor: useMock ? 'var(--color-ink-black)' : 'transparent',
              color: useMock ? '#ffffff' : '#000000'
            }}
          >
            {useMock ? 'Forced Offline' : 'Live Auto'}
          </button>
        </div>

        {/* Groq API Key Input (Primary) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-ink-black)', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Zap size={13} strokeWidth={2} style={{ color: '#E5A93C' }} />
              Groq API Key (Primary Fast Provider):
            </span>
            <span style={{ fontSize: '10px', color: 'var(--color-stone-gray)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Llama-3.3-70B
            </span>
          </div>
          <input
            type="password"
            placeholder="gsk_..."
            value={tempGroqKey}
            onChange={(e) => setTempGroqKey(e.target.value)}
            className="editorial-input"
            style={{ fontSize: '13px', padding: '10px 14px' }}
          />
          <span style={{ fontSize: '11px', color: 'var(--color-ash-gray)' }}>
            Used as the primary ultra-fast engine. If exhausted or unconfigured, falls back to Gemini.
          </span>
        </div>

        {/* Google Gemini API Key Input (Secondary / Backup) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-ink-black)', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <ShieldCheck size={13} strokeWidth={2} style={{ color: '#2C5282' }} />
              Google Gemini API Key (Secondary Backup):
            </span>
            <span style={{ fontSize: '10px', color: 'var(--color-stone-gray)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Gemini 2.5 Flash
            </span>
          </div>
          <input
            type="password"
            placeholder="AIzaSy..."
            value={tempGeminiKey}
            onChange={(e) => setTempGeminiKey(e.target.value)}
            className="editorial-input"
            style={{ fontSize: '13px', padding: '10px 14px' }}
          />
          <span style={{ fontSize: '11px', color: 'var(--color-ash-gray)' }}>
            Automatic failover target if Groq rate-limits or when Gemini is selected.
          </span>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
          <button onClick={onClose} className="btn-pill-secondary" style={{ fontSize: '13px' }}>
            Cancel
          </button>
          <button onClick={handleSave} className="btn-pill-primary" style={{ fontSize: '13px' }}>
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
