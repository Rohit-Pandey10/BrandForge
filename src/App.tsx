import React, { useState, useEffect } from 'react';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { ProgressStepper } from './components/ProgressStepper';
import { IntakeView } from './components/IntakeView';
import { InterviewChat } from './components/InterviewChat';
import { BrandKitDashboard } from './components/BrandKitDashboard';
import { ApiKeyModal } from './components/ApiKeyModal';
import { QuestionResponse, BrandKit, InterviewStep } from './types';
import { PRESET_PITCHES, PresetPitch, generateGenericMockQuestion, generateGenericMockBrandKit } from '../server/mockData';
import { playSynthesisSuccessSound, playPillClickSound } from './utils/audio';

export const App: React.FC = () => {
  const [activeStage, setActiveStage] = useState<number>(0); // 0: Intake, 1-3: Interview, 4: Kit
  const [pitch, setPitch] = useState<string>('');
  const [history, setHistory] = useState<InterviewStep[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionResponse | null>(null);
  const [brandKit, setBrandKit] = useState<BrandKit | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Theme State (Dark / Light)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('founder_editor_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  // Demo Shuffle Index & Notification
  const [mockShuffleIndex, setMockShuffleIndex] = useState<number>(0);
  const [demoToast, setDemoToast] = useState<string | null>(null);

  // Settings
  const [useMock, setUseMock] = useState<boolean>(true);
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('brand_builder_api_key') || '');
  const [groqApiKey, setGroqApiKey] = useState<string>(() => localStorage.getItem('brand_builder_groq_key') || '');
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.6-flash');
  const [isKeyModalOpen, setIsKeyModalOpen] = useState<boolean>(false);

  // Sync theme to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('founder_editor_theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    playPillClickSound();
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const [hasServerKey, setHasServerKey] = useState<boolean>(false);

  // Check health on boot to auto-engage live curation if server has preset key
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        if (data.hasApiKey) {
          setHasServerKey(true);
          setUseMock(false);
        } else if (!apiKey && !groqApiKey) {
          setUseMock(true);
        }
      })
      .catch(() => {
        if (!apiKey && !groqApiKey) setUseMock(true);
      });
  }, [apiKey, groqApiKey]);

  const handleSaveApiKeys = (geminiKey: string, groqKey?: string) => {
    setApiKey(geminiKey);
    localStorage.setItem('brand_builder_api_key', geminiKey);
    if (groqKey !== undefined) {
      setGroqApiKey(groqKey);
      localStorage.setItem('brand_builder_groq_key', groqKey);
    }
    if (geminiKey || groqKey) {
      setUseMock(false);
    }
  };

  const handleToggleMock = () => {
    setUseMock((prev) => !prev);
  };

  // Start interview from Intake
  const handleStartInterview = async (initialPitch: string, presetId?: string) => {
    setPitch(initialPitch);
    setIsLoading(true);
    setError(null);

    // If API key is present or server has preset key, engage live curation unless user explicitly enabled mock
    const effectiveUseMock = useMock && !apiKey && !groqApiKey && !hasServerKey;

    try {
      const res = await fetch('/api/interview/next', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-gemini-key': apiKey,
          'x-groq-key': groqApiKey
        },
        body: JSON.stringify({
          pitch: initialPitch,
          currentRound: 1,
          history: [],
          useMock: effectiveUseMock
        })
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const questionData: QuestionResponse = await res.json();
      setCurrentQuestion(questionData);
      setActiveStage(1);
    } catch (err: unknown) {
      console.error('Error starting interview, engaging domain-aware fallback:', err);
      // Fallback to preset or domain-curated question
      const matched = PRESET_PITCHES.find((p: PresetPitch) => p.id === presetId);
      if (matched && matched.rounds[0]) {
        setCurrentQuestion({
          isComplete: false,
          currentRound: 1,
          question: matched.rounds[0].question,
          suggestedAnswers: matched.rounds[0].suggestedAnswers,
          reasoning: matched.rounds[0].reasoning
        });
      } else {
        const fallbackQ = generateGenericMockQuestion(1, initialPitch);
        setCurrentQuestion(fallbackQ);
      }
      setActiveStage(1);
    } finally {
      setIsLoading(false);
    }
  };

  // Answer Socratic question
  const handleAnswerQuestion = async (userAnswer: string, selectedIndex?: number) => {
    if (!currentQuestion) return;

    const currentRound = currentQuestion.currentRound;
    const newStep: InterviewStep = {
      round: currentRound,
      question: currentQuestion.question,
      reasoning: currentQuestion.reasoning,
      suggestedAnswers: currentQuestion.suggestedAnswers,
      userAnswer,
      selectedOptionIndex: selectedIndex
    };

    const updatedHistory = [...history, newStep];
    setHistory(updatedHistory);
    setIsLoading(true);
    setError(null);

    const effectiveUseMock = useMock && !apiKey && !groqApiKey && !hasServerKey;

    // If completed round 3, compile brand kit
    if (currentRound >= 3) {
      try {
        const res = await fetch('/api/interview/compile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-gemini-key': apiKey,
            'x-groq-key': groqApiKey
          },
          body: JSON.stringify({
            pitch,
            history: updatedHistory,
            useMock: effectiveUseMock
          })
        });

        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const compiledKit: BrandKit = await res.json();
        setBrandKit(compiledKit);
        setActiveStage(4);
        playSynthesisSuccessSound();
      } catch (err: unknown) {
        console.error('Compilation error, using domain-aware fallback:', err);
        const matched = PRESET_PITCHES.find((p: PresetPitch) => p.pitch.toLowerCase().includes(pitch.toLowerCase().slice(0, 20)));
        if (matched) {
          setBrandKit(matched.brandKit);
        } else {
          setBrandKit(generateGenericMockBrandKit(pitch, updatedHistory));
        }
        setActiveStage(4);
        playSynthesisSuccessSound();
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Otherwise, fetch next round question
    const nextRoundNum = currentRound + 1;
    try {
      const res = await fetch('/api/interview/next', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-gemini-key': apiKey,
          'x-groq-key': groqApiKey
        },
        body: JSON.stringify({
          pitch,
          currentRound: nextRoundNum,
          history: updatedHistory,
          useMock: effectiveUseMock
        })
      });

      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const nextQ: QuestionResponse = await res.json();
      setCurrentQuestion(nextQ);
      setActiveStage(nextRoundNum);
    } catch (err: unknown) {
      console.error('Fetch next question error, using domain-aware fallback:', err);
      const matched = PRESET_PITCHES.find((p: PresetPitch) => p.pitch.toLowerCase().includes(pitch.toLowerCase().slice(0, 20)));
      if (matched && matched.rounds[nextRoundNum - 1]) {
        const r = matched.rounds[nextRoundNum - 1];
        setCurrentQuestion({
          isComplete: false,
          currentRound: nextRoundNum,
          question: r.question,
          suggestedAnswers: r.suggestedAnswers,
          reasoning: r.reasoning
        });
      } else {
        const fallbackQ = generateGenericMockQuestion(nextRoundNum, pitch);
        setCurrentQuestion(fallbackQ);
      }
      setActiveStage(nextRoundNum);
    } finally {
      setIsLoading(false);
    }
  };

  // Instant Synthesize (1-click mock demo with shuffling between prebuilt brands)
  const handleInstantSynthesize = async (targetPitch?: string, presetId?: string, forceShuffle?: boolean) => {
    setIsLoading(true);
    setError(null);

    let chosenPreset: PresetPitch | undefined;

    if (presetId) {
      chosenPreset = PRESET_PITCHES.find((p) => p.id === presetId);
    } else if (forceShuffle || !targetPitch) {
      // Rotate through prebuilt demo brands
      const idx = mockShuffleIndex % PRESET_PITCHES.length;
      chosenPreset = PRESET_PITCHES[idx];
      setMockShuffleIndex((prev) => prev + 1);
    } else {
      const matched = PRESET_PITCHES.find(
        (p: PresetPitch) =>
          targetPitch.toLowerCase().includes(p.title.toLowerCase()) ||
          p.pitch.toLowerCase().includes(targetPitch.toLowerCase().slice(0, 30))
      );
      if (matched) {
        chosenPreset = matched;
      } else {
        const idx = mockShuffleIndex % PRESET_PITCHES.length;
        chosenPreset = PRESET_PITCHES[idx];
        setMockShuffleIndex((prev) => prev + 1);
      }
    }

    const effectivePreset = chosenPreset || PRESET_PITCHES[0];
    const finalPitch = targetPitch || effectivePreset.pitch;
    setPitch(finalPitch);

    const mockHistory: InterviewStep[] = effectivePreset.rounds.map((r) => ({
      round: r.round,
      question: r.question,
      reasoning: r.reasoning,
      suggestedAnswers: r.suggestedAnswers,
      userAnswer: r.suggestedAnswers[0]
    }));

    setHistory(mockHistory);

    // Notify presenter of the shuffled demo brand
    setDemoToast(`Shuffled Demo: ${effectivePreset.brandKit.brandStrategy.brandName} (${effectivePreset.title})`);
    setTimeout(() => setDemoToast(null), 3600);

    try {
      const res = await fetch('/api/interview/compile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-gemini-key': apiKey
        },
        body: JSON.stringify({
          pitch: finalPitch,
          history: mockHistory,
          useMock: true
        })
      });

      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const kit: BrandKit = await res.json();
      setBrandKit(kit);
      setActiveStage(4);
      playSynthesisSuccessSound();
    } catch (err: unknown) {
      console.error('Instant synthesize error, falling back to prebuilt kit:', err);
      setBrandKit(effectivePreset.brandKit);
      setActiveStage(4);
      playSynthesisSuccessSound();
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setActiveStage(0);
    setPitch('');
    setHistory([]);
    setCurrentQuestion(null);
    setBrandKit(null);
    setError(null);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Announcement Bar */}
      <AnnouncementBar
        useMock={useMock}
        model={selectedModel}
        hasCustomKey={Boolean(apiKey)}
        onOpenKeyModal={() => setIsKeyModalOpen(true)}
      />

      {/* Top Navigation with Dark / Light Mode Toggle */}
      <Navbar
        useMock={useMock}
        onToggleMock={handleToggleMock}
        onReset={handleReset}
        onOpenKeyModal={() => setIsKeyModalOpen(true)}
        activeStage={activeStage}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%' }}>
        {/* Progress Stepper shown once interview commences */}
        {activeStage > 0 && (
          <div style={{ paddingTop: '32px' }}>
            <ProgressStepper currentStage={activeStage} />
          </div>
        )}

        {/* Stage 0: Intake View */}
        {activeStage === 0 && (
          <IntakeView
            onStartInterview={handleStartInterview}
            onInstantSynthesize={(p, id, shuffle) => handleInstantSynthesize(p, id, shuffle)}
            useMock={useMock}
            isLoading={isLoading}
          />
        )}

        {/* Stage 1-3: Socratic Interview Chat */}
        {activeStage >= 1 && activeStage <= 3 && currentQuestion && (
          <InterviewChat
            currentQuestion={currentQuestion}
            currentRound={currentQuestion.currentRound}
            pitch={pitch}
            history={history}
            onAnswerQuestion={handleAnswerQuestion}
            isLoading={isLoading}
            onInstantSynthesize={() => handleInstantSynthesize(undefined, undefined, true)}
          />
        )}

        {/* Stage 4: Synthesized Brand Kit Dashboard with Improvement Studio */}
        {activeStage === 4 && brandKit && (
          <BrandKitDashboard
            brandKit={brandKit}
            onReset={handleReset}
            onUpdateBrandKit={(updated) => setBrandKit(updated)}
          />
        )}
      </main>

      {/* Demo Shuffle Toast Notification */}
      {demoToast && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: 'var(--color-ink-black)',
            color: 'var(--color-paper-cream)',
            padding: '10px 20px',
            borderRadius: '9999px',
            fontSize: '13px',
            fontFamily: 'var(--font-inter)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.22)',
            zIndex: 9998,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            border: '1px solid var(--color-warm-border)'
          }}
        >
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#10b981' }} />
          <span>{demoToast}</span>
        </div>
      )}

      {/* API Key / Runtime Modal */}
      <ApiKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        apiKey={apiKey}
        groqApiKey={groqApiKey}
        onSaveApiKeys={handleSaveApiKeys}
        selectedModel={selectedModel}
        onSelectModel={setSelectedModel}
        useMock={useMock}
        onToggleMock={handleToggleMock}
      />
    </div>
  );
};

export default App;
