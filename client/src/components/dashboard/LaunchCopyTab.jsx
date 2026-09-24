/**
 * Launch Copy & Manifesto Tab — Manifesto, Hero Copy, Elevator Pitch, Social Hooks
 */

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function LaunchCopyTab({ brandStrategy, voiceSystem, visualTokens, launchContent }) {
  const [copiedId, setCopiedId] = useState(null);
  const typography = visualTokens?.typography || {};
  const { heroHeadline, heroSubheadline, callToAction, manifesto, elevatorPitch, socialHooks = [] } = launchContent || {};

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Manifesto */}
      <div className="bg-white rounded-[28px] border border-[#dbd7cd] p-6 sm:p-10 transition-all duration-200 hover:-translate-y-0.5">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#dbd7cd]">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-stone-400 font-medium block mb-1">CORE IDEOLOGY</span>
            <h3 className="font-serif text-2xl font-light text-black tracking-[-0.03em]">The Brand Manifesto</h3>
          </div>
          <button
            onClick={() => copyToClipboard(manifesto, 'manifesto')}
            className="text-xs text-stone-700 hover:text-black flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#dbd7cd] hover:border-black transition-colors"
          >
            {copiedId === 'manifesto' ? <Check className="w-3.5 h-3.5 text-black" /> : <Copy className="w-3.5 h-3.5 text-stone-500" />}
            <span>{copiedId === 'manifesto' ? 'Copied' : 'Copy Manifesto'}</span>
          </button>
        </div>
        <div
          className="font-serif text-xl sm:text-2xl text-black font-light leading-relaxed whitespace-pre-line italic border-l-2 border-black pl-6 sm:pl-8 py-2"
          style={{ fontFamily: typography.headingFont ? `'${typography.headingFont}', serif` : 'inherit' }}
        >
          "{manifesto || "We believe true category leaders don't blend in—they plant a flag, declare an enemy, and build with relentless conviction."}"
        </div>
      </div>

      {/* Hero Copy Specimen */}
      <div className="bg-white rounded-[28px] border border-[#dbd7cd] p-6 sm:p-8 transition-all duration-200 hover:-translate-y-0.5">
        <span className="text-[10px] uppercase tracking-widest text-stone-400 font-medium block mb-3">LAUNCH HEADLINE & PITCH</span>
        <h4
          className="font-serif text-3xl sm:text-4xl font-light text-black mb-3 leading-snug tracking-[-0.03em]"
          style={{ fontFamily: typography.headingFont ? `'${typography.headingFont}', serif` : 'inherit' }}
        >
          {heroHeadline}
        </h4>
        <p className="text-sm sm:text-base text-stone-600 mb-6 max-w-2xl leading-relaxed">{heroSubheadline}</p>
        <div className="pt-4 border-t border-[#dbd7cd]">
          <span className="text-[11px] uppercase tracking-wider text-stone-400 block mb-1">Elevator Pitch:</span>
          <p className="text-xs sm:text-sm text-stone-800 leading-relaxed">{elevatorPitch || brandStrategy?.coreValueProposition}</p>
        </div>
      </div>

      {/* Social Hooks Grid */}
      <div className="bg-white rounded-[28px] border border-[#dbd7cd] p-6 sm:p-8">
        <span className="text-[10px] uppercase tracking-widest text-stone-400 font-medium block mb-4">LAUNCH SOCIAL HOOKS (30-DAY CAMPAIGN)</span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {socialHooks.map((hook, idx) => (
            <div
              key={idx}
              className="bg-[#faf9f6] p-5 rounded-2xl border border-[#dbd7cd] flex flex-col justify-between gap-4 text-xs leading-relaxed transition-all duration-200 hover:-translate-y-0.5 hover:border-black/30"
            >
              <p className="text-stone-900 font-normal">"{hook}"</p>
              <div className="flex justify-between items-center pt-3 border-t border-[#dbd7cd]">
                <span className="text-[11px] text-stone-400 font-mono">Hook 0{idx + 1}</span>
                <button onClick={() => copyToClipboard(hook, `hook-${idx}`)} className="text-stone-500 hover:text-black transition-colors" title="Copy hook">
                  {copiedId === `hook-${idx}` ? <Check className="w-3.5 h-3.5 text-black" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
