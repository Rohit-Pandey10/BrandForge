import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Copy,
  Check,
  Download,
  Palette,
  Printer,
  ExternalLink
} from 'lucide-react';

export default function BrandKitDashboard({ brandKit, onStartNew }) {
  const [copiedHex, setCopiedHex] = useState(null);
  const [copiedSection, setCopiedSection] = useState(null);

  const {
    brandStrategy = {},
    voiceSystem = {},
    visualTokens = {},
    launchContent = {}
  } = brandKit || {};

  const palette = visualTokens.palette || [];
  const typography = visualTokens.typography || {};

  // Dynamically inject Google Fonts stylesheet into <head>
  useEffect(() => {
    if (typography.googleFontsUrl) {
      const existingLink = document.getElementById('dynamic-brand-google-fonts');
      if (existingLink) {
        existingLink.href = typography.googleFontsUrl;
      } else {
        const link = document.createElement('link');
        link.id = 'dynamic-brand-google-fonts';
        link.rel = 'stylesheet';
        link.href = typography.googleFontsUrl;
        document.head.appendChild(link);
      }
    }
  }, [typography.googleFontsUrl]);

  const copyToClipboard = (text, identifier) => {
    navigator.clipboard.writeText(text);
    if (identifier.startsWith('hex-')) {
      setCopiedHex(identifier.replace('hex-', ''));
      setTimeout(() => setCopiedHex(null), 2000);
    } else {
      setCopiedSection(identifier);
      setTimeout(() => setCopiedSection(null), 2000);
    }
  };

  const handleDownloadTokensJson = () => {
    const brandName = brandStrategy.brandName || 'brand';
    const cleanName = brandName.toLowerCase().replace(/\s+/g, '-');
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(brandKit, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${cleanName}-tokens.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportPaletteSvg = () => {
    const brandName = brandStrategy.brandName || 'Brand';
    const cleanName = brandName.toLowerCase().replace(/\s+/g, '-');
    const width = 1000;
    const height = 360;
    const swatchWidth = 160;
    const swatchHeight = 160;
    const gap = 24;
    const startX = (width - (palette.length * swatchWidth + (palette.length - 1) * gap)) / 2;

    const swatchesSvg = palette.map((c, i) => {
      const x = startX + i * (swatchWidth + gap);
      const y = 110;
      return `
        <g transform="translate(${x}, ${y})">
          <rect width="${swatchWidth}" height="${swatchHeight}" rx="20" fill="${c.hex}" stroke="#dbd7cd" stroke-width="1" />
          <text x="${swatchWidth / 2}" y="${swatchHeight + 28}" fill="#737373" font-size="11" font-weight="400" text-anchor="middle" font-family="'Inter', system-ui, sans-serif" letter-spacing="1">${(c.role || '').toUpperCase()}</text>
          <text x="${swatchWidth / 2}" y="${swatchHeight + 48}" fill="#000000" font-size="13" font-weight="400" text-anchor="middle" font-family="'Inter', system-ui, sans-serif">${c.name || 'Color'}</text>
          <text x="${swatchWidth / 2}" y="${swatchHeight + 68}" fill="#000000" font-size="12" font-weight="400" text-anchor="middle" font-family="monospace">${c.hex}</text>
        </g>
      `;
    }).join('\n');

    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <rect width="100%" height="100%" fill="#f2f1ed" />
  <text x="${width / 2}" y="50" fill="#000000" font-size="28" font-weight="300" text-anchor="middle" font-family="'Cormorant Garamond', Georgia, serif">${brandName} — Color Palette</text>
  <text x="${width / 2}" y="76" fill="#737373" font-size="12" font-weight="400" text-anchor="middle" font-family="'Inter', sans-serif">Brand Architecture &amp; Token System</text>
  ${swatchesSvg}
</svg>`;

    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${cleanName}-palette.svg`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 sm:py-10 animate-fade-in pb-24 font-sans text-black">
      {/* Top Action & Navigation Bar */}
      <div className="no-print flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-[#dbd7cd]">
        <button
          onClick={onStartNew}
          className="inline-flex items-center gap-2 text-xs text-[#737373] hover:text-black px-4 py-2 rounded-full border border-[#dbd7cd] bg-white hover:bg-[#f2f1ed] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 stroke-[1.5]" />
          <span>New Brand Dialogue</span>
        </button>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => copyToClipboard(JSON.stringify(brandKit, null, 2), 'all-json')}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-[#f2f1ed] border border-[#dbd7cd] hover:border-black text-xs text-black transition-all"
            title="Copy tokens JSON to clipboard"
          >
            {copiedSection === 'all-json' ? <Check className="w-3.5 h-3.5 text-black" /> : <Copy className="w-3.5 h-3.5 text-[#737373]" />}
            <span>{copiedSection === 'all-json' ? 'Copied' : 'Copy JSON'}</span>
          </button>

          <button
            onClick={handleDownloadTokensJson}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-[#f2f1ed] border border-[#dbd7cd] hover:border-black text-xs text-black transition-all"
            title="Download design tokens as JSON"
          >
            <Download className="w-3.5 h-3.5 text-[#737373]" />
            <span>tokens.json</span>
          </button>

          <button
            onClick={handleExportPaletteSvg}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-[#f2f1ed] border border-[#dbd7cd] hover:border-black text-xs text-black transition-all"
            title="Export 5-color palette as SVG asset"
          >
            <Palette className="w-3.5 h-3.5 text-[#737373]" />
            <span>palette.svg</span>
          </button>

          <button
            onClick={handlePrintPdf}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-5 py-2 rounded-full bg-black text-white hover:bg-neutral-800 text-xs transition-all"
            title="Print or save Brand Book as PDF"
          >
            <Printer className="w-3.5 h-3.5 stroke-[1.5]" />
            <span>Brand Book (PDF)</span>
          </button>
        </div>
      </div>

      {/* Editorial Monograph Cover / Header Spread */}
      <div className="bg-white rounded-[32px] border border-[#dbd7cd] p-8 sm:p-14 mb-10">
        <div className="max-w-3xl">
          <span className="text-[11px] uppercase tracking-[0.08em] text-[#737373] block mb-4">
            Brand Monograph &bull; Identity System
          </span>

          <h1 
            className="font-serif text-5xl sm:text-7xl md:text-8xl font-light text-black tracking-[-0.03em] leading-[1.0] mb-4"
            style={{ fontFamily: typography.headingFont ? `'${typography.headingFont}', serif` : 'inherit' }}
          >
            {brandStrategy.brandName || "Vortex Labs"}
          </h1>

          <p 
            className="text-lg sm:text-2xl text-[#737373] font-normal leading-snug mb-8 max-w-2xl"
            style={{ fontFamily: typography.bodyFont ? `'${typography.bodyFont}', sans-serif` : 'inherit' }}
          >
            {brandStrategy.tagline || "High-Velocity Brand Architecture for Relentless Builders"}
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-[#dbd7cd]">
            <span className="text-xs px-3.5 py-1.5 rounded-full border border-[#dbd7cd] bg-[#f2f1ed] text-black">
              Archetype: {voiceSystem.archetype || "The Rebel"}
            </span>
            <span className="text-xs px-3.5 py-1.5 rounded-full border border-[#dbd7cd] bg-[#f2f1ed] text-black">
              Heading: {typography.headingFont || "Cormorant Garamond"}
            </span>
            <span className="text-xs px-3.5 py-1.5 rounded-full border border-[#dbd7cd] bg-[#f2f1ed] text-black">
              Body: {typography.bodyFont || "Inter"}
            </span>
          </div>
        </div>
      </div>

      {/* Section 1: Visual Tokens & Palette */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-3xl font-light text-black tracking-[-0.03em]">
            Visual Tokens &bull; Palette
          </h2>
          <span className="text-xs text-[#737373]">Click any swatch to copy HEX</span>
        </div>

        {/* 5 Flat Swatch Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 mb-6">
          {palette.map((color, idx) => {
            const isCopied = copiedHex === color.hex;
            return (
              <button
                key={idx}
                onClick={() => copyToClipboard(color.hex, `hex-${color.hex}`)}
                className="bg-white rounded-[24px] border border-[#dbd7cd] p-3 text-left hover:border-black transition-colors group"
              >
                <div 
                  className="w-full h-24 rounded-2xl mb-3 border border-[#dbd7cd]/50 relative flex items-center justify-center"
                  style={{ backgroundColor: color.hex }}
                >
                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/90 text-black border border-black/10 transition-opacity ${
                    isCopied ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}>
                    {isCopied ? 'Copied' : 'Copy'}
                  </span>
                </div>

                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs text-black font-normal truncate">{color.name}</span>
                  <span className="text-[10px] uppercase tracking-wider text-[#737373]">
                    {color.role}
                  </span>
                </div>
                <div className="font-mono text-xs text-[#737373]">
                  {color.hex}
                </div>
              </button>
            );
          })}
        </div>

        {/* Typography System Card */}
        <div className="bg-white rounded-[28px] border border-[#dbd7cd] p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-[#dbd7cd]">
            <div>
              <span className="text-[11px] uppercase tracking-[0.08em] text-[#737373] block mb-1">
                Typography Pairing
              </span>
              <h3 className="font-serif text-2xl font-light text-black tracking-[-0.03em]">
                {typography.headingFont} &bull; {typography.bodyFont}
              </h3>
            </div>
            {typography.googleFontsUrl && (
              <a
                href={typography.googleFontsUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-[#737373] hover:text-black flex items-center gap-1.5 transition-colors"
              >
                <span>View Google Fonts</span>
                <ExternalLink className="w-3 h-3 stroke-[1.5]" />
              </a>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <span className="text-xs uppercase tracking-[0.05em] text-[#737373] block mb-2">
                Display Scale ({typography.headingFont})
              </span>
              <div 
                className="font-serif text-3xl sm:text-4xl font-light text-black leading-[1.05] tracking-[-0.03em]"
                style={{ fontFamily: typography.headingFont ? `'${typography.headingFont}', serif` : 'inherit' }}
              >
                Conviction builds enduring value. Clarity commands attention.
              </div>
            </div>

            <div>
              <span className="text-xs uppercase tracking-[0.05em] text-[#737373] block mb-2">
                Body & Editorial Scale ({typography.bodyFont})
              </span>
              <p 
                className="text-sm text-[#737373] leading-relaxed"
                style={{ fontFamily: typography.bodyFont ? `'${typography.bodyFont}', sans-serif` : 'inherit' }}
              >
                {visualTokens.stylePhilosophy || "Refined, high-contrast monochrome typography with disciplined whitespace and razor-sharp typographic hierarchy."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Strategy & Differentiation */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {/* Strategic Foundation Card */}
        <div className="bg-white rounded-[28px] border border-[#dbd7cd] p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div>
            <span className="text-[11px] uppercase tracking-[0.08em] text-[#737373] block mb-2">
              Foundation
            </span>
            <h3 className="font-serif text-2xl font-light text-black tracking-[-0.03em] mb-6">
              Strategic Foundation
            </h3>

            <div className="space-y-4">
              <div>
                <span className="text-xs uppercase tracking-[0.05em] text-[#737373] block mb-1">
                  Target Beachhead (ICP)
                </span>
                <p className="text-sm text-black bg-[#f2f1ed] p-3.5 rounded-xl border border-[#dbd7cd]">
                  {brandStrategy.targetAudience}
                </p>
              </div>

              <div>
                <span className="text-xs uppercase tracking-[0.05em] text-[#737373] block mb-1">
                  Core Value Proposition
                </span>
                <p className="text-sm text-black bg-[#f2f1ed] p-3.5 rounded-xl border border-[#dbd7cd]">
                  {brandStrategy.coreValueProposition}
                </p>
              </div>

              <div>
                <span className="text-xs uppercase tracking-[0.05em] text-[#737373] block mb-1">
                  Mission
                </span>
                <p className="text-xs text-[#737373] leading-relaxed pt-1">
                  {brandStrategy.mission}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Incumbent Villain & Differentiation Card */}
        <div className="bg-white rounded-[28px] border border-[#dbd7cd] p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div>
            <span className="text-[11px] uppercase tracking-[0.08em] text-[#737373] block mb-2">
              Positioning
            </span>
            <h3 className="font-serif text-2xl font-light text-black tracking-[-0.03em] mb-6">
              Villain & Differentiation
            </h3>

            <div className="space-y-4">
              <div>
                <span className="text-xs uppercase tracking-[0.05em] text-black block mb-1">
                  The Anti-Hero (What We Fight)
                </span>
                <p className="text-sm text-black bg-[#f2f1ed] p-3.5 rounded-xl border border-[#dbd7cd]">
                  {brandStrategy.antiHero}
                </p>
              </div>

              <div>
                <span className="text-xs uppercase tracking-[0.05em] text-black block mb-1">
                  Unfair Differentiator
                </span>
                <p className="text-sm text-black bg-[#f2f1ed] p-3.5 rounded-xl border border-[#dbd7cd]">
                  {brandStrategy.differentiator}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Voice System & Boundaries */}
      <section className="bg-white rounded-[28px] border border-[#dbd7cd] p-6 sm:p-8 mb-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#dbd7cd]">
          <div>
            <span className="text-[11px] uppercase tracking-[0.08em] text-[#737373] block mb-1">
              Verbal Identity
            </span>
            <h3 className="font-serif text-2xl font-light text-black tracking-[-0.03em]">
              Brand Voice System & Attitude Boundaries
            </h3>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {voiceSystem.tone?.map((t, idx) => (
              <span key={idx} className="px-3 py-1 rounded-full border border-[#dbd7cd] bg-[#f2f1ed] text-black text-xs">
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Dos */}
          <div className="bg-[#f2f1ed]/50 rounded-2xl p-5 border border-[#dbd7cd]">
            <h4 className="text-xs uppercase tracking-[0.05em] text-black mb-3">
              Voice Dos (Speak Like This)
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#737373]">
              {voiceSystem.dos?.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-black mt-2 shrink-0" />
                  <span className="text-black">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Don'ts */}
          <div className="bg-[#f2f1ed]/50 rounded-2xl p-5 border border-[#dbd7cd]">
            <h4 className="text-xs uppercase tracking-[0.05em] text-black mb-3">
              Voice Don'ts (Banned Habits)
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#737373]">
              {voiceSystem.donts?.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-xs font-mono text-black leading-none mt-0.5">&times;</span>
                  <span className="text-black">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Signature Vocabulary Cloud */}
        <div>
          <span className="text-xs uppercase tracking-[0.05em] text-[#737373] block mb-3">
            Signature Brand Lexicon
          </span>
          <div className="flex flex-wrap gap-2">
            {voiceSystem.vocabularyWords?.map((word, idx) => (
              <span
                key={idx}
                className="px-3.5 py-1.5 rounded-full border border-[#dbd7cd] bg-white text-xs font-sans text-black"
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Launch Content & Manifesto */}
      <section className="bg-white rounded-[28px] border border-[#dbd7cd] p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#dbd7cd]">
          <div>
            <span className="text-[11px] uppercase tracking-[0.08em] text-[#737373] block mb-1">
              Editorial Copy
            </span>
            <h3 className="font-serif text-2xl font-light text-black tracking-[-0.03em]">
              Launch Content & Brand Manifesto
            </h3>
          </div>
          <button
            onClick={() => copyToClipboard(launchContent.manifesto, 'manifesto')}
            className="text-xs text-[#737373] hover:text-black flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#dbd7cd] hover:border-black transition-colors"
          >
            {copiedSection === 'manifesto' ? <Check className="w-3.5 h-3.5 text-black" /> : <Copy className="w-3.5 h-3.5 text-[#737373]" />}
            <span>{copiedSection === 'manifesto' ? 'Copied' : 'Copy Manifesto'}</span>
          </button>
        </div>

        {/* Headline Preview Banner */}
        <div className="bg-[#f2f1ed]/50 p-6 sm:p-8 rounded-2xl border border-[#dbd7cd] mb-8">
          <span className="text-[11px] uppercase tracking-[0.08em] text-[#737373] block mb-2">
            Hero Headline &amp; Call To Action
          </span>
          <h4 
            className="font-serif text-3xl sm:text-4xl font-light text-black mb-3 leading-snug tracking-[-0.03em]"
            style={{ fontFamily: typography.headingFont ? `'${typography.headingFont}', serif` : 'inherit' }}
          >
            {launchContent.heroHeadline}
          </h4>
          <p className="text-sm sm:text-base text-[#737373] mb-6 max-w-2xl leading-relaxed">
            {launchContent.heroSubheadline}
          </p>
          <button 
            className="px-6 py-2.5 rounded-full bg-black text-white hover:bg-neutral-800 text-xs font-normal tracking-wide transition-all"
          >
            {launchContent.callToAction || "Forge Your Identity"}
          </button>
        </div>

        {/* Full Manifesto Box */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#dbd7cd] mb-8">
          <span className="text-xs uppercase tracking-[0.05em] text-[#737373] block mb-4">
            The Brand Manifesto
          </span>
          <div className="font-serif text-xl sm:text-2xl text-black font-light leading-relaxed whitespace-pre-line italic border-l-2 border-black pl-6 py-1">
            "{launchContent.manifesto}"
          </div>
        </div>

        {/* Social Launch Campaign */}
        <div>
          <span className="text-xs uppercase tracking-[0.05em] text-[#737373] block mb-4">
            Launch Social Hooks (30-Day Campaign)
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {launchContent.socialHooks?.map((hook, idx) => (
              <div 
                key={idx}
                className="bg-[#f2f1ed]/40 p-5 rounded-2xl border border-[#dbd7cd] flex flex-col justify-between gap-4 text-xs leading-relaxed"
              >
                <p className="text-black font-normal">"{hook}"</p>
                <div className="flex justify-between items-center pt-3 border-t border-[#dbd7cd]">
                  <span className="text-[11px] text-[#737373] font-mono">Hook 0{idx + 1}</span>
                  <button
                    onClick={() => copyToClipboard(hook, `hook-${idx}`)}
                    className="text-[#737373] hover:text-black transition-colors"
                  >
                    {copiedSection === `hook-${idx}` ? <Check className="w-3.5 h-3.5 text-black" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
