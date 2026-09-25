/**
 * App.jsx — Brand Builder Frontend Orchestrator
 * Location: client/src/App.jsx
 *
 * Implements the 4-step state machine:
 *   1. PITCH      -> PitchHero (Clean B2B SaaS landing screen with pitch input)
 *   2. DISCOVERY  -> SocraticWizard (7-stage card interrogation flow)
 *   3. COMPILING  -> CompilingAuditTrail (Synthesis progress with domain & 7-pillar audit)
 *   4. BRAND_KIT  -> BentoBrandKitDashboard (Dynamic CSS tokens, theme previewer, strategy & manifesto)
 */

import React from 'react';
import { Sparkles, Layers, ArrowLeft, Download, Code2, Palette, Printer, RotateCcw } from 'lucide-react';
import useBrandDiscovery, { STEPS } from './hooks/useBrandDiscovery.js';
import Header from './components/Header.jsx';
import LandingPage from './components/LandingPage.jsx';
import IntakeView from './components/IntakeView.jsx';
import SocraticWizard from './components/SocraticWizard.jsx';
import CompilingAuditTrail from './components/CompilingAuditTrail.jsx';
import BentoBrandKitDashboard from './components/BentoBrandKitDashboard.jsx';
import { exportBrandKitJson, exportCssTokens, exportPaletteSvg } from './utils/exportUtils.js';

export default function App() {
  const {
    currentStep,
    initialPitch,
    chatMessages,
    questions,
    currentQuestionIndex,
    userAnswers,
    brandKit,
    isLoading,
    isCompiling,
    serverHealth,
    error,
    setInitialPitch,
    startDiscovery,
    answerQuestion,
    goToQuestion,
    compileKit,
    loadMockPreview,
    resetDiscovery
  } = useBrandDiscovery();

  // Step 1: Render the complete BrandForge Landing Page matching the warm design system
  if (currentStep === STEPS.PITCH) {
    return (
      <LandingPage
        pitch={initialPitch}
        onPitchChange={setInitialPitch}
        onStartDiscovery={startDiscovery}
        isLoading={isLoading}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfaf9] text-zinc-900 flex flex-col justify-between selection:bg-orange-500 selection:text-white font-sans antialiased overflow-x-hidden">
      
      {/* ── Top Header for Wizard & Dashboard ── */}
      <Header
        stage={currentStep === STEPS.DISCOVERY ? 'interview' : 'dashboard'}
        onReset={resetDiscovery}
        onSkipToSynthesis={() => compileKit()}
        onPreviewMock={() => loadMockPreview('A minimalist artisanal sourdough pizzeria with communal tables and open crust counter')}
        onExportJson={() => brandKit && exportBrandKitJson(brandKit)}
        onExportCss={() => brandKit && exportCssTokens(brandKit)}
        onExportSvg={() => brandKit && exportPaletteSvg(brandKit)}
        onPrintPdf={() => window.print()}
      />

      {/* ── Main Dynamic Stage Canvas ── */}
      <main className="flex-1 flex flex-col justify-center">
        
        {/* Step 1: Neo-Brutalist BrandForge Hero Landing Page */}
        {currentStep === STEPS.PITCH && (
          <IntakeView
            pitch={initialPitch}
            chatMessages={chatMessages}
            onPitchChange={setInitialPitch}
            onStartInterview={startDiscovery}
            onStartDiscovery={startDiscovery}
            isLoading={isLoading}
            subtitle="Description"
          />
        )}

        {/* Step 2: Interactive 7-Stage Socratic Discovery Flow */}
        {currentStep === STEPS.DISCOVERY && (
          <div className="pt-24 pb-12">
            <SocraticWizard
              questions={questions}
              initialPitch={initialPitch}
              currentIndex={currentQuestionIndex}
              userAnswers={userAnswers}
              onAnswerChange={answerQuestion}
              onGoToQuestion={goToQuestion}
              onCompileKit={compileKit}
              onReset={resetDiscovery}
            />
          </div>
        )}

        {/* Step 3: Synthesis & "Audit Trail" Progress Screen */}
        {currentStep === STEPS.COMPILING && (
          <CompilingAuditTrail
            initialPitch={initialPitch}
          />
        )}

        {/* Step 4: Final Brand Kit Bento-Box Dashboard */}
        {currentStep === STEPS.BRAND_KIT && (
          <BentoBrandKitDashboard
            brandKit={brandKit}
            onStartNew={resetDiscovery}
          />
        )}

      </main>

      {/* ── Footer (Hidden on Landing Page) ── */}
      {currentStep !== STEPS.PITCH && (
        <footer className="no-print py-6 px-6 text-center text-xs text-slate-600 border-t border-slate-200 bg-white/50">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>
              &copy; {new Date().getFullYear()} BrandForge. Powered by Groq LLaMA 3.3 70B & Google Gemini Flash.
            </p>
            <div className="flex items-center gap-3 text-slate-600">
              <span>7-Stage Socratic Synthesis</span>
              <span>•</span>
              <span>Design Tokens & Theme Previewer</span>
            </div>
          </div>
        </footer>
      )}

    </div>
  );
}
