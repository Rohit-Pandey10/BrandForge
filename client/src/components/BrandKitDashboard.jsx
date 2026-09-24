import React, { useState, useEffect } from 'react';
import {
  Copy,
  Check,
  Download,
  Palette,
  Printer,
  ExternalLink,
  Code,
  Sparkles,
  ArrowRight,
  Eye,
  Target,
  Mic,
  Sliders,
  FileText,
  Utensils,
  Calendar,
  MapPin,
  Clock,
  Terminal,
  ShieldCheck,
  Heart
} from 'lucide-react';
import { extractClientDomain } from '../data/mockBrandData';

const cleanXml = (unsafe = '') => 
  String(unsafe).replace(/[<>&'"]/g, (c) => ({
    '<': '&lt;', '>': '&gt;', '&': '&amp;', '\'': '&apos;', '"': '&quot;'
  }[c]));

export default function BrandKitDashboard({ brandKit, onStartNew }) {
  const [activeTab, setActiveTab] = useState('preview'); // 'preview' | 'strategy' | 'voice' | 'tokens' | 'manifesto'
  const [copiedHex, setCopiedHex] = useState(null);
  const [copiedIdentifier, setCopiedIdentifier] = useState(null);

  const {
    brandStrategy = {},
    voiceSystem = {},
    visualTokens = {},
    launchContent = {}
  } = brandKit || {};

  const palette = visualTokens.palette || [];
  const typography = visualTokens.typography || {};
  const brandName = brandStrategy.brandName || "Brand Monograph";
  const cleanName = brandName.toLowerCase().replace(/\s+/g, '-');

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
      setCopiedIdentifier(identifier);
      setTimeout(() => setCopiedIdentifier(null), 2000);
    }
  };

  // Compile CSS Custom Properties
  const compiledCss = `:root {
  /* Brand: ${brandName} */
${palette.map(c => `  --color-${(c.role || 'color').toLowerCase().replace(/[^a-z0-9]/g, '-')}: ${c.hex}; /* ${c.name} */`).join('\n')}

  /* Typography Scale */
  --font-display: '${typography.headingFont || 'Cormorant Garamond'}', Georgia, serif;
  --font-body: '${typography.bodyFont || 'Inter'}', system-ui, sans-serif;

  /* Geometry & Shape */
  --radius-curvature: ${visualTokens.borderCurvature === 'rounded-none' ? '0px' : visualTokens.borderCurvature === 'rounded-full' ? '9999px' : '16px'};
}`;

  const handleDownloadTokensJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(brandKit, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${cleanName}-tokens.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDownloadCssTokens = () => {
    const dataStr = "data:text/css;charset=utf-8," + encodeURIComponent(compiledCss);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${cleanName}-tokens.css`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportPaletteSvg = () => {
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
          <rect width="${swatchWidth}" height="${swatchHeight}" rx="20" fill="${cleanXml(c.hex)}" stroke="#dbd7cd" stroke-width="1" />
          <text x="${swatchWidth / 2}" y="${swatchHeight + 28}" fill="#737373" font-size="11" font-weight="400" text-anchor="middle" font-family="'Inter', sans-serif" letter-spacing="1">${cleanXml((c.role || '').toUpperCase())}</text>
          <text x="${swatchWidth / 2}" y="${swatchHeight + 48}" fill="#000000" font-size="13" font-weight="500" text-anchor="middle" font-family="'Inter', sans-serif">${cleanXml(c.name || 'Color')}</text>
          <text x="${swatchWidth / 2}" y="${swatchHeight + 68}" fill="#000000" font-size="12" font-weight="400" text-anchor="middle" font-family="monospace">${cleanXml(c.hex)}</text>
        </g>
      `;
    }).join('\n');

    const brandTitle = cleanXml(brandName);

    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <rect width="100%" height="100%" fill="#f2f1ed" />
  <text x="${width / 2}" y="50" fill="#000000" font-size="28" font-weight="300" text-anchor="middle" font-family="'Cormorant Garamond', Georgia, serif">${brandTitle} — Color System</text>
  <text x="${width / 2}" y="76" fill="#737373" font-size="12" font-weight="400" text-anchor="middle" font-family="'Inter', sans-serif">Synthesized Design Tokens</text>
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

  const tabs = [
    { id: 'preview', label: 'Live Brand Preview', icon: Eye },
    { id: 'strategy', label: 'Brand Strategy', icon: Target },
    { id: 'voice', label: 'Voice & Tone', icon: Mic },
    { id: 'tokens', label: 'Visual Design Tokens', icon: Sliders },
    { id: 'manifesto', label: 'Launch Copy & Manifesto', icon: FileText }
  ];

  const primaryColor = palette.find(c => c.role === 'primary')?.hex || '#000000';
  const surfaceColor = palette.find(c => c.role === 'surface')?.hex || '#ffffff';
  const accentColor = palette.find(c => c.role === 'accent')?.hex || '#000000';
  const radiusCurvature = visualTokens.borderCurvature === 'rounded-none' 
    ? '0px' 
    : visualTokens.borderCurvature === 'rounded-full' 
    ? '9999px' 
    : visualTokens.borderCurvature === 'rounded-2xl' 
    ? '24px' 
    : visualTokens.borderCurvature === 'rounded-lg' 
    ? '12px' 
    : '16px';

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-4 sm:py-8 animate-fade-in pb-24 font-sans text-black">
      {/* Editorial Identity Header Bar */}
      <div className="bg-white rounded-[28px] border border-[#dbd7cd] p-6 sm:p-10 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-stone-400 font-medium block mb-2">
            SYNTHESIZED BRAND MONOGRAPH &bull; SPECIFICATION 01
          </span>
          <h1 
            className="font-serif text-4xl sm:text-6xl font-light text-black tracking-[-0.03em] leading-tight mb-2"
            style={{ fontFamily: typography.headingFont ? `'${typography.headingFont}', serif` : 'inherit' }}
          >
            {brandName}
          </h1>
          <p 
            className="text-sm sm:text-base text-stone-600 max-w-2xl font-normal leading-relaxed"
            style={{ fontFamily: typography.bodyFont ? `'${typography.bodyFont}', sans-serif` : 'inherit' }}
          >
            {brandStrategy.tagline || "Autonomous brand architecture synthesized from first-principles conviction."}
          </p>
        </div>

        {/* Quick Utility Actions */}
        <div className="no-print flex flex-wrap items-center gap-2 self-start md:self-center shrink-0">
          <button
            onClick={handleDownloadTokensJson}
            className="inline-flex items-center gap-1.5 border border-[#dbd7cd] bg-[#fcfbf9] text-stone-800 text-xs px-3.5 py-1.5 rounded-full hover:border-black transition-all"
            title="Download design tokens as JSON"
          >
            <Download className="w-3.5 h-3.5 text-stone-500" />
            <span>tokens.json</span>
          </button>

          <button
            onClick={handleDownloadCssTokens}
            className="inline-flex items-center gap-1.5 border border-[#dbd7cd] bg-[#fcfbf9] text-stone-800 text-xs px-3.5 py-1.5 rounded-full hover:border-black transition-all"
            title="Download compiled CSS custom properties"
          >
            <Code className="w-3.5 h-3.5 text-stone-500" />
            <span>tokens.css</span>
          </button>

          <button
            onClick={handleExportPaletteSvg}
            className="inline-flex items-center gap-1.5 border border-[#dbd7cd] bg-[#fcfbf9] text-stone-800 text-xs px-3.5 py-1.5 rounded-full hover:border-black transition-all"
            title="Download SVG swatches"
          >
            <Palette className="w-3.5 h-3.5 text-stone-500" />
            <span>palette.svg</span>
          </button>
        </div>
      </div>

      {/* Top Segmented Tab Bar Strip */}
      <div className="no-print mb-8">
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-2 gap-1.5 scrollbar-none">
          <div className="inline-flex p-1.5 bg-white rounded-full border border-[#dbd7cd] shadow-none max-w-full">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-black text-white shadow-none'
                      : 'text-stone-600 hover:text-black hover:bg-[#f2f1ed]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 stroke-[1.5]" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* TAB 1: LIVE BRAND PREVIEW */}
      {activeTab === 'preview' && (() => {
        const combinedContext = [
          brandStrategy.brandName,
          brandStrategy.tagline,
          brandStrategy.mission,
          brandStrategy.targetAudience,
          brandStrategy.differentiator,
          launchContent.heroHeadline,
          launchContent.heroSubheadline
        ].join(' ');
        const detectedDomain = extractClientDomain(combinedContext);

        return (
          <div className="space-y-8 animate-fade-in">
            {/* Simulated Browser Viewport Card */}
            <div 
              className="bg-white border border-[#dbd7cd] overflow-hidden shadow-sm"
              style={{
                borderRadius: '28px',
                '--color-primary': primaryColor,
                '--radius-curvature': radiusCurvature,
                '--font-display': typography.headingFont ? `'${typography.headingFont}', serif` : 'inherit',
                '--font-body': typography.bodyFont ? `'${typography.bodyFont}', sans-serif` : 'inherit'
              }}
            >
              {/* Browser Top Chrome */}
              <div className="bg-[#faf9f6] border-b border-[#dbd7cd] px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-stone-300" />
                  <span className="w-2.5 h-2.5 rounded-full bg-stone-300" />
                  <span className="w-2.5 h-2.5 rounded-full bg-stone-300" />
                </div>
                <div className="px-6 py-1 rounded-full bg-white border border-[#dbd7cd] text-[11px] font-mono text-stone-500 max-w-xs truncate">
                  {detectedDomain === 'hospitality' ? `https://${cleanName}.restaurant` : detectedDomain === 'developer' ? `https://${cleanName}.dev` : `https://${cleanName}.com`}
                </div>
                <span className="text-[10px] uppercase font-mono text-stone-400">
                  {detectedDomain.toUpperCase()} PREVIEW
                </span>
              </div>

              {/* DYNAMIC ARCHETYPE 1: HOSPITALITY & FOOD */}
              {detectedDomain === 'hospitality' ? (
                <div className="p-6 sm:p-12 min-h-[520px] flex flex-col justify-between bg-[#fcfbf9]">
                  {/* Restaurant Navigation Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-[#dbd7cd] gap-4">
                    <div className="flex items-center gap-3">
                      <span 
                        className="text-2xl sm:text-3xl font-light tracking-tight text-black"
                        style={{ fontFamily: typography.headingFont ? `'${typography.headingFont}', Georgia, serif` : 'inherit' }}
                      >
                        {brandName}
                      </span>
                      <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-[#f2f1ed] text-stone-600 border border-[#dbd7cd]">
                        {voiceSystem.archetype || "Hospitality"}
                      </span>
                    </div>
                    <div className="flex items-center gap-5 text-xs text-stone-700 font-sans">
                      <span className="hover:text-black cursor-pointer font-medium">Daily Menu</span>
                      <span className="hover:text-black cursor-pointer hidden sm:inline">The Table</span>
                      <span className="hover:text-black cursor-pointer hidden md:inline">Private Dining</span>
                      <button 
                        className="px-5 py-2 text-xs font-medium transition-all shadow-sm"
                        style={{ backgroundColor: primaryColor, color: '#ffffff', borderRadius: radiusCurvature }}
                      >
                        {launchContent.callToAction || "Reserve a Table"}
                      </button>
                    </div>
                  </div>

                  {/* Location & Hours Context Pill */}
                  <div className="flex items-center gap-2 text-[11px] font-mono text-stone-500 mb-6 bg-white px-3.5 py-1.5 rounded-full border border-[#dbd7cd] w-fit">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    <span>142 Bedford Ave &bull; Wed–Sun 4pm–10pm &bull; Walk-ins & Family Tables Welcome</span>
                  </div>

                  {/* Hero Photo / Atmospheric Hearth Showcase Placeholder Banner */}
                  <div 
                    className="relative w-full h-48 sm:h-64 overflow-hidden mb-8 border border-[#dbd7cd] flex items-end p-6"
                    style={{ 
                      borderRadius: radiusCurvature,
                      background: `linear-gradient(135deg, #1f1815 0%, #2b201b 50%, #15110f 100%)`
                    }}
                  >
                    <div className="absolute inset-0 opacity-15 flex items-center justify-center pointer-events-none">
                      <Utensils className="w-36 h-36 text-amber-100 stroke-[1]" />
                    </div>
                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between w-full gap-4 text-white">
                      <div>
                        <span className="text-[10px] uppercase font-mono tracking-widest text-amber-300 font-medium px-2 py-0.5 rounded bg-black/40 border border-white/10 inline-block mb-1.5">
                          OPEN HEARTH &bull; 900° LIVE OAK
                        </span>
                        <h3 
                          className="text-xl sm:text-2xl font-light text-white drop-shadow"
                          style={{ fontFamily: typography.headingFont ? `'${typography.headingFont}', Georgia, serif` : 'inherit' }}
                        >
                          Naturally Fermented Sourdough &bull; Hand-Crafted Hospitality
                        </h3>
                      </div>
                      <span className="text-xs font-mono px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white self-start sm:self-end">
                        Walk-ins & Big Tables Welcome
                      </span>
                    </div>
                  </div>

                  {/* Restaurant Hero Section */}
                  <div className="max-w-3xl my-2">
                    <h2 
                      className="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight leading-[1.08] text-black mb-4"
                      style={{ fontFamily: typography.headingFont ? `'${typography.headingFont}', Georgia, serif` : 'inherit' }}
                    >
                      {launchContent.heroHeadline || "Big Tables. Honest Slices. Bring Everyone."}
                    </h2>
                    <p 
                      className="text-base sm:text-lg text-stone-700 max-w-2xl leading-relaxed mb-6"
                      style={{ fontFamily: typography.bodyFont ? `'${typography.bodyFont}', system-ui, sans-serif` : 'inherit' }}
                    >
                      {launchContent.heroSubheadline || brandStrategy.coreValueProposition}
                    </p>

                    <div className="flex flex-wrap items-center gap-3">
                      <button 
                        className="px-6 py-3 text-xs font-medium tracking-wide transition-all shadow-sm flex items-center gap-2"
                        style={{ backgroundColor: primaryColor, color: '#ffffff', borderRadius: radiusCurvature }}
                      >
                        <Utensils className="w-3.5 h-3.5" />
                        <span>{launchContent.callToAction || "Reserve a Table"}</span>
                      </button>
                      <button 
                        className="px-6 py-3 text-xs font-medium text-stone-900 bg-white border border-[#dbd7cd] hover:border-black transition-all flex items-center gap-2"
                        style={{ borderRadius: radiusCurvature }}
                      >
                        <Clock className="w-3.5 h-3.5 text-stone-500" />
                        <span>Order Ahead</span>
                      </button>
                      <button 
                        className="px-6 py-3 text-xs text-stone-700 hover:text-black transition-all flex items-center gap-2"
                      >
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        <span>View Daily Menu</span>
                      </button>
                    </div>
                  </div>

                  {/* Featured Menu & Table Spread Preview */}
                  <div className="my-8 pt-8 border-t border-[#dbd7cd]">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[11px] uppercase font-mono tracking-widest text-stone-500 font-medium">
                        FROM THE KITCHEN & WOOD OVEN
                      </span>
                      <span className="text-xs text-stone-400 font-mono">Seasonal Daily Board</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div 
                        className="p-5 bg-white border border-[#dbd7cd] flex flex-col justify-between shadow-xs"
                        style={{ borderRadius: radiusCurvature }}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <h4 
                              className="text-base font-medium text-black"
                              style={{ fontFamily: typography.headingFont ? `'${typography.headingFont}', Georgia, serif` : 'inherit' }}
                            >
                              Sourdough Margherita
                            </h4>
                            <span className="font-mono text-xs font-semibold text-stone-900">$18</span>
                          </div>
                          <p 
                            className="text-xs text-stone-600 leading-relaxed"
                            style={{ fontFamily: typography.bodyFont ? `'${typography.bodyFont}', sans-serif` : 'inherit' }}
                          >
                            72-hour naturally fermented crust, sweet San Marzano tomatoes, fresh fior di latte, cold-pressed olive oil.
                          </p>
                        </div>
                        <span className="text-[10px] font-mono text-stone-400 mt-4 block">WOOD-FIRED &bull; 900° LIVE OAK</span>
                      </div>

                      <div 
                        className="p-5 bg-white border border-[#dbd7cd] flex flex-col justify-between shadow-xs"
                        style={{ borderRadius: radiusCurvature }}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <h4 
                              className="text-base font-medium text-black"
                              style={{ fontFamily: typography.headingFont ? `'${typography.headingFont}', Georgia, serif` : 'inherit' }}
                            >
                              Crispy Fennel Sausage
                            </h4>
                            <span className="font-mono text-xs font-semibold text-stone-900">$22</span>
                          </div>
                          <p 
                            className="text-xs text-stone-600 leading-relaxed"
                            style={{ fontFamily: typography.bodyFont ? `'${typography.bodyFont}', sans-serif` : 'inherit' }}
                          >
                            Heritage pork sausage, roasted garlic cream, charred scallions, organic hot honey drizzle.
                          </p>
                        </div>
                        <span className="text-[10px] font-mono text-stone-400 mt-4 block">NEIGHBORHOOD FAVORITE</span>
                      </div>

                      <div 
                        className="p-5 bg-white border border-[#dbd7cd] flex flex-col justify-between shadow-xs"
                        style={{ borderRadius: radiusCurvature }}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <h4 
                              className="text-base font-medium text-black"
                              style={{ fontFamily: typography.headingFont ? `'${typography.headingFont}', Georgia, serif` : 'inherit' }}
                            >
                              Family Chopped Salad
                            </h4>
                            <span className="font-mono text-xs font-semibold text-stone-900">$14</span>
                          </div>
                          <p 
                            className="text-xs text-stone-600 leading-relaxed"
                            style={{ fontFamily: typography.bodyFont ? `'${typography.bodyFont}', sans-serif` : 'inherit' }}
                          >
                            Crisp seasonal greens, shaved radishes, pickled peppers, toasted chickpeas, wild oregano vinaigrette.
                          </p>
                        </div>
                        <span className="text-[10px] font-mono text-stone-400 mt-4 block">SHARING PLATTER &bull; ALL-AGES</span>
                      </div>
                    </div>
                  </div>

                  {/* Hospitality Highlights Footer Strip */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[#dbd7cd]">
                    <div 
                      className="p-4 bg-white border border-[#dbd7cd]"
                      style={{ borderRadius: radiusCurvature }}
                    >
                      <span className="text-[10px] uppercase font-mono text-stone-400 block mb-1">01 / The Distinct Edge</span>
                      <p className="text-xs text-stone-800 font-medium leading-snug">{brandStrategy.differentiator}</p>
                    </div>
                    <div 
                      className="p-4 bg-white border border-[#dbd7cd]"
                      style={{ borderRadius: radiusCurvature }}
                    >
                      <span className="text-[10px] uppercase font-mono text-stone-400 block mb-1">02 / Core Guest Profile</span>
                      <p className="text-xs text-stone-800 font-medium leading-snug">{brandStrategy.targetAudience}</p>
                    </div>
                    <div 
                      className="p-4 bg-white border border-[#dbd7cd]"
                      style={{ borderRadius: radiusCurvature }}
                    >
                      <span className="text-[10px] uppercase font-mono text-stone-400 block mb-1">03 / Standard We Break</span>
                      <p className="text-xs text-stone-800 font-medium leading-snug">{brandStrategy.antiHero}</p>
                    </div>
                  </div>
                </div>
              ) : detectedDomain === 'developer' ? (
                /* DYNAMIC ARCHETYPE 2: DEVELOPER & SYSTEMS */
                <div className="p-6 sm:p-14 min-h-[500px] flex flex-col justify-between bg-[#0e1015] text-white">
                  <div className="flex items-center justify-between pb-6 mb-6 border-b border-stone-800">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xl font-bold tracking-tight text-white">{brandName}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-800 text-stone-400">v1.2.0</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/40">Zero Config</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-stone-400 font-mono">
                      <span>Docs</span>
                      <span>Benchmarks</span>
                      <span>GitHub ★ 2.4k</span>
                      <button 
                        className="px-4 py-1.5 text-xs font-mono font-medium transition-all"
                        style={{ backgroundColor: primaryColor, color: '#ffffff', borderRadius: radiusCurvature }}
                      >
                        {launchContent.callToAction || "Install"}
                      </button>
                    </div>
                  </div>

                  <div className="max-w-3xl my-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-stone-800 text-stone-300">
                        Rust-Engine
                      </span>
                      <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-stone-800 text-stone-300">
                        Sub-1ms Latency
                      </span>
                      <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-stone-800 text-stone-300">
                        Single Binary
                      </span>
                    </div>

                    <h2 
                      className="text-3xl sm:text-5xl font-mono font-bold tracking-tight leading-tight text-white mb-4"
                      style={{ fontFamily: typography.headingFont ? `'${typography.headingFont}', monospace` : 'inherit' }}
                    >
                      {launchContent.heroHeadline}
                    </h2>
                    <p 
                      className="text-sm sm:text-base text-stone-400 font-sans leading-relaxed mb-6"
                      style={{ fontFamily: typography.bodyFont ? `'${typography.bodyFont}', sans-serif` : 'inherit' }}
                    >
                      {launchContent.heroSubheadline || brandStrategy.coreValueProposition}
                    </p>

                    {/* Terminal Install Snippet */}
                    <div 
                      className="p-4 bg-black border border-stone-800 font-mono text-xs text-emerald-400 space-y-1 mb-6 shadow-inner"
                      style={{ borderRadius: radiusCurvature }}
                    >
                      <div className="text-stone-500 text-[10px]">// Install CLI & compile bare-metal engine</div>
                      <div className="flex items-center justify-between">
                        <code>$ curl -fsSL https://{cleanName}.dev/install.sh | sh</code>
                        <span className="text-[10px] text-stone-500">copy</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-stone-800">
                    <div 
                      className="p-4 bg-stone-900/60 border border-stone-800"
                      style={{ borderRadius: radiusCurvature }}
                    >
                      <span className="text-[10px] uppercase font-mono text-stone-500 block mb-1">01 / Engine Differentiator</span>
                      <p className="text-xs text-stone-300 font-mono leading-snug">{brandStrategy.differentiator}</p>
                    </div>
                    <div 
                      className="p-4 bg-stone-900/60 border border-stone-800"
                      style={{ borderRadius: radiusCurvature }}
                    >
                      <span className="text-[10px] uppercase font-mono text-stone-500 block mb-1">02 / Target Systems User</span>
                      <p className="text-xs text-stone-300 font-mono leading-snug">{brandStrategy.targetAudience}</p>
                    </div>
                    <div 
                      className="p-4 bg-stone-900/60 border border-stone-800"
                      style={{ borderRadius: radiusCurvature }}
                    >
                      <span className="text-[10px] uppercase font-mono text-stone-500 block mb-1">03 / Legacy Bloat Eliminated</span>
                      <p className="text-xs text-stone-300 font-mono leading-snug">{brandStrategy.antiHero}</p>
                    </div>
                  </div>
                </div>
              ) : (
                /* DYNAMIC ARCHETYPE 3: EDITORIAL / CREATIVE / CAREER */
                <div className="p-8 sm:p-16 min-h-[480px] flex flex-col justify-between bg-white">
                  <div className="flex items-center justify-between pb-8 mb-8 border-b border-stone-200">
                    <span 
                      className="text-2xl font-light tracking-tight text-black"
                      style={{ fontFamily: typography.headingFont ? `'${typography.headingFont}', serif` : 'inherit' }}
                    >
                      {brandName}.
                    </span>
                    <div className="flex items-center gap-4 text-xs text-stone-600 font-sans">
                      <span>Monograph</span>
                      <span>Evidence</span>
                      <button 
                        className="px-4 py-1.5 text-xs font-medium transition-all"
                        style={{ backgroundColor: primaryColor, color: '#ffffff', borderRadius: radiusCurvature }}
                      >
                        {launchContent.callToAction || "Get Started"}
                      </button>
                    </div>
                  </div>

                  <div className="max-w-3xl my-auto py-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs mb-6 border border-stone-300 bg-stone-50 text-stone-700">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }} />
                      <span>Archetype: {voiceSystem.archetype || "The Master Artisan"}</span>
                    </div>

                    <h2 
                      className="text-4xl sm:text-6xl font-light tracking-tight leading-[1.05] text-black mb-6"
                      style={{ fontFamily: typography.headingFont ? `'${typography.headingFont}', serif` : 'inherit' }}
                    >
                      {launchContent.heroHeadline}
                    </h2>

                    <p 
                      className="text-base sm:text-lg text-stone-600 max-w-2xl leading-relaxed mb-8"
                      style={{ fontFamily: typography.bodyFont ? `'${typography.bodyFont}', sans-serif` : 'inherit' }}
                    >
                      {launchContent.heroSubheadline || brandStrategy.coreValueProposition}
                    </p>

                    <div className="flex flex-wrap items-center gap-3">
                      <button 
                        className="px-6 py-3 text-xs font-medium tracking-wide transition-all shadow-sm"
                        style={{ backgroundColor: primaryColor, color: '#ffffff', borderRadius: radiusCurvature }}
                      >
                        {launchContent.callToAction || "Explore Archive"} &rarr;
                      </button>
                      <button 
                        className="px-6 py-3 text-xs text-stone-800 bg-white border border-[#dbd7cd] hover:border-black transition-all"
                        style={{ borderRadius: radiusCurvature }}
                      >
                        Read Manifesto
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-10 border-t border-stone-200">
                    <div 
                      className="p-4 bg-stone-50 border border-stone-200"
                      style={{ borderRadius: radiusCurvature }}
                    >
                      <span className="text-[10px] uppercase font-mono text-stone-400 block mb-1">01 / The Distinct Edge</span>
                      <p className="text-xs text-stone-800 font-medium leading-snug">{brandStrategy.differentiator}</p>
                    </div>
                    <div 
                      className="p-4 bg-stone-50 border border-stone-200"
                      style={{ borderRadius: radiusCurvature }}
                    >
                      <span className="text-[10px] uppercase font-mono text-stone-400 block mb-1">02 / Core Audience</span>
                      <p className="text-xs text-stone-800 font-medium leading-snug">{brandStrategy.targetAudience}</p>
                    </div>
                    <div 
                      className="p-4 bg-stone-50 border border-stone-200"
                      style={{ borderRadius: radiusCurvature }}
                    >
                      <span className="text-[10px] uppercase font-mono text-stone-400 block mb-1">03 / Standard We Break</span>
                      <p className="text-xs text-stone-800 font-medium leading-snug">{brandStrategy.antiHero}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* TAB 2: BRAND STRATEGY */}
      {activeTab === 'strategy' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Target Audience / Guest Profile Card */}
            <div className="bg-white rounded-[28px] border border-[#dbd7cd] p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-stone-400 font-medium block mb-2">
                  AUDIENCE FOUNDATION
                </span>
                <h3 className="font-serif text-2xl font-light text-black tracking-[-0.03em] mb-4">
                  Core Audience & Guest Profile
                </h3>
                <p className="text-sm text-stone-700 bg-[#fcfbf9] p-4 rounded-2xl border border-[#dbd7cd] leading-relaxed">
                  {brandStrategy.targetAudience}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#dbd7cd] text-xs text-stone-500">
                Identifies the distinct community and guests who actively seek out this experience.
              </div>
            </div>

            {/* Core Value Proposition */}
            <div className="bg-white rounded-[28px] border border-[#dbd7cd] p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-stone-400 font-medium block mb-2">
                  POSITIONING ANCHOR
                </span>
                <h3 className="font-serif text-2xl font-light text-black tracking-[-0.03em] mb-4">
                  Core Value Proposition
                </h3>
                <p className="text-sm text-stone-700 bg-[#fcfbf9] p-4 rounded-2xl border border-[#dbd7cd] leading-relaxed">
                  {brandStrategy.coreValueProposition}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#dbd7cd] text-xs text-stone-500">
                The primary transformational promise delivered directly to the core guest or buyer.
              </div>
            </div>

            {/* The Industry Standard We Break */}
            <div className="bg-white rounded-[28px] border border-[#dbd7cd] p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-stone-400 font-medium block mb-2">
                  IDEOLOGICAL OPPOSITION
                </span>
                <h3 className="font-serif text-2xl font-light text-black tracking-[-0.03em] mb-4">
                  The Industry Standard We Break
                </h3>
                <p className="text-sm text-stone-700 bg-[#fcfbf9] p-4 rounded-2xl border border-[#dbd7cd] leading-relaxed">
                  {brandStrategy.antiHero}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#dbd7cd] text-xs text-stone-500">
                Declares the tired industry compromise that gives the brand its reason to exist.
              </div>
            </div>

            {/* The Distinct Edge */}
            <div className="bg-white rounded-[28px] border border-[#dbd7cd] p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-stone-400 font-medium block mb-2">
                  COMPETITIVE ADVANTAGE
                </span>
                <h3 className="font-serif text-2xl font-light text-black tracking-[-0.03em] mb-4">
                  The Distinct Edge
                </h3>
                <p className="text-sm text-stone-700 bg-[#fcfbf9] p-4 rounded-2xl border border-[#dbd7cd] leading-relaxed">
                  {brandStrategy.differentiator}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#dbd7cd] text-xs text-stone-500">
                The singular reason someone chooses this experience over any alternative.
              </div>
            </div>
          </div>

          {/* Mission & Purpose */}
          <div className="bg-white rounded-[28px] border border-[#dbd7cd] p-6 sm:p-8">
            <span className="text-[10px] uppercase tracking-widest text-stone-400 font-medium block mb-2">
              PURPOSE & REACH
            </span>
            <h3 className="font-serif text-2xl font-light text-black tracking-[-0.03em] mb-3">
              Brand Mission
            </h3>
            <p className="text-base text-stone-800 leading-relaxed font-normal">
              {brandStrategy.mission}
            </p>
          </div>
        </div>
      )}

      {/* TAB 3: VOICE & TONE */}
      {activeTab === 'voice' && (
        <div className="space-y-6 animate-fade-in">
          {/* Verbal Identity Summary Card */}
          <div className="bg-white rounded-[28px] border border-[#dbd7cd] p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#dbd7cd]">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-stone-400 font-medium block mb-1">
                  VERBAL IDENTITY
                </span>
                <h3 className="font-serif text-3xl font-light text-black tracking-[-0.03em]">
                  Voice Archetype: {voiceSystem.archetype || "The Rebel"}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {voiceSystem.tone?.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-3.5 py-1 rounded-full border border-[#dbd7cd] bg-[#fcfbf9] text-xs text-black font-medium"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Dos and Don'ts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
              {/* Voice Dos */}
              <div className="p-5 rounded-2xl bg-[#faf9f6] border border-[#dbd7cd]/80">
                <span className="text-xs uppercase tracking-wider text-black font-medium block mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-black" />
                  <span>Voice Dos (Speak Like This)</span>
                </span>
                <ul className="space-y-3 text-xs sm:text-sm text-stone-700">
                  {voiceSystem.dos?.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-stone-400 mt-2 shrink-0" />
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Voice Don'ts */}
              <div className="p-5 rounded-2xl bg-[#faf9f6] border border-[#dbd7cd]/80">
                <span className="text-xs uppercase tracking-wider text-black font-medium block mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-stone-400" />
                  <span>Voice Don'ts (Banned Habits)</span>
                </span>
                <ul className="space-y-3 text-xs sm:text-sm text-stone-700">
                  {voiceSystem.donts?.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="text-xs font-mono text-stone-500 leading-none mt-0.5">&times;</span>
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Lexicon Cloud */}
            <div className="pt-6 mt-6 border-t border-[#dbd7cd]">
              <span className="text-xs uppercase tracking-wider text-stone-500 block mb-3">
                Signature Brand Lexicon (Power Words)
              </span>
              <div className="flex flex-wrap gap-2">
                {voiceSystem.vocabularyWords?.map((word, idx) => (
                  <span
                    key={idx}
                    className="px-3.5 py-1.5 rounded-full border border-[#dbd7cd] bg-white text-xs font-sans text-stone-900"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: VISUAL DESIGN TOKENS */}
      {activeTab === 'tokens' && (
        <div className="space-y-8 animate-fade-in">
          {/* Color System Section */}
          <section className="bg-white rounded-[28px] border border-[#dbd7cd] p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-[#dbd7cd]">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-stone-400 font-medium block mb-1">
                  PALETTE SPECIFICATION
                </span>
                <h3 className="font-serif text-2xl font-light text-black tracking-[-0.03em]">
                  Color System — Synthesized Palette Swatches
                </h3>
              </div>
              <span className="text-xs text-stone-500">Click any swatch to copy HEX code</span>
            </div>

            {/* 5 Swatch Blocks: Rounded-2xl slabs (Top 2/3 color, Bottom 1/3 white container) */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
              {palette.map((color, idx) => {
                const isCopied = copiedHex === color.hex;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => copyToClipboard(color.hex, `hex-${color.hex}`)}
                    className="rounded-2xl border border-[#dbd7cd] overflow-hidden bg-white text-left hover:border-black transition-all group flex flex-col shadow-none"
                    title={`Copy ${color.hex}`}
                  >
                    {/* Top 2/3: Solid color block */}
                    <div 
                      className="h-24 w-full relative flex items-center justify-center transition-transform group-hover:scale-[1.02]"
                      style={{ backgroundColor: color.hex }}
                    >
                      <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/95 text-black border border-black/10 transition-opacity ${
                        isCopied ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}>
                        {isCopied ? 'Copied' : 'Copy'}
                      </span>
                    </div>

                    {/* Bottom 1/3: Swatch metadata in white container */}
                    <div className="p-3 bg-white flex flex-col justify-between flex-1 border-t border-[#dbd7cd]/40">
                      <div>
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="font-sans text-[11px] font-medium text-black truncate">
                            {color.name}
                          </span>
                        </div>
                        <span className="text-[10px] uppercase tracking-wider text-stone-400 block">
                          {color.role}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="font-mono text-xs text-stone-700">{color.hex}</span>
                        {isCopied ? (
                          <Check className="w-3 h-3 text-black" />
                        ) : (
                          <Copy className="w-3 h-3 text-stone-400 group-hover:text-black transition-colors" />
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Typography Sandbox Row (2-Column Grid) */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Card: Display Typography */}
            <div className="bg-white rounded-[28px] border border-[#dbd7cd] p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-[#dbd7cd]">
                  <span className="text-[10px] uppercase tracking-widest text-stone-400 font-medium">
                    DISPLAY TYPOGRAPHY
                  </span>
                  <span className="text-xs font-mono text-stone-500">
                    {typography.headingFont || 'Cormorant Garamond'}
                  </span>
                </div>

                <div 
                  className="font-serif text-3xl sm:text-4xl font-light text-black leading-tight tracking-[-0.03em] mb-4"
                  style={{ fontFamily: typography.headingFont ? `'${typography.headingFont}', serif` : 'inherit' }}
                >
                  Conviction builds enduring value.
                </div>

                <div className="p-3 bg-[#faf9f6] rounded-xl border border-[#dbd7cd] font-mono text-xs text-stone-600 mb-4 leading-relaxed">
                  Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz 0123456789
                </div>
              </div>

              <div className="pt-3 border-t border-[#dbd7cd] text-xs text-stone-500">
                Rationale: Selected for razor-sharp editorial tension and stark modern authority.
              </div>
            </div>

            {/* Right Card: Body & UI Typography */}
            <div className="bg-white rounded-[28px] border border-[#dbd7cd] p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-[#dbd7cd]">
                  <span className="text-[10px] uppercase tracking-widest text-stone-400 font-medium">
                    BODY & UI TYPOGRAPHY
                  </span>
                  <span className="text-xs font-mono text-stone-500">
                    {typography.bodyFont || 'Inter'}
                  </span>
                </div>

                <p 
                  className="text-sm text-stone-700 leading-relaxed mb-4"
                  style={{ fontFamily: typography.bodyFont ? `'${typography.bodyFont}', sans-serif` : 'inherit' }}
                >
                  {typography.rationale || "Balanced letterforms scaled for legible tactile menus, printed signage, and responsive mobile reservations."}
                </p>

                {/* Sample UI specimens */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <span className="px-3 py-1 rounded-full text-xs bg-black text-white">Primary Action</span>
                  <span className="px-3 py-1 rounded-full text-xs border border-[#dbd7cd] bg-white text-stone-800">Neutral Button</span>
                  <span className="px-3 py-1 rounded-full text-xs bg-[#faf9f6] text-stone-600 border border-[#dbd7cd]">Tag Specimen</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#dbd7cd] text-xs text-stone-500">
                Weight: 400 Regular &bull; Scaled for legible tactile materials and responsive viewports.
              </div>
            </div>
          </section>

          {/* Style Philosophy & Border Curvature Cards (2-Column Grid) */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Style Philosophy */}
            <div className="bg-white rounded-[28px] border border-[#dbd7cd] p-6 sm:p-8">
              <span className="text-[10px] uppercase tracking-widest text-stone-400 font-medium block mb-2">
                AESTHETIC FOUNDATION
              </span>
              <h3 className="font-serif text-2xl font-light text-black tracking-[-0.03em] mb-3">
                Style Philosophy
              </h3>
              <p className="text-sm text-stone-700 leading-relaxed bg-[#fcfbf9] p-4 rounded-xl border border-[#dbd7cd]">
                {visualTokens.stylePhilosophy || "Refined monochrome typography with disciplined whitespace, hairline boundaries, and high-contrast editorial clarity."}
              </p>
            </div>

            {/* Card 2: Border Curvature Spec */}
            <div className="bg-white rounded-[28px] border border-[#dbd7cd] p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-stone-400 font-medium block mb-2">
                  GEOMETRY RULES
                </span>
                <h3 className="font-serif text-2xl font-light text-black tracking-[-0.03em] mb-3">
                  Border Curvature Spec
                </h3>
                <div className="flex items-center gap-4 bg-[#fcfbf9] p-4 rounded-xl border border-[#dbd7cd]">
                  <div className={`w-14 h-14 bg-stone-900 border border-stone-800 flex items-center justify-center text-white text-[10px] font-mono ${visualTokens.borderCurvature || 'rounded-xl'}`}>
                    Shape
                  </div>
                  <div>
                    <span className="font-mono text-xs text-black font-medium block">
                      {visualTokens.borderCurvature || 'rounded-xl'}
                    </span>
                    <span className="text-xs text-stone-500">
                      Standardized container and interactive element radius.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CSS Custom Properties Code Panel */}
          <section className="bg-white rounded-[28px] border border-[#dbd7cd] p-6 sm:p-8">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#dbd7cd]">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-stone-400 font-medium block mb-1">
                  COMPILED CODE SPECIFICATION
                </span>
                <h3 className="font-serif text-2xl font-light text-black tracking-[-0.03em]">
                  CSS Custom Properties (:root)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(compiledCss, 'css-tokens')}
                className="inline-flex items-center gap-1.5 text-xs text-stone-700 hover:text-black px-3.5 py-1.5 rounded-full border border-[#dbd7cd] bg-[#fcfbf9] hover:border-black transition-all"
              >
                {copiedIdentifier === 'css-tokens' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-black" />
                    <span>Copied CSS</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-stone-500" />
                    <span>Copy CSS</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-4 rounded-2xl bg-[#faf9f6] border border-[#dbd7cd] font-mono text-xs text-stone-800 overflow-x-auto leading-relaxed">
              <code>{compiledCss}</code>
            </pre>
          </section>
        </div>
      )}

      {/* TAB 5: LAUNCH COPY & MANIFESTO */}
      {activeTab === 'manifesto' && (
        <div className="space-y-6 animate-fade-in">
          {/* Brand Manifesto Box */}
          <div className="bg-white rounded-[28px] border border-[#dbd7cd] p-6 sm:p-10">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#dbd7cd]">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-stone-400 font-medium block mb-1">
                  CORE IDEOLOGY
                </span>
                <h3 className="font-serif text-2xl font-light text-black tracking-[-0.03em]">
                  The Brand Manifesto
                </h3>
              </div>
              <button
                onClick={() => copyToClipboard(launchContent.manifesto, 'manifesto')}
                className="text-xs text-stone-700 hover:text-black flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#dbd7cd] hover:border-black transition-colors"
              >
                {copiedIdentifier === 'manifesto' ? <Check className="w-3.5 h-3.5 text-black" /> : <Copy className="w-3.5 h-3.5 text-stone-500" />}
                <span>{copiedIdentifier === 'manifesto' ? 'Copied' : 'Copy Manifesto'}</span>
              </button>
            </div>

            <div 
              className="font-serif text-xl sm:text-2xl text-black font-light leading-relaxed whitespace-pre-line italic border-l-2 border-black pl-6 sm:pl-8 py-2"
              style={{ fontFamily: typography.headingFont ? `'${typography.headingFont}', serif` : 'inherit' }}
            >
              "{launchContent.manifesto || "We believe true category leaders don't blend in—they plant a flag, declare an enemy, and build with relentless conviction."}"
            </div>
          </div>

          {/* Hero Copy Specimen */}
          <div className="bg-white rounded-[28px] border border-[#dbd7cd] p-6 sm:p-8">
            <span className="text-[10px] uppercase tracking-widest text-stone-400 font-medium block mb-3">
              LAUNCH HEADLINE & PITCH
            </span>
            <h4 
              className="font-serif text-3xl sm:text-4xl font-light text-black mb-3 leading-snug tracking-[-0.03em]"
              style={{ fontFamily: typography.headingFont ? `'${typography.headingFont}', serif` : 'inherit' }}
            >
              {launchContent.heroHeadline}
            </h4>
            <p className="text-sm sm:text-base text-stone-600 mb-6 max-w-2xl leading-relaxed">
              {launchContent.heroSubheadline}
            </p>
            <div className="pt-4 border-t border-[#dbd7cd]">
              <span className="text-[11px] uppercase tracking-wider text-stone-400 block mb-1">
                Elevator Pitch:
              </span>
              <p className="text-xs sm:text-sm text-stone-800 leading-relaxed">
                {launchContent.elevatorPitch || brandStrategy.coreValueProposition}
              </p>
            </div>
          </div>

          {/* Social Hooks Grid */}
          <div className="bg-white rounded-[28px] border border-[#dbd7cd] p-6 sm:p-8">
            <span className="text-[10px] uppercase tracking-widest text-stone-400 font-medium block mb-4">
              LAUNCH SOCIAL HOOKS (30-DAY CAMPAIGN)
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {launchContent.socialHooks?.map((hook, idx) => (
                <div 
                  key={idx}
                  className="bg-[#faf9f6] p-5 rounded-2xl border border-[#dbd7cd] flex flex-col justify-between gap-4 text-xs leading-relaxed"
                >
                  <p className="text-stone-900 font-normal">"{hook}"</p>
                  <div className="flex justify-between items-center pt-3 border-t border-[#dbd7cd]">
                    <span className="text-[11px] text-stone-400 font-mono">Hook 0{idx + 1}</span>
                    <button
                      onClick={() => copyToClipboard(hook, `hook-${idx}`)}
                      className="text-stone-500 hover:text-black transition-colors"
                      title="Copy hook"
                    >
                      {copiedIdentifier === `hook-${idx}` ? <Check className="w-3.5 h-3.5 text-black" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
