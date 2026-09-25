/**
 * IntakeView.jsx — Neo-Brutalist Pop-Art Hero Section for BrandForge
 * Location: client/src/components/IntakeView.jsx
 *
 * Design System (Neo-Brutalism):
 * - Background: Full-screen vibrant orange (bg-orange-500).
 * - Abstract Background Shapes:
 *     * Large maroon curve clipping top-left corner.
 *     * Massive maroon semi-circle clipping the middle-right.
 *     * Subtle lighter orange circles floating in the background.
 * - Center Content:
 *     * Title: "BrandForge" in massive, bold black typography (text-7xl to text-9xl+ font-black text-black).
 *     * Subtitle: "Description" (text-xl text-black font-bold text-center).
 * - The Input Area:
 *     * Wide pill-shaped text input (rounded-full, bg-white, border-4 border-black) with placeholder "Enter text".
 *     * Perfect circular submit button (rounded-full, w-14 h-14, bg-white, border-4 border-black) positioned right next to it.
 * - Decorative Graphics (Bottom-Left):
 *     * Tilted green square with black wavy line inside (border-4 border-black).
 *     * Red square inside a white rounded frame (border-4 border-black).
 * - Functional:
 *     * Captures initialPitch and triggers onStartInterview / onStartDiscovery into Socratic discovery.
 *     * Displays conversational chatbot feedback if the user inputs greetings like "Hello".
 */

import React, { useState } from 'react';
import { ArrowRight, Bot, Loader2 } from 'lucide-react';

export default function IntakeView({
  pitch: externalPitch,
  onPitchChange,
  onStartInterview,
  onStartDiscovery,
  chatMessages = [],
  isLoading = false,
  subtitle = "Description"
}) {
  const [internalPitch, setInternalPitch] = useState('');
  const [error, setError] = useState('');

  // Support controlled or uncontrolled pitch state
  const currentPitch = externalPitch !== undefined ? externalPitch : internalPitch;

  const handleTextChange = (e) => {
    const val = e.target.value;
    if (onPitchChange) onPitchChange(val);
    else setInternalPitch(val);
    if (error) setError('');
  };

  const submitHandler = onStartInterview || onStartDiscovery;

  const handleSubmit = (e) => {
    e?.preventDefault();
    const clean = String(currentPitch || '').trim();
    if (!clean) {
      setError('Please enter your idea or message.');
      return;
    }
    setError('');
    if (submitHandler) {
      submitHandler(clean);
    }
  };

  // If the conversational intent router sent back a chat message, find the latest assistant reply
  const latestChatMessage = chatMessages && chatMessages.length > 0
    ? [...chatMessages].reverse().find(m => m.role === 'assistant')
    : null;

  return (
    <div className="relative w-full min-h-screen bg-orange-500 overflow-hidden flex flex-col justify-center items-center px-4 py-16 select-none font-sans">
      
      {/* ========================================================================= */}
      {/* ── ABSTRACT OVERSIZED BACKGROUND SHAPES ──                              */}
      {/* ========================================================================= */}

      {/* 1. Large Maroon Curve (Clipping Top-Left) */}
      <div
        className="absolute -top-32 -left-32 sm:-top-44 sm:-left-44 md:-top-56 md:-left-56 w-[380px] h-[380px] sm:w-[520px] sm:h-[520px] md:w-[680px] md:h-[680px] bg-[#610316] rounded-full pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* 2. Massive Maroon Semi-Circle (Clipping Middle-Right) */}
      <div
        className="absolute -right-32 sm:-right-48 md:-right-64 top-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[580px] sm:h-[580px] md:w-[740px] md:h-[740px] bg-[#610316] rounded-full pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* 3. Subtle Lighter Orange Decorative Circles in Background */}
      <div
        className="absolute top-[18%] left-[28%] w-64 h-64 sm:w-96 sm:h-96 bg-orange-400/40 rounded-full pointer-events-none z-0"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-[16%] left-[42%] w-52 h-52 sm:w-72 sm:h-72 bg-orange-400/35 rounded-full pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* ========================================================================= */}
      {/* ── CENTER CONTENT: TITLE, SUBTITLE & PILL INPUT ──                      */}
      {/* ========================================================================= */}
      <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center text-center mt-6 sm:mt-0">
        
        {/* Main Title: "BrandForge" (Massive, Bold, Black Sans-Serif) */}
        <h1 className="text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] font-black text-black tracking-tight leading-[0.95] drop-shadow-sm select-none">
          BrandForge
        </h1>

        {/* Subtitle: "Description" */}
        <p className="text-xl sm:text-2xl font-bold text-black tracking-wide mt-4 mb-8 select-none">
          {subtitle}
        </p>

        {/* Conversational Assistant Response Bubble (If user chatted e.g. "Hello") */}
        {latestChatMessage && (
          <div className="mb-6 w-full max-w-lg p-4 bg-white border-4 border-black rounded-2xl shadow-[4px_4px_0px_0px_#000000] text-left animate-fade-in flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#ef4444] border-2 border-black text-white flex items-center justify-center shrink-0 font-black text-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500 block mb-0.5">
                BrandForge AI Partner
              </span>
              <p className="text-sm font-bold text-black leading-snug">
                {latestChatMessage.content}
              </p>
            </div>
          </div>
        )}

        {/* The Input Area: Pill Input + Circular Submit Button */}
        <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto">
          <div className="flex items-center justify-center gap-3 w-full">
            
            {/* The Text Input: Wide, Pill-Shaped, White with Thick Black Border */}
            <div className="relative flex-1">
              <input
                type="text"
                value={currentPitch}
                onChange={handleTextChange}
                placeholder="Enter text"
                disabled={isLoading}
                className="w-full px-7 py-4 text-base sm:text-lg font-bold text-black placeholder:text-neutral-500 placeholder:font-bold bg-white border-4 border-black rounded-full shadow-[4px_4px_0px_0px_#000000] focus:outline-none focus:ring-0 active:translate-x-0.5 active:translate-y-0.5 transition-all"
              />
            </div>

            {/* The Submit Button: Perfect Circle, White with Thick Black Border */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white border-4 border-black shadow-[4px_4px_0px_0px_#000000] flex items-center justify-center shrink-0 hover:bg-neutral-100 hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 transition-all cursor-pointer group disabled:opacity-70 disabled:cursor-not-allowed"
              title="Submit to BrandForge"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 text-black animate-spin" />
              ) : (
                <ArrowRight className="w-6 h-6 text-black stroke-[3.5] group-hover:translate-x-0.5 transition-transform" />
              )}
            </button>

          </div>

          {error && (
            <div className="mt-3 px-4 py-1.5 bg-white border-2 border-black rounded-full inline-block shadow-[2px_2px_0px_0px_#000000]">
              <span className="text-xs font-black text-black">⚠️ {error}</span>
            </div>
          )}
        </form>

      </div>

      {/* ========================================================================= */}
      {/* ── DECORATIVE GRAPHICS (BOTTOM LEFT) ──                                  */}
      {/* ========================================================================= */}
      <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 flex items-end gap-3.5 z-20 pointer-events-none">
        
        {/* 1. Tilted Green Square with Wavy Line Inside */}
        <div
          className="w-14 h-14 sm:w-16 sm:h-16 bg-[#22c55e] border-4 border-black rounded-lg -rotate-12 flex items-center justify-center shadow-[4px_4px_0px_0px_#000000] transition-transform"
          aria-hidden="true"
        >
          <svg
            className="w-8 h-8 text-black"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          >
            <path d="M2 12c3-4 6-4 9 0s6 4 9 0" />
          </svg>
        </div>

        {/* 2. Red Square Inside White Rounded Frame */}
        <div
          className="p-2.5 sm:p-3 bg-white border-4 border-black rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_#000000] rotate-6 transition-transform"
          aria-hidden="true"
        >
          <div className="w-7 h-7 sm:w-9 sm:h-9 bg-[#ef4444] border-4 border-black rounded-sm" />
        </div>

      </div>

    </div>
  );
}
