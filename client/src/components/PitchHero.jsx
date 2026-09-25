/**
 * PitchHero — Step 1: Conversational Chatbot & Initial Pitch Input (Hero Screen)
 * Location: client/src/components/PitchHero.jsx
 *
 * Dual-Mode Conversational Interface:
 *   1. Conversational Chatbot: Responds naturally to greetings, support questions, or banter.
 *   2. Brand Discovery Launcher: Automatically detects when a pitch is shared and triggers the 7-stage Socratic discovery.
 *   - Palette: bg-slate-50, border-slate-200, text-slate-900, text-slate-500
 *   - Live server & active LLM provider health status badge
 *   - Preset founder pitch cards for instant experimentation
 */

import React, { useState } from 'react';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Utensils,
  Scissors,
  Database,
  FileText,
  MessageSquare,
  Bot,
  User,
  Send
} from 'lucide-react';

const PRESET_PITCHES = [
  {
    icon: Utensils,
    category: "Culinary & Dining",
    title: "Wood-Fired Pizzeria",
    pitch: "A neighborhood wood-fired sourdough pizzeria with giant wooden sharing tables, kid-friendly open kitchen counter, and zero pretentious wine snobbery."
  },
  {
    icon: Scissors,
    category: "Apparel & Craft",
    title: "Raw Selvedge Denim",
    pitch: "An obsessive raw selvedge denim label weaving 14oz shuttle-loom jeans with natural indigo fades, chainstitched hems, and lifetime free repairs."
  },
  {
    icon: Database,
    category: "Developer Tools",
    title: "In-Memory Time-Series DB",
    pitch: "An ultra-low latency in-memory time series database built in Rust for high-frequency trading telemetry with zero garbage collection pauses."
  },
  {
    icon: FileText,
    category: "Career & B2B",
    title: "Minimalist Resume Builder",
    pitch: "A hyper-minimalist markdown resume compiler designed to survive the brutal 6-second scan of Silicon Valley engineering hiring managers."
  }
];

export default function PitchHero({
  pitch,
  chatMessages = [],
  onPitchChange,
  onStartDiscovery,
  onQuickPreview,
  serverHealth,
  isLoading
}) {
  const [localError, setLocalError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const clean = pitch.trim();
    if (!clean) {
      setLocalError('Please type a message or describe what you want to build.');
      return;
    }
    setLocalError('');
    onStartDiscovery(clean);
  };

  const handleSelectPreset = (presetPitch) => {
    onPitchChange(presetPitch);
    setLocalError('');
  };

  const providerName = (serverHealth?.provider || 'Groq').toUpperCase();
  const isHealthy = serverHealth?.status === 'ok';
  const hasChatHistory = chatMessages && chatMessages.length > 0;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-14 animate-fade-in">
      
      {/* ── System Status & Provider Pill ── */}
      <div className="flex items-center justify-center mb-6">
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-xs text-slate-600">
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isHealthy ? 'bg-emerald-400' : 'bg-amber-400'} opacity-75`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isHealthy ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
          </span>
          <span className="font-medium text-slate-800">
            {isHealthy ? `Backend Connected: ${providerName}` : 'Local Safe Mode'}
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-500">
            {serverHealth?.model ? serverHealth.model : 'Adaptive LLM Synthesis'}
          </span>
        </div>
      </div>

      {/* ── Hero Title & Introduction ── */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-md mb-3 border border-indigo-100">
          <Bot className="w-3.5 h-3.5" />
          Conversational Brand Partner & Token Compiler
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-3">
          Talk through your idea. <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 bg-clip-text text-transparent">
            Build an enduring brand identity.
          </span>
        </h1>
        
        <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Chat freely, ask questions, or describe what you want to create.
          Once you mention a product or company idea, we'll guide you through our Socratic discovery.
        </p>
      </div>

      {/* ── Conversational Chat Feed (Active when chat history exists) ── */}
      {hasChatHistory && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 mb-6 shadow-sm space-y-4 max-h-[380px] overflow-y-auto scrollbar-none animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
              Conversation Thread
            </span>
            <span className="text-[11px] text-indigo-600 font-medium">
              Intent Router Active
            </span>
          </div>

          {chatMessages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={idx}
                className={`flex gap-3 items-start ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] sm:max-w-[75%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-slate-900 text-white rounded-tr-sm shadow-sm'
                      : 'bg-slate-100 text-slate-900 border border-slate-200/80 rounded-tl-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-200 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Main Input Card ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-100/80 p-6 sm:p-8 mb-8 transition-all">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="pitchTextarea" className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                {hasChatHistory ? 'Reply or introduce your brand idea:' : 'What are you thinking of building? (Or say hello):'}
              </label>
              <span className="text-xs text-slate-400">
                {pitch.length > 0 ? `${pitch.length} chars` : 'Free-form conversation or pitch'}
              </span>
            </div>
            
            <textarea
              id="pitchTextarea"
              rows={hasChatHistory ? 2 : 3}
              value={pitch}
              onChange={(e) => {
                onPitchChange(e.target.value);
                if (localError) setLocalError('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder={
                hasChatHistory
                  ? "Type your reply or pitch here (Press Enter to send)..."
                  : "e.g. 'Hello', 'What is this?', or 'I want to build a raw denim clothing brand in Portland'..."
              }
              className="w-full p-3.5 sm:p-4 rounded-xl bg-slate-50/70 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm sm:text-base leading-relaxed resize-none transition-all shadow-inner"
              disabled={isLoading}
            />

            {localError && (
              <p className="mt-2 text-xs font-medium text-rose-600 flex items-center gap-1.5 animate-fade-in">
                <span>⚠️</span> {localError}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-[11px] sm:text-xs">
                Auto-routes greetings to chat; pitches trigger 7-stage discovery.
              </span>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              {onQuickPreview && (
                <button
                  type="button"
                  onClick={() => onQuickPreview(pitch)}
                  className="w-full sm:w-auto px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Quick Demo
                </button>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 active:bg-slate-950 rounded-lg transition-all shadow-md shadow-slate-900/10 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isLoading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Thinking...</span>
                  </>
                ) : (
                  <>
                    <span>{hasChatHistory ? 'Send Message' : 'Send'}</span>
                    <Send className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* ── Preset Inspiration Grid ── */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Or launch immediately with a preset concept:
          </span>
          <span className="text-xs text-slate-400">1-click test</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PRESET_PITCHES.map((preset, idx) => {
            const IconComponent = preset.icon;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(preset.pitch)}
                className="text-left p-3.5 rounded-xl bg-white border border-slate-200/80 hover:border-slate-400 hover:shadow-md transition-all group flex items-start gap-3"
              >
                <div className="p-2 rounded-lg bg-slate-100 text-slate-700 group-hover:bg-slate-900 group-hover:text-white transition-colors shrink-0">
                  <IconComponent className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-900">{preset.title}</span>
                    <span className="text-[10px] text-slate-400 uppercase font-medium">{preset.category}</span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    "{preset.pitch}"
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
