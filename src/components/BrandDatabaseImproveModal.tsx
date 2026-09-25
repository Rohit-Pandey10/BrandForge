import React, { useState, useEffect } from 'react';
import {
  X,
  Database,
  Sparkles,
  Check,
  Edit3,
  BookOpen,
  ArrowRight,
  Download,
  Copy,
  Plus,
  RefreshCw,
  History
} from 'lucide-react';
import { BrandKit } from '../types';
import { playPillClickSound } from '../utils/audio';

interface BrandDatabaseImproveModalProps {
  isOpen: boolean;
  onClose: () => void;
  brandKit: BrandKit;
  onUpdateBrandKit: (updatedKit: BrandKit) => void;
  onContinueInterview?: (roundName: string) => void;
}

interface SocraticChallenge {
  id: string;
  category: string;
  question: string;
  suggestions: { title: string; desc: string }[];
}

const STRATEGIC_CHALLENGES: SocraticChallenge[] = [
  {
    id: 'moat',
    category: 'Stage 5: Defensibility & Moats',
    question: 'What is your asymmetric technical or architectural advantage that prevents incumbents from displacing you in 6 months?',
    suggestions: [
      {
        title: 'Architectural Data Gravity & Sovereign Cryptography',
        desc: 'Local-first embedded primitives and private-key encryption make switching costs 10x higher while eliminating cloud vulnerability vectors.'
      },
      {
        title: 'Artisanal Craft & Zero-Bloat Ergonomics',
        desc: 'Sub-second CLI workflows and relentless simplicity that bureaucratic enterprise committees are culturally incapable of building.'
      },
      {
        title: 'Deterministic Edge Execution & Single-Binary Purity',
        desc: 'Compile once to run on any micro-node globally with zero runtime dependencies and microsecond latency.'
      }
    ]
  },
  {
    id: 'pricing',
    category: 'Stage 6: Pricing Power & Unit Economics',
    question: 'How do you charge in a way that aligns strictly with customer value while rejecting predatory SaaS subscription rent?',
    suggestions: [
      {
        title: 'Perpetual License with Paid Annual Synchronization',
        desc: 'Founders own the software forever on day one; revenue scales purely with active high-throughput distributed relay bandwidth.'
      },
      {
        title: 'Usage-Tied Computational Throughput',
        desc: 'Zero base seat tax; pricing strictly indexed to microsecond execution cycles, aligning costs directly with customer revenue scale.'
      },
      {
        title: 'Open Core Engine with Enterprise Governance Vault',
        desc: 'Uncompromising free local developer engine, monetizing only automated compliance, telemetry, and SOC2 audit exports.'
      }
    ]
  },
  {
    id: 'anti-audience',
    category: 'Stage 7: Anti-Audience & Polarization',
    question: 'Who is the exact profile of buyer you deliberately want to turn away so your brand remains pure and razor-sharp?',
    suggestions: [
      {
        title: 'Check-the-Box Corporate Procurement Officers',
        desc: 'We refuse to participate in 90-page RFP theater for organizations that prioritize committee CYA over developer leverage.'
      },
      {
        title: 'Short-Attention Vanity Metric Chasers',
        desc: 'We do not build for growth hackers who want shiny dashboard animations over rock-solid data integrity.'
      },
      {
        title: 'Legacy Monolith Middle-Managers',
        desc: 'We alienate teams that measure productivity by tickets closed rather than low-latency software delivered.'
      }
    ]
  },
  {
    id: 'wedge',
    category: 'Stage 8: Category Wedge & Narrative Monopoly',
    question: 'What is the tiny, undeniable wedge feature that lets you enter an account silently before expanding to replace the entire stack?',
    suggestions: [
      {
        title: 'Instant Local-Dev Drop-In Emulator',
        desc: 'Engineers start using it on localhost for speed; it silently propagates into production without requiring a DevOps migration ticket.'
      },
      {
        title: 'Microsecond Edge Cache Proxy',
        desc: 'Inserted in 5 minutes in front of failing Postgres/Redis; once latency drops by 90%, teams migrate the core storage over.'
      },
      {
        title: 'Zero-Config Schema Auto-Migrator',
        desc: 'Solves the acute pain of broken schema diffs in CI/CD, earning immediate grassroots engineering trust.'
      }
    ]
  }
];

export const BrandDatabaseImproveModal: React.FC<BrandDatabaseImproveModalProps> = ({
  isOpen,
  onClose,
  brandKit,
  onUpdateBrandKit,
  onContinueInterview
}) => {
  const [activeTab, setActiveTab] = useState<'socratic' | 'editor' | 'ingest' | 'export' | 'history'>('socratic');

  // Multi-challenge Socratic state
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [customAnswer, setCustomAnswer] = useState('');
  const [isApplyingSocratic, setIsApplyingSocratic] = useState(false);

  // Direct Database record edit state
  const [editedName, setEditedName] = useState(brandKit.brandStrategy.brandName);
  const [editedTagline, setEditedTagline] = useState(brandKit.brandStrategy.tagline);
  const [editedMission, setEditedMission] = useState(brandKit.brandStrategy.mission);
  const [editedValueProp, setEditedValueProp] = useState(brandKit.brandStrategy.coreValueProposition);
  const [editedAntiHero, setEditedAntiHero] = useState(brandKit.brandStrategy.antiHero);
  const [editedDifferentiator, setEditedDifferentiator] = useState(brandKit.brandStrategy.differentiator);

  // Ingestion state
  const [ingestNotes, setIngestNotes] = useState('');
  const [ingestCompetitors, setIngestCompetitors] = useState('');

  // Status & Changelog tracking
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [versionNumber, setVersionNumber] = useState(1);
  const [changeLog, setChangeLog] = useState<Array<{ version: string; time: string; action: string }>>([
    { version: 'v1.0', time: 'Initial Synthesis', action: 'Synthesized initial Socratic brand tokens' }
  ]);

  // Export state
  const [copiedJson, setCopiedJson] = useState(false);

  // Sync state whenever active brandKit changes
  useEffect(() => {
    setEditedName(brandKit.brandStrategy.brandName);
    setEditedTagline(brandKit.brandStrategy.tagline);
    setEditedMission(brandKit.brandStrategy.mission);
    setEditedValueProp(brandKit.brandStrategy.coreValueProposition);
    setEditedAntiHero(brandKit.brandStrategy.antiHero);
    setEditedDifferentiator(brandKit.brandStrategy.differentiator);
  }, [brandKit]);

  if (!isOpen) return null;

  const currentChallenge = STRATEGIC_CHALLENGES[currentChallengeIndex % STRATEGIC_CHALLENGES.length];

  const handleNextChallenge = () => {
    playPillClickSound();
    setCurrentChallengeIndex((prev) => (prev + 1) % STRATEGIC_CHALLENGES.length);
    setSelectedOption(null);
    setCustomAnswer('');
  };

  const logUpdate = (action: string) => {
    const nextVer = (versionNumber + 0.1).toFixed(1);
    setVersionNumber((v) => v + 0.1);
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setChangeLog((prev) => [{ version: `v${nextVer}`, time: now, action }, ...prev]);
    setStatusMessage(`Saved to Database (v${nextVer})`);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleApplySocraticImprovement = () => {
    playPillClickSound();
    setIsApplyingSocratic(true);

    const chosenText = customAnswer.trim() || (selectedOption !== null ? currentChallenge.suggestions[selectedOption].desc : currentChallenge.suggestions[0].desc);

    setTimeout(() => {
      let updated: BrandKit;

      if (currentChallenge.id === 'moat') {
        updated = {
          ...brandKit,
          brandStrategy: {
            ...brandKit.brandStrategy,
            differentiator: `${brandKit.brandStrategy.differentiator} Enforced by: ${chosenText}`
          },
          launchContent: {
            ...brandKit.launchContent,
            manifesto: `${brandKit.launchContent.manifesto}\n\nOur unyielding moat: ${chosenText}`
          }
        };
      } else if (currentChallenge.id === 'pricing') {
        updated = {
          ...brandKit,
          brandStrategy: {
            ...brandKit.brandStrategy,
            coreValueProposition: `${brandKit.brandStrategy.coreValueProposition} Monetized via: ${chosenText}`
          },
          launchContent: {
            ...brandKit.launchContent,
            elevatorPitch: `${brandKit.launchContent.elevatorPitch} Value model: ${chosenText}`
          }
        };
      } else if (currentChallenge.id === 'anti-audience') {
        updated = {
          ...brandKit,
          brandStrategy: {
            ...brandKit.brandStrategy,
            antiHero: `${brandKit.brandStrategy.antiHero} (Anti-Audience: ${chosenText})`
          },
          voiceSystem: {
            ...brandKit.voiceSystem,
            donts: [...brandKit.voiceSystem.donts, `Never cater to: ${chosenText.slice(0, 90)}`]
          }
        };
      } else {
        updated = {
          ...brandKit,
          launchContent: {
            ...brandKit.launchContent,
            callToAction: chosenText.slice(0, 40),
            socialHooks: [...brandKit.launchContent.socialHooks, `Our strategic wedge: ${chosenText}`]
          }
        };
      }

      onUpdateBrandKit(updated);
      setIsApplyingSocratic(false);
      logUpdate(`Applied ${currentChallenge.category}`);
      setSelectedOption(null);
      setCustomAnswer('');
      // Auto-advance to next strategic challenge
      setCurrentChallengeIndex((prev) => (prev + 1) % STRATEGIC_CHALLENGES.length);
    }, 350);
  };

  const handleSaveDirectEdits = (e: React.FormEvent) => {
    e.preventDefault();
    playPillClickSound();

    const updated: BrandKit = {
      ...brandKit,
      brandStrategy: {
        ...brandKit.brandStrategy,
        brandName: editedName.trim() || brandKit.brandStrategy.brandName,
        tagline: editedTagline.trim() || brandKit.brandStrategy.tagline,
        mission: editedMission.trim() || brandKit.brandStrategy.mission,
        coreValueProposition: editedValueProp.trim() || brandKit.brandStrategy.coreValueProposition,
        antiHero: editedAntiHero.trim() || brandKit.brandStrategy.antiHero,
        differentiator: editedDifferentiator.trim() || brandKit.brandStrategy.differentiator
      }
    };

    onUpdateBrandKit(updated);
    logUpdate('Edited Core Strategic Tokens');
  };

  const handleApplyIngest = (e: React.FormEvent) => {
    e.preventDefault();
    playPillClickSound();

    const additionalContext = [
      ingestNotes.trim() ? `Founder Intel: ${ingestNotes.trim()}` : '',
      ingestCompetitors.trim() ? `Competitors: ${ingestCompetitors.trim()}` : ''
    ].filter(Boolean).join(' | ');

    if (!additionalContext) return;

    const updated: BrandKit = {
      ...brandKit,
      brandStrategy: {
        ...brandKit.brandStrategy,
        antiHero: ingestCompetitors.trim()
          ? `${brandKit.brandStrategy.antiHero} (Incumbent targets: ${ingestCompetitors.trim()})`
          : brandKit.brandStrategy.antiHero
      },
      launchContent: {
        ...brandKit.launchContent,
        socialHooks: [
          ...brandKit.launchContent.socialHooks,
          `Why the status quo of ${ingestCompetitors.trim() || 'legacy tools'} fails high-craft teams.`
        ]
      }
    };

    onUpdateBrandKit(updated);
    logUpdate(`Ingested Context (${ingestCompetitors.trim() || 'Custom Notes'})`);
    setIngestNotes('');
    setIngestCompetitors('');
  };

  const handleCopyJson = () => {
    playPillClickSound();
    navigator.clipboard.writeText(JSON.stringify(brandKit, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 1800);
  };

  const handleDownloadDatabaseJson = () => {
    playPillClickSound();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(brandKit, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${brandKit.brandStrategy.brandName.toLowerCase().replace(/\s+/g, '-')}-brand-db.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: 'var(--spacing-16)'
      }}
      onClick={onClose}
    >
      <div
        className="card-slab"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '780px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '32px',
          borderRadius: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          backgroundColor: 'var(--surface-card)',
          border: '1px solid var(--color-warm-border)'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="pill-tag">
                <Database size={11} strokeWidth={1.5} />
                <span>Continuous Brand Intelligence Database</span>
              </span>
              {statusMessage && (
                <span
                  style={{
                    fontSize: '12px',
                    color: '#10b981',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontFamily: 'var(--font-inter)',
                    fontWeight: 500
                  }}
                >
                  <Check size={13} strokeWidth={2} /> {statusMessage}
                </span>
              )}
            </div>
            <h2 className="serif-heading" style={{ fontSize: '28px', color: 'var(--color-ink-black)' }}>
              Further Improve Brand Database
            </h2>
            <p className="text-body-sm" style={{ color: 'var(--color-stone-gray)' }}>
              Iterate, refine, and deepen your brand database as many times as needed. Add Socratic layers, edit live tokens, or ingest raw market intelligence.
            </p>
          </div>

          <button
            onClick={onClose}
            className="btn-pill-secondary"
            style={{ padding: '8px', borderRadius: '50%' }}
            title="Close modal"
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            borderBottom: '1px solid var(--color-warm-border)',
            paddingBottom: '12px',
            overflowX: 'auto'
          }}
        >
          <button
            onClick={() => {
              playPillClickSound();
              setActiveTab('socratic');
            }}
            className="btn-pill-secondary"
            style={{
              padding: '6px 14px',
              fontSize: '12px',
              backgroundColor: activeTab === 'socratic' ? 'var(--color-ink-black)' : 'transparent',
              color: activeTab === 'socratic' ? 'var(--color-paper-cream)' : 'var(--color-ink-black)'
            }}
          >
            <Sparkles size={12} strokeWidth={1.5} />
            <span>Socratic Deepening ({currentChallenge.category.split(':')[0]})</span>
          </button>

          <button
            onClick={() => {
              playPillClickSound();
              setActiveTab('editor');
            }}
            className="btn-pill-secondary"
            style={{
              padding: '6px 14px',
              fontSize: '12px',
              backgroundColor: activeTab === 'editor' ? 'var(--color-ink-black)' : 'transparent',
              color: activeTab === 'editor' ? 'var(--color-paper-cream)' : 'var(--color-ink-black)'
            }}
          >
            <Edit3 size={12} strokeWidth={1.5} />
            <span>Direct Token Editor</span>
          </button>

          <button
            onClick={() => {
              playPillClickSound();
              setActiveTab('ingest');
            }}
            className="btn-pill-secondary"
            style={{
              padding: '6px 14px',
              fontSize: '12px',
              backgroundColor: activeTab === 'ingest' ? 'var(--color-ink-black)' : 'transparent',
              color: activeTab === 'ingest' ? 'var(--color-paper-cream)' : 'var(--color-ink-black)'
            }}
          >
            <Plus size={12} strokeWidth={1.5} />
            <span>Ingest Intel</span>
          </button>

          <button
            onClick={() => {
              playPillClickSound();
              setActiveTab('history');
            }}
            className="btn-pill-secondary"
            style={{
              padding: '6px 14px',
              fontSize: '12px',
              backgroundColor: activeTab === 'history' ? 'var(--color-ink-black)' : 'transparent',
              color: activeTab === 'history' ? 'var(--color-paper-cream)' : 'var(--color-ink-black)'
            }}
          >
            <History size={12} strokeWidth={1.5} />
            <span>Changelog ({changeLog.length})</span>
          </button>

          <button
            onClick={() => {
              playPillClickSound();
              setActiveTab('export');
            }}
            className="btn-pill-secondary"
            style={{
              padding: '6px 14px',
              fontSize: '12px',
              backgroundColor: activeTab === 'export' ? 'var(--color-ink-black)' : 'transparent',
              color: activeTab === 'export' ? 'var(--color-paper-cream)' : 'var(--color-ink-black)'
            }}
          >
            <Download size={12} strokeWidth={1.5} />
            <span>Export Database</span>
          </button>
        </div>

        {/* Tab 1: Socratic Multi-Challenge Deepening */}
        {activeTab === 'socratic' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div
              style={{
                padding: '16px 20px',
                borderRadius: '16px',
                backgroundColor: 'var(--color-paper-cream)',
                border: '1px solid var(--color-warm-border)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    color: 'var(--color-stone-gray)',
                    letterSpacing: '0.04em'
                  }}
                >
                  {currentChallenge.category}
                </span>

                <button
                  onClick={handleNextChallenge}
                  className="btn-pill-secondary"
                  style={{ fontSize: '11px', padding: '4px 10px' }}
                  title="Switch to next strategic challenge question"
                >
                  <RefreshCw size={11} strokeWidth={1.5} />
                  <span>Next Challenge ({currentChallengeIndex + 1}/{STRATEGIC_CHALLENGES.length})</span>
                </button>
              </div>

              <p
                className="serif-heading"
                style={{
                  fontSize: '18px',
                  lineHeight: 1.35,
                  color: 'var(--color-ink-black)'
                }}
              >
                {currentChallenge.question}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span className="text-caption" style={{ color: 'var(--color-stone-gray)' }}>
                Select an argument to synthesize into your brand kit, or write a custom stance below:
              </span>

              {currentChallenge.suggestions.map((sugg, idx) => {
                const isSelected = selectedOption === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      playPillClickSound();
                      setSelectedOption(idx);
                      setCustomAnswer(sugg.desc);
                    }}
                    className="pill-choice"
                    style={{
                      flexDirection: 'column',
                      gap: '4px',
                      padding: '14px 18px',
                      borderColor: isSelected ? 'var(--color-ink-black)' : 'var(--color-warm-border)',
                      backgroundColor: isSelected ? 'var(--surface-choice-hover)' : 'var(--surface-card)'
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-bureauserif)',
                        fontSize: '15px',
                        fontWeight: 500,
                        color: 'var(--color-ink-black)'
                      }}
                    >
                      {sugg.title}
                    </span>
                    <span className="text-body-sm" style={{ color: 'var(--color-stone-gray)', fontSize: '13px' }}>
                      {sugg.desc}
                    </span>
                  </div>
                );
              })}
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-inter)',
                  fontSize: '12px',
                  fontWeight: 500,
                  marginBottom: '6px',
                  color: 'var(--color-ink-black)'
                }}
              >
                Custom Strategic Position
              </label>
              <textarea
                className="editorial-textarea"
                rows={3}
                placeholder="State your precise thesis for this challenge..."
                value={customAnswer}
                onChange={(e) => {
                  setCustomAnswer(e.target.value);
                  setSelectedOption(null);
                }}
                style={{ fontSize: '14px', minHeight: '80px' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px' }}>
              <span className="text-caption" style={{ color: 'var(--color-stone-gray)' }}>
                Applied improvements stack cumulatively.
              </span>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={onClose} className="btn-pill-secondary">
                  <span>Close</span>
                </button>
                <button
                  onClick={handleApplySocraticImprovement}
                  className="btn-pill-primary"
                  disabled={isApplyingSocratic}
                >
                  <Sparkles size={14} strokeWidth={1.5} />
                  <span>{isApplyingSocratic ? 'Synthesizing...' : 'Apply & Save to Database'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Direct Database Editor */}
        {activeTab === 'editor' && (
          <form onSubmit={handleSaveDirectEdits} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p className="text-body-sm" style={{ color: 'var(--color-stone-gray)' }}>
              Tune your database fields directly. Every save creates a new version checkpoint and updates your visual dashboard live.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '14px' }}>
              <div>
                <label className="text-caption" style={{ display: 'block', marginBottom: '4px' }}>
                  Brand Name
                </label>
                <input
                  type="text"
                  className="editorial-input"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  style={{ fontSize: '14px', padding: '10px 14px' }}
                />
              </div>

              <div>
                <label className="text-caption" style={{ display: 'block', marginBottom: '4px' }}>
                  Tagline
                </label>
                <input
                  type="text"
                  className="editorial-input"
                  value={editedTagline}
                  onChange={(e) => setEditedTagline(e.target.value)}
                  style={{ fontSize: '14px', padding: '10px 14px' }}
                />
              </div>
            </div>

            <div>
              <label className="text-caption" style={{ display: 'block', marginBottom: '4px' }}>
                Mission Statement
              </label>
              <textarea
                className="editorial-textarea"
                rows={2}
                value={editedMission}
                onChange={(e) => setEditedMission(e.target.value)}
                style={{ fontSize: '13px', minHeight: '60px', padding: '10px 14px' }}
              />
            </div>

            <div>
              <label className="text-caption" style={{ display: 'block', marginBottom: '4px' }}>
                Core Value Proposition
              </label>
              <textarea
                className="editorial-textarea"
                rows={2}
                value={editedValueProp}
                onChange={(e) => setEditedValueProp(e.target.value)}
                style={{ fontSize: '13px', minHeight: '60px', padding: '10px 14px' }}
              />
            </div>

            <div>
              <label className="text-caption" style={{ display: 'block', marginBottom: '4px' }}>
                Incumbent Villain / Anti-Hero
              </label>
              <input
                type="text"
                className="editorial-input"
                value={editedAntiHero}
                onChange={(e) => setEditedAntiHero(e.target.value)}
                style={{ fontSize: '13px', padding: '10px 14px' }}
              />
            </div>

            <div>
              <label className="text-caption" style={{ display: 'block', marginBottom: '4px' }}>
                Unfair Technical Differentiator
              </label>
              <textarea
                className="editorial-textarea"
                rows={2}
                value={editedDifferentiator}
                onChange={(e) => setEditedDifferentiator(e.target.value)}
                style={{ fontSize: '13px', minHeight: '60px', padding: '10px 14px' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px' }}>
              <span className="text-caption" style={{ color: 'var(--color-stone-gray)' }}>
                You can save unlimited edits anytime.
              </span>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" onClick={onClose} className="btn-pill-secondary">
                  <span>Close</span>
                </button>
                <button type="submit" className="btn-pill-primary">
                  <Check size={14} strokeWidth={1.5} />
                  <span>Save Changes to Database</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Tab 3: Ingest Custom Intel */}
        {activeTab === 'ingest' && (
          <form onSubmit={handleApplyIngest} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p className="text-body-sm" style={{ color: 'var(--color-stone-gray)' }}>
              Feed fresh competitor intel, customer quotes, or technical notes into the brand database. The synthesis engine adapts the messaging and social hooks to address these new inputs.
            </p>

            <div>
              <label className="text-caption" style={{ display: 'block', marginBottom: '4px' }}>
                Target Competitors & Status Quo Alternatives
              </label>
              <input
                type="text"
                className="editorial-input"
                placeholder="e.g. AWS DynamoDB, Datadog bloated pricing, Salesforce legacy slow UI"
                value={ingestCompetitors}
                onChange={(e) => setIngestCompetitors(e.target.value)}
                style={{ fontSize: '14px', padding: '10px 14px' }}
              />
            </div>

            <div>
              <label className="text-caption" style={{ display: 'block', marginBottom: '4px' }}>
                Raw Founder Notes / Customer Interview Findings
              </label>
              <textarea
                className="editorial-textarea"
                rows={4}
                placeholder="Paste key user pain points, unedited customer reactions, or technical whitepaper summaries..."
                value={ingestNotes}
                onChange={(e) => setIngestNotes(e.target.value)}
                style={{ fontSize: '13px', minHeight: '100px' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px' }}>
              <span className="text-caption" style={{ color: 'var(--color-stone-gray)' }}>
                Ingest as many notes or competitors as you need.
              </span>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" onClick={onClose} className="btn-pill-secondary">
                  <span>Close</span>
                </button>
                <button
                  type="submit"
                  className="btn-pill-primary"
                  disabled={!ingestNotes.trim() && !ingestCompetitors.trim()}
                >
                  <Plus size={14} strokeWidth={1.5} />
                  <span>Ingest into Database</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Tab 4: Changelog & History */}
        {activeTab === 'history' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p className="text-body-sm" style={{ color: 'var(--color-stone-gray)' }}>
              Audit trail of every iteration and improvement made to this brand database record:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
              {changeLog.map((log, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--color-paper-cream)',
                    border: '1px solid var(--color-warm-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        backgroundColor: 'var(--color-ink-black)',
                        color: 'var(--color-paper-cream)'
                      }}
                    >
                      {log.version}
                    </span>
                    <span className="text-body-sm" style={{ color: 'var(--color-ink-black)', fontWeight: 500 }}>
                      {log.action}
                    </span>
                  </div>

                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-stone-gray)' }}>
                    {log.time}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '8px' }}>
              <button onClick={onClose} className="btn-pill-secondary">
                <span>Close</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 5: Database Export */}
        {activeTab === 'export' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p className="text-body-sm" style={{ color: 'var(--color-stone-gray)' }}>
              Export this brand database record for storage in your git repository, SQLite database, or internal documentation system.
            </p>

            <div
              style={{
                position: 'relative',
                maxHeight: '260px',
                overflowY: 'auto',
                backgroundColor: 'var(--surface-code-bg)',
                borderRadius: '14px',
                padding: '16px',
                border: '1px solid var(--color-warm-border)'
              }}
            >
              <pre
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  lineHeight: 1.45,
                  color: 'var(--color-ink-black)',
                  margin: 0
                }}
              >
                {JSON.stringify(brandKit, null, 2)}
              </pre>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '8px' }}>
              <button onClick={handleCopyJson} className="btn-pill-secondary">
                {copiedJson ? <Check size={14} strokeWidth={1.5} /> : <Copy size={14} strokeWidth={1.5} />}
                <span>{copiedJson ? 'Copied JSON!' : 'Copy Database JSON'}</span>
              </button>

              <button onClick={handleDownloadDatabaseJson} className="btn-pill-primary">
                <Download size={14} strokeWidth={1.5} />
                <span>Download .json Schema</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
