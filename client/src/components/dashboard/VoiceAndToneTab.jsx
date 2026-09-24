/**
 * Voice & Tone Tab — Archetype, Dos/Don'ts, Brand Lexicon
 */

import React from 'react';

export default function VoiceAndToneTab({ voiceSystem }) {
  const { archetype, tone = [], dos = [], donts = [], vocabularyWords = [] } = voiceSystem || {};

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white rounded-[28px] border border-[#dbd7cd] p-6 sm:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#dbd7cd]">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-stone-400 font-medium block mb-1">VERBAL IDENTITY</span>
            <h3 className="font-serif text-3xl font-light text-black tracking-[-0.03em]">
              Voice Archetype: {archetype || 'The Rebel'}
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {tone.map((t, idx) => (
              <span key={idx} className="px-3.5 py-1 rounded-full border border-[#dbd7cd] bg-[#fcfbf9] text-xs text-black font-medium">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Dos & Don'ts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          <div className="p-5 rounded-2xl bg-[#faf9f6] border border-[#dbd7cd]/80">
            <span className="text-xs uppercase tracking-wider text-black font-medium block mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-black inline-block" />
              <span>Voice Dos (Speak Like This)</span>
            </span>
            <ul className="space-y-3 text-xs sm:text-sm text-stone-700">
              {dos.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-stone-400 mt-2 shrink-0" />
                  <span className="leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-[#faf9f6] border border-[#dbd7cd]/80">
            <span className="text-xs uppercase tracking-wider text-black font-medium block mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-stone-400 inline-block" />
              <span>Voice Don'ts (Banned Habits)</span>
            </span>
            <ul className="space-y-3 text-xs sm:text-sm text-stone-700">
              {donts.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="text-xs font-mono text-stone-500 leading-none mt-0.5">&times;</span>
                  <span className="leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Lexicon */}
        <div className="pt-6 mt-6 border-t border-[#dbd7cd]">
          <span className="text-xs uppercase tracking-wider text-stone-500 block mb-3">
            Signature Brand Lexicon (Power Words)
          </span>
          <div className="flex flex-wrap gap-2">
            {vocabularyWords.map((word, idx) => (
              <span key={idx} className="px-3.5 py-1.5 rounded-full border border-[#dbd7cd] bg-white text-xs font-sans text-stone-900 transition-all duration-200 hover:border-black hover:bg-[#f2f1ed]">
                {word}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
