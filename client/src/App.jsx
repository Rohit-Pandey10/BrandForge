import React, { useState } from 'react';
import Header from './components/Header';
import IntakeView from './components/IntakeView';
import InterviewChat from './components/InterviewChat';
import BrandKitDashboard from './components/BrandKitDashboard';
import { mockBrandKit, getDomainMockBrandKit, getDomainMockQuestion } from './data/mockBrandData';

export default function App() {
  const [stage, setStage] = useState('intake'); // 'intake' | 'interview' | 'dashboard'
  const [messages, setMessages] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [brandKit, setBrandKit] = useState(mockBrandKit);
  const [isLoading, setIsLoading] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);

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
   * Step 1: Start interview from IntakeView
   */
  const handleStartInterview = async (pitch) => {
    setIsLoading(true);

    const initialHistory = [{ role: 'user', content: pitch }];
    const initialMessages = [{
      id: 'msg-0',
      role: 'user',
      content: pitch,
      timestamp: Date.now()
    }];

    setMessages(initialMessages);
    setStage('interview');

    // Call /api/interview/next
    const data = await callApi('/api/interview/next', { history: initialHistory });

    if (data) {
      setCurrentQuestion(data);
      setMessages(prev => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          role: 'assistant',
          content: data.question,
          reasoning: data.reasoning,
          suggestedAnswers: data.suggestedAnswers,
          timestamp: Date.now()
        }
      ]);
      // Local fallback if server unreachable (domain-adaptive)
      const fallbackQuestion = getDomainMockQuestion(1, pitch);
      setCurrentQuestion(fallbackQuestion);
      setMessages(prev => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          role: 'assistant',
          content: fallbackQuestion.question,
          reasoning: fallbackQuestion.reasoning,
          suggestedAnswers: fallbackQuestion.suggestedAnswers,
          timestamp: Date.now()
        }
      ]);
    }

    setIsLoading(false);
  };

  /**
   * Step 2: Answer question in InterviewChat (Continuous Discovery)
   */
  const handleSendMessage = async (text) => {
    const updatedMessages = [
      ...messages,
      {
        id: `msg-user-${Date.now()}`,
        role: 'user',
        content: text,
        timestamp: Date.now()
      }
    ];

    setMessages(updatedMessages);
    setIsLoading(true);

    const historyForApi = updatedMessages.map(m => ({
      role: m.role,
      content: m.content
    }));

    const data = await callApi('/api/interview/next', { history: historyForApi });

    if (data) {
      setCurrentQuestion(data);
      setMessages(prev => [
        ...prev,
        {
          id: `msg-ai-${Date.now()}`,
          role: 'assistant',
          content: data.question,
          reasoning: data.reasoning,
          suggestedAnswers: data.suggestedAnswers,
          timestamp: Date.now()
        }
      ]);
    } else {
      // Offline / network fallback progression (domain-adaptive)
      const userTurnCount = updatedMessages.filter(m => m.role === 'user').length;
      const fullContext = updatedMessages.map(m => m.content).join(' ');
      const nextMock = getDomainMockQuestion(userTurnCount, fullContext);

      setCurrentQuestion(nextMock);
      setMessages(prev => [
        ...prev,
        {
          id: `msg-ai-${Date.now()}`,
          role: 'assistant',
          content: nextMock.question,
          reasoning: nextMock.reasoning,
          suggestedAnswers: nextMock.suggestedAnswers,
          timestamp: Date.now()
        }
      ]);
    }

    setIsLoading(false);
  };

  /**
   * Step 3: Synthesize Brand Kit (Triggered on-demand at any time)
   */
  const handleCompileBrandKit = async (optionalFinalAnswer) => {
    setIsCompiling(true);

    let msgs = [...messages];
    if (optionalFinalAnswer && typeof optionalFinalAnswer === 'string' && optionalFinalAnswer.trim()) {
      const finalMsg = {
        id: `msg-user-final-${Date.now()}`,
        role: 'user',
        content: optionalFinalAnswer.trim(),
        timestamp: Date.now()
      };
      msgs.push(finalMsg);
      setMessages(msgs);
    }

    const historyForApi = msgs.map(m => ({
      role: m.role,
      content: m.content
    }));

    const data = await callApi('/api/interview/compile', { history: historyForApi });

    if (data && data.brandStrategy) {
      setBrandKit(data);
    } else {
      // Domain-adaptive fallback mock hydration
      const fullContext = msgs.map(m => m.content).join(' ');
      setBrandKit(getDomainMockBrandKit(fullContext));
    }

    setIsCompiling(false);
    setStage('dashboard');
  };

  /**
   * Reset flow to intake
   */
  const handleReset = () => {
    setStage('intake');
    setMessages([]);
    setCurrentQuestion(null);
  };

  /**
   * Jump straight to dashboard with hydrated mock state
   */
  const handlePreviewMock = () => {
    const fullContext = messages.map(m => m.content).join(' ');
    setBrandKit(getDomainMockBrandKit(fullContext));
    setStage('dashboard');
  };

  /**
   * Fast-forward synthesis from Header
   */
  const handleSkipToSynthesis = () => {
    if (messages.length > 0) {
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
          <rect width="${swatchWidth}" height="${swatchHeight}" rx="20" fill="${c.hex}" stroke="#dbd7cd" stroke-width="1" />
          <text x="${swatchWidth / 2}" y="${swatchHeight + 28}" fill="#737373" font-size="11" font-weight="400" text-anchor="middle" font-family="'Inter', sans-serif" letter-spacing="1">${(c.role || '').toUpperCase()}</text>
          <text x="${swatchWidth / 2}" y="${swatchHeight + 48}" fill="#000000" font-size="13" font-weight="500" text-anchor="middle" font-family="'Inter', sans-serif">${c.name || 'Color'}</text>
          <text x="${swatchWidth / 2}" y="${swatchHeight + 68}" fill="#000000" font-size="12" font-weight="400" text-anchor="middle" font-family="monospace">${c.hex}</text>
        </g>
      `;
    }).join('\n');

    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <rect width="100%" height="100%" fill="#f2f1ed" />
  <text x="${width / 2}" y="50" fill="#000000" font-size="28" font-weight="300" text-anchor="middle" font-family="'Cormorant Garamond', Georgia, serif">${brandKit?.brandStrategy?.brandName || 'Brand'} — Color System</text>
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
    <div className="min-h-screen bg-[#f2f1ed] text-[#000000] flex flex-col justify-between selection:bg-black selection:text-white font-sans">
      {/* Editorial Navigation Header */}
      <Header
        stage={stage}
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
            onStartInterview={handleStartInterview}
            onPreviewMock={handlePreviewMock}
          />
        )}

        {stage === 'interview' && (
          <InterviewChat
            messages={messages}
            currentQuestion={currentQuestion}
            isLoading={isLoading}
            isCompiling={isCompiling}
            onSendMessage={handleSendMessage}
            onCompileBrandKit={handleCompileBrandKit}
            onReset={handleReset}
          />
        )}

        {stage === 'dashboard' && (
          <BrandKitDashboard
            brandKit={brandKit}
            onStartNew={handleReset}
          />
        )}
      </main>

      {/* Minimalist Editorial Footer */}
      <footer className="no-print py-6 px-6 text-center text-xs text-[#737373] border-t border-[#dbd7cd]/50">
        <p>
          &copy; {new Date().getFullYear()} Brand Builder. Socratic Brand Studio &bull; Handhold Editorial Design System.
        </p>
      </footer>
    </div>
  );
}
