/**
 * Interview Service — Socratic Question Generation
 *
 * Handles the logic for evaluating a conversation transcript and producing
 * the next Socratic question. Delegates Gemini API calls to geminiClient,
 * uses brandPrompts for system instructions, and falls back to mockEngine.
 */

import { generateStructuredJson, isLlmConfigured } from '../utils/llmClient.js';
import { classifyDomain, isFamilyIntent } from '../data/domainConfig.js';
import {
  buildQuestionSystemInstruction,
  buildBatchQuestionSystemInstruction,
  buildIntentRouterSystemInstruction,
  intentRouterSchema
} from '../prompts/brandPrompts.js';
import { getMockQuestion, getMockBatch } from './mockEngine.js';

/**
 * Heuristic fallback classifier for offline / error cases
 */
function fallbackClassifyIntent(text = '') {
  const clean = String(text || '').toLowerCase().trim();
  const chatPatterns = [
    /^(hi|hello|hey|yo|sup|howdy|greetings|hola|namaste)(\s+.*)?$/i,
    /^(who\s+are\s+you|what\s+is\s+this|what\s+do\s+you\s+do|how\s+does\s+this\s+work)/i,
    /^(why\s+isn'?t\s+this\s+working|is\s+this\s+on|is\s+this\s+working|test|help|asdf|qwerty)/i,
    /^(good\s+morning|good\s+afternoon|good\s+evening)/i,
    /^(thanks|thank\s+you|ok|okay|cool|nice|bye|goodbye)$/i
  ];

  if (clean.length < 8 || chatPatterns.some(p => p.test(clean))) {
    return {
      intent: 'CHAT',
      chatReply: "Hello! I'm your Socratic Brand Studio partner. Share a quick sentence about what product, company, or store you're dreaming of building, and we'll craft its identity together."
    };
  }

  return { intent: 'PITCH', chatReply: '' };
}

/**
 * Routes initial user input: classifies as CHAT or PITCH.
 * - If CHAT: returns { type: 'chat', message: chatReply }
 * - If PITCH: generates the 7-question discovery batch and returns { type: 'discovery', questions }
 * 
 * @param {string} initialPitch
 * @returns {Promise<{ type: 'chat' | 'discovery', message?: string, questions?: Array<Object> }>}
 */
export async function routeInitialInput(initialPitch = '') {
  const cleanText = String(initialPitch || '').trim();

  let classification = null;

  if (isLlmConfigured()) {
    try {
      const systemInstruction = buildIntentRouterSystemInstruction();
      const prompt = `User Input Message:\n"${cleanText}"\n\nClassify intent and generate chat reply if CHAT matching schema.`;

      const result = await generateStructuredJson({
        systemInstruction,
        prompt,
        schema: intentRouterSchema
      });

      if (result && (result.intent === 'CHAT' || result.intent === 'PITCH')) {
        classification = result;
      }
    } catch (llmError) {
      console.warn('[interviewService] Intent router LLM failed, using heuristic fallback:', llmError.message);
    }
  }

  if (!classification) {
    classification = fallbackClassifyIntent(cleanText);
  }

  // 1. If classified as CHAT, respond conversationally
  if (classification.intent === 'CHAT') {
    const message = classification.chatReply?.trim() ||
      "Hello! I'm your Socratic Brand Studio partner. Tell me what product, store, or company you want to build, and we'll craft its brand identity together.";
    return {
      type: 'chat',
      message
    };
  }

  // 2. If classified as PITCH, generate the full 7-stage discovery questions
  const questions = await generateInterviewBatch(cleanText);
  return {
    type: 'discovery',
    questions
  };
}

/**
 * JSON schema for upfront 7-question batch discovery
 */
export const batchQuestionSchema = {
  type: 'object',
  properties: {
    stageQuestions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          stageLabel: { type: 'string' },
          question: { type: 'string' },
          suggestedAnswers: {
            type: 'array',
            items: { type: 'string' }
          },
          reasoning: { type: 'string' }
        },
        required: ['id', 'stageLabel', 'question', 'suggestedAnswers', 'reasoning']
      }
    }
  },
  required: ['stageQuestions']
};

/**
 * Generates all 7 discovery questions upfront in a single batch call.
 * @param {string} initialPitch
 * @returns {Promise<Array<Object>>} Array of exactly 7 questions
 */
export async function generateInterviewBatch(initialPitch = '') {
  const pitchText = String(initialPitch || '').trim();
  const domain = classifyDomain(pitchText);
  const isFamily = isFamilyIntent(pitchText);

  if (isLlmConfigured()) {
    try {
      const systemInstruction = buildBatchQuestionSystemInstruction(domain, isFamily);
      const prompt = `Founder's Initial Concept Pitch:\n"${pitchText}"\n\nDetected Domain: ${domain.toUpperCase()}${isFamily ? ' (FAMILY DINING INTENT)' : ''}.\nGenerate the complete 7-question discovery batch now matching schema.`;

      const result = await generateStructuredJson({
        systemInstruction,
        prompt,
        schema: batchQuestionSchema
      });

      if (result && Array.isArray(result.stageQuestions) && result.stageQuestions.length >= 7) {
        return result.stageQuestions.slice(0, 7);
      }
      if (result && Array.isArray(result.stageQuestions) && result.stageQuestions.length > 0) {
        return result.stageQuestions;
      }
    } catch (llmError) {
      console.warn('[interviewService] LLM Batch generation failed, using mock batch fallback:', llmError.message);
    }
  }

  return getMockBatch(pitchText);
}

/**
 * Gemini JSON schema for the Socratic question response shape.
 */
export const questionSchema = {
  type: 'object',
  properties: {
    currentRound: {
      type: 'integer',
      description: 'Current interview round number (1, 2, 3, 4, 5, etc.).'
    },
    question: {
      type: 'string',
      description: 'Strictly under 25 words total. Exactly 1 or 2 clear sentences. No academic jargon.'
    },
    suggestedAnswers: {
      type: 'array',
      items: { type: 'string' },
      description: 'Exactly 3 distinct real choices. STRICT LIMIT: Under 6 words per option.'
    },
    reasoning: {
      type: 'string',
      description: '1 simple sentence explaining how this choice defines the brand identity or pricing.'
    },
    stageLabel: {
      type: 'string',
      description: 'Short 2-3 word stage title, e.g. Dinner Vibe, Kitchen Conviction, Signature Ritual.'
    },
    readyForSynthesis: {
      type: 'boolean',
      description: 'True if baseline context is sufficient for brand kit synthesis.'
    }
  },
  required: ['currentRound', 'question', 'suggestedAnswers', 'reasoning', 'stageLabel', 'readyForSynthesis']
};

/**
 * Generates the next Socratic question for a given conversation history.
 * Tries Gemini API first; falls back to deterministic mock on any failure.
 *
 * @param {Array<{role: string, content: string}>} history
 * @returns {Promise<Object>} Question response matching questionSchema
 */
export async function generateNextQuestion(history = []) {
  const userMessages = history.filter(m => m.role === 'user');
  const currentRound = Math.max(userMessages.length, 1);
  const readyForSynthesis = currentRound >= 3;

  const transcriptText = history.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n');
  const domain = classifyDomain(transcriptText);
  const isFamily = isFamilyIntent(transcriptText);

  if (isLlmConfigured()) {
    try {
      const systemInstruction = buildQuestionSystemInstruction(domain, isFamily, currentRound);
      const prompt = `Conversation Transcript:\n${transcriptText}\n\nDetected Domain: ${domain.toUpperCase()}${isFamily ? ' (FAMILY DINING INTENT)' : ''}.\nFormulate the next question for Round ${currentRound}. Return structured JSON matching schema.`;

      const result = await generateStructuredJson({ systemInstruction, prompt, schema: questionSchema });

      // Enforce consistency regardless of what the model returned
      result.currentRound = currentRound;
      result.readyForSynthesis = Boolean(result.readyForSynthesis || readyForSynthesis);
      if (!result.stageLabel) {
        result.stageLabel = _defaultStageLabel(currentRound, isFamily);
      }
      return result;
    } catch (llmError) {
      console.warn('[interviewService] LLM API call failed, using mock fallback:', llmError.message);
    }
  }

  return getMockQuestion(currentRound, transcriptText);
}

function _defaultStageLabel(round, isFamily) {
  if (isFamily) {
    if (round === 1) return 'Family Dining Flow';
    if (round === 2) return 'Kitchen Boundaries';
    return 'Family Ritual';
  }
  if (round === 1) return 'Target Audience';
  if (round === 2) return 'Core Differentiation';
  if (round === 3) return 'Brand Edge';
  return 'Strategic Moat';
}
