import React, { useState, useEffect } from 'react';
import {
  Copy,
  Check,
  Download,
  Printer,
  Sparkles,
  ExternalLink,
  Code,
  Share2,
  FileText,
  Palette,
  Layers,
  ArrowRight,
  Database,
  Monitor,
  Smartphone,
  Globe,
  Lock,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { BrandKit } from '../types';
import { playPillClickSound } from '../utils/audio';
import { BrandDatabaseImproveModal } from './BrandDatabaseImproveModal';

// Helper: Convert HEX to RGBA with alpha
const hexToRgba = (hex: string, alpha: number = 1): string => {
  if (!hex || typeof hex !== 'string') return `rgba(0, 0, 0, ${alpha})`;
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  if (clean.length !== 6) return hex;
  const num = parseInt(clean, 16);
  if (isNaN(num)) return hex;
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Helper: Determine if color is perceptually light
const isLightColor = (hex: string): boolean => {
  if (!hex || typeof hex !== 'string') return true;
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  if (clean.length !== 6) return true;
  const num = parseInt(clean, 16);
  if (isNaN(num)) return true;
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 135;
};

// Helper: High contrast readable text color (#0f1115 or #ffffff)
const getContrastColor = (hex: string): string => {
  return isLightColor(hex) ? '#0f1115' : '#ffffff';
};

interface BrandKitDashboardProps {
  brandKit: BrandKit;
  onReset: () => void;
  onUpdateBrandKit?: (updatedKit: BrandKit) => void;
}

export const BrandKitDashboard: React.FC<BrandKitDashboardProps> = ({ brandKit, onReset, onUpdateBrandKit }) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [copiedCss, setCopiedCss] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'strategy' | 'visuals' | 'launch'>('preview');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [isImproveModalOpen, setIsImproveModalOpen] = useState(false);

  const { brandStrategy, visualTokens, launchContent } = brandKit;

  // Dynamic Google Fonts injection
  useEffect(() => {
    if (visualTokens.typography.googleFontsUrl) {
      const linkId = 'dynamic-brandkit-font';
      let linkElement = document.getElementById(linkId) as HTMLLinkElement | null;
      if (!linkElement) {
        linkElement = document.createElement('link');
        linkElement.id = linkId;
        linkElement.rel = 'stylesheet';
        document.head.appendChild(linkElement);
      }
      linkElement.href = visualTokens.typography.googleFontsUrl;
    }
  }, [visualTokens.typography.googleFontsUrl]);

  // Copy HEX helper
  const handleCopyHex = (hex: string) => {
    playPillClickSound();
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  // Generate CSS Variables
  const generateCssVariables = () => {
    const paletteLines = visualTokens.palette
      .map((swatch) => `  --color-${swatch.role}: ${swatch.hex}; /* ${swatch.name} */`)
      .join('\n');

    return `:root {
  /* Brand: ${brandStrategy.brandName} */
  /* Tagline: ${brandStrategy.tagline} */
${paletteLines}

  /* Typography */
  --font-heading: '${visualTokens.typography.headingFont}', serif;
  --font-body: '${visualTokens.typography.bodyFont}', sans-serif;

  /* Shape & Philosophy */
  --border-radius: ${visualTokens.borderCurvature};
  /* Philosophy: ${visualTokens.stylePhilosophy} */
}`;
  };

  const handleCopyCss = () => {
    playPillClickSound();
    navigator.clipboard.writeText(generateCssVariables());
    setCopiedCss(true);
    setTimeout(() => setCopiedCss(false), 2000);
  };

  const handleCopyJson = () => {
    playPillClickSound();
    navigator.clipboard.writeText(JSON.stringify(brandKit, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  // Download SVG Swatches
  const handleDownloadSvgSwatches = () => {
    playPillClickSound();
    const swatches = visualTokens.palette;
    const width = 800;
    const height = 240;
    const swatchWidth = width / swatches.length;

    let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <rect width="100%" height="100%" fill="#f2f1ed"/>
  <text x="32" y="40" font-family="sans-serif" font-size="16" font-weight="600" fill="#000000">${brandStrategy.brandName} — Color Swatches</text>
  <g transform="translate(0, 60)">`;

    swatches.forEach((s, i) => {
      const x = i * swatchWidth + 24;
      const w = swatchWidth - 16;
      svgContent += `
    <rect x="${x}" y="0" width="${w}" height="100" rx="12" fill="${s.hex}"/>
    <text x="${x}" y="125" font-family="sans-serif" font-size="12" font-weight="600" fill="#000000">${s.name}</text>
    <text x="${x}" y="142" font-family="sans-serif" font-size="11" fill="#737373">${s.hex} (${s.role})</text>`;
    });

    svgContent += `
  </g>
</svg>`;

    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${brandStrategy.brandName.toLowerCase().replace(/\s+/g, '-')}-palette.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Download CSS file
  const handleDownloadCss = () => {
    playPillClickSound();
    const css = generateCssVariables();
    const blob = new Blob([css], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${brandStrategy.brandName.toLowerCase().replace(/\s+/g, '-')}-tokens.css`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Download JSON Kit
  const handleDownloadJson = () => {
    playPillClickSound();
    const jsonStr = JSON.stringify(brandKit, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${brandStrategy.brandName.toLowerCase().replace(/\s+/g, '-')}-brandkit.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Print PDF
  const handlePrint = () => {
    playPillClickSound();
    window.print();
  };

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '0 var(--spacing-24) 80px var(--spacing-24)',
        display: 'flex',
        flexDirection: 'column',
        gap: '36px'
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '16px',
          padding: '24px 0'
        }}
      >
        <div className="pill-tag">
          <Sparkles size={12} strokeWidth={1.5} />
          <span>Stage 4 Synthesized — Strategic Identity System</span>
        </div>

        <h1
          className="serif-heading"
          style={{
            fontSize: '56px',
            lineHeight: 1.0,
            letterSpacing: '-0.03em',
            color: 'var(--color-ink-black)'
          }}
        >
          {brandStrategy.brandName}
        </h1>

        <p
          className="text-body"
          style={{
            maxWidth: '680px',
            color: 'var(--color-stone-gray)',
            fontSize: '17px'
          }}
        >
          "{brandStrategy.tagline}"
        </p>

        {/* Global Action Toolbar */}
        <div
          className="no-print"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            marginTop: '8px'
          }}
        >
          <button onClick={handleDownloadJson} className="btn-pill-secondary" style={{ fontSize: '13px' }}>
            <Download size={14} strokeWidth={1.5} />
            <span>Export JSON</span>
          </button>

          <button onClick={handleDownloadCss} className="btn-pill-secondary" style={{ fontSize: '13px' }}>
            <Code size={14} strokeWidth={1.5} />
            <span>Export CSS Tokens</span>
          </button>

          <button onClick={handleDownloadSvgSwatches} className="btn-pill-secondary" style={{ fontSize: '13px' }}>
            <Palette size={14} strokeWidth={1.5} />
            <span>Download SVG Swatches</span>
          </button>

          <button onClick={handlePrint} className="btn-pill-secondary" style={{ fontSize: '13px' }}>
            <Printer size={14} strokeWidth={1.5} />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div
        className="no-print"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          paddingBottom: '16px',
          borderBottom: '1px solid var(--color-warm-border)',
          overflowX: 'auto'
        }}
      >
        {[
          { id: 'preview', label: 'Live Brand Preview' },
          { id: 'strategy', label: 'Brand Strategy' },
          { id: 'visuals', label: 'Visual Design Tokens' },
          { id: 'launch', label: 'Launch Copy & Manifesto' }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                playPillClickSound();
                setActiveTab(tab.id as typeof activeTab);
              }}
              className="btn-pill-secondary"
              style={{
                borderColor: isActive ? 'var(--color-ink-black)' : 'var(--color-warm-border)',
                backgroundColor: isActive ? 'var(--color-ink-black)' : 'transparent',
                color: isActive ? 'var(--color-pure-white)' : 'var(--color-ink-black)',
                fontSize: '13px',
                padding: '6px 16px',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab: LIVE BRAND PREVIEW */}
      {(activeTab === 'preview' || window.matchMedia?.('print').matches) && (() => {
        // Extract custom color swatches from the suggested brand palette
        const primarySwatch = visualTokens.palette.find((p) => p.role === 'primary') || visualTokens.palette[0] || { name: 'Primary', hex: '#111215', role: 'primary' };
        const secondarySwatch = visualTokens.palette.find((p) => p.role === 'secondary') || visualTokens.palette[1] || { name: 'Secondary', hex: '#71717a', role: 'secondary' };
        const accentSwatch = visualTokens.palette.find((p) => p.role === 'accent') || visualTokens.palette[2] || { name: 'Accent', hex: '#00e599', role: 'accent' };
        const surfaceSwatch = visualTokens.palette.find((p) => p.role === 'surface') || visualTokens.palette[3] || { name: 'Surface', hex: '#fdfcf9', role: 'surface' };
        const textSwatch = visualTokens.palette.find((p) => p.role === 'text') || visualTokens.palette[4] || { name: 'Text', hex: '#0a0a0c', role: 'text' };

        const primaryHex = primarySwatch.hex;
        const secondaryHex = secondarySwatch.hex;
        const accentHex = accentSwatch.hex;
        const surfaceHex = surfaceSwatch.hex;
        let textHex = textSwatch.hex;

        // Safeguard: Ensure textHex has sufficient perceived contrast on surfaceHex
        const isSurfaceLight = isLightColor(surfaceHex);
        if (isSurfaceLight && isLightColor(textHex)) {
          textHex = '#111217';
        } else if (!isSurfaceLight && !isLightColor(textHex)) {
          textHex = '#f8fafc';
        }

        // Derive palette-grounded design tokens for the website preview
        const brandSiteTokens = {
          surface: surfaceHex,
          surfaceCard: isSurfaceLight ? '#ffffff' : hexToRgba('#ffffff', 0.05),
          surfaceElevated: isSurfaceLight ? hexToRgba('#ffffff', 0.95) : hexToRgba('#ffffff', 0.08),
          border: hexToRgba(secondaryHex, 0.4),
          borderSubtle: hexToRgba(secondaryHex, 0.25),
          text: textHex,
          textMuted: hexToRgba(textHex, 0.72),
          textSubtle: hexToRgba(textHex, 0.48),
          primary: primaryHex,
          primaryText: getContrastColor(primaryHex),
          secondary: secondaryHex,
          secondaryText: getContrastColor(secondaryHex),
          accent: accentHex,
          accentText: getContrastColor(accentHex),
          accentTint: hexToRgba(accentHex, 0.14),
          accentBorder: hexToRgba(accentHex, 0.45)
        };

        const brandSlug = brandStrategy.brandName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'brand';
        const isMobile = previewDevice === 'mobile';

        return (
          <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Specimen Control Toolbar */}
            <div
              className="no-print"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                padding: '12px 18px',
                borderRadius: '16px',
                backgroundColor: 'var(--color-paper-cream)',
                border: '1px solid var(--color-warm-border)'
              }}
            >
              {/* Active Suggested Palette Indicator */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: 'var(--color-stone-gray)'
                  }}
                >
                  Applied Brand Palette:
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  {visualTokens.palette.map((swatch, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleCopyHex(swatch.hex)}
                      title={`Click to copy ${swatch.name} (${swatch.hex}) — Role: ${swatch.role}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '3px 8px',
                        borderRadius: '9999px',
                        backgroundColor: 'var(--color-pure-white)',
                        border: '1px solid var(--color-warm-border)',
                        cursor: 'pointer',
                        fontSize: '11px',
                        color: 'var(--color-ink-black)',
                        transition: 'transform 0.1s ease'
                      }}
                    >
                      <span
                        style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          backgroundColor: swatch.hex,
                          border: '1px solid rgba(0,0,0,0.15)'
                        }}
                      />
                      <span style={{ fontWeight: 500 }}>{swatch.role}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-stone-gray)', fontSize: '10px' }}>
                        {swatch.hex}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Viewport Switcher */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  onClick={() => {
                    playPillClickSound();
                    setPreviewDevice('desktop');
                  }}
                  className="btn-pill-secondary"
                  style={{
                    padding: '4px 10px',
                    fontSize: '11px',
                    borderColor: !isMobile ? 'var(--color-ink-black)' : 'var(--color-warm-border)',
                    backgroundColor: !isMobile ? 'var(--color-ink-black)' : 'transparent',
                    color: !isMobile ? '#ffffff' : 'var(--color-ink-black)'
                  }}
                >
                  <Monitor size={12} />
                  <span>Desktop</span>
                </button>

                <button
                  onClick={() => {
                    playPillClickSound();
                    setPreviewDevice('mobile');
                  }}
                  className="btn-pill-secondary"
                  style={{
                    padding: '4px 10px',
                    fontSize: '11px',
                    borderColor: isMobile ? 'var(--color-ink-black)' : 'var(--color-warm-border)',
                    backgroundColor: isMobile ? 'var(--color-ink-black)' : 'transparent',
                    color: isMobile ? '#ffffff' : 'var(--color-ink-black)'
                  }}
                >
                  <Smartphone size={12} />
                  <span>Mobile</span>
                </button>
              </div>
            </div>

            {/* Browser Specimen Frame */}
            <div
              style={{
                width: '100%',
                maxWidth: isMobile ? '430px' : '100%',
                margin: '0 auto',
                borderRadius: isMobile ? '36px' : '24px',
                border: `1px solid ${brandSiteTokens.border}`,
                overflow: 'hidden',
                boxShadow: isSurfaceLight
                  ? '0 20px 48px -12px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.04)'
                  : '0 24px 60px -12px rgba(0, 0, 0, 0.45)',
                transition: 'max-width 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                backgroundColor: brandSiteTokens.surface
              }}
            >
              {/* Browser Window Chrome */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 18px',
                  backgroundColor: isSurfaceLight ? hexToRgba('#000000', 0.03) : hexToRgba('#ffffff', 0.04),
                  borderBottom: `1px solid ${brandSiteTokens.borderSubtle}`
                }}
              >
                {/* Traffic Dots */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ff5f56' }} />
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ffbd2e' }} />
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#27c93f' }} />
                </div>

                {/* URL Bar */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 14px',
                    borderRadius: '9999px',
                    backgroundColor: isSurfaceLight ? hexToRgba('#ffffff', 0.8) : hexToRgba('#000000', 0.3),
                    border: `1px solid ${brandSiteTokens.borderSubtle}`,
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    color: brandSiteTokens.textMuted,
                    maxWidth: '320px',
                    width: '100%',
                    justifyContent: 'center'
                  }}
                >
                  <Lock size={10} color={brandSiteTokens.textSubtle} />
                  <span>https://{brandSlug}.com</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span
                    style={{
                      fontSize: '10px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      fontFamily: 'var(--font-mono)',
                      color: brandSiteTokens.textSubtle
                    }}
                  >
                    LIVE SPECIMEN
                  </span>
                </div>
              </div>

              {/* Website Canvas - 100% styled from suggested brand palette */}
              <div
                style={{
                  backgroundColor: brandSiteTokens.surface,
                  color: brandSiteTokens.text,
                  fontFamily: `'${visualTokens.typography.bodyFont}', sans-serif`,
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* 1. Website Navigation Header */}
                <header
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: isMobile ? '16px 20px' : '18px 36px',
                    borderBottom: `1px solid ${brandSiteTokens.borderSubtle}`,
                    backgroundColor: hexToRgba(brandSiteTokens.surface, 0.95),
                    backdropFilter: 'blur(8px)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10
                  }}
                >
                  {/* Brand Logo & Name */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: brandSiteTokens.accent,
                        boxShadow: `0 0 10px ${brandSiteTokens.accent}`
                      }}
                    />
                    <span
                      style={{
                        fontFamily: `'${visualTokens.typography.headingFont}', serif`,
                        fontSize: isMobile ? '20px' : '22px',
                        fontWeight: 450,
                        letterSpacing: '-0.02em',
                        color: brandSiteTokens.text
                      }}
                    >
                      {brandStrategy.brandName}
                    </span>
                  </div>

                  {/* Desktop Nav Links */}
                  {!isMobile && (
                    <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                      {['Platform', 'Moat', 'Manifesto', 'Specs'].map((link, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontSize: '13px',
                            color: brandSiteTokens.textMuted,
                            cursor: 'pointer',
                            transition: 'color 0.15s ease'
                          }}
                        >
                          {link}
                        </span>
                      ))}
                    </nav>
                  )}

                  {/* Header CTA Button */}
                  <button
                    style={{
                      backgroundColor: brandSiteTokens.primary,
                      color: brandSiteTokens.primaryText,
                      border: 'none',
                      borderRadius: '9999px',
                      padding: isMobile ? '7px 14px' : '8px 18px',
                      fontSize: isMobile ? '11px' : '13px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span>{launchContent.callToAction.slice(0, 24)}</span>
                    <ArrowRight size={12} />
                  </button>
                </header>

                {/* 2. Hero Section */}
                <div
                  style={{
                    padding: isMobile ? '36px 20px 48px' : '56px 48px 64px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: '24px'
                  }}
                >
                  {/* Category / Mission Badge */}
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '6px 14px',
                      borderRadius: '9999px',
                      backgroundColor: brandSiteTokens.accentTint,
                      border: `1px solid ${brandSiteTokens.accentBorder}`,
                      color: isSurfaceLight && isLightColor(accentHex) ? brandSiteTokens.text : brandSiteTokens.accent,
                      fontSize: '12px',
                      fontWeight: 500
                    }}
                  >
                    <Sparkles size={12} />
                    <span>{brandStrategy.tagline}</span>
                  </div>

                  {/* Hero Main Headline */}
                  <h1
                    style={{
                      fontFamily: `'${visualTokens.typography.headingFont}', serif`,
                      fontSize: isMobile ? '32px' : '52px',
                      fontWeight: 450,
                      lineHeight: 1.06,
                      letterSpacing: '-0.03em',
                      color: brandSiteTokens.text,
                      maxWidth: '820px',
                      margin: 0
                    }}
                  >
                    {launchContent.heroHeadline}
                  </h1>

                  {/* Hero Subheadline */}
                  <p
                    style={{
                      fontSize: isMobile ? '14px' : '17px',
                      lineHeight: 1.6,
                      color: brandSiteTokens.textMuted,
                      maxWidth: '640px',
                      margin: 0
                    }}
                  >
                    {launchContent.heroSubheadline}
                  </p>

                  {/* Hero Action Button Cluster */}
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '12px',
                      marginTop: '8px'
                    }}
                  >
                    <button
                      style={{
                        backgroundColor: brandSiteTokens.primary,
                        color: brandSiteTokens.primaryText,
                        border: `1px solid ${brandSiteTokens.primary}`,
                        borderRadius: '9999px',
                        padding: isMobile ? '10px 20px' : '13px 28px',
                        fontSize: isMobile ? '13px' : '15px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: `0 4px 14px ${hexToRgba(brandSiteTokens.primary, 0.25)}`
                      }}
                    >
                      <span>{launchContent.callToAction}</span>
                      <ArrowRight size={14} />
                    </button>

                    <button
                      style={{
                        backgroundColor: hexToRgba(brandSiteTokens.secondary, 0.12),
                        color: brandSiteTokens.text,
                        border: `1px solid ${brandSiteTokens.border}`,
                        borderRadius: '9999px',
                        padding: isMobile ? '10px 20px' : '13px 24px',
                        fontSize: isMobile ? '13px' : '15px',
                        fontWeight: 500,
                        cursor: 'pointer'
                      }}
                    >
                      <span>Explore Architecture</span>
                    </button>
                  </div>

                  {/* 3. Hero Specimen Preview / Architecture Showcase Card */}
                  <div
                    style={{
                      width: '100%',
                      maxWidth: '760px',
                      marginTop: '24px',
                      borderRadius: '20px',
                      backgroundColor: brandSiteTokens.surfaceCard,
                      border: `1px solid ${brandSiteTokens.border}`,
                      padding: isMobile ? '20px 16px' : '28px 32px',
                      textAlign: 'left',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                      boxShadow: isSurfaceLight ? '0 10px 30px rgba(0,0,0,0.04)' : '0 10px 30px rgba(0,0,0,0.2)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: brandSiteTokens.accent }} />
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 600, color: brandSiteTokens.text }}>
                          {brandStrategy.brandName} • Core Operational Architecture
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: '11px',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          backgroundColor: brandSiteTokens.accentTint,
                          color: isSurfaceLight && isLightColor(accentHex) ? brandSiteTokens.text : brandSiteTokens.accent,
                          fontFamily: 'var(--font-mono)'
                        }}
                      >
                        Target: {brandStrategy.targetAudience.slice(0, 36)}
                      </span>
                    </div>

                    <p style={{ fontSize: '14px', lineHeight: 1.55, color: brandSiteTokens.textMuted, margin: 0 }}>
                      {launchContent.elevatorPitch}
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', paddingTop: '4px' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          fontSize: '12px',
                          color: brandSiteTokens.text,
                          padding: '4px 10px',
                          borderRadius: '8px',
                          backgroundColor: hexToRgba(brandSiteTokens.secondary, 0.15)
                        }}
                      >
                        <ShieldCheck size={13} color={brandSiteTokens.accent} />
                        <span>Moat: {brandStrategy.differentiator.slice(0, 48)}...</span>
                      </span>

                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          fontSize: '12px',
                          color: brandSiteTokens.text,
                          padding: '4px 10px',
                          borderRadius: '8px',
                          backgroundColor: hexToRgba(brandSiteTokens.secondary, 0.15)
                        }}
                      >
                        <CheckCircle2 size={13} color={brandSiteTokens.accent} />
                        <span>Defying: {brandStrategy.antiHero.slice(0, 36)}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* 4. Strategic Differentiation Grid (3 Pillar Cards) */}
                <div
                  style={{
                    padding: isMobile ? '24px 20px 48px' : '36px 48px 60px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px',
                    borderTop: `1px solid ${brandSiteTokens.borderSubtle}`,
                    borderBottom: `1px solid ${brandSiteTokens.borderSubtle}`
                  }}
                >
                  <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: isSurfaceLight && isLightColor(accentHex) ? brandSiteTokens.text : brandSiteTokens.accent
                      }}
                    >
                      THE STRATEGIC PILLARS
                    </span>
                    <h3
                      style={{
                        fontFamily: `'${visualTokens.typography.headingFont}', serif`,
                        fontSize: isMobile ? '24px' : '32px',
                        fontWeight: 450,
                        color: brandSiteTokens.text,
                        margin: '6px 0 0 0'
                      }}
                    >
                      Engineered for Uncompromising Founders
                    </h3>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                      gap: '20px'
                    }}
                  >
                    {/* Pillar 1: Unfair Advantage */}
                    <div
                      style={{
                        padding: '24px',
                        borderRadius: '20px',
                        backgroundColor: brandSiteTokens.surfaceCard,
                        border: `1px solid ${brandSiteTokens.border}`,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                      }}
                    >
                      <span
                        style={{
                          fontSize: '11px',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 600,
                          color: isSurfaceLight && isLightColor(accentHex) ? brandSiteTokens.text : brandSiteTokens.accent,
                          textTransform: 'uppercase'
                        }}
                      >
                        01 / Unfair Promise
                      </span>
                      <h4
                        style={{
                          fontFamily: `'${visualTokens.typography.headingFont}', serif`,
                          fontSize: '20px',
                          fontWeight: 450,
                          color: brandSiteTokens.text,
                          margin: 0
                        }}
                      >
                        Value Proposition
                      </h4>
                      <p style={{ fontSize: '13px', lineHeight: 1.55, color: brandSiteTokens.textMuted, margin: 0 }}>
                        {brandStrategy.coreValueProposition}
                      </p>
                    </div>

                    {/* Pillar 2: Defensible Moat */}
                    <div
                      style={{
                        padding: '24px',
                        borderRadius: '20px',
                        backgroundColor: brandSiteTokens.surfaceCard,
                        border: `1px solid ${brandSiteTokens.border}`,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                      }}
                    >
                      <span
                        style={{
                          fontSize: '11px',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 600,
                          color: isSurfaceLight && isLightColor(accentHex) ? brandSiteTokens.text : brandSiteTokens.accent,
                          textTransform: 'uppercase'
                        }}
                      >
                        02 / Defensible Moat
                      </span>
                      <h4
                        style={{
                          fontFamily: `'${visualTokens.typography.headingFont}', serif`,
                          fontSize: '20px',
                          fontWeight: 450,
                          color: brandSiteTokens.text,
                          margin: 0
                        }}
                      >
                        Structural Differentiation
                      </h4>
                      <p style={{ fontSize: '13px', lineHeight: 1.55, color: brandSiteTokens.textMuted, margin: 0 }}>
                        {brandStrategy.differentiator}
                      </p>
                    </div>

                    {/* Pillar 3: Beachhead ICP & Mission */}
                    <div
                      style={{
                        padding: '24px',
                        borderRadius: '20px',
                        backgroundColor: brandSiteTokens.surfaceCard,
                        border: `1px solid ${brandSiteTokens.border}`,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                      }}
                    >
                      <span
                        style={{
                          fontSize: '11px',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 600,
                          color: isSurfaceLight && isLightColor(accentHex) ? brandSiteTokens.text : brandSiteTokens.accent,
                          textTransform: 'uppercase'
                        }}
                      >
                        03 / Beachhead ICP
                      </span>
                      <h4
                        style={{
                          fontFamily: `'${visualTokens.typography.headingFont}', serif`,
                          fontSize: '20px',
                          fontWeight: 450,
                          color: brandSiteTokens.text,
                          margin: 0
                        }}
                      >
                        Target Customer
                      </h4>
                      <p style={{ fontSize: '13px', lineHeight: 1.55, color: brandSiteTokens.textMuted, margin: 0 }}>
                        {brandStrategy.targetAudience}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 5. Brand Manifesto Showcase Banner (Derived strictly from brand's primary color) */}
                <div style={{ padding: isMobile ? '32px 20px' : '48px 48px' }}>
                  <div
                    style={{
                      borderRadius: '24px',
                      background: `linear-gradient(135deg, ${brandSiteTokens.primary} 0%, ${hexToRgba(brandSiteTokens.primary, 0.88)} 100%)`,
                      border: `1px solid ${hexToRgba(brandSiteTokens.primary, 0.6)}`,
                      padding: isMobile ? '32px 24px' : '44px 40px',
                      color: brandSiteTokens.primaryText,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '18px',
                      boxShadow: `0 16px 36px -8px ${hexToRgba(brandSiteTokens.primary, 0.35)}`
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '11px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          color: isLightColor(brandSiteTokens.primary) ? '#111215' : brandSiteTokens.accent,
                          padding: '3px 10px',
                          borderRadius: '9999px',
                          backgroundColor: isLightColor(brandSiteTokens.primary) ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.1)'
                        }}
                      >
                        The {brandStrategy.brandName} Manifesto
                      </span>
                    </div>

                    <p
                      style={{
                        fontFamily: `'${visualTokens.typography.headingFont}', serif`,
                        fontSize: isMobile ? '18px' : '24px',
                        fontWeight: 450,
                        lineHeight: 1.45,
                        fontStyle: 'italic',
                        color: brandSiteTokens.primaryText,
                        margin: 0
                      }}
                    >
                      "{launchContent.manifesto}"
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginTop: '6px' }}>
                      <span
                        style={{
                          fontSize: '13px',
                          color: hexToRgba(brandSiteTokens.primaryText, 0.75),
                          fontWeight: 500
                        }}
                      >
                        — Core Philosophical Creed
                      </span>

                      <span
                        style={{
                          fontSize: '12px',
                          fontFamily: 'var(--font-mono)',
                          color: hexToRgba(brandSiteTokens.primaryText, 0.6)
                        }}
                      >
                        Style Philosophy: {visualTokens.stylePhilosophy.slice(0, 52)}...
                      </span>
                    </div>
                  </div>
                </div>

                {/* 6. Social Hooks / Positioning Angles */}
                {launchContent.socialHooks && launchContent.socialHooks.length > 0 && (
                  <div
                    style={{
                      padding: isMobile ? '0 20px 48px' : '0 48px 56px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px'
                    }}
                  >
                    <span
                      style={{
                        fontSize: '11px',
                        fontFamily: 'var(--font-mono)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        color: brandSiteTokens.textSubtle
                      }}
                    >
                      Market Wedge & Social Narrative
                    </span>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(260px, 1fr))',
                        gap: '14px'
                      }}
                    >
                      {launchContent.socialHooks.slice(0, 3).map((hook, idx) => (
                        <div
                          key={idx}
                          style={{
                            padding: '16px 20px',
                            borderRadius: '16px',
                            backgroundColor: hexToRgba(brandSiteTokens.secondary, 0.1),
                            border: `1px solid ${brandSiteTokens.borderSubtle}`,
                            fontSize: '13px',
                            lineHeight: 1.5,
                            color: brandSiteTokens.textMuted
                          }}
                        >
                          "{hook}"
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 7. Website Specimen Footer */}
                <footer
                  style={{
                    padding: isMobile ? '24px 20px' : '28px 48px',
                    borderTop: `1px solid ${brandSiteTokens.borderSubtle}`,
                    backgroundColor: isSurfaceLight ? hexToRgba('#000000', 0.02) : hexToRgba('#ffffff', 0.02),
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    alignItems: isMobile ? 'flex-start' : 'center',
                    justifyContent: 'space-between',
                    gap: '16px'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span
                      style={{
                        fontFamily: `'${visualTokens.typography.headingFont}', serif`,
                        fontSize: '16px',
                        fontWeight: 500,
                        color: brandSiteTokens.text
                      }}
                    >
                      {brandStrategy.brandName}
                    </span>
                    <span style={{ fontSize: '12px', color: brandSiteTokens.textSubtle }}>
                      {brandStrategy.tagline}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: brandSiteTokens.textSubtle }}>
                      Suggested Palette Tokens:
                    </span>
                    {visualTokens.palette.map((s, idx) => (
                      <span
                        key={idx}
                        style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '3px',
                          backgroundColor: s.hex,
                          border: '1px solid rgba(0,0,0,0.1)'
                        }}
                        title={`${s.name} (${s.role}): ${s.hex}`}
                      />
                    ))}
                  </div>

                  <span style={{ fontSize: '11px', color: brandSiteTokens.textSubtle }}>
                    © {new Date().getFullYear()} {brandStrategy.brandName}. All rights reserved.
                  </span>
                </footer>
              </div>
            </div>
          </section>
        );
      })()}

      {/* Tab: BRAND STRATEGY */}
      {activeTab === 'strategy' && (
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px'
          }}
        >
          {/* Mission & Purpose */}
          <div className="card-slab" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <span className="pill-tag">Core Mission</span>
            <h3 className="serif-heading" style={{ fontSize: '24px' }}>
              Why this brand exists
            </h3>
            <p className="text-body" style={{ color: 'var(--color-stone-gray)' }}>
              {brandStrategy.mission}
            </p>
          </div>

          {/* Beachhead Audience */}
          <div className="card-slab" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <span className="pill-tag">Beachhead ICP</span>
            <h3 className="serif-heading" style={{ fontSize: '24px' }}>
              The Targeted Customer
            </h3>
            <p className="text-body" style={{ color: 'var(--color-stone-gray)' }}>
              {brandStrategy.targetAudience}
            </p>
          </div>

          {/* Core Value Prop */}
          <div className="card-slab" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <span className="pill-tag">Value Proposition</span>
            <h3 className="serif-heading" style={{ fontSize: '24px' }}>
              The Unfair Promise
            </h3>
            <p className="text-body" style={{ color: 'var(--color-stone-gray)' }}>
              {brandStrategy.coreValueProposition}
            </p>
          </div>

          {/* The Anti-Hero / Villain */}
          <div className="card-slab" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <span className="pill-tag">The Villain</span>
            <h3 className="serif-heading" style={{ fontSize: '24px' }}>
              What We Stand Against
            </h3>
            <p className="text-body" style={{ color: 'var(--color-stone-gray)' }}>
              {brandStrategy.antiHero}
            </p>
          </div>

          {/* Key Differentiator */}
          <div
            className="card-slab"
            style={{
              gridColumn: '1 / -1',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}
          >
            <span className="pill-tag">Defensible Moat & Differentiator</span>
            <h3 className="serif-heading" style={{ fontSize: '24px' }}>
              Structural Differentiation
            </h3>
            <p className="text-body" style={{ color: 'var(--color-ink-black)' }}>
              {brandStrategy.differentiator}
            </p>
          </div>
        </section>
      )}



      {/* Tab: VISUAL DESIGN TOKENS */}
      {activeTab === 'visuals' && (
        <section style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* Palette Swatches */}
          <div className="card-slab" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <span className="pill-tag">Color System</span>
                <h3 className="serif-heading" style={{ fontSize: '26px', marginTop: '6px' }}>
                  Synthesized Palette Swatches
                </h3>
              </div>
              <span className="text-caption">Click any swatch to copy HEX code</span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '16px'
              }}
            >
              {visualTokens.palette.map((swatch, idx) => {
                const isCopied = copiedHex === swatch.hex;
                return (
                  <div
                    key={idx}
                    onClick={() => handleCopyHex(swatch.hex)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: '18px',
                      overflow: 'hidden',
                      border: '1px solid var(--color-warm-border)',
                      cursor: 'pointer',
                      transition: 'transform 0.15s ease'
                    }}
                  >
                    <div
                      style={{
                        height: '110px',
                        backgroundColor: swatch.hex,
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'flex-end',
                        padding: '8px'
                      }}
                    >
                      {isCopied && (
                        <span
                          style={{
                            fontSize: '11px',
                            backgroundColor: '#ffffff',
                            color: '#000000',
                            padding: '2px 8px',
                            borderRadius: '9999px',
                            fontWeight: 400
                          }}
                        >
                          Copied!
                        </span>
                      )}
                    </div>

                    <div
                      style={{
                        padding: '12px 14px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        backgroundColor: 'var(--color-pure-white)'
                      }}
                    >
                      <span style={{ fontSize: '13px', color: 'var(--color-ink-black)' }}>
                        {swatch.name}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '12px',
                            color: 'var(--color-stone-gray)'
                          }}
                        >
                          {swatch.hex}
                        </span>
                        <span
                          style={{
                            fontSize: '10px',
                            textTransform: 'uppercase',
                            color: 'var(--color-ash-gray)'
                          }}
                        >
                          {swatch.role}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Typography Pairing */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px'
            }}
          >
            <div className="card-slab" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <span className="pill-tag">Display Typography</span>
              <h4
                style={{
                  fontFamily: visualTokens.typography.headingFont,
                  fontSize: '32px',
                  fontWeight: 450,
                  lineHeight: 1.0,
                  letterSpacing: '-0.03em'
                }}
              >
                {visualTokens.typography.headingFont}
              </h4>
              <p className="text-body-sm" style={{ color: 'var(--color-stone-gray)' }}>
                Whisper-weight display headline serif configured at tight 1.0 leading and negative tracking.
              </p>
            </div>

            <div className="card-slab" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <span className="pill-tag">Body & UI Typography</span>
              <h4
                style={{
                  fontFamily: visualTokens.typography.bodyFont,
                  fontSize: '24px',
                  fontWeight: 400
                }}
              >
                {visualTokens.typography.bodyFont}
              </h4>
              <p className="text-body-sm" style={{ color: 'var(--color-stone-gray)' }}>
                Single-weight 400 sans-serif providing neutral balance so display headlines command authority.
              </p>
            </div>
          </div>

          {/* Style Philosophy & Radii */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px'
            }}
          >
            <div className="card-slab" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span className="pill-tag">Style Philosophy</span>
              <p className="text-body" style={{ color: 'var(--color-ink-black)' }}>
                {visualTokens.stylePhilosophy}
              </p>
            </div>

            <div className="card-slab" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span className="pill-tag">Border Curvature Spec</span>
              <p className="text-body" style={{ color: 'var(--color-ink-black)' }}>
                {visualTokens.borderCurvature}
              </p>
            </div>
          </div>

          {/* CSS Variables Code Block */}
          <div className="card-slab" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="pill-tag">CSS Custom Properties</span>
              <button
                onClick={handleCopyCss}
                className="btn-pill-secondary"
                style={{ fontSize: '12px', padding: '4px 12px' }}
              >
                {copiedCss ? <Check size={12} /> : <Copy size={12} />}
                <span>{copiedCss ? 'Copied' : 'Copy CSS'}</span>
              </button>
            </div>

            <pre
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                lineHeight: 1.5,
                backgroundColor: 'var(--color-paper-cream)',
                padding: '20px',
                borderRadius: '16px',
                overflowX: 'auto',
                color: 'var(--color-ink-black)'
              }}
            >
              {generateCssVariables()}
            </pre>
          </div>
        </section>
      )}

      {/* Tab: LAUNCH COPY & MANIFESTO */}
      {activeTab === 'launch' && (
        <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Hero Package */}
          <div className="card-slab" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <span className="pill-tag">Hero Copywriting</span>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--color-stone-gray)', textTransform: 'uppercase' }}>
                Primary Headline
              </span>
              <h3 className="serif-heading" style={{ fontSize: '32px', marginTop: '4px' }}>
                {launchContent.heroHeadline}
              </h3>
            </div>

            <div>
              <span style={{ fontSize: '11px', color: 'var(--color-stone-gray)', textTransform: 'uppercase' }}>
                Supporting Subheadline
              </span>
              <p className="text-body" style={{ color: 'var(--color-stone-gray)', marginTop: '4px' }}>
                {launchContent.heroSubheadline}
              </p>
            </div>

            <div>
              <span style={{ fontSize: '11px', color: 'var(--color-stone-gray)', textTransform: 'uppercase' }}>
                Action Trigger / CTA
              </span>
              <div style={{ marginTop: '8px' }}>
                <span className="btn-pill-primary">{launchContent.callToAction}</span>
              </div>
            </div>
          </div>

          {/* Full Manifesto */}
          <div className="card-slab" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <span className="pill-tag">Brand Manifesto</span>
            <p
              style={{
                fontFamily: 'var(--font-bureauserif)',
                fontSize: '22px',
                fontWeight: 450,
                lineHeight: 1.45,
                color: 'var(--color-ink-black)',
                letterSpacing: '-0.02em'
              }}
            >
              {launchContent.manifesto}
            </p>
          </div>

          {/* Elevator Pitch */}
          <div className="card-slab" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <span className="pill-tag">30-Second Investor & Customer Pitch</span>
            <p className="text-body" style={{ color: 'var(--color-ink-black)' }}>
              {launchContent.elevatorPitch}
            </p>
          </div>

          {/* Social Hooks */}
          <div className="card-slab" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <span className="pill-tag">Viral Organic Social Hooks</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {launchContent.socialHooks.map((hook, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '14px 18px',
                    borderRadius: '14px',
                    backgroundColor: 'var(--color-paper-cream)',
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '12px'
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-stone-gray)' }}>
                    0{idx + 1}
                  </span>
                  <span className="text-body-sm" style={{ color: 'var(--color-ink-black)' }}>
                    "{hook}"
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bottom Actions: Synthesize Another Brand & Improve Brand Database */}
      <div
        className="no-print"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '14px',
          paddingTop: '24px',
          borderTop: '1px solid var(--color-warm-border)'
        }}
      >
        <button onClick={onReset} className="btn-pill-secondary" style={{ padding: '11px 24px' }}>
          <span>Synthesize Another Brand</span>
        </button>

        <button
          onClick={() => {
            playPillClickSound();
            setIsImproveModalOpen(true);
          }}
          className="btn-pill-primary"
          style={{ padding: '11px 24px' }}
          title="Further enrich, edit, and expand your brand database"
        >
          <Database size={15} strokeWidth={1.5} />
          <span>Improve Brand Database</span>
        </button>
      </div>

      {/* Brand Database Studio Modal */}
      <BrandDatabaseImproveModal
        isOpen={isImproveModalOpen}
        onClose={() => setIsImproveModalOpen(false)}
        brandKit={brandKit}
        onUpdateBrandKit={(updated) => {
          if (onUpdateBrandKit) onUpdateBrandKit(updated);
        }}
      />
    </div>
  );
};
