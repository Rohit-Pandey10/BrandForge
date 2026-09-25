/**
 * Brand Discovery State Machine Hook
 * Location: client/src/hooks/useBrandDiscovery.js
 * 
 * Manages the multi-stage lifecycle of brand synthesis:
 *   PITCH -> DISCOVERY -> COMPILING -> BRAND_KIT
 */

import { useState, useEffect, useCallback } from 'react';
import { checkHealth, startInterview, compileBrandKit } from '../api/brandClient.js';
import { getDomainMockBrandKit, getDomainMockBatch } from '../data/mockBrandData.js';

export const STEPS = {
  PITCH: 'PITCH',
  DISCOVERY: 'DISCOVERY',
  COMPILING: 'COMPILING',
  BRAND_KIT: 'BRAND_KIT'
};

export function useBrandDiscovery() {
  const [currentStep, setCurrentStep] = useState(STEPS.PITCH);
  const [initialPitch, setInitialPitch] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [brandKit, setBrandKit] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [serverHealth, setServerHealth] = useState(null);
  const [error, setError] = useState(null);

  // Check backend server health on initial mount
  useEffect(() => {
    let isMounted = true;
    async function loadHealth() {
      try {
        const health = await checkHealth();
        if (isMounted) setServerHealth(health);
      } catch (err) {
        if (isMounted) setServerHealth({ status: 'offline', provider: 'local-mock' });
      }
    }
    loadHealth();
    return () => { isMounted = false; };
  }, []);

  /**
   * Evaluates initial input:
   * - If type === 'chat': renders conversation reply & stays on PITCH screen
   * - If type === 'discovery': transitions to DISCOVERY wizard with 7 questions
   */
  const startDiscovery = useCallback(async (pitchOverride) => {
    const pitchToUse = (pitchOverride !== undefined ? pitchOverride : initialPitch).trim();
    if (!pitchToUse) {
      setError('Please type a message or describe what you are building.');
      return;
    }

    setError(null);
    setIsLoading(true);

    // Record user message in conversational thread
    setChatMessages(prev => [...prev, { role: 'user', content: pitchToUse }]);

    try {
      const data = await startInterview(pitchToUse);

      // 1. If backend says CHAT: display reply and stay on conversational hero
      if (data && data.type === 'chat') {
        setChatMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
        setInitialPitch(''); // Clear input so user can reply naturally
        setIsLoading(false);
        return;
      }

      // 2. If backend says DISCOVERY: launch the 7-stage wizard
      setInitialPitch(pitchToUse);
      if (data && Array.isArray(data.questions) && data.questions.length > 0) {
        setQuestions(data.questions);
      } else {
        setQuestions(getDomainMockBatch(pitchToUse));
      }
      setCurrentQuestionIndex(0);
      setUserAnswers({});
      setCurrentStep(STEPS.DISCOVERY);
    } catch (err) {
      console.warn('[useBrandDiscovery] Error starting interview, using mock batch:', err);
      setQuestions(getDomainMockBatch(pitchToUse));
      setCurrentStep(STEPS.DISCOVERY);
    } finally {
      setIsLoading(false);
    }
  }, [initialPitch]);

  /**
   * Records the founder's answer for question at specific index
   */
  const answerQuestion = useCallback((index, answer) => {
    setUserAnswers((prev) => ({
      ...prev,
      [index]: answer
    }));
  }, []);

  /**
   * Navigates between questions in DISCOVERY mode
   */
  const goToQuestion = useCallback((index) => {
    if (index >= 0 && index < (questions.length || 7)) {
      setCurrentQuestionIndex(index);
    }
  }, [questions.length]);

  /**
   * Transition: DISCOVERY -> COMPILING -> BRAND_KIT
   * Assembles all qaPairs and triggers POST /api/interview/compile
   */
  const compileKit = useCallback(async (lastAnswer) => {
    setIsCompiling(true);
    setCurrentStep(STEPS.COMPILING);
    setError(null);

    // Merge any last answer passed right as user submits
    const finalAnswers = {
      ...userAnswers,
      ...(lastAnswer !== undefined ? { [currentQuestionIndex]: lastAnswer } : {})
    };

    const qaPairs = questions.map((q, idx) => ({
      id: q.id || idx + 1,
      stageLabel: q.stageLabel || `Stage ${idx + 1}`,
      question: q.question,
      answer: finalAnswers[idx] || ''
    })).filter(pair => pair.answer && pair.answer.trim());

    try {
      const synthesizedKit = await compileBrandKit({
        initialPitch,
        qaPairs,
        answers: finalAnswers
      });

      if (synthesizedKit && synthesizedKit.brandStrategy) {
        setBrandKit(synthesizedKit);
      } else {
        setBrandKit(getDomainMockBrandKit(initialPitch));
      }
      setCurrentStep(STEPS.BRAND_KIT);
    } catch (err) {
      console.warn('[useBrandDiscovery] Synthesis failed, utilizing domain mock kit:', err);
      setBrandKit(getDomainMockBrandKit(initialPitch));
      setCurrentStep(STEPS.BRAND_KIT);
    } finally {
      setIsCompiling(false);
    }
  }, [userAnswers, currentQuestionIndex, questions, initialPitch]);

  /**
   * Jump straight to dashboard with hydrated domain mock
   */
  const loadMockPreview = useCallback((customPitch = '') => {
    const pitch = customPitch || initialPitch || 'A modern high-quality product';
    setInitialPitch(pitch);
    const mockKit = getDomainMockBrandKit(pitch);
    setBrandKit(mockKit);
    setCurrentStep(STEPS.BRAND_KIT);
  }, [initialPitch]);

  /**
   * Reset state back to initial PITCH view
   */
  const resetDiscovery = useCallback(() => {
    setCurrentStep(STEPS.PITCH);
    setChatMessages([]);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setError(null);
    setBrandKit(null);
  }, []);

  return {
    // Current State
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

    // Setters & Actions
    setInitialPitch,
    startDiscovery,
    answerQuestion,
    goToQuestion,
    compileKit,
    loadMockPreview,
    resetDiscovery,
    STEPS
  };
}

export default useBrandDiscovery;
