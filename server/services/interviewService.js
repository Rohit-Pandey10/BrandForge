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
  pitchEnhancerPrompt 
} from '../prompts/brandPrompts.js';
import { getMockQuestion, getMockBatch } from './mockEngine.js';

/**
 * JSON schema for Pitch Expansion & Concept Refinement Gate
 */
export const pitchEnhancerSchema = {
  type: 'object',
  properties: {
    concepts: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          expandedPitch: { type: 'string' },
          strategicAngle: { type: 'string' }
        },
        required: ['id', 'title', 'expandedPitch', 'strategicAngle']
      }
    }
  },
  required: ['concepts']
};

/**
 * Evaluates raw or fragmented user input and expands it into 2 distinct strategic concepts.
 * @param {string} rawInput
 * @returns {Promise<Array<Object>>} Exactly 2 concepts: [{ id, title, expandedPitch, strategicAngle }]
 */
export async function expandRawPitch(rawInput = '') {
  const cleanInput = String(rawInput || '').trim();
  const domain = classifyDomain(cleanInput);

  if (isLlmConfigured()) {
    try {
      const prompt = `Raw User Concept Input:
"${cleanInput}"

Detected General Domain: ${domain.toUpperCase()}

Transform this input into exactly 2 distinct, highly ambitious brand concepts matching the schema.`;

      const result = await generateStructuredJson({
        systemInstruction: pitchEnhancerPrompt,
        prompt,
        schema: pitchEnhancerSchema
      });

      if (result && Array.isArray(result.concepts) && result.concepts.length >= 2) {
        return result.concepts.slice(0, 2);
      }
    } catch (err) {
      console.warn('[interviewService] LLM Pitch expansion failed, using smart fallback:', err.message);
    }
  }

  return getFallbackConcepts(cleanInput, domain);
}

function getFallbackConcepts(input, domain) {
  const lower = (input || '').toLowerCase();

  // If broken / casual / meta query
  if (!input || lower.includes('work') || lower.includes('idk') || lower.includes('test') || lower.length < 8) {
    return [
      {
        id: 'concept_a',
        title: 'IncidentZero AI Debugger',
        expandedPitch: 'An autonomous runtime debugging agent that pinpoints flaky microservices and halting state errors before customers notice.',
        strategicAngle: 'Zero-downtime reliability for distributed high-velocity engineering teams.'
      },
      {
        id: 'concept_b',
        title: 'BareMetal Observability',
        expandedPitch: 'A deterministic telemetry and log tracing suite engineered for low-overhead kernel and Rust backend architectures.',
        strategicAngle: 'Raw sub-millisecond performance without proprietary SaaS tracing tax.'
      }
    ];
  }

  // If culinary / dining / pizza
  if (domain === 'hospitality' || lower.includes('pizza') || lower.includes('food') || lower.includes('eat') || lower.includes('restaurant')) {
    return [
      {
        id: 'concept_a',
        title: 'Ferment & Hearth Slice Bar',
        expandedPitch: 'A fast-casual counter serving 72-hour naturally fermented sourdough pizza slices paired with organic botanical sodas.',
        strategicAngle: 'High-speed artisan street dining for urban lunch crowds and late-night purists.'
      },
      {
        id: 'concept_b',
        title: 'Lucca Family Woodfire Hearth',
        expandedPitch: 'A warm, rustic neighborhood trattoria centered around oak-fired ovens, generous communal sharing tables, and honest regional ingredients.',
        strategicAngle: 'Wholesome, unpretentious family dining with zero fussy culinary pretension.'
      }
    ];
  }

  // If fashion / apparel / denim
  if (domain === 'fashion' || lower.includes('denim') || lower.includes('jeans') || lower.includes('clothes') || lower.includes('wear')) {
    return [
      {
        id: 'concept_a',
        title: 'Kuro Raw Selvedge Studio',
        expandedPitch: 'Unwashed 14oz Japanese shuttle-loom denim built with copper hardware for creators and architects seeking timeless silhouettes.',
        strategicAngle: 'Radical durability and anti-fast-fashion craft with authentic indigo fades.'
      },
      {
        id: 'concept_b',
        title: 'Modular Indigo Workshop',
        expandedPitch: 'Upcycled circular streetwear designed with reinforced knee articulation, modular utility pockets, and free lifetime repairs.',
        strategicAngle: 'Tactical zero-waste uniform engineered for everyday city life.'
      }
    ];
  }

  // General default fallback
  const label = input.length > 25 ? input.slice(0, 22) + '...' : input;
  return [
    {
      id: 'concept_a',
      title: `${label} Studio`,
      expandedPitch: `A streamlined, high-signal modern solution designed to strip away legacy friction for discerning modern professionals.`,
      strategicAngle: 'Extreme clarity and precision tailored for immediate daily utility.'
    },
    {
      id: 'concept_b',
      title: `${label} Collective`,
      expandedPitch: `An artisanal, high-touch craft alternative built around sustainable materials and transparent customer trust.`,
      strategicAngle: 'Premium uncompromising execution over commoditized mass market competition.'
    }
  ];
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
          reasoning: { type: 'string' },
          allowMultiple: { type: 'boolean' }
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
      const systemInstruction = buildBatchQuestionSystemInstruction(domain, isFamily, { rawPitch: pitchText });
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
    },
    allowMultiple: {
      type: 'boolean',
      description: 'Optional flag indicating if multiple choices can be selected.'
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

  const firstPitch = userMessages[0]?.content || '';
  if (isLlmConfigured()) {
    try {
      const systemInstruction = buildQuestionSystemInstruction(domain, isFamily, currentRound, { rawPitch: firstPitch });
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
