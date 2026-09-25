import React, { useState } from 'react';
import Header from './Header.jsx';
import Hero from './Hero.jsx';
import Features from './Features.jsx';
import HowItWorks from './HowItWorks.jsx';
import { ArrowRight, Sparkles, Shield, Zap, Globe, Heart } from 'lucide-react';

/**
 * LandingPage Component (Main Page)
 * Assembles:
 *  - Header (Sticky navigation, Logo with 4-point star, ghost login, dark sign up)
 *  - Hero (Relative container, gradient headline, wide pill input, tilted floating cards)
 *  - Features (3-column white cards: AI Brand Intelligence, Complete Identity Suite, Refine Iteratively)
 *  - How It Works (3-column white cards: STEP 01 Describe, STEP 02 Generate, STEP 03 Refine & Export)
 *  - High-converting SaaS CTA Section
 *  - Clean, accessible SaaS Footer
 */
export default function LandingPage({
  pitch: externalPitch,
  onPitchChange,
  onStartDiscovery,
  isLoading: externalLoading = false
}) {
  const [internalPitch, setInternalPitch] = useState('');
  const [localLoading, setLocalLoading] = useState(false);

  const pitch = externalPitch !== undefined ? externalPitch : internalPitch;
  const isLoading = externalLoading || localLoading;

  const handlePitchChange = (val) => {
    if (onPitchChange) onPitchChange(val);
    else setInternalPitch(val);
  };

  const handleHeroSubmit = (submittedPitch) => {
    const clean = (submittedPitch || pitch).trim();
    if (!clean) return;
    if (onStartDiscovery) {
      onStartDiscovery(clean);
    } else {
      setLocalLoading(true);
      console.log('Forging brand for:', clean);
      setTimeout(() => setLocalLoading(false), 1200);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfaf9] text-zinc-900 font-sans selection:bg-orange-500 selection:text-white flex flex-col justify-between antialiased">
      
      {/* ── Component 1: Header ── */}
      <Header
        onLogin={() => alert('Login modal / route')}
        onSignUp={() => alert('Sign up modal / route')}
        onReset={() => setPitch('')}
      />

      <main className="flex-1">
        
        {/* ── Component 2: Hero Section ── */}
        <Hero
          pitch={pitch}
          onPitchChange={handlePitchChange}
          onSubmit={handleHeroSubmit}
          isLoading={isLoading}
        />

        {/* ── Trusted / Metric Bar (Subtle SaaS Micro-Proof) ── */}
        <section className="py-10 border-y border-zinc-200/50 bg-[#f8f6f3]/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-xs font-semibold tracking-wider text-zinc-400 uppercase mb-6">
              Empowering next-generation founders, indie hackers &amp; creative studios
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16 opacity-75 grayscale hover:grayscale-0 transition-all duration-300">
              <span className="font-bold text-lg tracking-tight text-zinc-700">StudioPulse</span>
              <span className="font-bold text-lg tracking-tight text-zinc-700">AuraCraft</span>
              <span className="font-bold text-lg tracking-tight text-zinc-700">VectorLab</span>
              <span className="font-bold text-lg tracking-tight text-zinc-700">HyperScale</span>
              <span className="font-bold text-lg tracking-tight text-zinc-700">Monolith.ai</span>
            </div>
          </div>
        </section>

        {/* ── Component 3: Features Section ── */}
        <Features />

        {/* ── Component 4: How It Works Section ── */}
        <HowItWorks />

        {/* ── High-Converting Bottom CTA Section ── */}
        <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto bg-white rounded-3xl border border-zinc-200/70 p-8 sm:p-14 md:p-16 text-center shadow-sm relative overflow-hidden">
            {/* Background Warm Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-orange-100/40 via-red-50/20 to-transparent rounded-full blur-3xl pointer-events-none -z-0" />
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f4efe8] border border-stone-200/80 mb-6">
                <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                <span className="text-xs font-semibold tracking-wider text-zinc-700 uppercase">
                  Launch In Minutes
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-900 tracking-tight leading-tight mb-5">
                Ready to forge your{' '}
                <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  distinct brand
                </span>
                ?
              </h2>

              <p className="text-base sm:text-lg text-zinc-500 max-w-xl mx-auto mb-8 leading-relaxed">
                Join thousands of creators who turn rough ideas into investor-ready brand guidelines and production-ready design tokens.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    const input = document.querySelector('input');
                    if (input) input.focus();
                  }}
                  className="w-full sm:w-auto bg-[#1a1a1a] hover:bg-zinc-800 text-white font-medium text-sm sm:text-base px-8 py-3.5 rounded-xl transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Start Forging Free</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="#features"
                  className="w-full sm:w-auto px-6 py-3.5 text-sm sm:text-base font-medium text-zinc-700 hover:text-zinc-900 hover:bg-stone-100 rounded-xl transition-colors text-center"
                >
                  Explore features
                </a>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-zinc-200/60 bg-white/60 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-zinc-500">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white fill-current" viewBox="0 0 24 24">
                <path d="M12 2L14.6 9.4L22 12L14.6 14.6L12 22L9.4 14.6L2 12L9.4 9.4L12 2Z" />
              </svg>
            </div>
            <span className="font-bold text-zinc-900">
              Brand<span className="text-orange-500">Forge</span>
            </span>
            <span className="text-zinc-400">© {new Date().getFullYear()}</span>
          </div>

          <div className="flex items-center gap-6 text-xs sm:text-sm">
            <a href="#features" className="hover:text-zinc-900 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-zinc-900 transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-zinc-900 transition-colors">Pricing</a>
            <a href="#docs" className="hover:text-zinc-900 transition-colors">Documentation</a>
            <a href="#" className="hover:text-zinc-900 transition-colors">Privacy</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
