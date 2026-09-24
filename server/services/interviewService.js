/**
 * Interview Service — Socratic Question Generation
 *
 * Handles the logic for evaluating a conversation transcript and producing
 * the next Socratic question. Delegates Gemini API calls to geminiClient,
 * uses brandPrompts for system instructions, and falls back to mockEngine.
 */

import { generateStructuredJson, getGeminiClient } from '../utils/geminiClient.js';
import { classifyDomain, isFamilyIntent } from '../data/domainConfig.js';
import { buildQuestionSystemInstruction } from '../prompts/brandPrompts.js';
import { getMockQuestion } from './mockEngine.js';

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

  if (getGeminiClient()) {
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
    } catch (geminiError) {
      console.warn('[interviewService] Gemini API failed, using mock fallback:', geminiError.message);
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
