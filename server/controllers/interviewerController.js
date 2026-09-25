/**
 * Interviewer Controller — Slim Route Handlers
 *
 * Validates request inputs, delegates to services, and handles error responses.
 * No business logic, no inline prompts, no mock data here.
 *
 * Service layer:
 *   interviewService  → Socratic question generation
 *   compilerService   → Brand kit synthesis
 */

import { generateNextQuestion, generateInterviewBatch, expandRawPitch } from '../services/interviewService.js';
import { compileBrandKit } from '../services/compilerService.js';

// Re-export schemas for backwards compatibility with existing tests
export { questionSchema, batchQuestionSchema, pitchEnhancerSchema } from '../services/interviewService.js';
export { brandKitSchema } from '../services/compilerService.js';

// Re-export domain helpers so existing imports from old controller still work
export { classifyDomain as extractDomain, isFamilyIntent } from '../data/domainConfig.js';

/**
 * POST /api/interview/expand-pitch
 * Evaluates raw/vague/broken user input and returns 2 distinct, high-conviction concepts.
 */
export async function handleExpandPitch(req, res) {
  try {
    const rawPitch = req.body.rawPitch || req.body.pitch || req.body.initialPitch || '';

    if (!rawPitch || typeof rawPitch !== 'string' || !rawPitch.trim()) {
      return res.status(400).json({ error: 'Invalid request', details: 'rawPitch must be a non-empty string' });
    }

    const concepts = await expandRawPitch(rawPitch.trim());
    return res.status(200).json({ concepts });
  } catch (error) {
    console.error('[interviewerController] Error in handleExpandPitch:', error);
    return res.status(500).json({ error: 'Failed to expand pitch', details: error.message });
  }
}

/**
 * Validates that the history payload is a well-formed array of chat messages.
 * @param {*} history
 * @returns {string|null} Error message or null if valid.
 */
function validateHistory(history) {
  if (!Array.isArray(history)) return 'history must be an array';
  if (history.length > 50) return 'history exceeds maximum length of 50 turns';
  for (const msg of history) {
    if (!msg || typeof msg.role !== 'string' || typeof msg.content !== 'string') {
      return 'each history entry must have a string role and content field';
    }
  }
  return null;
}

/**
 * POST /api/interview/start
 * Generates the full 7-question discovery batch upfront from initial pitch.
 */
export async function handleStartInterview(req, res) {
  try {
    const initialPitch = req.body.initialPitch || req.body.pitch || (Array.isArray(req.body.history) && req.body.history[0]?.content) || '';

    if (!initialPitch || typeof initialPitch !== 'string' || !initialPitch.trim()) {
      return res.status(400).json({ error: 'Invalid request', details: 'initialPitch must be a non-empty string' });
    }

    const questions = await generateInterviewBatch(initialPitch.trim());
    return res.status(200).json({ questions });
  } catch (error) {
    console.error('[interviewerController] Error in handleStartInterview:', error);
    return res.status(500).json({ error: 'Failed to generate interview batch', details: error.message });
  }
}

/**
 * POST /api/interview/next
 * Evaluates the conversation history and returns the next Socratic question.
 */
export async function handleNextQuestion(req, res) {
  try {
    const { history = [] } = req.body;

    const validationError = validateHistory(history);
    if (validationError) {
      return res.status(400).json({ error: 'Invalid request', details: validationError });
    }

    const result = await generateNextQuestion(history);
    return res.status(200).json(result);
  } catch (error) {
    console.error('[interviewerController] Error in handleNextQuestion:', error);
    return res.status(500).json({ error: 'Failed to process interview question', details: error.message });
  }
}

/**
 * POST /api/interview/compile
 * Synthesizes the full conversation transcript or 7 Q&A pairs into a structured Brand Kit.
 */
export async function handleCompileBrandKit(req, res) {
  try {
    const payload = req.body;

    // Support both new { qaPairs, initialPitch } / { answers } and legacy { history }
    const result = await compileBrandKit(payload);
    return res.status(200).json(result);
  } catch (error) {
    console.error('[interviewerController] Error in handleCompileBrandKit:', error);
    return res.status(500).json({ error: 'Failed to compile brand kit', details: error.message });
  }
}
