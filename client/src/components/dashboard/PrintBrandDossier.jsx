/**
 * Print Brand Dossier — Executive 4-Page Brand Book
 *
 * Rendered only during window.print() via @media print CSS rules.
 * Hidden on screen via `#brand-book-print-container { display: none }` in index.css.
 *
 * Page 1: Cover, Palette Swatches, 4 Strategy Pillars
 * Page 2: Founding Manifesto, Voice Dos/Don'ts, Brand Lexicon
 * Page 3: Experience Blueprint, Product Catalog, Social Hooks
 * Page 4: Strategic SWOT Ledger & Commercial Defensibility Matrix
 */

import React from 'react';

export default function PrintBrandDossier({ kit }) {
  if (!kit) return null;

  const brandStrategy = kit.brandStrategy || {};
  const voiceSystem   = kit.voiceSystem   || {};
  const visualTokens  = kit.visualTokens  || {};
  const launchContent = kit.launchContent || {};
  const blueprint     = kit.websiteBlueprint || {};
  const swotAnalysis  = kit.swotAnalysis  || {};

  const palette    = visualTokens.palette  || [];
  const typography = visualTokens.typography || {};
  const brandName  = brandStrategy.brandName || 'Brand Identity';

  const headingFont = typography.headingFont || 'Cormorant Garamond';
  const bodyFont    = typography.bodyFont    || 'Inter';

  // Pull catalog items: prefer first blueprint section, then fall back
  const catalogItems = (blueprint.sections && blueprint.sections[0]?.items) || [];
  const printCatalog = catalogItems.length > 0
    ? catalogItems.slice(0, 3)
    : [
        { label: 'Edition 01: Core Release',  description: brandStrategy.coreValueProposition || 'Our flagship product.', metricOrPrice: '—' },
        { label: 'Edition 02: Reserve Bundle', description: 'Limited batch with origin certificate.',                       metricOrPrice: '—' },
        { label: 'Edition 03: Routine Tier',  description: 'Monthly subscription in compostable packaging.',              metricOrPrice: '—' }
      ];

  const swotSummary = swotAnalysis.summary || brandStrategy.coreValueProposition || 'High-conviction commercial positioning isolating key defensibility wedges and market hedges.';
  const swotStrengths = Array.isArray(swotAnalysis.strengths) ? swotAnalysis.strengths : [];
  const swotWeaknesses = Array.isArray(swotAnalysis.weaknesses) ? swotAnalysis.weaknesses : [];
  const swotOpportunities = Array.isArray(swotAnalysis.opportunities) ? swotAnalysis.opportunities : [];
  const swotThreats = Array.isArray(swotAnalysis.threats) ? swotAnalysis.threats : [];

  /* ── Style Helpers ──────────────────────────────────────────────────── */
  const mono = { fontFamily: 'monospace' };
  const serif = { fontFamily: `'${headingFont}', Georgia, serif` };
  const sectionLabel = {
    ...mono, fontSize: '9pt', textTransform: 'uppercase',
    letterSpacing: '0.15em', color: '#666', display: 'block'
  };
  const cardLabel = {
    ...mono, fontSize: '8pt', textTransform: 'uppercase',
    letterSpacing: '0.1em', color: '#777', display: 'block', marginBottom: '0.5rem'
  };
  const footerStyle = {
    borderTop: '1px solid #dbd7cd', paddingTop: '0.75rem',
    display: 'flex', justifyContent: 'space-between',
    ...mono, fontSize: '8pt', color: '#888'
  };
  const card = {
    border: '1px solid #dbd7cd', padding: '1.25rem', borderRadius: '8px'
  };

  return (
    <div id="brand-book-print-container" style={{ fontFamily: `'${bodyFont}', sans-serif` }}>

      {/* ================================================================
          PAGE 1: COVER, PALETTE TOKENS & CORE STRATEGY
          ================================================================ */}
      <section className="print-dossier-page">
        <div>

          {/* Masthead */}
          <div style={{ borderBottom: '2px solid #111', paddingBottom: '1.25rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
              <span style={{ ...sectionLabel, marginBottom: 0 }}>
                EXECUTIVE BRAND DOSSIER • SPECIFICATION 01
              </span>
              <span style={{ ...mono, fontSize: '10pt', color: '#666' }}>
                {(brandStrategy.domain || 'RETAIL & CPG').toUpperCase()}
              </span>
            </div>
            <h1 style={{ ...serif, fontSize: '42pt', fontWeight: 300, lineHeight: 1.0, margin: '0.5rem 0' }}>
              {brandName}
            </h1>
            <p style={{ fontSize: '14pt', color: '#444', fontStyle: 'italic', margin: 0 }}>
              "{brandStrategy.tagline || launchContent.heroHeadline || ''}"
            </p>
          </div>

          {/* 5-Role Palette Swatch Ribbon */}
          <div className="print-card-avoid-break" style={{ marginBottom: '2.5rem' }}>
            <span style={{ ...cardLabel }}>SYNTHESIZED VISUAL TOKENS — 5-ROLE PALETTE</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
              {palette.slice(0, 5).map((color, i) => (
                <div key={i} style={{ border: '1px solid #e0ded9', borderRadius: '8px', overflow: 'hidden' }}>
                  <div
                    className="print-swatch-box"
                    style={{ backgroundColor: color.hex, height: '48px', width: '100%', borderBottom: '1px solid #e0ded9' }}
                  />
                  <div style={{ padding: '6px 8px' }}>
                    <div style={{ ...mono, fontSize: '8pt', textTransform: 'uppercase', color: '#888' }}>{color.role}</div>
                    <div style={{ fontSize: '9pt', fontWeight: 600 }}>{color.hex}</div>
                    <div style={{ fontSize: '8pt', color: '#555', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {color.name || color.role}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strategy 2×2 Quadrant */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            {[
              {
                num: '01', label: 'TARGET AUDIENCE & ICP',
                value: brandStrategy.targetAudience,
                bold: false
              },
              {
                num: '02', label: 'CORE VALUE PROPOSITION',
                value: brandStrategy.coreValueProposition,
                bold: false
              },
              {
                num: '03', label: 'THE INDUSTRY STANDARD WE BREAK (ANTI-HERO)',
                value: brandStrategy.antiHero,
                bold: false
              },
              {
                num: '04', label: 'THE ONLYNESS DIFFERENTIATOR',
                value: brandStrategy.differentiator,
                bold: true, highlight: true
              }
            ].map(({ num, label, value, bold, highlight }) => (
              <div
                key={num}
                className="print-card-avoid-break"
                style={{
                  ...card,
                  ...(highlight ? { border: '2px solid #000', background: '#faf9f6' } : {})
                }}
              >
                <span style={{ ...cardLabel, ...(highlight ? { color: '#000', fontWeight: 'bold' } : {}) }}>
                  {num} / {label}
                </span>
                <p style={{ fontSize: '10.5pt', lineHeight: 1.45, margin: 0, color: '#111', fontWeight: bold ? 500 : 400 }}>
                  {value || '—'}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div style={footerStyle}>
          <span>{brandName} • Core Strategy Specification</span>
          <span>Page 01 of 04</span>
        </div>
      </section>

      {/* ================================================================
          PAGE 2: MANIFESTO, VOICE RULES & BRAND LEXICON
          ================================================================ */}
      <section className="print-dossier-page">
        <div>
          <div style={{ borderBottom: '2px solid #111', paddingBottom: '0.75rem', marginBottom: '2rem' }}>
            <span style={sectionLabel}>SECTION 02 • VERBAL IDENTITY & CREATIVE MANIFESTO</span>
          </div>

          {/* Manifesto */}
          <div
            className="print-card-avoid-break"
            style={{ border: '1px solid #111', borderRadius: '12px', padding: '2rem', marginBottom: '2rem', background: '#fdfcfb' }}
          >
            <span style={{ ...cardLabel, color: '#555' }}>THE FOUNDING MANIFESTO</span>
            <div style={{ ...serif, fontSize: '13pt', lineHeight: 1.55, color: '#111', whiteSpace: 'pre-line' }}>
              {launchContent.manifesto ||
                `${brandStrategy.coreValueProposition || ''}. We reject ${brandStrategy.antiHero || 'industry compromise'}. Our mandate: ${brandStrategy.mission || brandStrategy.differentiator || ''}`}
            </div>
          </div>

          {/* Voice Dos / Don'ts */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div className="print-card-avoid-break" style={card}>
              <span style={{ ...cardLabel, color: '#166534', fontWeight: 600 }}>✓ VOICE DOS — SPEAK LIKE THIS</span>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '9.5pt', lineHeight: 1.65, color: '#333' }}>
                {(voiceSystem.dos || [
                  'Speak with crisp, concrete conviction',
                  'Ground promises in tangible sensory reality',
                  'Stay clear, active, and jargon-free'
                ]).map((item, i) => (
                  <li key={i} style={{ marginBottom: '0.2rem' }}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="print-card-avoid-break" style={card}>
              <span style={{ ...cardLabel, color: '#991b1b', fontWeight: 600 }}>✕ VOICE DON'TS — STRICTLY BANNED</span>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '9.5pt', lineHeight: 1.65, color: '#333' }}>
                {(voiceSystem.donts || [
                  'Never use corporate tech buzzwords',
                  'Avoid demographic caricature language',
                  'Never make unsubstantiated claims'
                ]).map((item, i) => (
                  <li key={i} style={{ marginBottom: '0.2rem' }}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Signature Lexicon */}
          <div className="print-card-avoid-break" style={{ ...card }}>
            <span style={cardLabel}>SIGNATURE BRAND LEXICON</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {(voiceSystem.vocabularyWords || ['clarity', 'craft', 'essential', 'focused', 'honest']).map((word, i) => (
                <span key={i} style={{
                  ...mono, fontSize: '8.5pt', padding: '2px 8px',
                  border: '1px solid #ccc', borderRadius: '4px', background: '#fafafa'
                }}>
                  {word}
                </span>
              ))}
            </div>
          </div>

          {/* Archetype row */}
          {voiceSystem.archetype && (
            <div style={{ marginTop: '1.25rem', ...card }}>
              <span style={cardLabel}>BRAND ARCHETYPE</span>
              <p style={{ fontSize: '10.5pt', margin: 0, fontWeight: 500 }}>{voiceSystem.archetype}</p>
            </div>
          )}
        </div>

        <div style={footerStyle}>
          <span>{brandName} • Verbal Identity & Manifesto</span>
          <span>Page 02 of 04</span>
        </div>
      </section>

      {/* ================================================================
          PAGE 3: EXPERIENCE BLUEPRINT, CATALOG & SOCIAL HOOKS
          ================================================================ */}
      <section className="print-dossier-page">
        <div>
          <div style={{ borderBottom: '2px solid #111', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
            <span style={sectionLabel}>SECTION 03 • SYNTHESIZED EXPERIENCE BLUEPRINT</span>
          </div>

          {/* Hero card */}
          <div
            className="print-card-avoid-break"
            style={{ ...card, background: '#fcfbf9', marginBottom: '1.5rem', padding: '1.5rem', borderRadius: '12px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ ...serif, fontSize: '16pt', fontWeight: 600 }}>{brandName}</span>
              <span style={{
                ...mono, fontSize: '8pt', padding: '2px 10px',
                borderRadius: '999px', border: '1px solid #ccc'
              }}>
                {blueprint.badge || 'Official Release'}
              </span>
            </div>
            <h2 style={{ ...serif, fontSize: '22pt', fontWeight: 400, margin: '0.5rem 0', lineHeight: 1.15 }}>
              {launchContent.heroHeadline || '—'}
            </h2>
            <p style={{ fontSize: '10pt', color: '#555', margin: '0 0 1rem 0', lineHeight: 1.45 }}>
              {launchContent.heroSubheadline || brandStrategy.coreValueProposition || '—'}
            </p>
            <div style={{ ...mono, fontSize: '8.5pt', color: '#444' }}>
              PRIMARY CTA: [{blueprint.primaryCta || launchContent.callToAction || 'Explore'}]
              &nbsp;•&nbsp;
              SECONDARY: [{blueprint.secondaryCta || 'Learn More'}]
              {blueprint.announcementBar && (
                <>&nbsp;•&nbsp;BAR: {blueprint.announcementBar}</>
              )}
            </div>
          </div>

          {/* Launch Catalog */}
          <div className="print-card-avoid-break" style={{ marginBottom: '1.5rem' }}>
            <span style={cardLabel}>
              {(blueprint.sections && blueprint.sections[0]?.title) || 'LAUNCH OFFERINGS & EDITIONS'}
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              {printCatalog.map((item, i) => (
                <div key={i} style={{ ...card, background: '#fff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.3rem', gap: '6px' }}>
                    <div style={{ ...serif, fontSize: '9.5pt', fontWeight: 600, lineHeight: 1.3 }}>{item.label}</div>
                    {item.metricOrPrice && item.metricOrPrice !== '—' && (
                      <div style={{ ...mono, fontSize: '8.5pt', fontWeight: 600, flexShrink: 0 }}>{item.metricOrPrice}</div>
                    )}
                  </div>
                  <p style={{ fontSize: '8pt', color: '#666', lineHeight: 1.4, margin: 0 }}>{item.description}</p>
                  {item.tag && (
                    <span style={{ ...mono, fontSize: '7.5pt', color: '#888', marginTop: '0.4rem', display: 'block' }}>{item.tag}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Social Hooks */}
          <div className="print-card-avoid-break" style={card}>
            <span style={cardLabel}>LAUNCH SOCIAL ANNOUNCEMENT HOOKS</span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {(launchContent.socialHooks || [
                'We built this because the industry was broken.',
                'No more compromises. This is the new standard.'
              ]).slice(0, 4).map((hook, i) => (
                <div key={i} style={{
                  fontSize: '8.5pt', color: '#333',
                  background: '#f9f9f8', padding: '6px 10px',
                  borderRadius: '6px', border: '1px solid #eee',
                  fontStyle: 'italic'
                }}>
                  "{hook}"
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={footerStyle}>
          <span>{brandName} • Experience Blueprint</span>
          <span>Page 03 of 04</span>
        </div>
      </section>

      {/* ================================================================
          PAGE 4: STRATEGIC SWOT LEDGER & COMMERCIAL ANALYSIS
          ================================================================ */}
      <section className="print-dossier-page">
        <div>
          <div style={{ borderBottom: '2px solid #111', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={sectionLabel}>SECTION 04 • STRATEGIC SWOT LEDGER & COMMERCIAL ANALYSIS</span>
              <span style={{ ...mono, fontSize: '9pt', color: '#666' }}>SOCRATIC SYNTHESIS</span>
            </div>
          </div>

          {/* Executive Verdict Banner */}
          <div
            className="print-card-avoid-break"
            style={{
              border: '1px solid #111',
              borderRadius: '10px',
              padding: '1.25rem 1.5rem',
              marginBottom: '1.5rem',
              background: '#fcfbf9'
            }}
          >
            <span style={{ ...cardLabel, color: '#b45309', fontWeight: 600 }}>
              EXECUTIVE COMMERCIAL DEFICIT & ADVANTAGE VERDICT
            </span>
            <div style={{ ...serif, fontSize: '13pt', lineHeight: 1.45, color: '#111', fontStyle: 'italic' }}>
              "{swotSummary}"
            </div>
          </div>

          {/* 2x2 SWOT Matrix */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>

            {/* Strengths */}
            <div className="print-card-avoid-break" style={{ ...card, borderLeft: '3px solid #059669' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                <span style={{ ...cardLabel, color: '#065f46', fontWeight: 700, marginBottom: 0 }}>
                  [S] CORE STRENGTHS & WEDGES
                </span>
                <span style={{ ...mono, fontSize: '7.5pt', color: '#059669' }}>{swotStrengths.length} WEDGES</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(swotStrengths.slice(0, 5)).map((s, idx) => (
                  <div key={idx} style={{ padding: '6px 8px', background: '#f6fbf8', borderRadius: '6px', border: '1px solid #e2ece6' }}>
                    <div style={{ fontSize: '9pt', fontWeight: 600, color: '#111' }}>{s.title}</div>
                    <div style={{ fontSize: '8pt', color: '#444', lineHeight: 1.35, marginTop: '2px' }}>{s.description}</div>
                    {s.transcriptAnchor && (
                      <div style={{ ...mono, fontSize: '7.5pt', color: '#065f46', marginTop: '4px', fontStyle: 'italic' }}>
                        Anchor: "{s.transcriptAnchor}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Weaknesses */}
            <div className="print-card-avoid-break" style={{ ...card, borderLeft: '3px solid #d97706' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                <span style={{ ...cardLabel, color: '#92400e', fontWeight: 700, marginBottom: 0 }}>
                  [W] COMMERCIAL VULNERABILITIES
                </span>
                <span style={{ ...mono, fontSize: '7.5pt', color: '#d97706' }}>{swotWeaknesses.length} RISKS</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(swotWeaknesses.slice(0, 5)).map((w, idx) => (
                  <div key={idx} style={{ padding: '6px 8px', background: '#fdfaf5', borderRadius: '6px', border: '1px solid #f2e9dc' }}>
                    <div style={{ fontSize: '9pt', fontWeight: 600, color: '#111' }}>{w.title}</div>
                    <div style={{ fontSize: '8pt', color: '#444', lineHeight: 1.35, marginTop: '2px' }}>{w.description}</div>
                    {w.mitigation && (
                      <div style={{ ...mono, fontSize: '7.5pt', color: '#78350f', marginTop: '4px' }}>
                        Hedge: {w.mitigation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Opportunities */}
            <div className="print-card-avoid-break" style={{ ...card, borderLeft: '3px solid #4f46e5' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                <span style={{ ...cardLabel, color: '#3730a3', fontWeight: 700, marginBottom: 0 }}>
                  [O] EXPANSION VECTORS
                </span>
                <span style={{ ...mono, fontSize: '7.5pt', color: '#4f46e5' }}>{swotOpportunities.length} CHANNELS</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(swotOpportunities.slice(0, 5)).map((o, idx) => (
                  <div key={idx} style={{ padding: '6px 8px', background: '#f7f7fd', borderRadius: '6px', border: '1px solid #e5e5f7' }}>
                    <div style={{ fontSize: '9pt', fontWeight: 600, color: '#111' }}>{o.title}</div>
                    <div style={{ fontSize: '8pt', color: '#444', lineHeight: 1.35, marginTop: '2px' }}>{o.description}</div>
                    {o.growthVector && (
                      <div style={{ ...mono, fontSize: '7.5pt', color: '#3730a3', marginTop: '4px' }}>
                        Vector: {o.growthVector}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Threats */}
            <div className="print-card-avoid-break" style={{ ...card, borderLeft: '3px solid #e11d48' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                <span style={{ ...cardLabel, color: '#9f1239', fontWeight: 700, marginBottom: 0 }}>
                  [T] INCUMBENT THREATS & COUNTER-MOVES
                </span>
                <span style={{ ...mono, fontSize: '7.5pt', color: '#e11d48' }}>{swotThreats.length} THREATS</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(swotThreats.slice(0, 5)).map((t, idx) => (
                  <div key={idx} style={{ padding: '6px 8px', background: '#fdf6f7', borderRadius: '6px', border: '1px solid #fae4e7' }}>
                    <div style={{ fontSize: '9pt', fontWeight: 600, color: '#111' }}>{t.title}</div>
                    <div style={{ fontSize: '8pt', color: '#444', lineHeight: 1.35, marginTop: '2px' }}>{t.description}</div>
                    {t.defensivePlay && (
                      <div style={{ ...mono, fontSize: '7.5pt', color: '#881337', marginTop: '4px' }}>
                        Defense: {t.defensivePlay}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        <div style={footerStyle}>
          <span>{brandName} • Strategic SWOT Analysis</span>
          <span>Page 04 of 04</span>
        </div>
      </section>

    </div>
  );
}
