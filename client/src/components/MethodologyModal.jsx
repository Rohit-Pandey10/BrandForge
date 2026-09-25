import React, { useEffect } from 'react';
import { X, ArrowRight, Sparkles, ShieldAlert, Cpu, Terminal, Compass, CheckCircle2 } from 'lucide-react';

/**
 * MethodologyModal — Inkloom Editorial Handbook Architecture
 *
 * Explains why the Socratic Method escapes the "one-prompt trap"
 * and how BrandLoom engineers high-conviction identity systems.
 * Follows the Handhold Editorial aesthetic: warm cream paper (#FAF9F6),
 * hairline stone borders (#E5E0D8), Cormorant Garamond display serif, and Inter body text.
 */
export default function MethodologyModal({ isOpen, onClose }) {
  // Handle ESC key press
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Lock body scrolling when modal is active
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 bg-stone-950/60 backdrop-blur-md animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="methodology-title"
    >
      {/* Modal Card Surface */}
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-[28px] sm:rounded-[32px] bg-[#FAF9F6] border border-[#E5E0D8] shadow-2xl overflow-hidden text-zinc-900 transition-all font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header Bar */}
        <div className="sticky top-0 z-10 flex items-start justify-between p-6 sm:p-8 pb-4 bg-[#FAF9F6]/95 backdrop-blur-sm border-b border-[#E5E0D8]/80">
          <div className="pr-4">
            <span className="inline-block px-2.5 py-1 text-[11px] font-mono font-semibold tracking-[0.18em] uppercase rounded-full bg-amber-500/10 text-amber-900 border border-amber-500/20 mb-2.5">
              EDITORIAL ARCHITECTURE
            </span>
            <h2 
              id="methodology-title"
              className="text-2xl sm:text-4xl md:text-5xl font-light text-zinc-950 tracking-[-0.03em] leading-[1.05] font-serif"
            >
              The Socratic Method vs. The One-Prompt Trap
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-zinc-600 leading-relaxed max-w-xl">
              Why dumping an idea into an LLM produces generic fluff, and how BrandLoom engineers high-conviction identity systems.
            </p>
          </div>

          {/* Dismiss button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close guide"
            className="p-2 sm:p-2.5 rounded-full text-zinc-500 hover:text-zinc-900 hover:bg-stone-200/60 transition-colors shrink-0 cursor-pointer border border-transparent hover:border-[#E5E0D8]"
          >
            <X className="w-5 h-5 stroke-[1.8]" />
          </button>
        </div>

        {/* Scrollable Stage Breakdown */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 sm:space-y-8 divide-y divide-[#E5E0D8]/60">
          
          {/* Stage 01 */}
          <section className="space-y-4 pt-1 first:pt-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] font-semibold text-orange-600 tracking-wider">
                STAGE 01
              </span>
              <span className="text-stone-300">•</span>
              <h3 className="text-lg sm:text-xl font-medium text-zinc-900 tracking-tight font-serif">
                The Strategic BGM & Refinement Gate
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div className="p-4 sm:p-5 rounded-2xl bg-stone-100/70 border border-[#E5E0D8] space-y-1.5">
                <span className="text-[11px] font-mono uppercase tracking-wider text-rose-800 font-semibold flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                  The Problem (The One-Prompt Trap)
                </span>
                <p className="text-xs sm:text-[13px] text-zinc-700 leading-relaxed">
                  Raw founder ideas are often either too broad or hyper-literal, leaving generic AI models to hallucinate clichéd buzzwords and forgettable identities.
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E5E0D8] shadow-2xs space-y-1.5">
                <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-800 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  The System (BrandLoom Wedge)
                </span>
                <p className="text-xs sm:text-[13px] text-zinc-800 leading-relaxed">
                  Instead of hallucinating, our engine extracts the underlying commercial wedge and formulates two distinct, non-cringe strategic directions anchored in physical rituals, ingredients, or workflow realities.
                </p>
              </div>
            </div>
          </section>

          {/* Stage 02 */}
          <section className="space-y-4 pt-6">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] font-semibold text-orange-600 tracking-wider">
                STAGE 02
              </span>
              <span className="text-stone-300">•</span>
              <h3 className="text-lg sm:text-xl font-medium text-zinc-900 tracking-tight font-serif">
                7-Dimension Socratic Interrogation
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div className="p-4 sm:p-5 rounded-2xl bg-stone-100/70 border border-[#E5E0D8] space-y-1.5">
                <span className="text-[11px] font-mono uppercase tracking-wider text-rose-800 font-semibold flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                  The Problem (Static Forms)
                </span>
                <p className="text-xs sm:text-[13px] text-zinc-700 leading-relaxed">
                  Static forms and template drop-downs force pre-baked assumptions that strip away what makes your proposition uniquely defensible.
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E5E0D8] shadow-2xs space-y-1.5">
                <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-800 font-semibold flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-emerald-600" />
                  The System (Category Trade-Offs)
                </span>
                <p className="text-xs sm:text-[13px] text-zinc-800 leading-relaxed">
                  The engine dynamically authors 7 trade-off probes specific to your category (e.g., table pacing and cellar philosophy for hospitality; latency and zero-GC friction for developer tools). It isolates the <strong className="font-semibold text-zinc-950">“Sacred Cow”</strong>—the legacy industry compromise your brand refuses to make.
                </p>
              </div>
            </div>
          </section>

          {/* Stage 03 */}
          <section className="space-y-4 pt-6">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] font-semibold text-orange-600 tracking-wider">
                STAGE 03
              </span>
              <span className="text-stone-300">•</span>
              <h3 className="text-lg sm:text-xl font-medium text-zinc-900 tracking-tight font-serif">
                Algorithmic Token & Monograph Synthesis
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div className="p-4 sm:p-5 rounded-2xl bg-stone-100/70 border border-[#E5E0D8] space-y-1.5">
                <span className="text-[11px] font-mono uppercase tracking-wider text-rose-800 font-semibold flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                  The Problem (Superficial Aesthetics)
                </span>
                <p className="text-xs sm:text-[13px] text-zinc-700 leading-relaxed">
                  Standard AI tools output generic random hex codes and boilerplate copy that feel disconnected from actual customer touchpoints.
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E5E0D8] shadow-2xs space-y-1.5">
                <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-800 font-semibold flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-emerald-600" />
                  The System (Living Monograph)
                </span>
                <p className="text-xs sm:text-[13px] text-zinc-800 leading-relaxed">
                  Pulls exact vocabulary directly from the interview transcript to compile a living monograph: WCAG-tested color tokens, authentic Google Font pairings, voice boundaries (Dos & Don'ts), and an adaptive website preview.
                </p>
              </div>
            </div>
          </section>

          {/* Stage 04 */}
          <section className="space-y-4 pt-6">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] font-semibold text-orange-600 tracking-wider">
                STAGE 04
              </span>
              <span className="text-stone-300">•</span>
              <h3 className="text-lg sm:text-xl font-medium text-zinc-900 tracking-tight font-serif">
                Production-Ready Handoff
              </h3>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E5E0D8] shadow-2xs space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-orange-800 font-semibold flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-orange-600" />
                The System (Eliminate Design-to-Dev Lag)
              </span>
              <p className="text-xs sm:text-[13px] text-zinc-800 leading-relaxed">
                Instant export to <code className="font-mono bg-stone-100 text-stone-900 px-1.5 py-0.5 rounded text-[11px] border border-stone-200">tokens.json</code>, <code className="font-mono bg-stone-100 text-stone-900 px-1.5 py-0.5 rounded text-[11px] border border-stone-200">tokens.css</code>, printable executive PDF briefs, and tailored AI master prompts (for Bolt.new, v0, Lovable, Claude) to eliminate design-to-development lag.
              </p>
            </div>
          </section>

        </div>

        {/* Footer Bar */}
        <div className="p-4 sm:p-6 bg-[#FAF9F6] border-t border-[#E5E0D8] flex items-center justify-between gap-3">
          <span className="text-xs font-mono text-zinc-500 hidden sm:inline">
            Press <kbd className="px-1.5 py-0.5 rounded bg-stone-200/80 text-zinc-700 text-[10px] font-mono border border-stone-300">Esc</kbd> to dismiss
          </span>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#1a1a1a] hover:bg-zinc-800 text-white text-xs font-semibold tracking-wide transition-all shadow-xs cursor-pointer ml-auto"
          >
            Understood — Return to Studio
          </button>
        </div>
      </div>
    </div>
  );
}
