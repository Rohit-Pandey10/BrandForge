import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

let aiClientInstance = null;

/**
 * Returns a singleton instance of the GoogleGenAI SDK.
 * Returns null if the GEMINI_API_KEY is missing or contains placeholder text.
 */
export function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here' || apiKey.trim() === '') {
    return null;
  }

  if (!aiClientInstance) {
    aiClientInstance = new GoogleGenAI({ apiKey });
  }
  return aiClientInstance;
}

/**
 * Helper to strip markdown code fences (e.g. ```json ... ```) from model output.
 */
function cleanJsonString(str) {
  if (!str) return '{}';
  return str
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
}

const DEFAULT_MODEL = process.env.GEMINI_MODEL || "gemini-3.6-flash";
const CANDIDATE_MODELS = [
  'gemini-3.6-flash',
  'gemini-3-flash-preview',
  'gemini-flash-lite-latest',
  'gemini-3.8-flash',
  'gemini-flash-latest'
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Checks if an error is transient (e.g., 429 rate limit or 503 overloaded/high demand).
 */
function isTransientError(error) {
  if (!error) return false;
  const status = error.status || error.code || (error.error && error.error.code);
  const msg = (error.message || '').toLowerCase();
  return (
    status === 429 ||
    status === 503 ||
    msg.includes('429') ||
    msg.includes('503') ||
    msg.includes('quota') ||
    msg.includes('rate limit') ||
    msg.includes('overloaded') ||
    msg.includes('unavailable') ||
    msg.includes('high demand') ||
    msg.includes('spikes in demand')
  );
}

/**
 * Generates structured JSON using Google GenAI SDK with multi-model failover and exponential backoff.
 * 
 * @param {Object} options
 * @param {string} [options.systemInstruction] - High-level system behavior prompt
 * @param {string|Array} options.prompt - Prompt content
 * @param {Object} [options.schema] - JSON Schema to enforce
 * @param {string} [options.model] - Model name (defaults to GEMINI_MODEL env or gemini-3.6-flash)
 * @returns {Promise<Object>} Parsed JSON object matching the requested schema
 */
export async function generateStructuredJson({
  systemInstruction,
  prompt,
  schema,
  model = DEFAULT_MODEL
}) {
  const ai = getGeminiClient();

  if (!ai) {
    throw new Error('GEMINI_CLIENT_UNCONFIGURED: GEMINI_API_KEY is missing or invalid.');
  }

  const config = {
    responseMimeType: 'application/json'
  };

  if (schema) {
    config.responseSchema = schema;
  }

  if (systemInstruction) {
    config.systemInstruction = systemInstruction;
  }

  const contents = Array.isArray(prompt) ? prompt : [prompt];
  
  // Model attempt queue: start with requested model, then fallbacks if quota/404 hit
  const modelsToTry = [model, ...CANDIDATE_MODELS.filter(m => m !== model)];

  for (let modelIdx = 0; modelIdx < modelsToTry.length; modelIdx++) {
    const currentModel = modelsToTry[modelIdx];
    const isLastModel = modelIdx === modelsToTry.length - 1;
    const maxRetries = 2;
    const baseDelays = [1000, 2000];

    console.log(`[Gemini SDK] Dispatching prompt to ${currentModel}`);

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const generatePromise = ai.models.generateContent({
          model: currentModel,
          contents,
          config
        });

        let timerId;
        const timeoutPromise = new Promise((_, reject) => {
          timerId = setTimeout(() => {
            const err = new Error(`TIMEOUT: Call to ${currentModel} exceeded 25000ms`);
            err.status = 503;
            reject(err);
          }, 25000);
        });

        const response = await Promise.race([generatePromise, timeoutPromise]).finally(() => {
          clearTimeout(timerId);
        });

        const rawText = response.text ? response.text.trim() : '';
        if (!rawText) {
          throw new Error('Empty response received from Gemini model.');
        }

        const cleaned = cleanJsonString(rawText);
        return JSON.parse(cleaned);
      } catch (error) {
        const msg = (error.message || '').toLowerCase();
        const isQuotaExhausted = error.status === 429 || msg.includes('quota exceeded') || msg.includes('rate limit');
        const isModelUnavailable = error.status === 404 || msg.includes('no longer available') || msg.includes('not found');

        // If quota exhausted for the project, immediately fall back to domain-adaptive engine without stalling
        if (isQuotaExhausted) {
          console.warn(`[Gemini SDK] Free-tier project quota exhausted. Immediately transitioning to high-fidelity domain synthesizer.`);
          throw error;
        }

        // If model not available on this tier, switch immediately to backup model
        if (isModelUnavailable && !isLastModel) {
          console.warn(`[Gemini SDK] Model ${currentModel} returned 404. Switching to backup model ${modelsToTry[modelIdx + 1]}...`);
          break; // break retry loop to try next model
        }

        const isTransient = isTransientError(error);
        const canRetry = attempt < maxRetries && isTransient;

        if (canRetry) {
          const jitter = Math.floor(Math.random() * 250);
          const delay = baseDelays[attempt] + jitter;
          console.warn(`[Gemini SDK] Transient error on ${currentModel} (${error.status || error.message}), retrying attempt ${attempt + 1}/${maxRetries} after ${delay}ms...`);
          await sleep(delay);
          continue;
        }

        if (isLastModel) {
          console.error(`[geminiClient] All candidate models exhausted. Final error on ${currentModel}:`, error.message);
          throw error;
        }
        break; // try next candidate model
      }
    }
  }
}
