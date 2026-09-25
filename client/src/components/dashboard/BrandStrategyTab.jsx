/**
 * Brand Strategy Tab — Audience Profile, Value Prop, Differentiator, Anti-Hero
 */

import React from 'react';

export default function BrandStrategyTab({ brandStrategy }) {
  const {
    targetAudience, coreValueProposition, antiHero, differentiator, mission
  } = brandStrategy || {};

  const cards = [
    {
      eyebrow: 'AUDIENCE FOUNDATION',
      title: 'Core Audience & Guest Profile',
      body: targetAudience,
      footnote: 'Identifies the distinct community who actively seek out this experience.'
    },
    {
      eyebrow: 'POSITIONING ANCHOR',
      title: 'Core Value Proposition',
      body: coreValueProposition,
      footnote: 'The primary transformational promise delivered directly to the core buyer.'
    },
    {
      eyebrow: 'IDEOLOGICAL OPPOSITION',
      title: 'The Industry Standard We Break',
      body: antiHero,
      footnote: 'Declares the tired industry compromise that gives the brand its reason to exist.'
    },
    {
      eyebrow: 'COMPETITIVE ADVANTAGE',
      title: 'The Distinct Edge',
      body: differentiator,
      footnote: 'The singular reason someone chooses this experience over any alternative.'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map(card => (
          <div key={card.eyebrow} className="bg-white rounded-[28px] border border-[#dbd7cd] p-6 sm:p-8 flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:border-black/30">
            <div>
              <span className="text-xs font-mono font-medium uppercase tracking-wider text-stone-400 block mb-2">{card.eyebrow}</span>
              <h3 className="font-serif text-2xl font-light text-black tracking-[-0.03em] mb-4">{card.title}</h3>
              <p className="text-sm text-stone-700 bg-[#fcfbf9] p-4 rounded-2xl border border-[#dbd7cd] leading-relaxed">{card.body}</p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#dbd7cd] text-xs text-stone-500">{card.footnote}</div>
          </div>
        ))}
      </div>

      {/* Mission */}
      <div className="bg-white rounded-[28px] border border-[#dbd7cd] p-6 sm:p-8 transition-all duration-200 hover:-translate-y-0.5">
        <span className="text-xs font-mono font-medium uppercase tracking-wider text-stone-400 block mb-2">PURPOSE & REACH</span>
        <h3 className="font-serif text-2xl font-light text-black tracking-[-0.03em] mb-3">Brand Mission</h3>
        <p className="text-base text-stone-800 leading-relaxed">{mission}</p>
      </div>
    </div>
  );
}
