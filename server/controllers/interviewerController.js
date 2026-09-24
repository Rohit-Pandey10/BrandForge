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
      description: 'Strictly under 25 words total. Exactly 1 or 2 clear sentences. No academic jargon or obscure words.'
    },
    suggestedAnswers: {
      type: 'array',
      items: { type: 'string' },
      description: 'Exactly 3 distinct real choices representing radically different directions. STRICT LIMIT: Under 6 words per option.'
    },
    reasoning: {
      type: 'string',
      description: '1 simple sentence explaining how this choice defines the brand identity or pricing.'
    },
    stageLabel: {
      type: 'string',
      description: 'Short 2-3 word stage title, e.g. Dinner Vibe, Kitchen Conviction, Signature Ritual.'
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
            googleFontsUrl: { type: 'string' },
            rationale: { type: 'string', description: 'Real industry-relevant typographic explanation (e.g. for menus and signage vs responsive reservations).' }
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

export function isFamilyIntent(text = '') {
  return /(family|kid|child|children|toddler|parent|all-ages|all ages|multi-generation|casual diner|sharing table|high chair|soccer team)/i.test(text);
}

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
function getDomainGuidance(domain, isFamily = false) {
  switch (domain) {
    case 'hospitality':
      if (isFamily) {
        return `DOMAIN: FAMILY RESTAURANT & ALL-AGES HOSPITALITY.
- Focus: Welcoming neighborhood family dining, generous sharing tables, kid-approved high-quality meals, mess-friendly durable spaces, weeknight convenience, Sunday family gatherings.
- STRICT PROHIBITION ON ALCOHOL & DATE-NIGHT TROPES:
  * ABSOLUTELY BANNED IN BRAND NAME: "Wine", "Bar", "Tavern", "Lounge", "Cellar", "Spirits", "Cocktail", "Pub".
  * DO NOT name the brand after alcohol or date-night tropes.
  * Target audience must directly match the input (e.g., parents, kids, large tables, neighborhood families).
- BANNED VOCABULARY: "terroir", "provenance", "quiet luxury", "unfiltered exposure", "sovereign", "climate-controlled indifference", "elemental", "sanctuary", "sacred cow", "bleeding-neck", "synergize", "natural wine", "date-night", "sommelier", "tasting menu", "cocktails".
- Grounded Physical Terms: big wooden tables, dough-stretching counter, wood-fired hearth, bubbly crust, kid slices, sharing platters, laughter, warm hospitality.
- Visual Guidance: Approachable, warm, sunlit colors (Warm Terracotta, Golden Wheat, Forest Olive, Soft Buttermilk, Deep Espresso). AVOID gloomy dark bar aesthetics or moody dark charcoal.
- Typography Guidance: Warm, friendly display serif (Fraunces) paired with highly legible modern sans-serif (Inter).`;
      }
      return `DOMAIN: CULINARY, RESTAURANT & HOSPITALITY.
- Focus: Dinner vibe, table experience, price-point compromise, neighborhood energy, lighting, host presence, signature dishes.
- BANNED VOCABULARY & FORBIDDEN BUZZWORDS: "terroir", "provenance", "quiet luxury", "unfiltered exposure", "sovereign", "climate-controlled indifference", "elemental", "sanctuary", "sacred cow", "bleeding-neck", "synergize", "data density", "system labels", "latency", "code", "SaaS", "beachhead ICP".
- Grounded Physical Terms: tables, regulars, warmth, open flame, crust, host greeting, neighborhood buzz, seating flow.
- Visual Guidance: Appetizing, harmonious colors (Deep Terracotta, Cast Iron Charcoal, Warm Cream, Toasted Fennel, Natural Linen).
- Typography Guidance: Classic, high-contrast serif for printed daily menus and signage (Fraunces, Playfair Display, Newsreader) paired with a modern neutral sans-serif for responsive reservations (Inter).`;

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
  const isFamily = isFamilyIntent(userContext);

  if (domain === 'hospitality') {
    if (isFamily) {
      if (round === 1) {
        return {
          currentRound: 1,
          stageLabel: "Family Dining Flow",
          question: "Family dinners have different rhythms. Are you focusing on fast weeknight school-night dinners or celebratory weekend feasts?",
          suggestedAnswers: [
            "Fast weeknight neighborhood dinners",
            "Lively weekend family feasts",
            "All-day pizza & gelato counter"
          ],
          reasoning: "Table turn speed and kid-friendly service style determine your dining room layout.",
          readyForSynthesis: false
        };
      }
      if (round === 2) {
        return {
          currentRound: 2,
          stageLabel: "Kitchen Boundaries",
          question: "Many family spots rely on frozen shortcuts or bland kid menus. What compromise do you refuse to make?",
          suggestedAnswers: [
            "No frozen or boxed kid food",
            "No artificial dough improvers",
            "No cramped tables or stroller bans"
          ],
          reasoning: "Real ingredient boundaries build lasting trust with health-conscious parents.",
          readyForSynthesis: false
        };
      }
      if (round === 3) {
        return {
          currentRound: 3,
          stageLabel: "Family Ritual",
          question: "What memorable dining ritual will kids and parents look forward to every visit?",
          suggestedAnswers: [
            "Watch dough tossed at counter",
            "Family sharing platters sliced table-side",
            "Soft-serve swirl station for kids"
          ],
          reasoning: "Tangible interactive rituals turn first-time families into weekly regulars.",
          readyForSynthesis: true
        };
      }
      return {
        currentRound: round,
        stageLabel: "Neighborhood Role",
        question: "How will your dining room become an indispensable hub for local families?",
        suggestedAnswers: [
          "Host post-game youth sports tables",
          "Host weeknight dough-making workshops",
          "Dine-in and speedy family takeout"
        ],
        reasoning: "Community integration drives repeat visits throughout the entire school year.",
        readyForSynthesis: true
      };
    }

    if (round === 1) {
      return {
        currentRound: 1,
        stageLabel: "Dinner Vibe",
        question: "Are you aiming for an energetic neighborhood joint or an intimate dinner counter?",
        suggestedAnswers: [
          "Casual neighborhood joint",
          "Intimate dinner counter",
          "Lively open-fire table"
        ],
        reasoning: "Your room vibe dictates table spacing, seating cadence, and music volume.",
        readyForSynthesis: false
      };
    }
    if (round === 2) {
      return {
        currentRound: 2,
        stageLabel: "Kitchen Conviction",
        question: "Most restaurants cut corners on ingredients or overcomplicate the menu. What compromise will you refuse?",
        suggestedAnswers: [
          "No freezer shortcuts or additives",
          "No tiny pretentious tasting portions",
          "No rushed ninety-minute table limits"
        ],
        reasoning: "Declaring kitchen boundaries shapes menu pricing and guest trust.",
        readyForSynthesis: false
      };
    }
    if (round === 3) {
      return {
        currentRound: 3,
        stageLabel: "Guest Fit",
        question: "What kind of dining behavior or customer expectation are you completely comfortable turning away?",
        suggestedAnswers: [
          "Guests expecting fast-food speed",
          "Influencers seeking photo-only stunts",
          "Formal diners wanting stiff quiet"
        ],
        reasoning: "Defining who you reject gives your service team clear identity.",
        readyForSynthesis: true
      };
    }
    return {
      currentRound: round,
      stageLabel: "Signature Ritual",
      question: "What memorable table ritual will guests tell their friends about tomorrow morning?",
      suggestedAnswers: [
        "Sizzling skillet brought table-side",
        "Generous carafes poured at table",
        "Warm bread fresh from embers"
      ],
      reasoning: "Signature rituals create word-of-mouth without paid marketing.",
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
  const isFamily = isFamilyIntent(combinedContext);

  if (domain === 'hospitality') {
    if (isFamily) {
      return {
        brandStrategy: {
          brandName: "Campiña Family Table",
          tagline: "Wood-Fired Pizza & Big Sharing Tables",
          mission: "To bring families and neighborhoods together around honest wood-fired pizzas, hearty pasta platters, and joyful, welcoming tables.",
          targetAudience: "Neighborhood families, parents with hungry kids, multi-generational gatherings, and local regulars looking for wholesome food and warm hospitality.",
          coreValueProposition: "Naturally fermented crispy sourdough pizzas, kid-approved handmade crusts, and family-style platters served in a warm, mess-friendly dining room.",
          antiHero: "Pretentious, quiet dining rooms with tiny portions, side-eye glances at energetic toddlers, and sixty-dollar tasting plates.",
          differentiator: "Giant wooden sharing tables, open dough-stretching counter where kids can watch, and speedy, warm weeknight hospitality."
        },
        voiceSystem: {
          archetype: "The Welcoming Host",
          tone: [
            "Warm",
            "Generous",
            "Down-to-Earth",
            "Joyful"
          ],
          dos: [
            "Celebrate hearty crusts, bubbly cheese, and shared family laughter.",
            "Welcome strollers, big groups, and kids with open arms.",
            "Focus on fresh simple ingredients and generous portions."
          ],
          donts: [
            "Never mention wine pairings, date-night intimacy, or cocktail bars.",
            "No stiff quiet rules or formal dining etiquette.",
            "Never talk down to casual family diners."
          ],
          vocabularyWords: [
            "Hearth",
            "Gather",
            "Share",
            "Warmth",
            "Crisp",
            "Generous"
          ]
        },
        visualTokens: {
          palette: [
            { name: "Warm Terracotta", hex: "#C85A32", role: "primary" },
            { name: "Golden Wheat", hex: "#D99E32", role: "secondary" },
            { name: "Forest Olive", hex: "#4A6044", role: "accent" },
            { name: "Soft Buttermilk", hex: "#FAF7F0", role: "surface" },
            { name: "Deep Espresso", hex: "#261E1A", role: "text" }
          ],
          typography: {
            headingFont: "Fraunces",
            bodyFont: "Inter",
            googleFontsUrl: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;600&family=Inter:wght@400;500&display=swap",
            rationale: "A warm, approachable heritage serif for friendly menus and storefront signage, paired with a clean, highly legible sans-serif for family online ordering."
          },
          stylePhilosophy: "Warm, sunlit family hospitality design with golden wheat tones, terracotta accents, soft buttermilk surfaces, and welcoming rounded geometry.",
          borderCurvature: "rounded-2xl"
        },
        launchContent: {
          heroHeadline: "Big Tables. Honest Slices. Bring Everyone.",
          heroSubheadline: "Hand-stretched wood-fired sourdough pizzas, fresh pasta platters, and generous family dining where kids and grandparents feel right at home.",
          callToAction: "Reserve a Family Table",
          manifesto: "Family dinner shouldn't be stressful or stuffy. We got tired of restaurants where strollers are treated like hazards and kids are given frozen nuggets while parents whisper. We built a room with big oak tables, high heat, and fresh dough stretched right before your eyes. Bring the team after the game, bring the grandparents on Sunday, or pull up a chair on a busy Tuesday. There is always a seat at our table.",
          elevatorPitch: "Campiña Family Table is a welcoming neighborhood pizzeria offering handcrafted wood-fired pizzas, sharing platters, and vibrant family-friendly hospitality.",
          socialHooks: [
            "Messy hands, full bellies, big smiles. Pass the pizza.",
            "Built for family weeknights and Sunday teams. Big tables always open.",
            "Real wood-fired dough. Honest ingredients. Every generation welcome."
          ]
        }
      };
    }

    return {
      brandStrategy: {
        brandName: "Campiña Hearth & Table",
        tagline: "Wood-Fired Dining & Neighborhood Hospitality",
        mission: "To make neighborhood dining unpretentious, delicious, and centered around an open fire table.",
        targetAudience: "Neighborhood regulars, hungry friends, and lively dinner parties who want blistering sourdough pizza, delicious hospitality, and zero stiff service.",
        coreValueProposition: "72-hour naturally fermented dough fired at 900 degrees over seasoned oak, served at neighborhood prices in a warm, communal room.",
        antiHero: "Stiff, overpriced dining rooms with whispering servers, tiny portions, and pretentious tasting lecture scripts.",
        differentiator: "Blistering live-fire oven right in the center of a loud, energetic, communal dining room where you can always hear your friends."
      },
      voiceSystem: {
        archetype: "The Warm Host",
        tone: [
          "Warm",
          "Direct",
          "Generous",
          "Lively"
        ],
        dos: [
          "Talk passionately about sizzling crusts, melted cheeses, and cold pours.",
          "Keep the dining room casual, energetic, and welcoming to everyone.",
          "Welcome guests warmly with zero pretension or stiff lectures."
        ],
        donts: [
          "Never use pretentious buzzwords like terroir, provenance, or quiet luxury.",
          "No stiff white tablecloth etiquette or whisper-only rules.",
          "Never rush guests off their tables with artificial time limits."
        ],
        vocabularyWords: [
          "Oak",
          "Crust",
          "Table",
          "Sizzle",
          "Hearth",
          "Lively"
        ]
      },
      visualTokens: {
        palette: [
          { name: "Cast Iron Charcoal", hex: "#1C1917", role: "surface" },
          { name: "Deep Terracotta", hex: "#C25E3E", role: "primary" },
          { name: "Toasted Fennel", hex: "#556B2F", role: "secondary" },
          { name: "Aged Brass", hex: "#C49A45", role: "accent" },
          { name: "Warm Cream", hex: "#FAF8F5", role: "text" }
        ],
        typography: {
          headingFont: "Fraunces",
          bodyFont: "Inter",
          googleFontsUrl: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;600&family=Inter:wght@400;500&display=swap",
          rationale: "A classic, high-contrast serif for printed daily menus and signage paired with a modern neutral sans-serif for responsive reservations and digital ordering."
        },
        stylePhilosophy: "Warm, tactile hospitality design with cast-iron contrast, deep terracotta accents, and unpretentious editorial typography.",
        borderCurvature: "rounded-xl"
      },
      launchContent: {
        heroHeadline: "Open Fire. Honest Slices. No Stiff Collars.",
        heroSubheadline: "A lively neighborhood dining room with wood-fired sourdough pizzas and unpretentious neighborhood service.",
        callToAction: "Grab a Table",
        manifesto: "Dining out should be loud, joyful, and deeply satisfying. We are tired of stiff restaurants where you can't hear your friends and the bill feels like a down payment. We build around what matters: seasoned oak, blistering heat, fermented dough, and honest food served freely. Pull up a chair, order a pie, and stay as long as you want.",
        elevatorPitch: "Campiña Hearth & Table is a vibrant wood-fired pizza and neighborhood dining room dedicated to sourdough craft, lively tables, and zero dining pretension.",
        socialHooks: [
          "Life is too short for stiff dining rooms and quiet whispers. Pass the pizza.",
          "72-hour fermented dough. 900-degree oak fire. 0 pretension.",
          "Great hospitality doesn't need a lecture. Just pull up a chair."
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
    const isFamily = isFamilyIntent(transcriptText);

    // Attempt Gemini invocation via dynamic model resolution if configured
    if (getGeminiClient()) {
      try {
        const domainGuidance = getDomainGuidance(domain, isFamily);

        const systemInstruction = `You are a seasoned brand advisor helping a founder turn their rough concept into a distinctive, commercially viable brand.

${domainGuidance}

RULES:
1. SPEAK LIKE A CONSTRUCTIVE HUMAN:
   - Keep the question to 1 or 2 clear sentences (STRICTLY UNDER 25 WORDS TOTAL).
   - No academic jargon or obscure words (BANNED: "terroir", "provenance", "sacred cow", "bleeding-neck", "quiet luxury", "sanctuary", "elemental").
2. TAILOR TO THE ACTUAL DOMAIN & DEMOGRAPHIC:
   - If the founder specifies "family", "family dining", or "kids": STRICTLY FORBID alcohol, wine bar, or date-night suggestions. Focus on family dining flow, kid-friendly seating, sharing platters, weeknight speed, or neighborhood trust.
   - For a general restaurant: ask about the dinner vibe, table experience, price-point compromise, and what the neighborhood is missing.
   - For a software product: ask about workflows, speed, and tooling frustrations.
3. THREE DISTINCT REAL CHOICES:
   - Return exactly 3 suggested answers.
   - Limit each suggested answer to UNDER 6 WORDS.
   - The 3 options must represent radically different strategic directions.
4. REASONING:
   - 1 simple sentence explaining how this choice defines the brand's identity or pricing.
5. STAGE LABEL: Short 2-3 word label reflecting this inquiry round.
6. READY FOR SYNTHESIS: Set to true if currentRound >= 3.

Currently evaluating Round ${currentRound}.`;

        const prompt = `Conversation Transcript:\n${transcriptText}\n\nDetected Domain: ${domain.toUpperCase()}${isFamily ? ' (FAMILY DINING INTENT)' : ''}.\nFormulate the next question for Round ${currentRound}. Return structured JSON matching schema.`;

        const result = await generateStructuredJson({
          systemInstruction,
          prompt,
          schema: questionSchema
        });

        // Ensure round and readiness flags are synchronized
        result.currentRound = currentRound;
        result.readyForSynthesis = Boolean(result.readyForSynthesis || readyForSynthesis);
        if (!result.stageLabel) {
          result.stageLabel = currentRound === 1 ? (isFamily ? "Family Dining Flow" : "Target Audience") : currentRound === 2 ? "Core Differentiation" : currentRound === 3 ? "Brand Edge" : "Strategic Moat";
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
    const isFamily = isFamilyIntent(transcriptText);

    if (getGeminiClient()) {
      try {
        const domainGuidance = getDomainGuidance(domain, isFamily);

        const systemInstruction = `You are an elite Creative Director and Brand Identity Partner at a top tier agency (like Collins or Pentagram).
Your job is to synthesize the founder's interview into a launch-ready, world-class brand system.

${domainGuidance}

STRICT TONE, AUDIENCE & LANGUAGE CONSTRAINTS:
1. STRICT AUDIENCE-TO-VIBE ALIGNMENT (PREVENT DEMOGRAPHIC HALLUCINATIONS):
   - If the founder specifies "family", "family dining", "family pizza", "kids", or "all-ages":
     * BRAND NAME: DO NOT name the brand after alcohol, bars, or date-night tropes (BANNED in names: "Wine", "Bar", "Tavern", "Lounge", "Cellar", "Spirits", "Cocktails", "Pub"). Acceptable names: Warm family and hearth names (e.g., "Campiña Family Table", "Lucca & Family Pizzeria", "Casa Famiglia Hearth", "Little Star Pizza Co.").
     * TARGET AUDIENCE: Must directly match the input (e.g., parents with hungry kids, multi-generational family dinners, neighborhood regulars, youth teams).
     * PALETTE COLORS: Must reflect family warmth (approachable terracottas, golden wheat, soft buttermilk surface, forest greens; avoid gloomy dark bar aesthetics or cold dark charcoal).
     * COPY: Focus on generous sharing platters, kid-friendly welcome, messy slices, and zero stiff pretension.
   - If the business is NOT family-focused, align precisely with the founder's specific audience (date nights, solo diners, office workers, etc.).

2. BAN CORPORATE THEATER & POETIC DRIVEL:
   - FORBIDDEN BUZZWORDS: "terroir", "provenance", "quiet luxury", "unfiltered exposure", "sovereign", "climate-controlled indifference", "elemental", "sanctuary", "sacred cow", "bleeding-neck", "synergize".
   - Never write high-flown, melodramatic prose. Write punchy, muscular, evocative, and commercially actionable copy.

3. DOMAIN-AWARE VOCABULARY:
   - DETECT THE DOMAIN: If the business is a physical space, restaurant, or hospitality brand, speak in physical, culinary, and guest-experience terms (e.g., tables, warmth, regulars, signature dishes, neighborhood energy, lighting, host presence).
   - Never export SaaS/tech phrases ("system labels", "high data density", "API latency", "beachhead ICP") to physical hospitality brands.

4. STRATEGIC NARRATIVE RULES:
   - brandStrategy.targetAudience: Be concrete and human. Who walks in the door? What are they hungry for? What time do they come?
   - brandStrategy.antiHero: What standard industry experience does this place refuse to replicate? (e.g., "Stiff, silent dining rooms where toddlers get dirty looks and portions are microscopic", "Overpriced tasting menus with cold service").
   - brandStrategy.differentiator: What is the singular reason someone chooses this place over the spot next door?

5. VOICE & MANIFESTO RULES:
   - voiceSystem.archetype: Use classic, grounded character archetypes (e.g., "The Welcoming Host", "The Family Craftsman", "The Neighborhood Instigator", "The Bold Modernist").
   - launchContent.heroHeadline: Short, memorable, punchy (under 6 words). E.g., for family: "Big Tables. Honest Slices. Bring Everyone."
   - launchContent.manifesto: 2 tight paragraphs. Honest, visceral, grounded. Make the reader crave the food and atmosphere immediately.

6. VISUAL & COLOR TOKENS:
   - Palette: Return appetizing, harmonious colors tailored to the vibe (for family: Warm Terracotta, Golden Wheat, Forest Olive, Soft Buttermilk, Deep Espresso; for nightlife/bar: Deep Terracotta, Cast Iron Charcoal, Toasted Fennel, Aged Brass, Warm Cream).
   - Typography Rationale: Write real descriptions relevant to the industry in visualTokens.typography.rationale (e.g., "A warm, approachable heritage serif for friendly menus and storefront signage paired with a clean, highly legible sans-serif for family digital ordering").
   - borderCurvature: 'rounded-none', 'rounded-lg', 'rounded-xl', or 'rounded-2xl'.`;

        const prompt = `Full Socratic Interview Transcript:\n${transcriptText}\n\nDetected Domain: ${domain.toUpperCase()}${isFamily ? ' (FAMILY DINING INTENT)' : ''}.\nCompile the complete Brand Kit now.`;

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
