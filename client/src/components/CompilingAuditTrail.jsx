/**
 * CompilingAuditTrail — Step 3: Synthesis & "Audit Trail" Progress Screen
 * Location: client/src/components/CompilingAuditTrail.jsx
 *
 * Rendered while POST /api/interview/compile is resolving:
 *   - Sleek animated loading state
 *   - Displays domain classification badge
 *   - Dynamic audit trail animating through the 7 discovery pillars:
 *     1. The Beachhead ICP
 *     2. The Incumbent Anti-Hero
 *     3. Core Operational Friction
 *     4. Unfair Advantage & Moat
 *     5. Visual Archetype & Tokens
 *     6. Voice & Tone Guardrails
 *     7. Price & High-Commitment Anchor
 */

import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle, Loader2, Compass, Shield, Palette, Volume2, DollarSign, Target, Flame } from 'lucide-react';

const AUDIT_PILLARS = [
  { id: 1, label: 'Beachhead ICP', icon: Target, desc: 'Isolating high-urgency early adopters...' },
  { id: 2, label: 'Incumbent Anti-Hero', icon: Flame, desc: 'Targeting status-quo compromises to oppose...' },
  { id: 3, label: 'Core Friction', icon: Shield, desc: 'Defining the unaddressed market pain-point...' },
  { id: 4, label: 'Unfair Advantage', icon: Compass, desc: 'Establishing moat & defensible differentiator...' },
  { id: 5, label: 'Visual Archetype', icon: Palette, desc: 'Harmonizing 5-color palette & typography pairing...' },
  { id: 6, label: 'Voice Guardrails', icon: Volume2, desc: 'Banning category clichés and authoring tone dos & donts...' },
  { id: 7, label: 'Price & Positioning', icon: DollarSign, desc: 'Anchoring premium value proposition and launch copy...' }
];

export default function CompilingAuditTrail({ initialPitch = '' }) {
  const [completedSteps, setCompletedSteps] = useState([1]);
  const [activeStep, setActiveStep] = useState(2);

  // Classify domain from pitch text for display
  const detectDomainLabel = (text = '') => {
    const lower = text.toLowerCase();
    if (/(jeans|denim|apparel|clothing|fashion|wear)/i.test(lower)) return 'Apparel & Craft';
    if (/(restaurant|food|pizza|dining|culinary|chef|bistro|cafe)/i.test(lower)) return 'Hospitality & Dining';
    if (/(sql|database|rust|in-memory|backend|api|dev|compiler|code)/i.test(lower)) return 'Developer Tools & Infra';
    if (/(fitness|wellness|health|nutrition|yoga)/i.test(lower)) return 'Wellness & Health';
    if (/(resume|cv|career|job|hiring)/i.test(lower)) return 'Career & Professional';
    return 'Modern Enterprise & Consumer';
  };

  const domainLabel = detectDomainLabel(initialPitch);

  // Progressive milestone animation timer to provide engaging visual feedback
  useEffect(() => {
    const intervals = [
      setTimeout(() => { setCompletedSteps(prev => [...prev, 2]); setActiveStep(3); }, 800),
      setTimeout(() => { setCompletedSteps(prev => [...prev, 3]); setActiveStep(4); }, 1800),
      setTimeout(() => { setCompletedSteps(prev => [...prev, 4]); setActiveStep(5); }, 3000),
      setTimeout(() => { setCompletedSteps(prev => [...prev, 5]); setActiveStep(6); }, 4400),
      setTimeout(() => { setCompletedSteps(prev => [...prev, 6]); setActiveStep(7); }, 6000),
    ];

    return () => intervals.forEach(clearTimeout);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-12 sm:py-16 text-center animate-fade-in">
      
      {/* ── Spinning Pulse Indicator ── */}
      <div className="relative inline-flex items-center justify-center w-20 h-20 mb-8">
        <div className="absolute inset-0 rounded-full bg-indigo-500/10 animate-ping"></div>
        <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-slate-900 text-white shadow-xl">
          <Sparkles className="w-8 h-8 text-indigo-400 animate-pulse" />
        </div>
      </div>

      {/* ── Headline & Domain Tag ── */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 mb-3">
        <span>Domain Archetype:</span>
        <span className="text-indigo-600 font-bold">{domainLabel}</span>
      </div>

      <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
        Synthesizing Brand Architecture
      </h2>
      <p className="text-slate-500 text-sm max-w-md mx-auto mb-10 leading-relaxed">
        Compiling your Socratic transcript into strategic pillars, anti-hero boundaries,
        mathematically balanced color tokens, and launch copy.
      </p>

      {/* ── 7-Pillar Audit Trail Grid ── */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl shadow-slate-100 p-6 sm:p-8 text-left space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Synthesis Audit Trail
          </span>
          <span className="text-xs text-indigo-600 font-semibold flex items-center gap-1.5">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Analyzing LLM Token Streams
          </span>
        </div>

        <div className="space-y-3">
          {AUDIT_PILLARS.map((pillar) => {
            const isCompleted = completedSteps.includes(pillar.id);
            const isActive = activeStep === pillar.id;
            const Icon = pillar.icon;

            return (
              <div
                key={pillar.id}
                className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                  isCompleted
                    ? 'bg-slate-50/80 border border-slate-200/60'
                    : isActive
                    ? 'bg-indigo-50/70 border border-indigo-200 shadow-sm'
                    : 'opacity-40 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isCompleted
                        ? 'bg-emerald-100 text-emerald-700'
                        : isActive
                        ? 'bg-indigo-600 text-white animate-pulse'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      <span>{pillar.label}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {pillar.desc}
                    </p>
                  </div>
                </div>

                <div>
                  {isCompleted ? (
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                  ) : isActive ? (
                    <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-200 block" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
