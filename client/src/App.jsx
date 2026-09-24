import React, { useState } from 'react';
import IntakeView from './components/IntakeView';
import InterviewChat from './components/InterviewChat';
import BrandKitDashboard from './components/BrandKitDashboard';
import { mockBrandKit } from './data/mockBrandData';
import { Sparkles, Cpu, Layers } from 'lucide-react';

export default function App() {
  const [stage, setStage] = useState('intake'); // 'intake' | 'interview' | 'dashboard'
  const [messages, setMessages] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [brandKit, setBrandKit] = useState(mockBrandKit);
  const [isLoading, setIsLoading] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [apiError, setApiError] = useState(null);

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
    setApiError(null);

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
    } else {
      // Local fallback if server unreachable
      const fallbackQuestion = {
        isComplete: false,
        currentRound: 1,
        question: "Who is the single most desperate user who will revolt if this product disappears tomorrow, and what specific nightmare does your product eliminate for them?",
        suggestedAnswers: [
          "Technical founders paralyzed by brand identity indecision.",
          "Early growth leads tired of $20k agency decks.",
          "Developer advocates needing punchy, un-boring documentation identity."
        ],
        reasoning: "Isolates the beachhead ICP from casual tire-kickers and demands an acute, urgent pain point."
      };
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
   * Step 2: Answer question in InterviewChat
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
      // Offline / network fallback progression
      const userTurnCount = updatedMessages.filter(m => m.role === 'user').length;
      let nextMock;

      if (userTurnCount === 2) {
        nextMock = {
          isComplete: false,
          currentRound: 2,
          question: "What sacred cow in your industry are you killing, and why does the conventional incumbent solution secretly fail users?",
          suggestedAnswers: [
            "Incumbents sell sterile corporate jargon; we deliver personality.",
            "Agencies take 8 weeks; we synthesize in 3 minutes.",
            "Identical blue SaaS templates with zero distinct edge."
          ],
          reasoning: "Forces differentiation away from incremental claims to ideological opposition."
        };
      } else if (userTurnCount === 3) {
        nextMock = {
          isComplete: false,
          currentRound: 3,
          question: "If your brand were a person entering a room, what is their attitude, and who are they totally comfortable alienating?",
          suggestedAnswers: [
            "Irreverent, sharp, and hostile toward bureaucratic committees.",
            "Hyper-focused, minimal, and allergic to corporate buzzwords.",
            "Provocative cyberpunk craftsman speaking directly to power builders."
          ],
          reasoning: "Defines the edge of the brand personality and sets up design tokens."
        };
      } else {
        nextMock = {
          isComplete: true,
          currentRound: 3,
          question: "You have carved out a razor-sharp positioning. Ready to synthesize your complete Brand Kit?",
          suggestedAnswers: ["Synthesize Brand Kit Now"],
          reasoning: "Discovery completed."
        };
      }

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
   * Step 3: Synthesize Brand Kit
   */
  const handleCompileBrandKit = async () => {
    setIsCompiling(true);

    const historyForApi = messages.map(m => ({
      role: m.role,
      content: m.content
    }));

    const data = await callApi('/api/interview/compile', { history: historyForApi });

    if (data && data.brandStrategy) {
      setBrandKit(data);
    } else {
      // Fallback mock hydration
      setBrandKit(mockBrandKit);
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
    setBrandKit(mockBrandKit);
    setStage('dashboard');
  };

  return (
    <div className="min-h-screen bg-[#f2f1ed] text-[#000000] flex flex-col justify-between selection:bg-black selection:text-white font-sans">
      {/* Editorial Navigation Header */}
      <header className="no-print sticky top-0 z-50 bg-[#f2f1ed]/90 backdrop-blur-md px-6 sm:px-12 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo Mark: Lowercase Editorial Serif Wordmark */}
          <button 
            onClick={handleReset}
            className="text-left group transition-opacity hover:opacity-70"
          >
            <span className="font-serif text-2xl tracking-[-0.03em] font-light text-[#000000]">
              brand builder.
            </span>
          </button>

          {/* Right Header Navigation: Handhold Pill Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePreviewMock}
              className={`text-xs px-4 py-2 rounded-full border transition-all ${
                stage === 'dashboard'
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-black border-[#dbd7cd] hover:border-black hover:bg-[#f2f1ed]'
              }`}
            >
              Preview Brand Kit
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center py-6 sm:py-10">
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
      <footer className="no-print py-6 px-6 text-center text-xs text-[#737373]">
        <p>
          &copy; {new Date().getFullYear()} Brand Builder. Turn raw ideas into launch-ready identity systems.
        </p>
      </footer>
    </div>
  );
}
