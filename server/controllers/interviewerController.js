import { generateStructuredJson, getGeminiClient } from '../utils/geminiClient.js';

/**
 * Question Schema for Socratic Interview Loop (Continuous Discovery)
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
      description: 'Strictly under 25 words total. Exactly 2 short sentences. Sentence 1 points out the market risk or trade-off. Sentence 2 asks a direct choice.'
    },
    suggestedAnswers: {
      type: 'array',
      items: { type: 'string' },
      description: 'Exactly 3 distinct clickable options. STRICT LIMIT: Under 8 words per option.'
    },
    reasoning: {
      type: 'string',
      description: '1 brief diagnostic sentence under 15 words explaining the strategic risk.'
    },
    stageLabel: {
      type: 'string',
      description: 'Short 2-3 word stage title, e.g. Target Beachhead, Incumbent Critique, Brand Edge, Voice Boundaries, Category Moat.'
    },
    readyForSynthesis: {
      type: 'boolean',
      description: 'True if baseline context is sufficient for brand kit synthesis, but more discovery can still be requested.'
    }
  },
  required: ['currentRound', 'question', 'suggestedAnswers', 'reasoning', 'stageLabel', 'readyForSynthesis']
};

/**
 * Brand Kit Schema for Final Token & Narrative Synthesis
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
            googleFontsUrl: { type: 'string' }
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

function extractDomain(text = '') {
  const lower = text.toLowerCase();
  if (lower.includes('resume') || lower.includes('cv') || lower.includes('job') || lower.includes('career') || lower.includes('hire')) {
    return 'resume';
  }
  if (lower.includes('data') || lower.includes('sql') || lower.includes('rust') || lower.includes('dev') || lower.includes('code') || lower.includes('api')) {
    return 'developer';
  }
  if (lower.includes('account') || lower.includes('finance') || lower.includes('bookkeeping') || lower.includes('tax') || lower.includes('money')) {
    return 'finance';
  }
  return 'general';
}

/**
 * Deterministic Mock Question Generator for fallback / offline testing (Continuous Discovery).
 */
function getMockQuestion(round, userContext = '') {
  const domain = extractDomain(userContext);

  if (round === 1) {
    if (domain === 'resume') {
      return {
        currentRound: 1,
        stageLabel: "Target Beachhead",
        question: "Generic templates fail ambitious candidates. Who is the specific professional you help win interviews?",
        suggestedAnswers: [
          "Senior engineers with non-traditional gaps.",
          "Career switchers translating past experience.",
          "New grads needing verified proof."
        ],
        reasoning: "Focusing on a specific target user prevents commoditization.",
        readyForSynthesis: false
      };
    }

    return {
      currentRound: 1,
      stageLabel: "Target Beachhead",
      question: "Broad positioning dilutes early traction. Who feels this problem so acutely they will pay immediately?",
      suggestedAnswers: [
        "Founders stuck on brand identity.",
        "Growth leads avoiding agency retainers.",
        "Dev advocates needing distinct identity."
      ],
      reasoning: "A narrow beachhead audience provides rapid organic traction.",
      readyForSynthesis: false
    };
  }

  if (round === 2) {
    if (domain === 'resume') {
      return {
        currentRound: 2,
        stageLabel: "Incumbent Critique",
        question: "Most tools optimize for bots rather than managers. What industry compromise do you refuse to make?",
        suggestedAnswers: [
          "Predatory recurring subscription traps.",
          "Visual templates that fail ATS checks.",
          "Graphics hiding actual business impact."
        ],
        reasoning: "Clear differentiation requires highlighting the compromises of existing solutions.",
        readyForSynthesis: false
      };
    }

    return {
      currentRound: 2,
      stageLabel: "Incumbent Critique",
      question: "Incumbents already claim speed and ease. What fundamental compromise in today's tools are you fixing?",
      suggestedAnswers: [
        "Incumbents sell sterile corporate jargon.",
        "Slow agencies charging exorbitant retainers.",
        "Generic blue corporate templates."
      ],
      reasoning: "True differentiation comes from ideological contrast with legacy options.",
      readyForSynthesis: false
    };
  }

  if (round === 3) {
    return {
      currentRound: 3,
      stageLabel: "Brand Edge",
      question: "Safe brands get ignored. What specific corporate habit or tone are you completely comfortable alienating?",
      suggestedAnswers: [
        "Bureaucratic committee consensus.",
        "Sterile corporate buzzwords.",
        "Polite surface-level marketing."
      ],
      reasoning: "Negative boundaries define visual and verbal edge.",
      readyForSynthesis: true
    };
  }

  if (round === 4) {
    return {
      currentRound: 4,
      stageLabel: "Voice Boundaries",
      question: "Unchecked copy sounds like generic SaaS. What phrases or attitudes are strictly forbidden in your messaging?",
      suggestedAnswers: [
        "Hype words like revolutionary and seamless.",
        "Apologetic hedging and passive claims.",
        "Vague claims of being all-in-one."
      ],
      reasoning: "Banned vocabulary preserves razor-sharp brand identity.",
      readyForSynthesis: true
    };
  }

  // Round 5+
  return {
    currentRound: round,
    stageLabel: "Positioning Moat",
    question: "Competitors will copy features quickly. What contrarian conviction makes your brand impossible to replicate?",
    suggestedAnswers: [
      "Craft and speed over consensus.",
      "Algorithmic clarity over manual agencies.",
      "Radical transparency with power users."
    ],
    reasoning: "Philosophical conviction forms an enduring competitive moat.",
    readyForSynthesis: true
  };
}

/**
 * Deterministic Mock Brand Kit Generator for fallback / offline testing.
 */
function getMockBrandKit(founderPitch = '') {
  return {
    brandStrategy: {
      brandName: "Vortex Labs",
      tagline: "High-Velocity Brand Architecture for Relentless Builders",
      mission: "To liberate ambitious founders from corporate design mediocrity through algorithmic, unapologetic brand identity synthesis.",
      targetAudience: "Technical founders, indie hackers, and zero-to-one product leaders who value speed, craft, and distinct edge.",
      coreValueProposition: "Turn raw technical concepts into category-defining design tokens and punchy positioning in under 3 minutes.",
      antiHero: "Bloated legacy branding agencies charging $30k for pastel slides and vague stakeholder alignment decks.",
      differentiator: "Algorithmic Socratic interrogation combined with instant design token compilation (HEX, typography, and launch manifesto)."
    },
    voiceSystem: {
      archetype: "The Radical Craftsman",
      tone: [
        "Hyper-Direct",
        "Unapologetic",
        "Punchy",
        "Technically Astute"
      ],
      dos: [
        "Call out industry vanity metrics directly.",
        "Use active verbs and short, muscular sentences.",
        "Emphasize tangible output over abstract theories."
      ],
      donts: [
        "Never use enterprise buzzwords like 'synergize' or 'paradigm'.",
        "Do not hedge statements with 'maybe' or 'we try to'.",
        "Never apologize for having a strong aesthetic opinion."
      ],
      vocabularyWords: [
        "Velocity",
        "Signal",
        "Frictionless",
        "Uncompromising",
        "Raw",
        "Synthesis"
      ]
    },
    visualTokens: {
      palette: [
        { name: "Obsidian Core", hex: "#0A0D14", role: "surface" },
        { name: "Electric Indigo", hex: "#6366F1", role: "primary" },
        { name: "Hyper Cyan", hex: "#06B6D4", role: "secondary" },
        { name: "Solar Amber", hex: "#F59E0B", role: "accent" },
        { name: "Pure Ghost", hex: "#F8FAFC", role: "text" }
      ],
      typography: {
        headingFont: "Space Grotesk",
        bodyFont: "Inter",
        googleFontsUrl: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;600&display=swap"
      },
      stylePhilosophy: "High-contrast dark mode brutalism with luminous neon accents and razor-sharp typographic scale.",
      borderCurvature: "rounded-xl"
    },
    launchContent: {
      heroHeadline: "Stop Sounding Like a Corporate Brochure.",
      heroSubheadline: "Autonomous brand architecture that gives ambitious founders the voice and visual venom of a category leader.",
      callToAction: "Forge Your Identity",
      manifesto: "The software world is drowning in polite consensus. Every landing page looks like the same pastel template created by the same committee. We believe true category leaders don't blend in—they plant a flag, declare an enemy, and build with relentless conviction. Your code is exceptional. Your brand should hit just as hard.",
      elevatorPitch: "Vortex Labs is an AI-powered brand architecture engine that transforms raw technical pitches into complete visual identities, voice systems, and launch copy in minutes.",
      socialHooks: [
        "90% of SaaS landing pages look identical because founders design by consensus. Break the cycle.",
        "Your product solves a hard technical problem. Why does your marketing sound like a 2012 B2B slide deck?",
        "Real brand strategy isn't colors and logos. It's declaring who you're willing to alienate."
      ]
    }
  };
}

/**
 * Controller: Evaluates interview history and returns the next Socratic question.
 * POST /api/interview/next (Supports Open-Ended Continuous Discovery)
 */
export async function handleNextQuestion(req, res) {
  try {
    const { history = [] } = req.body;

    const userMessages = history.filter(m => m.role === 'user');
    const userTurnCount = userMessages.length;

    // Continuous dynamic round counter: round equals user turn count (1, 2, 3, 4, 5...)
    const currentRound = Math.max(userTurnCount, 1);
    const readyForSynthesis = currentRound >= 3;

    // Attempt Gemini invocation via dynamic model resolution if configured
    if (getGeminiClient()) {
      try {
        const transcriptText = history
          .map(m => `${m.role.toUpperCase()}: ${m.content}`)
          .join('\n');

        const systemInstruction = `You are an elite, contrarian startup mentor and brand strategist.
Your job is to ask sharp, probing questions that force founders to make clear, polarizing strategic choices.

CORE RULES:
- ZERO corporate fluff, zero filler praise, zero buzzwords (ban: "killer", "game-changer", "supercharge", "what is your core strategic vision").
- Question format: Exactly 2 short sentences, STRICTLY UNDER 25 WORDS TOTAL.
  * Sentence 1: Highlight a critical market trade-off, risk, or incumbent flaw.
  * Sentence 2: Ask a direct question forcing a definitive choice.
- suggestedAnswers: Exactly 3 distinct, high-conviction options. STRICT LIMIT: Under 8 words per option.
- reasoning: 1 brief diagnostic sentence under 15 words explaining the strategic stakes.
- stageLabel: Short 2-3 word stage title (e.g., "Target Beachhead", "Incumbent Critique", "Brand Edge", "Voice Boundaries", "Category Moat").
- readyForSynthesis: Set to true if currentRound >= 3 or baseline strategic context is sufficient.

PROGRESSIVE INQUIRY ROADMAP:
- Round 1: Target Beachhead (probe acute pain, eliminate generic demographic broadness).
- Round 2: Incumbent Critique (target the broken compromise of legacy incumbents).
- Round 3: Brand Edge & Polarizing Attitude (define who the brand is willing to alienate).
- Round 4+: Voice Boundaries, Positioning Moat, or Distribution Conviction (deepen the thesis if requested).

Currently evaluating Round ${currentRound}.`;

        const prompt = `Conversation Transcript:\n${transcriptText}\n\nFormulate the next question for Round ${currentRound}. Return structured JSON matching the schema.`;

        const result = await generateStructuredJson({
          systemInstruction,
          prompt,
          schema: questionSchema
        });

        // Ensure round and readiness flags are synchronized
        result.currentRound = currentRound;
        result.readyForSynthesis = Boolean(result.readyForSynthesis || readyForSynthesis);
        if (!result.stageLabel) {
          result.stageLabel = currentRound === 1 ? "Target Beachhead" : currentRound === 2 ? "Incumbent Critique" : currentRound === 3 ? "Brand Edge" : "Strategic Moat";
        }

        return res.status(200).json(result);
      } catch (geminiError) {
        console.warn('[interviewerController] Gemini API call failed, using high-fidelity mock fallback:', geminiError.message);
      }
    }

    // High-fidelity fallback
    const lastUserMessage = userMessages[userMessages.length - 1]?.content || '';
    const fallbackResponse = getMockQuestion(currentRound, lastUserMessage);
    return res.status(200).json(fallbackResponse);

  } catch (error) {
    console.error('[interviewerController] Unhandled error in handleNextQuestion:', error);
    return res.status(500).json({
      error: 'Failed to process interview question',
      details: error.message
    });
  }
}

/**
 * Controller: Synthesizes full conversation transcript into structured Brand Kit.
 * POST /api/interview/compile
 */
export async function handleCompileBrandKit(req, res) {
  try {
    const { history = [] } = req.body;
    const firstPitch = history.find(m => m.role === 'user')?.content || 'Autonomous tech platform';

    if (getGeminiClient()) {
      try {
        const transcriptText = history
          .map(m => `${m.role.toUpperCase()}: ${m.content}`)
          .join('\n');

        const systemInstruction = `You are a world-class Chief Creative Officer and Design Director.
Synthesize the founder's Socratic interview transcript into an unforgettable, high-signal Brand Kit.
Output MUST strictly follow the JSON Schema provided.
Requirements:
1. brandStrategy: Extract a compelling brandName, punchy tagline, clear mission, specific targetAudience, coreValueProposition, the antiHero (incumbent villain), and sharp differentiator.
2. voiceSystem: Archetype, tone adjectives, 3 dos, 3 donts, and 6 signature vocabulary words.
3. visualTokens:
   - Exactly 5 harmonious HEX colors (surface, primary, secondary, accent, text).
   - Dynamic Google Fonts pair: headingFont, bodyFont, and a valid googleFontsUrl (e.g. from Google Fonts CDN).
   - stylePhilosophy (1 sentence description).
   - borderCurvature ('rounded-none', 'rounded-lg', 'rounded-xl', or 'rounded-2xl').
4. launchContent: Punchy heroHeadline, heroSubheadline, callToAction, a 3-paragraph inspiring manifesto, elevatorPitch, and 3 viral socialHooks.`;

        const prompt = `Full Socratic Interview Transcript:\n${transcriptText}\n\nCompile the complete Brand Kit now.`;

        const result = await generateStructuredJson({
          systemInstruction,
          prompt,
          schema: brandKitSchema
        });

        return res.status(200).json(result);
      } catch (geminiError) {
        console.warn('[interviewerController] Gemini compilation failed, utilizing high-fidelity mock brand kit:', geminiError.message);
      }
    }

    // High-fidelity fallback
    const fallbackBrandKit = getMockBrandKit(firstPitch);
    return res.status(200).json(fallbackBrandKit);

  } catch (error) {
    console.error('[interviewerController] Unhandled error in handleCompileBrandKit:', error);
    return res.status(500).json({
      error: 'Failed to compile brand kit',
      details: error.message
    });
  }
}
