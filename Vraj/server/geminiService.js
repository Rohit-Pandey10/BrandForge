// server/geminiService.js
import dotenv from 'dotenv';
import { PRESET_PITCHES, generateGenericMockQuestion, generateGenericMockBrandKit } from './mockData.js';
import { DOMAINS, classifyDomain, isFamilyIntent, extractPitchMetadata } from './domainConfig.js';
import { generateStructuredJson, isLlmConfigured } from './llmClient.js';

dotenv.config({ override: true });

/**
 * Generate Next Socratic Question using Groq (Primary) -> Gemini (Backup) -> Domain Mock Engine
 */
export async function getNextQuestion({
  pitch,
  history = [],
  currentRound,
  apiKey = null,
  groqApiKey = null,
  useMock = false
}) {
  const matchedPreset = PRESET_PITCHES.find(
    (p) => pitch.toLowerCase().includes(p.title.toLowerCase()) || pitch.toLowerCase().includes(p.id)
  );

  const hasKey = Boolean(apiKey || groqApiKey || isLlmConfigured());

  if (useMock || !hasKey) {
    console.log(`[GeminiService] Using domain-aware mock for round ${currentRound} (Preset: ${matchedPreset ? matchedPreset.title : 'Dynamic Domain'})`);
    if (matchedPreset && matchedPreset.rounds[currentRound - 1]) {
      const r = matchedPreset.rounds[currentRound - 1];
      return {
        isComplete: currentRound >= 3,
        currentRound,
        question: r.question,
        suggestedAnswers: r.suggestedAnswers,
        reasoning: r.reasoning
      };
    }
    return generateGenericMockQuestion(currentRound, pitch);
  }

  // Universal domain metadata extraction for live prompt steering
  const meta = extractPitchMetadata(pitch);

  const systemInstruction = `You are a world-class Socratic Brand Interviewer and Venture Strategist for high-ambition founders.
Your job is to challenge the founder's assumptions across 3 rigorous pipeline stages:
- Stage 1 (Round 1): Intake & ICP Discovery. Uncover their beachhead user/guest, acute operational pain, and urgency. Challenge generic target audiences.
- Stage 2 (Round 2): Differentiation & Critique. Attack legacy compromises, incumbent status quo, and uncover the brand's 'villain'.
- Stage 3 (Round 3): Attitude Boundaries & Edge. Probe tone boundaries, polarization tolerance, and brand archetype.

UNIVERSAL DOMAIN ADAPTATION RULE:
1. Dynamically analyze the concept pitch ("${pitch}") to identify the exact industry, profession, and operational context (Detected: ${meta.industryName} targeting ${meta.targetRole}).
2. You MUST speak the authentic insider language, operational realities, and stakes of THAT specific profession or industry.
3. NEVER ask generic tech or SaaS buzzword questions if the pitch is in a non-tech industry (e.g., for restaurants ask about dining room acoustics, table pacing, ingredient craft; for clinical healthcare ask about nurse documentation burnout and shift triage; for construction/trades ask about job-site change orders and subcontractor coordination; for legal ask about contract diligence and billable hour friction).
4. Suggested answers must be EXACTLY 3 distinct, high-conviction choices under 7 words each, specifically tailored to the real operational trade-offs of this exact venture.

You MUST respond strictly with valid JSON conforming to this schema:
{
  "isComplete": boolean, // true ONLY if currentRound is 3
  "currentRound": number, // exactly ${currentRound}
  "question": string, // sharp, probing Socratic question under 25 words specifically tailored to this exact business concept
  "suggestedAnswers": [string, string, string], // EXACTLY 3 distinct choices under 7 words each presenting extreme distinct conviction choices
  "reasoning": string // under-the-hood rationale for why this question challenges founder assumptions
}`;

  const promptContent = `Founder Concept Pitch: "${pitch}"
Current Round: ${currentRound} of 3
Prior Interview Transcript:
${history.map((h) => `Round ${h.round}: Q: ${h.question} -> A: ${h.userAnswer}`).join('\n') || 'None (First Round)'}

Generate the curated Socratic question for Round ${currentRound}. Provide exactly 3 suggested answer pills with distinct conviction choices specifically suited to this concept.`;

  try {
    const parsed = await generateStructuredJson({
      systemInstruction,
      prompt: promptContent,
      apiKey,
      groqApiKey
    });

    return {
      isComplete: currentRound >= 3 || Boolean(parsed.isComplete),
      currentRound: Number(parsed.currentRound) || currentRound,
      question: parsed.question || 'What is your core differentiator?',
      suggestedAnswers: Array.isArray(parsed.suggestedAnswers) && parsed.suggestedAnswers.length === 3
        ? parsed.suggestedAnswers
        : ['Radical simplicity', 'Enterprise security', 'Developer-first speed'],
      reasoning: parsed.reasoning || 'Testing fundamental market positioning.'
    };
  } catch (err) {
    console.warn(`[GeminiService] Live LLM calls failed, falling back to domain-aware mock:`, err.message);
    if (matchedPreset && matchedPreset.rounds[currentRound - 1]) {
      const r = matchedPreset.rounds[currentRound - 1];
      return {
        isComplete: currentRound >= 3,
        currentRound,
        question: r.question,
        suggestedAnswers: r.suggestedAnswers,
        reasoning: r.reasoning
      };
    }
    return generateGenericMockQuestion(currentRound, pitch);
  }
}

/**
 * Synthesize Full Brand Kit using Groq (Primary) -> Gemini (Backup) -> Domain Mock Engine
 */
export async function compileBrandKit({
  pitch,
  history = [],
  apiKey = null,
  groqApiKey = null,
  useMock = false
}) {
  const matchedPreset = PRESET_PITCHES.find(
    (p) => pitch.toLowerCase().includes(p.title.toLowerCase()) || pitch.toLowerCase().includes(p.id)
  );

  const hasKey = Boolean(apiKey || groqApiKey || isLlmConfigured());

  if (useMock || !hasKey) {
    console.log(`[GeminiService] Compiling Brand Kit via domain-aware mock (Preset: ${matchedPreset ? matchedPreset.title : 'Dynamic Domain'})`);
    if (matchedPreset) {
      return matchedPreset.brandKit;
    }
    return generateGenericMockBrandKit(pitch, history);
  }

  const meta = extractPitchMetadata(pitch);

  const systemInstruction = `You are an elite Brand Strategist, Typographer, and Token Synthesizer.
Translate the founder's pitch and complete Socratic interview transcript into a cohesive, production-grade Brand Kit.
The design aesthetic MUST follow the Handhold editorial reference:
- Restrained, warm, high-craft editorial sensibility tailored specifically to ${meta.industryName}.
- Color palette must include 5 curated roles: primary, secondary, accent, surface, text (with exact HEX codes appropriate for the tone of ${meta.industryName}).
- Typography pairings must be real Google Fonts (e.g. Cormorant Garamond, EB Garamond, Inter, Newsreader, Space Grotesk, Playfair Display).
- Launch content must include sharp, un-cliched manifesto copy and high-signal social hooks directly addressing the acute friction of ${meta.targetRole} and defeating the systemic villain: "${meta.systemicVillain}".

CRITICAL BRAND NAME COMPUTATION RULES:
1. ALWAYS COMPUTE / INVENT a distinctive, memorable, authentic 1-2 word brand name for "brandName" (e.g., "Krio", "Glace", "Cascadia", "Oasis", "FrostCraft" for cold drinks/beverages; "Aegis Flow", "Vellum" for clinical/health; "Fornello", "Campiña" for dining; "Kuro Loom" for textiles; "Kestrel", "Prism" for tech).
2. NEVER repeat the founder's raw conversational pitch phrase or append generic filler words (e.g. if the pitch is "i am a cold drink", DO NOT output "i am a cold drink", "i am a cold drink Innovation", or "Cold Drink Works"—you MUST coin an evocative, authentic, iconic brand name like "Krio", "Glace", or "FrostCraft").
3. If the founder explicitly provided their company name in the pitch (e.g. "Acme is a cold drink..."), use that exact name. Otherwise, invent a distinctive, market-ready brand name.

Respond strictly in valid JSON matching this schema:
{
  "brandStrategy": {
    "brandName": string,
    "tagline": string,
    "mission": string,
    "targetAudience": string,
    "coreValueProposition": string,
    "antiHero": string,
    "differentiator": string
  },
  "voiceSystem": {
    "archetype": string,
    "tone": [string],
    "dos": [string],
    "donts": [string],
    "vocabularyWords": [string]
  },
  "visualTokens": {
    "palette": [
      { "name": string, "hex": string, "role": "primary" | "secondary" | "accent" | "surface" | "text" }
    ],
    "typography": {
      "headingFont": string,
      "bodyFont": string,
      "googleFontsUrl": string
    },
    "stylePhilosophy": string,
    "borderCurvature": string
  },
  "launchContent": {
    "heroHeadline": string,
    "heroSubheadline": string,
    "callToAction": string,
    "manifesto": string,
    "elevatorPitch": string,
    "socialHooks": [string]
  }
}`;

  const promptContent = `Founder Concept Pitch: "${pitch}"
Complete Socratic Transcript:
${history.map((h) => `Round ${h.round}: Q: ${h.question} -> Founder Answer: ${h.userAnswer}`).join('\n\n')}

Synthesize the full Brand Kit JSON specifically tailored to this venture.`;

  try {
    const parsed = await generateStructuredJson({
      systemInstruction,
      prompt: promptContent,
      apiKey,
      groqApiKey
    });

    // Post-process: ensure computed brand name is not conversational pitch fluff
    if (parsed?.brandStrategy?.brandName) {
      const rawName = parsed.brandStrategy.brandName.trim();
      const lowerRaw = rawName.toLowerCase();
      const lowerPitch = pitch.toLowerCase().trim();

      if (
        lowerRaw.startsWith('i am') ||
        lowerRaw.startsWith('we are') ||
        lowerRaw.startsWith('an app') ||
        lowerRaw === lowerPitch ||
        lowerRaw.endsWith('innovation') ||
        lowerRaw.endsWith('works')
      ) {
        let cleaned = rawName
          .replace(/^(?:i am a|i am an|i am|we are a|we are an|we are|we build a|we make a|an app for|a tool for)\s+/i, '')
          .replace(/\s+(?:innovation|works|platform|helper|system)$/i, '')
          .trim();

        if (!cleaned || cleaned.toLowerCase() === lowerPitch) {
          if (meta.domain === 'hospitality') cleaned = 'Krio';
          else if (meta.domain === 'healthcare') cleaned = 'Aegis Flow';
          else cleaned = 'Venture Studio';
        } else {
          cleaned = cleaned
            .split(/\s+/)
            .slice(0, 2)
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join(' ');
        }
        parsed.brandStrategy.brandName = cleaned;
      }
    }

    return parsed;
  } catch (err) {
    console.warn(`[GeminiService] LLM Synthesis failed, falling back to domain-aware mock:`, err.message);
    if (matchedPreset) {
      return matchedPreset.brandKit;
    }
    return generateGenericMockBrandKit(pitch, history);
  }
}
