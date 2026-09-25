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
    isValidPremise: { type: 'boolean' },
    retryMessage: { type: 'string' },
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
  required: ['isValidPremise']
};

/**
 * Checks for obvious keyboard spam, single-word gibberish, or incoherent phrases
 */
export function isGibberishInput(input = '') {
  const clean = String(input || '').trim().toLowerCase();
  if (!clean || clean.length < 3) return true;
  // Repeated character spam (e.g. "asdfgh", "aaaa", "zzzz")
  if (/^([a-z0-9])\1{2,}$/i.test(clean)) return true;
  // Keyboard mashing
  if (/^(asdf|qwert|zxcvb|hjkl|poiuy)/i.test(clean) && clean.length <= 10) return true;
  // Known incoherent / fragmented nonsense phrases
  const knownNonsense = [
    'school make', 'make do thing', 'thing do', 'do thing', 'make thing',
    'why u not', 'make make', 'do do', 'thing make', 'thing thing',
    'idk do', 'not work', 'test test', 'make do', 'do make'
  ];
  if (knownNonsense.includes(clean)) return true;
  return false;
}

/**
 * Evaluates raw or fragmented user input and expands it into 2 distinct strategic concepts.
 * Validates coherence first to intercept gibberish/nonsense.
 * @param {string} rawInput
 * @returns {Promise<Object>} { isValidPremise: boolean, retryMessage?: string, concepts?: Array<Object> }
 */
export async function expandRawPitch(rawInput = '') {
  const cleanInput = String(rawInput || '').trim();
  const domain = classifyDomain(cleanInput);

  if (isGibberishInput(cleanInput)) {
    return {
      isValidPremise: false,
      retryMessage: "That premise is a bit too fragmented to extract a defensible market angle. Try describing your product or business in a short phrase (e.g., 'An artisanal sourdough bakery' or 'A low-latency database for fintech')."
    };
  }

  if (isLlmConfigured()) {
    try {
      const prompt = `Raw User Concept Input:
"${cleanInput}"

Detected General Domain: ${domain.toUpperCase()}

VALIDATION CHECK (CRITICAL FIRST PASS):
Evaluate if the input contains a discernible business, product, service, or creator premise.
If it is nonsense, keyboard spam, fragmented gibberish, or completely incoherent, immediately return isValidPremise=false with an encouraging retryMessage.
If valid, transform this input into exactly 2 distinct, highly ambitious brand concepts matching the schema.`;

      const result = await generateStructuredJson({
        systemInstruction: pitchEnhancerPrompt,
        prompt,
        schema: pitchEnhancerSchema
      });

      if (result) {
        if (result.isValidPremise === false || result.retryMessage) {
          return {
            isValidPremise: false,
            retryMessage: result.retryMessage || "That premise is a bit too fragmented to extract a defensible market angle. Try describing your product or business in a short phrase (e.g., 'An artisanal sourdough bakery' or 'A low-latency database for fintech')."
          };
        }
        if (Array.isArray(result.concepts) && result.concepts.length >= 2) {
          return {
            isValidPremise: true,
            concepts: result.concepts.slice(0, 2)
          };
        }
      }
    } catch (err) {
      console.warn('[interviewService] LLM Pitch expansion failed, using smart fallback:', err.message);
    }
  }

  // Fallback mode: check if input is vague/broken
  const lower = cleanInput.toLowerCase();
  if (lower.length < 8 || lower.includes('work') || lower.includes('idk') || lower.includes('test')) {
    return {
      isValidPremise: false,
      retryMessage: "That premise is a bit too fragmented to extract a defensible market angle. Try describing your product or business in a short phrase (e.g., 'An artisanal sourdough bakery' or 'A low-latency database for fintech')."
    };
  }

  return {
    isValidPremise: true,
    concepts: getFallbackConcepts(cleanInput, domain)
  };
}

function getFallbackConcepts(input, domain) {
  const lower = (input || '').toLowerCase();

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

  // If beverage / drinks
  if (domain === 'beverage' || lower.includes('drink') || lower.includes('tea') || lower.includes('soda') || lower.includes('coffee') || lower.includes('water')) {
    return [
      {
        id: 'concept_a',
        title: 'Kura Botanical Elixirs',
        expandedPitch: 'Clean sparkling adaptogenic energy elixirs formulated with organic botanicals and slow-burn caffeine.',
        strategicAngle: 'Sustained cognitive focus without sugar spikes, synthetic taurine, or 3 PM jitters.'
      },
      {
        id: 'concept_b',
        title: 'Aura Cold-Brew Ritual',
        expandedPitch: 'Single-origin nitrogen cold brew steeped for 24 hours with organic oat milk and functional Lion\'s Mane.',
        strategicAngle: 'Elevated morning cafe ritual packaged for on-the-go creative professionals.'
      }
    ];
  }

  // If fashion / apparel / denim
  if (domain === 'fashion' || lower.includes('denim') || lower.includes('jeans') || lower.includes('clothes') || lower.includes('wear')) {
    return [
      {
        id: 'concept_a',
        title: 'Atelier Selvaggio',
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
      strategicAngle: 'High-touch personal care centered on durability and human connection.'
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
