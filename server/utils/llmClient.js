import Groq from 'groq-sdk';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;
const gemini = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;

/**
 * Returns true if at least one LLM provider is configured.
 */
export function isLlmConfigured() {
  const provider = (process.env.LLM_PROVIDER || 'groq').replace(/['"]/g, '').trim().toLowerCase();
  if (provider === 'groq' && groq) return true;
  return Boolean(groq || gemini);
}

export const getLlmClient = isLlmConfigured;

// Priority list for Groq models with graceful fallback for decommissioned model IDs
const GROQ_CANDIDATE_MODELS = [
  process.env.GROQ_MODEL,
  'llama-3.3-70b-versatile',
  'openai/gpt-oss-120b',
  'qwen/qwen3.8-27b',
  'openai/gpt-oss-20b'
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
  const provider = (process.env.LLM_PROVIDER || 'groq').replace(/['"]/g, '').trim().toLowerCase();

  // Primary: Try Groq if selected and configured
  if (provider === 'groq' && groq) {
    console.log('[LLM Client] Dispatching request to Groq (llama-3.3-70b-versatile)...');

    for (let i = 0; i < GROQ_CANDIDATE_MODELS.length; i++) {
      const groqModel = GROQ_CANDIDATE_MODELS[i];
      try {
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
          temperature: 0.6
        });

        const raw = response.choices[0]?.message?.content || '{}';
        return JSON.parse(raw);
      } catch (err) {
        const msg = (err.message || '').toLowerCase();
        const isModelUnavailable = err.status === 404 || err.status === 400 || msg.includes('does not exist') || msg.includes('decommissioned');
        if (isModelUnavailable && i < GROQ_CANDIDATE_MODELS.length - 1) {
          // Model decommissioned or unavailable on current Groq tier — failover to active Groq model
          continue;
        }
        console.warn('[LLM Client] Groq call failed or rate-limited. Falling back to Gemini...', err.message);
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
        temperature: 0.6
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
