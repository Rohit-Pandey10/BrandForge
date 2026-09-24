import { generateStructuredJson, getGeminiClient } from '../utils/geminiClient.js';

/**
 * Question Schema for Socratic Interview Loop
 */
export const questionSchema = {
  type: 'object',
  properties: {
    isComplete: {
      type: 'boolean',
      description: 'True if all 3 interview rounds have concluded and the brand is ready to synthesize.'
    },
    currentRound: {
      type: 'integer',
      description: 'Current interview round number: 1, 2, or 3.'
    },
    question: {
      type: 'string',
      description: 'Exactly 2 short sentences, under 30 words total. Sentence 1 points out the market risk directly. Sentence 2 asks a specific question.'
    },
    suggestedAnswers: {
      type: 'array',
      items: { type: 'string' },
      description: 'Exactly 3 clickable options. STRICT LIMIT: Under 6 words per option.'
    },
    reasoning: {
      type: 'string',
      description: '1 brief sentence explaining why this decision matters.'
    }
  },
  required: ['isComplete', 'currentRound', 'question', 'suggestedAnswers', 'reasoning']
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
 * Deterministic Mock Question Generator for fallback / offline testing.
 */
function getMockQuestion(round, userContext = '') {
  const normalizedRound = Math.min(Math.max(round, 1), 3);
  const domain = extractDomain(userContext);

  if (normalizedRound === 1) {
    if (domain === 'resume') {
      return {
        isComplete: false,
        currentRound: 1,
        question: "Generic templates fail ambitious candidates. Who is the specific professional you help win interviews?",
        suggestedAnswers: [
          "Senior engineers with non-traditional gaps.",
          "Career switchers translating past experience.",
          "New grads needing verified proof."
        ],
        reasoning: "Focusing on a specific target user prevents commoditization."
      };
    }

    return {
      isComplete: false,
      currentRound: 1,
      question: "Broad positioning kills early startups. Who feels this problem so acutely they will pay immediately?",
      suggestedAnswers: [
        "Founders stuck on brand identity.",
        "Growth leads avoiding agency fees.",
        "Dev advocates needing distinct identity."
      ],
      reasoning: "A narrow beachhead audience provides the fastest path to traction."
    };
  }

  if (normalizedRound === 2) {
    const isCliche = /faster|cheaper|easier|simple|convenient|better|best|all-in-one/i.test(userContext);

    if (domain === 'resume') {
      return {
        isComplete: false,
        currentRound: 2,
        question: isCliche
          ? "Incumbents already claim speed and ease. What specific compromise in current tools do you eliminate?"
          : "Most builders optimize for bots rather than hiring managers. What industry compromise do you refuse to make?",
        suggestedAnswers: [
          "Predatory recurring subscription traps.",
          "Visual templates that fail ATS.",
          "Graphics hiding actual business impact."
        ],
        reasoning: "Clear differentiation requires highlighting the compromises of existing solutions."
      };
    }

    const question = isCliche
      ? "Incumbents already claim speed and ease. What specific compromise in current tools do you eliminate?"
      : "Every incumbent promises speed and simplicity. What fundamental flaw in today's tools are you fixing?";

    return {
      isComplete: false,
      currentRound: 2,
      question,
      suggestedAnswers: [
        "Incumbents sell sterile corporate jargon.",
        "Slow agencies charging exorbitant retainers.",
        "Generic blue corporate templates."
      ],
      reasoning: "True differentiation comes from ideological contrast with legacy options."
    };
  }

  return {
    isComplete: false,
    currentRound: 3,
    question: "Strong brands make distinct personality trade-offs. What specific tone or style will you never adopt?",
    suggestedAnswers: [
      "Hostile toward bureaucratic committees.",
      "Allergic to corporate buzzwords.",
      "Direct craftsman speaking to builders."
    ],
    reasoning: "Setting clear negative boundaries defines your visual and verbal identity."
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
 * POST /api/interview/next
 */
export async function handleNextQuestion(req, res) {
  try {
    const { history = [] } = req.body;

    // Count user turns to determine round progress:
    // Turn 1 (initial pitch) -> Round 1 (Beachhead & Acute Pain)
    // Turn 2 (answer 1) -> Round 2 (Differentiation & Incumbent Critique)
    // Turn 3 (answer 2) -> Round 3 (Attitude Boundaries & Edge)
    // Turn >= 4 (answer 3) -> Complete
    const userMessages = history.filter(m => m.role === 'user');
    const userTurnCount = userMessages.length;

    const currentRound = Math.min(Math.max(userTurnCount, 1), 3);
    const isComplete = userTurnCount >= 4;

    if (isComplete) {
      return res.status(200).json({
        isComplete: true,
        currentRound: 3,
        question: "You have carved out a razor-sharp positioning. Ready to synthesize your complete Brand Kit, Design Tokens, and Launch Manifesto?",
        suggestedAnswers: [
          "Synthesize Brand Kit Now",
          "Review Core Identity",
          "Polish Tone of Voice"
        ],
        reasoning: "All three Socratic interview stages (ICP, Differentiation, and Edge) have been thoroughly explored."
      });
    }

    // Attempt Gemini invocation via dynamic model resolution if configured
    if (getGeminiClient()) {
      try {
        const transcriptText = history
          .map(m => `${m.role.toUpperCase()}: ${m.content}`)
          .join('\n');

        const systemInstruction = `You are an expert startup advisor and brand strategist.
Your job is to ask sharp, focused questions that help founders make crisp branding choices.

TONE & STYLE RULES:
- Zero corporate fluff, zero theater, zero buzzwords (ban: "killer", "game-changer", "bleeding-neck", "supercharge", "revolutionary", "calling bullshit").
- Be concise, direct, and constructive.
- Format for "question": Exactly 2 short sentences (under 30 words total).
  * Sentence 1 (Advice / Risk): Point out the core market risk or trade-off directly.
  * Sentence 2 (Question): Ask a specific question to resolve it.

3-ROUND ROADMAP:
- Round 1 (Target User): If their audience is too broad, advise narrowing it down. Ask who feels the problem most acutely.
- Round 2 (Differentiation): Advise focusing on the specific compromise users make today. Ask what they do differently.
- Round 3 (Brand Edge): Advise picking a clear personality direction. Ask what specific tone or vibe they want to avoid.

OUTPUT CONSTRAINTS:
1. question: Under 30 words total. No filler praise.
2. suggestedAnswers: Exactly 3 clickable options. STRICT LIMIT: Under 6 words per option.
3. reasoning: 1 brief sentence explaining why this decision matters.

Currently we are evaluating Round ${currentRound} of 3.`;

        const prompt = `Conversation Transcript:\n${transcriptText}\n\nFormulate the next question for Round ${currentRound}. Return structured JSON matching the schema.`;

        const result = await generateStructuredJson({
          systemInstruction,
          prompt,
          schema: questionSchema
        });

        // Ensure round number aligns
        result.currentRound = currentRound;
        result.isComplete = isComplete;

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
