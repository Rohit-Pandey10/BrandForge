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
      description: 'Exactly 3 distinct clickable options tailored strictly to the business domain. STRICT LIMIT: Under 8 words per option.'
    },
    reasoning: {
      type: 'string',
      description: '1 brief diagnostic sentence under 15 words explaining the strategic risk.'
    },
    stageLabel: {
      type: 'string',
      description: 'Short 2-3 word stage title, e.g. Target Diners, Culinary Ethos, Ingredient Integrity, Dining Ritual.'
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

/**
 * Intelligent Domain Classifier
 * Inspects all conversation turns to detect the business category.
 */
export function extractDomain(text = '') {
  const lower = text.toLowerCase();
  if (/(restaurant|food|dining|cuisine|culinary|chef|bistro|cafe|bar|bakery|coffee|eatery|pizza|burger|pasta|taco|cocktail|hospitality|kitchen|table|wine|menu)/i.test(lower)) {
    return 'hospitality';
  }
  if (/(fashion|clothing|apparel|wear|luxury|garment|streetwear|shoe|jewelry|bag|textile|tailor|collection)/i.test(lower)) {
    return 'fashion';
  }
  if (/(fitness|wellness|health|gym|workout|yoga|longevity|nutrition|mental health|therapy|meditation|supplement)/i.test(lower)) {
    return 'wellness';
  }
  if (/(resume|cv|career|job|hiring|recruiting|portfolio|interview|candidate)/i.test(lower)) {
    return 'career';
  }
  if (/(sql|database|rust|in-memory|backend|api|infrastructure|dev|developer|compiler|cloud|devops|kubernetes|linux)/i.test(lower)) {
    return 'developer';
  }
  if (/(creative|agency|design studio|animation|film|music|video|branding agency|photography)/i.test(lower)) {
    return 'creative';
  }
  return 'general';
}

/**
 * Domain-specific guidance injected into Gemini system instructions
 */
function getDomainGuidance(domain) {
  switch (domain) {
    case 'hospitality':
      return `DOMAIN: CULINARY, RESTAURANT & HOSPITALITY.
- Focus: Culinary ethos, atmosphere, ingredient sourcing, neighborhood identity, dining rituals.
- BANNED VOCABULARY: NEVER use software/tech words ("code", "developer", "SaaS", "APIs", "platforms", "users", "metrics").
- Use culinary and sensory terminology (guests, diners, table, hearth, flavor, provenance, service, seasonal).
- Visual Guidance: Warm organic earth tones, deep terracotta, olive, smoked charcoal, aged brass, warm cream.
- Typography Guidance: Editorial artisanal serifs (Fraunces, Playfair Display, Cormorant Garamond, Newsreader) with warm grotesque bodies.`;

    case 'fashion':
      return `DOMAIN: FASHION, APPAREL & LUXURY.
- Focus: Silhouette, aesthetic tension, fabric provenance, anti-fast-fashion stance, target tastemakers.
- BANNED VOCABULARY: NEVER use software/tech jargon ("SaaS", "APIs", "software", "code").
- Visual Guidance: Monochromatic luxury, sculptural geometry, stone, charcoal, ecru.
- Typography Guidance: High-contrast high-fashion serifs or minimalist Swiss display grotesques.`;

    case 'wellness':
      return `DOMAIN: WELLNESS, HEALTH & FITNESS.
- Focus: Biological conviction, performance vs restoration, clinical rigor vs holistic peace.
- Visual Guidance: Sage, earthen clay, serene ocean mist, botanical tones.`;

    case 'career':
      return `DOMAIN: CAREER & PROFESSIONAL TOOLS.
- Focus: Desperate job-seekers, recruiter 6-second glance, anti-generic template angle.`;

    case 'developer':
      return `DOMAIN: DEVELOPER TOOLS & TECHNICAL INFRASTRUCTURE.
- Focus: Latency, developer friction, systems engineers, unbloated architecture.`;

    default:
      return `DOMAIN: GENERAL CONSUMER / PRODUCT DISCOVERY.
- Focus on the specific human buyer, acute pain point, and broken legacy compromise.`;
  }
}

/**
 * Deterministic Multi-Domain Mock Question Generator for fallback / offline testing.
 */
function getMockQuestion(round, userContext = '') {
  const domain = extractDomain(userContext);

  if (domain === 'hospitality') {
    if (round === 1) {
      return {
        currentRound: 1,
        stageLabel: "Target Diners",
        question: "Casual diners prioritize convenience over culinary soul. Who is the passionate diner who will book three weeks in advance?",
        suggestedAnswers: [
          "Neighborhood epicures seeking unhurried dining.",
          "Natural wine and wood-fired purists.",
          "Date-night couples craving sensory intimacy."
        ],
        reasoning: "Defining your primary dining audience determines menu size and seating flow.",
        readyForSynthesis: false
      };
    }
    if (round === 2) {
      return {
        currentRound: 2,
        stageLabel: "Culinary Integrity",
        question: "Most restaurants cut corners with frozen distributor shortcuts. What sacred culinary compromise will you never allow in your kitchen?",
        suggestedAnswers: [
          "Zero frozen ingredients or pre-made sauces.",
          "No high-turnover rushed table seatings.",
          "Rejecting sterile QR-code menu hospitality."
        ],
        reasoning: "Great restaurants plant a flag against industrial dining shortcuts.",
        readyForSynthesis: false
      };
    }
    if (round === 3) {
      return {
        currentRound: 3,
        stageLabel: "Atmosphere & Ritual",
        question: "Safe restaurants feel forgettable and sterile. What specific dining habit or customer behavior are you totally comfortable alienating?",
        suggestedAnswers: [
          "Rushed diners demanding ten-minute food.",
          "Corporate expense-account steakhouse crowds.",
          "Casual diners wanting bland comfort food."
        ],
        reasoning: "Polarizing culinary conviction creates obsessive neighborhood loyalty.",
        readyForSynthesis: true
      };
    }
    return {
      currentRound: round,
      stageLabel: "Sensory Atmosphere",
      question: "Ambiance dictates perceived flavor before the first bite. What sensory texture defines your dining room experience?",
      suggestedAnswers: [
        "Open wood hearth with crackling embers.",
        "Intimate candlelight and vinyl acoustics.",
        "Sunlit minimalist stone and linen."
      ],
      reasoning: "Sensory atmosphere shapes memory and brand word-of-mouth.",
      readyForSynthesis: true
    };
  }

  if (domain === 'career') {
    if (round === 1) {
      return {
        currentRound: 1,
        stageLabel: "Target Candidates",
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
    if (round === 2) {
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
      currentRound: round,
      stageLabel: "Brand Edge",
      question: "Safe brands get ignored. What specific tone or corporate habit are you completely comfortable alienating?",
      suggestedAnswers: [
        "Polite corporate buzzwords and clichés.",
        "Inflated vanity metrics on resumes.",
        "Generic pastel career advice tropes."
      ],
      reasoning: "Setting clear negative boundaries defines your visual and verbal identity.",
      readyForSynthesis: true
    };
  }

  // Developer / Technical
  if (domain === 'developer') {
    if (round === 1) {
      return {
        currentRound: 1,
        stageLabel: "Technical ICP",
        question: "Broad positioning dilutes early traction. Who feels this developer problem so acutely they will adopt today?",
        suggestedAnswers: [
          "Systems engineers crippled by query latency.",
          "DevOps teams fighting cloud cost overruns.",
          "Platform leads tired of complex ORMs."
        ],
        reasoning: "Narrow beachheads provide rapid organic developer adoption.",
        readyForSynthesis: false
      };
    }
    if (round === 2) {
      return {
        currentRound: 2,
        stageLabel: "Architecture Critique",
        question: "Legacy databases sacrifice speed for enterprise bloat. What fundamental compromise in existing tools do you refuse?",
        suggestedAnswers: [
          "Bloated garbage-collected runtimes.",
          "Opaque proprietary cloud lock-in.",
          "Complex multi-node clustering overhead."
        ],
        reasoning: "Differentiators must highlight legacy compromises.",
        readyForSynthesis: false
      };
    }
    return {
      currentRound: round,
      stageLabel: "Engineering Conviction",
      question: "Competitors will copy features quickly. What contrarian engineering belief makes your product impossible to replicate?",
      suggestedAnswers: [
        "Bare-metal compiled performance over abstractions.",
        "Zero-dependency single-binary simplicity.",
        "Radical transparency with power users."
      ],
      reasoning: "Philosophical conviction forms an enduring competitive moat.",
      readyForSynthesis: true
    };
  }

  // General fallback
  if (round === 1) {
    return {
      currentRound: 1,
      stageLabel: "Target Audience",
      question: "Broad positioning dilutes early traction. Who feels this problem so acutely they will pay immediately?",
      suggestedAnswers: [
        "Passionate early adopters craving quality.",
        "Frustrated customers escaping legacy tools.",
        "Discerning buyers demanding bespoke craft."
      ],
      reasoning: "A narrow beachhead audience provides rapid organic traction.",
      readyForSynthesis: false
    };
  }
  if (round === 2) {
    return {
      currentRound: 2,
      stageLabel: "Incumbent Critique",
      question: "Incumbents rely on feature bloat and vanity claims. What fundamental industry compromise do you refuse to make?",
      suggestedAnswers: [
        "Cheap mass-produced commodity shortcuts.",
        "Slow, bloated agency retainers.",
        "Sterile corporate homogenisation."
      ],
      reasoning: "True differentiation comes from ideological contrast with legacy options.",
      readyForSynthesis: false
    };
  }
  return {
    currentRound: round,
    stageLabel: "Brand Edge",
    question: "Safe brands get ignored in a crowded market. What specific habit or attitude are you completely comfortable alienating?",
    suggestedAnswers: [
      "Bureaucratic committee consensus.",
      "Sterile corporate buzzwords.",
      "Polite surface-level marketing."
    ],
    reasoning: "Negative boundaries define visual and verbal edge.",
    readyForSynthesis: true
  };
}

/**
 * Deterministic Multi-Domain Mock Brand Kit Generator for fallback / offline testing.
 */
function getMockBrandKit(founderPitch = '', fullHistory = []) {
  const combinedContext = [founderPitch, ...fullHistory.map(m => m.content)].join(' ');
  const domain = extractDomain(combinedContext);

  if (domain === 'hospitality') {
    return {
      brandStrategy: {
        brandName: "Atelier Umami",
        tagline: "Unhurried Seasonal Hearth & Terroir-Driven Gastronomy",
        mission: "To restore reverence for honest ingredients, wood-fired craft, and unhurried hospitality in an era of sterile, assembly-line dining.",
        targetAudience: "Discerning culinary purists, neighborhood regulars, and food lovers who value provenance, craftsmanship, and memorable hospitality.",
        coreValueProposition: "A micro-seasonal dining experience centered on an open wood hearth, where every plate celebrates local regenerative agriculture.",
        antiHero: "Homogenized corporate restaurant groups serving microwaved distributor shortcuts under dim Edison bulbs.",
        differentiator: "Zero frozen ingredients, 100% direct micro-farm relationships, and an open hearth kitchen where every dish has an uncompromised lineage."
      },
      voiceSystem: {
        archetype: "The Master Artisan",
        tone: [
          "Unhurried",
          "Reverent",
          "Sensory",
          "Warmly Discerning"
        ],
        dos: [
          "Speak passionately about ingredient origin and seasonal harvest.",
          "Describe culinary rituals and hearth techniques with sensory clarity.",
          "Welcome guests as collaborators in an unhurried communal experience."
        ],
        donts: [
          "Never use tech buzzwords, corporate jargon, or sterile hospitality clichés.",
          "Do not brag about vanity awards or celebrity patrons.",
          "Never compromise on culinary integrity to cater to rushed diners."
        ],
        vocabularyWords: [
          "Terroir",
          "Hearth",
          "Provenance",
          "Unhurried",
          "Savor",
          "Embers"
        ]
      },
      visualTokens: {
        palette: [
          { name: "Smoked Charcoal", hex: "#1C1A17", role: "surface" },
          { name: "Warm Terracotta", hex: "#C25E3E", role: "primary" },
          { name: "Sage Olive", hex: "#5B6B4D", role: "secondary" },
          { name: "Raw Ochre", hex: "#D49B42", role: "accent" },
          { name: "Warm Linen", hex: "#F7F5F0", role: "text" }
        ],
        typography: {
          headingFont: "Fraunces",
          bodyFont: "Inter",
          googleFontsUrl: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;600&family=Inter:wght@400;500&display=swap"
        },
        stylePhilosophy: "Warm organic brutalism with open-flame terracotta tones, unbleached linen textures, and expressive artisanal typography.",
        borderCurvature: "rounded-2xl"
      },
      launchContent: {
        heroHeadline: "Food Reclaimed From The Industrial Conveyor Belt.",
        heroSubheadline: "A neighborhood hearth dedicated to regenerative micro-farms, wild fermentations, and unhurried conversation around open embers.",
        callToAction: "Reserve a Table",
        manifesto: "The modern dining landscape has been hijacked by private equity and ghost kitchens. Every concept looks like the same faux-industrial tavern serving the same sysco shortcuts. We believe true hospitality is sacred. We cook with wood, time, and ruthless respect for the land. When you sit at our table, you taste where food actually comes from.",
        elevatorPitch: "Atelier Umami is an intimate wood-fired dining room that pairs micro-seasonal harvests from local regenerative farms with natural wines and unhurried communal hospitality.",
        socialHooks: [
          "Sysco didn't make this sauce. Our morning delivery from three local farms did.",
          "If a restaurant can serve 40 entrees in 8 minutes, you aren't eating food—you're eating logistics.",
          "We built our kitchen around an open hearth because real flavor demands patience."
        ]
      }
    };
  }

  // Default tech/developer brand kit
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
 * POST /api/interview/next (Domain-Adaptive & Continuous Discovery)
 */
export async function handleNextQuestion(req, res) {
  try {
    const { history = [] } = req.body;

    const userMessages = history.filter(m => m.role === 'user');
    const userTurnCount = userMessages.length;
    const currentRound = Math.max(userTurnCount, 1);
    const readyForSynthesis = currentRound >= 3;

    const transcriptText = history
      .map(m => `${m.role.toUpperCase()}: ${m.content}`)
      .join('\n');

    const domain = extractDomain(transcriptText);

    // Attempt Gemini invocation via dynamic model resolution if configured
    if (getGeminiClient()) {
      try {
        const domainGuidance = getDomainGuidance(domain);

        const systemInstruction = `You are an elite, contrarian brand strategist and creative interrogator.
Your job is to ask sharp, probing questions that force founders to make clear, polarizing strategic choices tailored to their business.

${domainGuidance}

CORE RULES:
- TONE: Direct, discerning mentor. Zero filler praise, zero generic cheerleading.
- STRICT QUESTION BUDGET: Exactly 2 short sentences, STRICTLY UNDER 25 WORDS TOTAL.
  * Sentence 1 (Stakes / Risk): Highlight the industry trap, compromise, or cliche directly.
  * Sentence 2 (Direct Choice): Ask a specific question forcing a definitive choice.
- SUGGESTED ANSWERS: Exactly 3 distinct, high-conviction options tailored strictly to the business domain. STRICT LIMIT: Under 8 words per option.
- REASONING: 1 brief diagnostic sentence under 15 words explaining the strategic risk.
- STAGE LABEL: Short 2-3 word label reflecting this inquiry round.
- READY FOR SYNTHESIS: Set to true if currentRound >= 3.

Currently evaluating Round ${currentRound}.`;

        const prompt = `Conversation Transcript:\n${transcriptText}\n\nDetected Domain: ${domain.toUpperCase()}.\nFormulate the next question for Round ${currentRound}. Return structured JSON matching schema.`;

        const result = await generateStructuredJson({
          systemInstruction,
          prompt,
          schema: questionSchema
        });

        // Ensure round and readiness flags are synchronized
        result.currentRound = currentRound;
        result.readyForSynthesis = Boolean(result.readyForSynthesis || readyForSynthesis);
        if (!result.stageLabel) {
          result.stageLabel = currentRound === 1 ? "Target Audience" : currentRound === 2 ? "Core Differentiation" : currentRound === 3 ? "Brand Edge" : "Strategic Moat";
        }

        return res.status(200).json(result);
      } catch (geminiError) {
        console.warn('[interviewerController] Gemini API call failed, using domain-adaptive mock fallback:', geminiError.message);
      }
    }

    // High-fidelity domain-adaptive fallback
    const fallbackResponse = getMockQuestion(currentRound, transcriptText);
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
 * POST /api/interview/compile (Domain-Adaptive Synthesis)
 */
export async function handleCompileBrandKit(req, res) {
  try {
    const { history = [] } = req.body;
    const transcriptText = history
      .map(m => `${m.role.toUpperCase()}: ${m.content}`)
      .join('\n');

    const firstPitch = history.find(m => m.role === 'user')?.content || 'Hospitality dining experience';
    const domain = extractDomain(transcriptText);

    if (getGeminiClient()) {
      try {
        const domainGuidance = getDomainGuidance(domain);

        const systemInstruction = `You are a world-class Chief Creative Officer and Design Director.
Synthesize the founder's Socratic interview transcript into an unforgettable, category-defining Brand Kit.
Output MUST strictly follow the JSON Schema provided.

${domainGuidance}

Requirements:
1. brandStrategy: Extract a compelling, authentic brandName (e.g. for restaurants, a resonant dining room name; for tech, a sharp tech name), punchy tagline, clear mission, specific targetAudience, coreValueProposition, the antiHero (industry villain/bad habit), and sharp differentiator.
2. voiceSystem: Archetype, tone adjectives, 3 dos, 3 donts, and 6 signature vocabulary words reflecting the domain.
3. visualTokens:
   - Exactly 5 harmonious HEX colors (surface, primary, secondary, accent, text) tailored to the business vibe.
   - Dynamic Google Fonts pair: headingFont, bodyFont, and a valid googleFontsUrl (e.g. Fraunces, Playfair Display, or Cormorant Garamond for hospitality/luxury; Space Grotesk or Inter for software).
   - stylePhilosophy (1 sentence description).
   - borderCurvature ('rounded-none', 'rounded-lg', 'rounded-xl', or 'rounded-2xl').
4. launchContent: Punchy heroHeadline, heroSubheadline, callToAction, a 3-paragraph inspiring manifesto, elevatorPitch, and 3 viral socialHooks.`;

        const prompt = `Full Socratic Interview Transcript:\n${transcriptText}\n\nDetected Domain: ${domain.toUpperCase()}.\nCompile the complete Brand Kit now.`;

        const result = await generateStructuredJson({
          systemInstruction,
          prompt,
          schema: brandKitSchema
        });

        return res.status(200).json(result);
      } catch (geminiError) {
        console.warn('[interviewerController] Gemini compilation failed, utilizing domain-adaptive mock brand kit:', geminiError.message);
      }
    }

    // High-fidelity domain-adaptive fallback
    const fallbackBrandKit = getMockBrandKit(firstPitch, history);
    return res.status(200).json(fallbackBrandKit);

  } catch (error) {
    console.error('[interviewerController] Unhandled error in handleCompileBrandKit:', error);
    return res.status(500).json({
      error: 'Failed to compile brand kit',
      details: error.message
    });
  }
}
