import Groq from 'groq-sdk';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Robustly load .env from server dir, root dir, or cwd
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

let _groq = null;
function getGroqClient() {
  if (!_groq && process.env.GROQ_API_KEY) {
    _groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return _groq;
}

let _gemini = null;
function getGeminiClient() {
  if (!_gemini && process.env.GEMINI_API_KEY) {
    _gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return _gemini;
}

/**
 * Returns true if at least one LLM provider is configured.
 */
export function isLlmConfigured() {
<<<<<<< HEAD
  const provider = (process.env.LLM_PROVIDER || 'groq').replace(/['"]/g, '').trim().toLowerCase();
  if (provider === 'groq' && Boolean(process.env.GROQ_API_KEY)) return true;
  return Boolean(process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY);
=======
  const provider = (process.env.LLM_PROVIDER || 'groq').split('#')[0].replace(/['"]/g, '').trim().toLowerCase();
  if (provider === 'groq' && groq) return true;
  return Boolean(groq || gemini);
>>>>>>> dc9bada763cc7d97945289cc141d87886243899d
}

export const getLlmClient = isLlmConfigured;

// Priority list for Groq models with graceful fallback for decommissioned or rate-limited model IDs
const GROQ_CANDIDATE_MODELS = [
  process.env.GROQ_MODEL,
<<<<<<< HEAD
  'openai/gpt-oss-120b',
  'qwen/qwen3.8-27b',
  'openai/gpt-oss-20b',
=======
  'qwen/qwen3.8-27b',
  'openai/gpt-oss-20b',
  'openai/gpt-oss-120b',
>>>>>>> dc9bada763cc7d97945289cc141d87886243899d
  'llama-3.3-70b-versatile'
].filter(Boolean);

/**
 * Generates structured JSON using Groq as primary with automatic fallback to Gemini.
 *
 * @param {Object} options
 * @param {string} options.systemInstruction
 * @param {string} options.prompt
 * @param {Object} options.schema
 * @returns {Promise<Object>}
 */
export async function generateStructuredJson({ systemInstruction, prompt, schema }) {
<<<<<<< HEAD
  const provider = (process.env.LLM_PROVIDER || 'groq').replace(/['"]/g, '').trim().toLowerCase();
  const groq = getGroqClient();
  const gemini = getGeminiClient();

  // Primary: Try Groq if selected and configured
  if (provider === 'groq' && groq) {
    console.log('[LLM Client] Dispatching request to Groq...');

    for (let i = 0; i < GROQ_CANDIDATE_MODELS.length; i++) {
      const groqModel = GROQ_CANDIDATE_MODELS[i];
      try {
        console.log(`[LLM Client] Attempting Groq model: ${groqModel}`);
=======
  const provider = (process.env.LLM_PROVIDER || 'groq').split('#')[0].replace(/['"]/g, '').trim().toLowerCase();

  // Primary: Try Groq if selected and configured
  if (provider === 'groq' && groq) {
    for (let i = 0; i < GROQ_CANDIDATE_MODELS.length; i++) {
      const groqModel = GROQ_CANDIDATE_MODELS[i];
      try {
        console.log(`[LLM Client] Dispatching request to Groq (${groqModel})...`);
>>>>>>> dc9bada763cc7d97945289cc141d87886243899d
        const response = await groq.chat.completions.create({
          model: groqModel,
          messages: [
            {
              role: 'system',
              content: `${systemInstruction}\n\nSTRICT JSON ENFORCEMENT:\nYou must return ONLY a raw JSON object matching this schema. Do not include markdown code blocks, backticks, or commentary.\nSchema:\n${JSON.stringify(schema)}`
            },
            { role: 'user', content: prompt }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.65
        });

        const raw = response.choices[0]?.message?.content || '{}';
        return JSON.parse(raw);
      } catch (err) {
<<<<<<< HEAD
        const msg = (err.message || '').toLowerCase();
        const isModelUnavailable = err.status === 404 || err.status === 400 || msg.includes('does not exist') || msg.includes('decommissioned');
        if (isModelUnavailable && i < GROQ_CANDIDATE_MODELS.length - 1) {
          console.warn(`[LLM Client] Model ${groqModel} unavailable, trying next candidate...`);
=======
        console.warn(`[LLM Client] Groq model ${groqModel} failed:`, err?.message || err);
        if (i < GROQ_CANDIDATE_MODELS.length - 1) {
          // Failover to next candidate model
>>>>>>> dc9bada763cc7d97945289cc141d87886243899d
          continue;
        }
        console.warn('[LLM Client] All Groq candidate models exhausted. Falling back to Gemini...');
        break;
      }
    }
  }

  // Fallback: Gemini (@google/genai)
  if (gemini) {
    console.log('[LLM Client] Dispatching request to Gemini SDK...');
    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const response = await gemini.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: schema,
        temperature: 0.65
      }
    });

    const text = response.text?.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim() || '{}';
    return JSON.parse(text);
  }

  throw new Error('No functional LLM provider available (both Groq and Gemini failed or missing keys).');
}

export default {
  generateStructuredJson,
  isLlmConfigured,
  getLlmClient
};
