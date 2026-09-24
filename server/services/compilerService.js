/**
 * Compiler Service — Brand Kit Synthesis
 *
 * Takes a full conversation transcript and synthesizes a complete, structured
 * Brand Kit: strategy, voice system, visual tokens, and launch content.
 * Delegates to Gemini when available, falls back to mockEngine.
 */

import { generateStructuredJson, getGeminiClient } from '../utils/geminiClient.js';
import { classifyDomain, isFamilyIntent } from '../data/domainConfig.js';
import { buildCompileSystemInstruction } from '../prompts/brandPrompts.js';
import { getMockBrandKit } from './mockEngine.js';

/**
 * Gemini JSON schema for the Brand Kit compilation response.
 */
export const brandKitSchema = {
  type: 'object',
  properties: {
    brandStrategy: {
      type: 'object',
      properties: {
        brandName: { type: 'string' },
        tagline: { type: 'string' },
        mission: { type: 'string' },
        targetAudience: { type: 'string' },
        coreValueProposition: { type: 'string' },
        antiHero: { type: 'string' },
        differentiator: { type: 'string' }
      },
      required: ['brandName', 'tagline', 'mission', 'targetAudience', 'coreValueProposition', 'antiHero', 'differentiator']
    },
    voiceSystem: {
      type: 'object',
      properties: {
        archetype: { type: 'string' },
        tone: { type: 'array', items: { type: 'string' } },
        dos: { type: 'array', items: { type: 'string' } },
        donts: { type: 'array', items: { type: 'string' } },
        vocabularyWords: { type: 'array', items: { type: 'string' } }
      },
      required: ['archetype', 'tone', 'dos', 'donts', 'vocabularyWords']
    },
    visualTokens: {
      type: 'object',
      properties: {
        palette: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              hex: { type: 'string' },
              role: { type: 'string', enum: ['primary', 'secondary', 'accent', 'surface', 'text'] }
            },
            required: ['name', 'hex', 'role']
          }
        },
        typography: {
          type: 'object',
          properties: {
            headingFont: { type: 'string' },
            bodyFont: { type: 'string' },
            googleFontsUrl: { type: 'string' },
            rationale: { type: 'string' }
          },
          required: ['headingFont', 'bodyFont', 'googleFontsUrl']
        },
        stylePhilosophy: { type: 'string' },
        borderCurvature: { type: 'string' }
      },
      required: ['palette', 'typography', 'stylePhilosophy', 'borderCurvature']
    },
    launchContent: {
      type: 'object',
      properties: {
        heroHeadline: { type: 'string' },
        heroSubheadline: { type: 'string' },
        callToAction: { type: 'string' },
        manifesto: { type: 'string' },
        elevatorPitch: { type: 'string' },
        socialHooks: { type: 'array', items: { type: 'string' } }
      },
      required: ['heroHeadline', 'heroSubheadline', 'callToAction', 'manifesto', 'elevatorPitch', 'socialHooks']
    }
  },
  required: ['brandStrategy', 'voiceSystem', 'visualTokens', 'launchContent']
};

/**
 * Synthesizes a full Brand Kit from a conversation history.
 * Tries Gemini API first; falls back to deterministic mock on any failure.
 *
 * @param {Array<{role: string, content: string}>} history
 * @returns {Promise<Object>} Brand Kit matching brandKitSchema
 */
export async function compileBrandKit(history = []) {
  const transcriptText = history.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n');
  const firstPitch = history.find(m => m.role === 'user')?.content || 'Hospitality dining experience';
  const domain = classifyDomain(transcriptText);
  const isFamily = isFamilyIntent(transcriptText);

  if (getGeminiClient()) {
    try {
      const systemInstruction = buildCompileSystemInstruction(domain, isFamily);
      const prompt = `Full Socratic Interview Transcript:\n${transcriptText}\n\nDetected Domain: ${domain.toUpperCase()}${isFamily ? ' (FAMILY DINING INTENT)' : ''}.\nCompile the complete Brand Kit now.`;

      const result = await generateStructuredJson({ systemInstruction, prompt, schema: brandKitSchema });
      return result;
    } catch (geminiError) {
      console.warn('[compilerService] Gemini compilation failed, using domain-adaptive mock:', geminiError.message);
    }
  }

  return getMockBrandKit(firstPitch, history);
}
