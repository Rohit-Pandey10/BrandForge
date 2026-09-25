// server/llmClient.js
import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config({ override: true });

// Priority list for Groq models with graceful fallback
const GROQ_CANDIDATE_MODELS = [
  process.env.GROQ_MODEL,
  'llama-3.3-70b-versatile',
  'qwen/qwen3.8-27b',
  'llama-3.1-8b-instant'
].filter(Boolean);

const GEMINI_CANDIDATE_MODELS = Array.from(
  new Set(
    [
      process.env.GEMINI_MODEL,
      'gemini-3.6-flash',
      'gemini-3.5-flash',
      'gemini-3.8-flash',
      'gemini-flash-latest',
      'gemini-3.1-flash-lite',
      'gemini-2.5-flash'
    ].filter(Boolean)
  )
);

/**
 * Returns true if at least one LLM provider is configured.
 */
export function isLlmConfigured() {
  return Boolean(process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY);
}

/**
 * Generates structured JSON using Groq as PRIMARY with automatic failover to Gemini.
 */
export async function generateStructuredJson(options) {
  const { systemInstruction, prompt, schema, apiKey, groqApiKey } = options;

  const effectiveGroqKey = (groqApiKey && groqApiKey.trim()) || process.env.GROQ_API_KEY || null;
  const effectiveGeminiKey = (apiKey && apiKey.trim()) || process.env.GEMINI_API_KEY || null;
  const preferredProvider = (process.env.LLM_PROVIDER || 'groq').trim().toLowerCase();

  // 1. PRIMARY: Try Groq if key is present and preferred (or as default)
  if (effectiveGroqKey && (preferredProvider === 'groq' || !effectiveGeminiKey)) {
    console.log('[LLM Client] Dispatching request to Groq (Primary)...');
    const groq = new Groq({ apiKey: effectiveGroqKey });

    for (let i = 0; i < GROQ_CANDIDATE_MODELS.length; i++) {
      const model = GROQ_CANDIDATE_MODELS[i];
      try {
        const response = await groq.chat.completions.create({
          model,
          messages: [
            {
              role: 'system',
              content: `${systemInstruction}\n\nSTRICT JSON ENFORCEMENT:\nYou must return ONLY a raw JSON object matching the requested schema. Do not include markdown code blocks, backticks, or commentary.${schema ? `\nSchema:\n${JSON.stringify(schema)}` : ''}`
            },
            { role: 'user', content: prompt }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.7
        });

        const raw = response.choices[0]?.message?.content || '{}';
        const clean = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
        return JSON.parse(clean);
      } catch (err) {
        console.warn(`[LLM Client] Groq model [${model}] failed (${err.message}). Trying fallback...`);
        if (i === GROQ_CANDIDATE_MODELS.length - 1) {
          console.warn('[LLM Client] All Groq models exhausted. Failing over to Gemini...');
        }
      }
    }
  }

  // 2. BACKUP / SECONDARY: Gemini
  if (effectiveGeminiKey) {
    console.log('[LLM Client] Dispatching request to Google Gemini (Backup)...');

    for (let i = 0; i < GEMINI_CANDIDATE_MODELS.length; i++) {
      const model = GEMINI_CANDIDATE_MODELS[i];
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${effectiveGeminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: prompt }] }],
              systemInstruction: { parts: [{ text: systemInstruction }] },
              generationConfig: {
                responseMimeType: 'application/json',
                temperature: 0.7
              }
            })
          }
        );

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`Gemini API Error ${response.status}: ${errText}`);
        }

        const data = await response.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!rawText) throw new Error(`No candidate content received from Gemini model ${model}`);

        const clean = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
        return JSON.parse(clean);
      } catch (err) {
        console.warn(`[LLM Client] Gemini model [${model}] failed (${err.message}). Trying fallback...`);
      }
    }
  }

  throw new Error('No functional LLM provider available (both Groq and Gemini failed or keys not configured).');
}
