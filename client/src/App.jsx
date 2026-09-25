import React, { useState } from 'react';
import Header from './components/Header';
import IntakeView from './components/IntakeView';
import ConceptSelector from './components/ConceptSelector';
import InterviewChat from './components/InterviewChat';
import BrandKitDashboard from './components/BrandKitDashboard';
import Sidebar from './components/Sidebar';
import AuthModal from './components/AuthModal';
import { useAuth, MAX_GUEST_RUNS } from './context/AuthContext';
import { mockBrandKit, getDomainMockBrandKit, getDomainMockBatch, getDomainMockQuestion } from './data/mockBrandData';

export default function App() {
  const [stage, setStage] = useState('intake'); // 'intake' | 'refinement' | 'interview' | 'dashboard'
  const [rawPitch, setRawPitch] = useState('');
  const [expandedConcepts, setExpandedConcepts] = useState([]);
  const [isExpanding, setIsExpanding] = useState(false);
  const [intakeError, setIntakeError] = useState('');
  const [questions, setQuestions] = useState([]);
  const [initialPitch, setInitialPitch] = useState('');
  const [brandKit, setBrandKit] = useState(null);
  const [interviewAnswers, setInterviewAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);

  const {
    isAuthenticated,
    guestRunsCount,
    incrementGuestRun,
    saveGuestKitLocally,
    openAuthModal
  } = useAuth();

  const API_BASE = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '';

  /**
   * Helper to call backend API with fallback
   */
  const callApi = async (endpoint, payload) => {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      console.warn(`[App] API request to ${url} failed, utilizing local fallback:`, err.message);
      return null;
    }
  };

  /**
   * Step 1: Submit raw pitch from IntakeView
   * Evaluated by BGM Prompt Enhancer to produce 2 distinct strategic directions
   */
  const handleRawPitchSubmit = async (pitch) => {
    if (!isAuthenticated && guestRunsCount >= MAX_GUEST_RUNS) {
      openAuthModal('run_limit');
      return;
    }

    const cleanPitch = String(pitch || '').trim();
    setRawPitch(cleanPitch);
    setIsExpanding(true);
    setIntakeError('');

    const data = await callApi('/api/interview/expand-pitch', { rawPitch: cleanPitch });

    if (data && data.isValidPremise === false) {
      setIsExpanding(false);
      setIntakeError(data.retryMessage || "That premise is a bit too fragmented to extract a defensible market angle. Try describing your product or business in a short phrase (e.g., 'An artisanal sourdough bakery' or 'A low-latency database for fintech').");
      return;
    }

    if (data && Array.isArray(data.concepts) && data.concepts.length >= 2) {
      setExpandedConcepts(data.concepts);
      setIsExpanding(false);
      setStage('refinement');
      return;
    }

    // Programmatic safety gate: reject fragmented or spam inputs
    const lower = cleanPitch.toLowerCase();
    if (lower.length < 6 || /^(asdf|qwert|zxcvb)/i.test(lower) || lower === 'school make' || lower === 'make do thing') {
      setIsExpanding(false);
      setIntakeError("That premise is a bit too fragmented to extract a defensible market angle. Try describing your product or business in a short phrase (e.g., 'An artisanal sourdough bakery' or 'A low-latency database for fintech').");
      return;
    }

    // Local domain-adaptive fallback concepts for valid inputs
    setExpandedConcepts([
      {
        id: 'concept_a',
        title: `${cleanPitch.slice(0, 20)} Studio`,
        expandedPitch: cleanPitch,
        strategicAngle: 'Direct-to-consumer craftsmanship without legacy distributor markups.'
      },
      {
        id: 'concept_b',
        title: `${cleanPitch.slice(0, 20)} Collective`,
        expandedPitch: 'A communal alternative designed around sustainable materials and transparent customer trust.',
        strategicAngle: 'High-touch artisanal experience centered on human connection.'
      }
    ]);

    setIsExpanding(false);
    setStage('refinement');
  };

  /**
   * Step 2: Select or refine concept from ConceptSelector
   * Generates the 7 discovery questions based on the chosen high-conviction concept
   */
  const handleSelectConcept = async (refinedPitch) => {
    const cleanPitch = String(refinedPitch || '').trim();
    setIsLoading(true);
    setInitialPitch(cleanPitch);
    setStage('interview');

    // Call 1: POST /api/interview/start generates all 7 questions upfront based on refined pitch
    const data = await callApi('/api/interview/start', { initialPitch: cleanPitch });

    if (data && Array.isArray(data.questions) && data.questions.length > 0) {
      setQuestions(data.questions);
    } else {
      // Local domain-adaptive fallback batch
      setQuestions(getDomainMockBatch(cleanPitch));
    }

    setIsLoading(false);
  };

  /**
   * Step 3: Final Synthesis (Batch Call 2: Single Compilation from 7 Answers)
   */
  const handleCompileBrandKit = async (qaData = {}) => {
    setIsCompiling(true);

    const payload = typeof qaData === 'object' ? qaData : {};
    const pitch = payload.initialPitch || initialPitch;
    const answersList = Array.isArray(payload.qaPairs) ? payload.qaPairs : [];
    setInterviewAnswers(answersList);

    const data = await callApi('/api/interview/compile', {
      initialPitch: pitch,
      ...payload
    });

    let compiledKit = null;
    if (data && data.brandStrategy) {
      compiledKit = data;
    } else {
      // Domain-adaptive fallback mock hydration
      compiledKit = getDomainMockBrandKit(pitch);
    }

    setBrandKit(compiledKit);

    // If unauthenticated guest, record run usage and buffer in memory/local storage
    if (!isAuthenticated) {
      incrementGuestRun();
      saveGuestKitLocally(compiledKit, {
        brandName: compiledKit?.brandStrategy?.brandName,
        tagline: compiledKit?.brandStrategy?.tagline,
        initialPitch: pitch,
        domain: compiledKit?.brandStrategy?.archetype || 'general'
      });
    }

    setIsCompiling(false);
    setStage('dashboard');
  };

  /**
   * Reset flow to intake
   */
  const handleReset = () => {
    setStage('intake');
    setQuestions([]);
    setInitialPitch('');
    setRawPitch('');
    setExpandedConcepts([]);
    setIntakeError('');
    setBrandKit(null);
    setInterviewAnswers([]);
  };

  /**
   * Jump straight to dashboard with hydrated mock state
   */
  const handlePreviewMock = () => {
    if (!isAuthenticated && guestRunsCount >= MAX_GUEST_RUNS) {
      openAuthModal('run_limit');
      return;
    }

    const mockKit = getDomainMockBrandKit(initialPitch || rawPitch || '');
    setBrandKit(mockKit);

    if (!isAuthenticated) {
      incrementGuestRun();
      saveGuestKitLocally(mockKit, {
        brandName: mockKit?.brandStrategy?.brandName,
        tagline: mockKit?.brandStrategy?.tagline,
        initialPitch: initialPitch || rawPitch || 'Sample Brand',
        domain: 'general'
      });
    }

    setStage('dashboard');
  };

  /**
   * Single-click rehydration from Sidebar
   */
  const handleRehydrateBrand = (rehydratedKit, sessionMeta) => {
    if (!rehydratedKit) return;
    setBrandKit(rehydratedKit);
    if (sessionMeta?.initialPitch) {
      setInitialPitch(sessionMeta.initialPitch);
    }
    setStage('dashboard');
  };

  /**
   * Fast-forward synthesis from Header
   */
  const handleSkipToSynthesis = () => {
    if (questions.length > 0) {
      handleCompileBrandKit();
    } else {
      handlePreviewMock();
    }
  };

  /**
   * Global Export Actions for Header
   */
  const cleanBrandName = (brandKit?.brandStrategy?.brandName || 'brand').toLowerCase().replace(/\s+/g, '-');

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(brandKit, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${cleanBrandName}-tokens.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportCss = () => {
    const palette = brandKit?.visualTokens?.palette || [];
    const typography = brandKit?.visualTokens?.typography || {};
    const css = `:root {
  /* Brand: ${brandKit?.brandStrategy?.brandName || 'Brand'} */
${palette.map(c => `  --color-${(c.role || 'color').toLowerCase().replace(/[^a-z0-9]/g, '-')}: ${c.hex}; /* ${c.name} */`).join('\n')}

  /* Typography Scale */
  --font-display: '${typography.headingFont || 'Cormorant Garamond'}', Georgia, serif;
  --font-body: '${typography.bodyFont || 'Inter'}', system-ui, sans-serif;

  /* Geometry & Shape */
  --radius-curvature: ${brandKit?.visualTokens?.borderCurvature === 'rounded-none' ? '0px' : brandKit?.visualTokens?.borderCurvature === 'rounded-full' ? '9999px' : '16px'};
}`;

    const dataStr = "data:text/css;charset=utf-8," + encodeURIComponent(css);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${cleanBrandName}-tokens.css`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const cleanXml = (unsafe = '') => 
    String(unsafe).replace(/[<>&'"]/g, (c) => ({
      '<': '&lt;', '>': '&gt;', '&': '&amp;', '\'': '&apos;', '"': '&quot;'
    }[c]));

  const handleExportSvg = () => {
    const palette = brandKit?.visualTokens?.palette || [];
    const width = 1000;
    const height = 360;
    const swatchWidth = 160;
    const swatchHeight = 160;
    const gap = 24;
    const startX = (width - (palette.length * swatchWidth + (palette.length - 1) * gap)) / 2;

    const swatchesSvg = palette.map((c, i) => {
      const x = startX + i * (swatchWidth + gap);
      const y = 110;
      return `
        <g transform="translate(${x}, ${y})">
          <rect width="${swatchWidth}" height="${swatchHeight}" rx="20" fill="${cleanXml(c.hex)}" stroke="#dbd7cd" stroke-width="1" />
          <text x="${swatchWidth / 2}" y="${swatchHeight + 28}" fill="#737373" font-size="11" font-weight="400" text-anchor="middle" font-family="'Inter', sans-serif" letter-spacing="1">${cleanXml((c.role || '').toUpperCase())}</text>
          <text x="${swatchWidth / 2}" y="${swatchHeight + 48}" fill="#000000" font-size="13" font-weight="500" text-anchor="middle" font-family="'Inter', sans-serif">${cleanXml(c.name || 'Color')}</text>
          <text x="${swatchWidth / 2}" y="${swatchHeight + 68}" fill="#000000" font-size="12" font-weight="400" text-anchor="middle" font-family="monospace">${cleanXml(c.hex)}</text>
        </g>
      `;
    }).join('\n');

    const brandTitle = cleanXml(brandKit?.brandStrategy?.brandName || 'Brand');

    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <rect width="100%" height="100%" fill="#f2f1ed" />
  <text x="${width / 2}" y="50" fill="#000000" font-size="28" font-weight="300" text-anchor="middle" font-family="'Cormorant Garamond', Georgia, serif">${brandTitle} — Color System</text>
  <text x="${width / 2}" y="76" fill="#737373" font-size="12" font-weight="400" text-anchor="middle" font-family="'Inter', sans-serif">Synthesized Design Tokens</text>
  ${swatchesSvg}
</svg>`;

    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${cleanBrandName}-palette.svg`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-transparent text-zinc-900 flex flex-col justify-between selection:bg-orange-500 selection:text-white font-sans antialiased">
      {/* Expandable / Collapsible Left Sidebar */}
      <Sidebar
        onRehydrateBrand={handleRehydrateBrand}
        onStartNew={handleReset}
      />

      {/* Global Authentication Modal */}
      <AuthModal />

      {/* Editorial Navigation Header */}
      <Header
        stage={stage}
        brandKit={brandKit}
        onReset={handleReset}
        onSkipToSynthesis={handleSkipToSynthesis}
        onPreviewMock={handlePreviewMock}
        onExportJson={handleExportJson}
        onExportCss={handleExportCss}
        onExportSvg={handleExportSvg}
        onPrintPdf={handlePrintPdf}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center py-4 sm:py-8">
        {stage === 'intake' && (
          <IntakeView
            onStartInterview={handleRawPitchSubmit}
            onPreviewMock={handlePreviewMock}
            isExpanding={isExpanding}
            serverError={intakeError}
          />
        )}

        {stage === 'refinement' && (
          <ConceptSelector
            rawPitch={rawPitch}
            concepts={expandedConcepts}
            onSelectConcept={handleSelectConcept}
            onBackToIntake={() => setStage('intake')}
            isLoadingDiscovery={isLoading}
          />
        )}

        {stage === 'interview' && (
          <InterviewChat
            questions={questions}
            initialPitch={initialPitch}
            isLoading={isLoading}
            isCompiling={isCompiling}
            onCompileBrandKit={handleCompileBrandKit}
            onReset={handleReset}
          />
        )}

        {stage === 'dashboard' && (
          <BrandKitDashboard
            brandKit={brandKit}
            answers={interviewAnswers}
            onStartNew={handleReset}
          />
        )}
      </main>

      {/* Editorial Footer (Shaurya's Design System) */}
      <footer className="no-print py-6 px-6 text-center text-xs text-zinc-500 border-t border-zinc-200/60 bg-white/40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            &copy; 2026 Brand Builder. Strategic Positioning, Verbal Identity & Design Systems.
          </p>
          <div className="flex items-center gap-3 text-zinc-500 font-mono text-xs">
            <span>Socratic Brand Synthesis</span>
            <span>•</span>
            <span>Design Tokens & Multi-Archetype Specimen</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
