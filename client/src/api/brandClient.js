/**
 * Brand Builder API Client Utility
 * Location: client/src/api/brandClient.js
 * 
 * Provides typed, resilient HTTP fetching methods connecting to the Express
 * backend running at http://localhost:5001.
 * 
 * Endpoints:
 *   - GET  /health               -> Server runtime & active LLM provider check
 *   - POST /api/interview/start  -> Generates 7 progressive Socratic questions upfront
 *   - POST /api/interview/compile-> Synthesizes transcript into structured BrandKit
 */

import {
  getDomainMockBatch,
  getDomainMockBrandKit
} from '../data/mockBrandData.js';

// Respect configured env vars or fall back to local proxy / direct port
const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Universal JSON fetch helper with timeout and error handling.
 */
async function request(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeout || 35000);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(options.headers || {})
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorBody = {};
      try {
        errorBody = await response.json();
      } catch {
        // Non-JSON response
      }
      const message = errorBody.details || errorBody.error || errorBody.message || `HTTP ${response.status}: ${response.statusText}`;
      const err = new Error(message);
      err.status = response.status;
      err.details = errorBody;
      throw err;
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error(`Request timed out after ${options.timeout || 35000}ms`);
    }
    throw error;
  }
}

/**
 * 1. Checks backend server health & active LLM provider (Groq / Gemini).
 * @returns {Promise<{ status: string, service: string, provider: string, groqConfigured: boolean, geminiConfigured: boolean, model: string, uptime: number }>}
 */
export async function checkHealth() {
  try {
    return await request('/health', { method: 'GET', timeout: 6000 });
  } catch (error) {
    console.warn('[brandClient] Health check failed, server might be offline:', error.message);
    return {
      status: 'offline',
      service: 'brand-builder-server',
      provider: 'mock-offline',
      groqConfigured: false,
      geminiConfigured: false,
      model: 'deterministic-mock-engine',
      uptime: 0
    };
  }
}

/**
 * 2. Starts discovery interview: generates all 7 Socratic questions upfront in one batch call.
 * 
 * @param {string} initialPitch - Founder's one-sentence initial product or company pitch
 * @returns {Promise<{ questions: Array<{ id: number, stageLabel: string, question: string, suggestedAnswers: string[], reasoning: string }> }>}
 */
export async function startInterview(initialPitch) {
  const cleanPitch = String(initialPitch || '').trim();
  if (!cleanPitch) {
    throw new Error('Initial pitch cannot be empty');
  }

  try {
    const data = await request('/api/interview/start', {
      method: 'POST',
      body: JSON.stringify({ initialPitch: cleanPitch }),
      timeout: 30000
    });

    if (data && data.type === 'chat') {
      return {
        type: 'chat',
        message: data.message || "Hello! What kind of brand or product are you planning to build?"
      };
    }

    if (data && (data.type === 'discovery' || Array.isArray(data.questions))) {
      return {
        type: 'discovery',
        questions: data.questions || []
      };
    }

    throw new Error('Backend returned invalid response structure');
  } catch (error) {
    console.warn('[brandClient] startInterview failed or timed out. Falling back to domain mock batch:', error.message);
    // Deterministic domain-adaptive fallback
    const fallbackQuestions = getDomainMockBatch(cleanPitch);
    return {
      type: 'discovery',
      questions: fallbackQuestions
    };
  }
}

/**
 * 3. Compiles the interview responses into a structured BrandKit JSON object.
 * 
 * @param {Object} payload
 * @param {string} payload.initialPitch - Original founder pitch
 * @param {Array<{ id?: number, stageLabel?: string, question: string, answer: string }>} payload.qaPairs - Array of answered questions
 * @param {Object} [payload.answers] - Optional map of index to answer string
 * @returns {Promise<Object>} Full BrandKit object
 */
export async function compileBrandKit({ initialPitch, qaPairs = [], answers = {} }) {
  const cleanPitch = String(initialPitch || '').trim();

  try {
    const data = await request('/api/interview/compile', {
      method: 'POST',
      body: JSON.stringify({
        initialPitch: cleanPitch,
        qaPairs,
        answers
      }),
      timeout: 45000
    });

    if (data && data.brandStrategy && data.visualTokens) {
      return data;
    }
    throw new Error('Backend returned incomplete BrandKit structure');
  } catch (error) {
    console.warn('[brandClient] compileBrandKit failed or timed out. Falling back to domain mock kit:', error.message);
    // Deterministic domain-adaptive fallback
    return getDomainMockBrandKit(cleanPitch);
  }
}

export default {
  checkHealth,
  startInterview,
  compileBrandKit
};
