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
import { Download, Palette, Code, Eye, Target, FileText, Printer, RotateCcw, Bookmark, Check, Sparkles, X, Copy } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

import LivePreviewTab      from './dashboard/LivePreviewTab';
import BrandStrategyTab   from './dashboard/BrandStrategyTab';
import LaunchCopyTab      from './dashboard/LaunchCopyTab';
import PrintBrandDossier  from './dashboard/PrintBrandDossier';
import { exportBrandKitJson, exportCssTokens, exportPaletteSvg, getAiPrompts } from '../utils/exportUtils';

const TABS = [
  { id: 'preview',   label: 'Live Website Preview',         Icon: Eye },
  { id: 'strategy',  label: 'Brand Strategy & Positioning', Icon: Target },
  { id: 'manifesto', label: 'Launch Manifesto & Copy',      Icon: FileText }
];

export default function BrandKitDashboard({ brandKit, onStartNew }) {
  const [activeTab, setActiveTab] = useState('preview');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [aiTab, setAiTab] = useState('copywriter');
  const [copiedPrompt, setCopiedPrompt] = useState(null);
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

  const aiPrompts = getAiPrompts(brandKit);
  const handleCopyPrompt = (key) => {
    const text = aiPrompts[key] || '';
    navigator.clipboard?.writeText(text);
    setCopiedPrompt(key);
    setTimeout(() => setCopiedPrompt(null), 2500);
  };

  const AI_TABS = [
    { id: 'copywriter',  label: 'Copywriter (ChatGPT / Claude)', promptKey: 'chatGptCopywriterSystemPrompt' },
    { id: 'midjourney',  label: 'Midjourney Photography',         promptKey: 'midjourneyProductShootPrompt' },
    { id: 'ui',          label: 'UI Builder (v0 / Cursor)',        promptKey: 'cursorV0UiGenerationPrompt' },
  ];

  const tabProps = { brandStrategy, voiceSystem, visualTokens, launchContent, brandKit, kit: brandKit };

  return (
    <>
    {/* ── Interactive Screen Dashboard ── */}
    <div className="screen-dashboard-container w-full max-w-6xl mx-auto px-4 py-4 sm:py-8 animate-fade-in pb-32 font-sans text-zinc-900">

      {/* ── Editorial Identity Header ── */}
      <div className="liquid-glass-card rounded-[32px] p-6 sm:p-10 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all">
        <div>
          <span className="text-xs uppercase tracking-wider text-orange-600 font-semibold font-mono block mb-2">
            SYNTHESIZED BRAND MONOGRAPH • SPECIFICATION 01
          </span>
          <h1
            className="text-4xl sm:text-6xl font-light text-zinc-900 tracking-[-0.03em] leading-tight mb-2"
            style={{ fontFamily: typography.headingFont ? `'${typography.headingFont}', serif` : 'inherit' }}
          >
            {brandName}
          </h1>
          <p
            className="text-sm sm:text-base text-zinc-600 max-w-2xl font-normal leading-relaxed"
            style={{ fontFamily: typography.bodyFont ? `'${typography.bodyFont}', sans-serif` : 'inherit' }}
          >
            {brandStrategy.tagline || 'Autonomous brand architecture synthesized from first-principles conviction.'}
          </p>
        </div>

        {/* Actions: Save to Library & Start New */}
        <div className="no-print shrink-0 flex items-center gap-2.5">
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
            className={`inline-flex items-center gap-1.5 text-xs px-4 py-2.5 rounded-xl border transition-all cursor-pointer font-semibold shadow-2xs ${
              savedSuccess
                ? 'bg-emerald-600 text-white border-emerald-700'
                : 'bg-white border-zinc-200 hover:border-zinc-400 text-zinc-800'
            }`}
            title="Save this brand kit to your library"
          >
            {isSaving ? (
              <span className="w-3.5 h-3.5 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
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
            className="inline-flex items-center gap-2 bg-[#1a1a1a] text-white text-xs px-5 py-2.5 rounded-xl hover:bg-zinc-800 transition-all font-semibold shadow-xs cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Brand</span>
          </button>
        </div>
      </div>

      {/* ── Segmented Tab Bar (Liquid Glass Pill Design) ── */}
      <div className="no-print mb-8">
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-2 gap-1.5 scrollbar-none">
          <div className="inline-flex p-1.5 liquid-glass-card rounded-full max-w-full gap-1">
            {TABS.map(({ id, label, Icon }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  id={`tab-${id}`}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 px-4 sm:px-6 py-2 rounded-full text-xs transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#1a1a1a] text-white shadow-xs font-semibold'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-white/60 font-medium'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 stroke-[1.8] ${isActive ? 'text-orange-400' : 'text-zinc-400'}`} />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Tab Content ── */}
      {activeTab === 'preview' && (
        <div className="liquid-glass-card rounded-[36px] p-4 sm:p-8">
          <LivePreviewTab {...tabProps} />
        </div>
      )}
      {activeTab === 'strategy'  && <BrandStrategyTab {...tabProps} />}
      {activeTab === 'manifesto' && <LaunchCopyTab    {...tabProps} />}

      {/* ── Floating Glassmorphism Export Toolbar ── */}
      <div className="no-print fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl liquid-glass-card shadow-xl transition-all">
          <span className="text-xs uppercase font-mono tracking-widest text-zinc-500 font-semibold pr-2 border-r border-zinc-300 mr-1">
            Export
          </span>

          <button
            onClick={() => exportBrandKitJson(brandKit)}
            className="inline-flex items-center gap-1.5 text-xs text-zinc-700 hover:text-zinc-900 px-3 py-1.5 rounded-xl hover:bg-zinc-100 transition-all font-medium cursor-pointer"
            title="Download tokens.json"
          >
            <Download className="w-3.5 h-3.5 text-zinc-400" />
            <span>tokens.json</span>
          </button>

          <button
            onClick={() => exportCssTokens(brandKit)}
            className="inline-flex items-center gap-1.5 text-xs text-zinc-700 hover:text-zinc-900 px-3 py-1.5 rounded-xl hover:bg-zinc-100 transition-all font-medium cursor-pointer"
            title="Download tokens.css"
          >
            <Code className="w-3.5 h-3.5 text-zinc-400" />
            <span>tokens.css</span>
          </button>

          <button
            onClick={() => exportPaletteSvg(brandKit)}
            className="inline-flex items-center gap-1.5 text-xs text-zinc-700 hover:text-zinc-900 px-3 py-1.5 rounded-xl hover:bg-zinc-100 transition-all font-medium cursor-pointer"
            title="Download SVG palette"
          >
            <Palette className="w-3.5 h-3.5 text-zinc-400" />
            <span>palette.svg</span>
          </button>

          <div className="w-px h-4 bg-zinc-200 mx-1" />

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 text-xs text-zinc-700 hover:text-zinc-900 px-3 py-1.5 rounded-xl hover:bg-zinc-100 transition-all font-medium cursor-pointer"
            title="Print / Save PDF"
          >
            <Printer className="w-3.5 h-3.5 text-zinc-400" />
            <span>Print PDF</span>
          </button>

          <div className="w-px h-4 bg-zinc-200 mx-1" />

          {/* AI Prompts button */}
          <button
            onClick={() => setAiDrawerOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-xl transition-all shadow-xs cursor-pointer active:scale-95"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff' }}
            title="AI Master Prompts"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
            <span>AI Prompts</span>
          </button>
        </div>
      </div>
    </div>

    {/* ── AI Prompts Drawer Modal ── */}
    {aiDrawerOpen && (
      <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center" onClick={() => setAiDrawerOpen(false)}>
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        {/* Panel */}
        <div
          className="relative w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-t-3xl sm:rounded-3xl border border-zinc-200 shadow-2xl animate-fade-in"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-zinc-100">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <h2 className="text-sm font-bold text-zinc-900">AI Master Prompts</h2>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">Copy and paste into ChatGPT, Claude, Midjourney, or v0 to extend this brand kit.</p>
            </div>
            <button onClick={() => setAiDrawerOpen(false)} className="p-1.5 rounded-lg hover:bg-zinc-100 transition-all cursor-pointer">
              <X className="w-4 h-4 text-zinc-500" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1.5 px-6 pt-4">
            {AI_TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setAiTab(t.id)}
                className={`text-xs px-3.5 py-1.5 rounded-xl transition-all font-medium cursor-pointer ${
                  aiTab === t.id ? 'bg-[#1a1a1a] text-white shadow-xs' : 'text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Prompt area */}
          {AI_TABS.map(t => aiTab === t.id && (
            <div key={t.id} className="px-6 py-4">
              <div className="relative">
                <pre className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 text-xs font-mono text-zinc-800 leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto">
                  {aiPrompts[t.promptKey]}
                </pre>
                <button
                  onClick={() => handleCopyPrompt(t.promptKey)}
                  className="absolute top-3 right-3 inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl transition-all font-medium shadow-2xs cursor-pointer"
                  style={{
                    background: copiedPrompt === t.promptKey ? '#ecfdf5' : '#fff',
                    border: `1px solid ${copiedPrompt === t.promptKey ? '#6ee7b7' : '#e4e4e7'}`,
                    color: copiedPrompt === t.promptKey ? '#059669' : '#18181b'
                  }}
                >
                  {copiedPrompt === t.promptKey
                    ? <><Check className="w-3 h-3" /><span>Copied!</span></>
                    : <><Copy className="w-3 h-3 text-zinc-400" /><span>Copy Prompt</span></>
                  }
                </button>
              </div>
              <p className="text-xs text-zinc-500 font-mono mt-2 leading-relaxed">
                {t.id === 'copywriter' && 'Paste as a System Prompt in ChatGPT, Claude, or Gemini.'}
                {t.id === 'midjourney' && 'Paste directly into Midjourney /imagine or DALL·E 3.'}
                {t.id === 'ui' && 'Paste into v0.dev or Cursor Composer to scaffold a new page.'}
              </p>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* ── Hidden on screen; renders only via @media print ── */}
    <PrintBrandDossier kit={brandKit} />
    </>
  );
}
