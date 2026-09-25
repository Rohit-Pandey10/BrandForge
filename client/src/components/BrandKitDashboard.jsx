/**
 * Brand Kit Dashboard — Thin Orchestrator
 *
 * Composes the 3 streamlined tab components and the floating export toolbar.
 * No business logic, rendering, or file export code lives here.
 *
 * Tab components:
 *   LivePreviewTab     → Live website preview (Hospitality / Developer / Editorial / Consumer)
 *   BrandStrategyTab   → Audience profile, value prop, differentiator, anti-hero, mission
 *   LaunchCopyTab      → Manifesto, hero copy, social hooks
 *
 * Export utilities: exportUtils.js
 */

import React, { useState, useEffect } from 'react';
import { Download, Palette, Code, Eye, Target, FileText, Printer, RotateCcw, Bookmark, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

import LivePreviewTab    from './dashboard/LivePreviewTab';
import BrandStrategyTab from './dashboard/BrandStrategyTab';
import LaunchCopyTab    from './dashboard/LaunchCopyTab';
import { exportBrandKitJson, exportCssTokens, exportPaletteSvg } from '../utils/exportUtils';

const TABS = [
  { id: 'preview',   label: 'Live Website Preview',         Icon: Eye },
  { id: 'strategy',  label: 'Brand Strategy & Positioning', Icon: Target },
  { id: 'manifesto', label: 'Launch Manifesto & Copy',      Icon: FileText }
];

export default function BrandKitDashboard({ brandKit, onStartNew }) {
  const [activeTab, setActiveTab] = useState('preview');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const { isAuthenticated, saveBrandToLibrary, openAuthModal } = useAuth();

  const { brandStrategy = {}, voiceSystem = {}, visualTokens = {}, launchContent = {} } = brandKit || {};
  const brandName = brandStrategy.brandName || 'Brand Monograph';
  const typography = visualTokens.typography || {};

  // Inject brand-specific Google Fonts into <head>
  useEffect(() => {
    if (!typography.googleFontsUrl) return;
    const existing = document.getElementById('dynamic-brand-google-fonts');
    if (existing) {
      existing.href = typography.googleFontsUrl;
    } else {
      const link = document.createElement('link');
      link.id   = 'dynamic-brand-google-fonts';
      link.rel  = 'stylesheet';
      link.href = typography.googleFontsUrl;
      document.head.appendChild(link);
    }
  }, [typography.googleFontsUrl]);

  const handlePrint = () => window.print();

  const tabProps = { brandStrategy, voiceSystem, visualTokens, launchContent };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-4 sm:py-8 animate-fade-in pb-32 font-sans text-black">

      {/* ── Editorial Identity Header ── */}
      <div className="bg-white rounded-[28px] border border-[#dbd7cd] p-6 sm:p-10 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-stone-400 font-medium block mb-2">
            SYNTHESIZED BRAND MONOGRAPH • SPECIFICATION 01
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
            {brandStrategy.tagline || 'Autonomous brand architecture synthesized from first-principles conviction.'}
          </p>
        </div>

        {/* Actions: Save to Library & Start New */}
        <div className="no-print shrink-0 flex items-center gap-2">
          <button
            onClick={async () => {
              if (!isAuthenticated) {
                openAuthModal('save_gate');
                return;
              }
              setIsSaving(true);
              try {
                const res = await saveBrandToLibrary(brandKit);
                if (res?.success) {
                  setSavedSuccess(true);
                  setTimeout(() => setSavedSuccess(false), 3500);
                }
              } catch (e) {
                console.error(e);
              } finally {
                setIsSaving(false);
              }
            }}
            disabled={isSaving}
            className={`inline-flex items-center gap-1.5 text-xs px-4 py-2.5 rounded-full border transition-all ${
              savedSuccess
                ? 'bg-emerald-700 text-white border-emerald-800'
                : 'bg-white border-[#dbd7cd] hover:border-black text-black'
            }`}
            title="Save this brand kit to your library"
          >
            {isSaving ? (
              <span className="w-3.5 h-3.5 border-2 border-stone-300 border-t-black rounded-full animate-spin" />
            ) : savedSuccess ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Saved</span>
              </>
            ) : (
              <>
                <Bookmark className="w-3.5 h-3.5 stroke-[1.8]" />
                <span>Save to Library</span>
              </>
            )}
          </button>

          <button
            onClick={onStartNew}
            className="inline-flex items-center gap-2 bg-black text-white text-xs px-5 py-2.5 rounded-full hover:bg-neutral-800 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Brand</span>
          </button>
        </div>
      </div>

      {/* ── Segmented Tab Bar ── */}
      <div className="no-print mb-8">
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-2 gap-1.5 scrollbar-none">
          <div className="inline-flex p-1.5 bg-white rounded-full border border-[#dbd7cd] max-w-full">
            {TABS.map(({ id, label, Icon }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  id={`tab-${id}`}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                    isActive ? 'bg-black text-white' : 'text-stone-600 hover:text-black hover:bg-[#f2f1ed]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 stroke-[1.5]" />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Tab Content ── */}
      {activeTab === 'preview'   && <LivePreviewTab   {...tabProps} />}
      {activeTab === 'strategy'  && <BrandStrategyTab {...tabProps} />}
      {activeTab === 'manifesto' && <LaunchCopyTab    {...tabProps} />}

      {/* ── Floating Glassmorphism Export Toolbar ── */}
      <div className="no-print fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-2 px-4 py-3 rounded-full bg-white/80 backdrop-blur-md border border-stone-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.10)] transition-all">
          <span className="text-[10px] uppercase tracking-widest text-stone-400 font-medium pr-2 border-r border-stone-200 mr-1">Export</span>

          <button
            onClick={() => exportBrandKitJson(brandKit)}
            className="inline-flex items-center gap-1.5 text-xs text-stone-700 hover:text-black px-3 py-1.5 rounded-full hover:bg-[#f2f1ed] transition-all"
            title="Download tokens.json"
          >
            <Download className="w-3.5 h-3.5 text-stone-500" />
            <span>tokens.json</span>
          </button>

          <button
            onClick={() => exportCssTokens(brandKit)}
            className="inline-flex items-center gap-1.5 text-xs text-stone-700 hover:text-black px-3 py-1.5 rounded-full hover:bg-[#f2f1ed] transition-all"
            title="Download tokens.css"
          >
            <Code className="w-3.5 h-3.5 text-stone-500" />
            <span>tokens.css</span>
          </button>

          <button
            onClick={() => exportPaletteSvg(brandKit)}
            className="inline-flex items-center gap-1.5 text-xs text-stone-700 hover:text-black px-3 py-1.5 rounded-full hover:bg-[#f2f1ed] transition-all"
            title="Download SVG palette"
          >
            <Palette className="w-3.5 h-3.5 text-stone-500" />
            <span>palette.svg</span>
          </button>

          <div className="w-px h-4 bg-stone-200 mx-1" />

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 text-xs text-stone-700 hover:text-black px-3 py-1.5 rounded-full hover:bg-[#f2f1ed] transition-all"
            title="Print / Save PDF"
          >
            <Printer className="w-3.5 h-3.5 text-stone-500" />
            <span>Print PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}
