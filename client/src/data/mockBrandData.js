/**
 * High-Fidelity Domain-Adaptive Brand Kits & Mock Strategy Generators
 * Ensures the client NEVER presents tech/SaaS tropes when the founder is building
 * a restaurant, hospitality space, fashion label, or consumer experience.
 */

export const hospitalityBrandKit = {
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

export const developerBrandKit = {
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

export const careerBrandKit = {
  brandStrategy: {
    brandName: "Signal Folio",
    tagline: "The Unapologetic Proof of Work for High-Agency Builders",
    mission: "To eliminate keyword-stuffed corporate resumes and replace them with high-signal, verified evidence of real impact.",
    targetAudience: "Exceptional engineers, designers, and operators who refuse to play the ATS automated filtering game.",
    coreValueProposition: "Convert messy career histories into a crisp, editorial monograph designed for the 10-second scan of decision-makers.",
    antiHero: "Predatory ATS resume optimization farms that encourage keyword stuffing and robotic corporate clichés.",
    differentiator: "Zero fluff, structured project case studies, and instant typography that signals senior executive craft."
  },
  voiceSystem: {
    archetype: "The Discerning Editor",
    tone: [
      "Clear",
      "Restrained",
      "Authoritative",
      "Impact-First"
    ],
    dos: [
      "Show measurable architectural impact, not task checklists.",
      "Use sharp, declarative language with active verbs.",
      "Treat career milestones as design case studies."
    ],
    donts: [
      "Never use hollow buzzwords like 'passionate leader' or 'detail-oriented'.",
      "Avoid multi-column visual clutter that confuses readers.",
      "Never obscure the actual technical deliverable."
    ],
    vocabularyWords: [
      "Clarity",
      "Signal",
      "Provenance",
      "Evidence",
      "Craft",
      "Impact"
    ]
  },
  visualTokens: {
    palette: [
      { name: "Paper Cream", hex: "#F2F1ED", role: "surface" },
      { name: "Deep Ink", hex: "#111111", role: "primary" },
      { name: "Neutral Stone", hex: "#737373", role: "secondary" },
      { name: "Warm Linen", hex: "#DBD7CD", role: "accent" },
      { name: "Pure White", hex: "#FFFFFF", role: "text" }
    ],
    typography: {
      headingFont: "Cormorant Garamond",
      bodyFont: "Inter",
      googleFontsUrl: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=Inter:wght@400;500&display=swap"
    },
    stylePhilosophy: "Restrained Swiss editorial design with warm tactile paper tones and razor-sharp typographic discipline.",
    borderCurvature: "rounded-lg"
  },
  launchContent: {
    heroHeadline: "Your Career Is Not A Keyword-Stuffed Template.",
    heroSubheadline: "Editorial monographs that communicate deep technical mastery to senior hiring leaders in under ten seconds.",
    callToAction: "Build Your Dossier",
    manifesto: "The corporate hiring pipeline is broken by automated bots screening for buzzwords. Exceptional candidates are reduced to 1-page PDF summaries that conceal their true genius. We believe your craft deserves an editorial standard.",
    elevatorPitch: "Signal Folio turns developer career trajectories into pristine, high-signal monographs that skip automated filters and win executive interviews.",
    socialHooks: [
      "ATS filters reward buzzword stuffing. Real leaders reward proof of work.",
      "If your resume looks like a 2005 Word document, you're pricing yourself at a discount.",
      "Stop describing duties. Start publishing verified architectural impact."
    ]
  }
};

/**
 * Default mock brand kit export
 */
export const mockBrandKit = hospitalityBrandKit;

/**
 * Domain Classifier
 */
export function extractClientDomain(text = '') {
  const lower = String(text).toLowerCase();
  if (/(restaurant|food|dining|cuisine|culinary|chef|bistro|cafe|bar|bakery|coffee|eatery|pizza|burger|pasta|taco|cocktail|hospitality|kitchen|table|wine|menu|dish)/i.test(lower)) {
    return 'hospitality';
  }
  if (/(resume|career|job|hiring|portfolio|cv|recruiter|interview|ats)/i.test(lower)) {
    return 'career';
  }
  if (/(database|compiler|code|dev|developer|api|rust|backend|infrastructure|saas|terminal|cli|software)/i.test(lower)) {
    return 'developer';
  }
  return 'hospitality'; // Default to hospitality/general craft over generic dev
}

/**
 * Returns a domain-adaptive brand kit based on user pitch or history
 */
export function getDomainMockBrandKit(contextText = '') {
  const domain = extractClientDomain(contextText);
  if (domain === 'hospitality') return hospitalityBrandKit;
  if (domain === 'career') return careerBrandKit;
  if (domain === 'developer') return developerBrandKit;
  return hospitalityBrandKit;
}

/**
 * Returns high-fidelity domain-adaptive fallback questions
 */
export function getDomainMockQuestion(round = 1, contextText = '') {
  const domain = extractClientDomain(contextText);

  if (domain === 'hospitality') {
    if (round === 1) {
      return {
        currentRound: 1,
        stageLabel: "Target Diners",
        question: "Broad dining concepts fail to build loyalty. Who feels an immediate emotional connection to your table?",
        suggestedAnswers: [
          "Discerning culinary purists seeking terroir.",
          "Neighborhood regulars seeking unhurried dining.",
          "Adventurous eaters seeking bold open fire."
        ],
        reasoning: "Focusing on a specific dining beachhead creates a devoted neighborhood following.",
        readyForSynthesis: false
      };
    }
    if (round === 2) {
      return {
        currentRound: 2,
        stageLabel: "Culinary Ethos",
        question: "Corporate restaurants compromise on ingredients to boost margins. What kitchen compromise will you never make?",
        suggestedAnswers: [
          "Zero frozen or distributor shortcuts.",
          "100% direct regenerative farm sourcing.",
          "Only wood-fired ancestral cooking."
        ],
        reasoning: "Clear culinary convictions guard against generic food concepts.",
        readyForSynthesis: false
      };
    }
    if (round === 3) {
      return {
        currentRound: 3,
        stageLabel: "Atmosphere & Edge",
        question: "Trend-chasing hospitality spaces feel sterile. What popular dining trend do you refuse to adopt?",
        suggestedAnswers: [
          "Rushed table turns and QR menus.",
          "Dimly lit faux-industrial clichés.",
          "Loud club music over honest dialogue."
        ],
        reasoning: "Atmospheric boundaries shape sensory identity and room cadence.",
        readyForSynthesis: true
      };
    }
    return {
      currentRound: round,
      stageLabel: "Hospitality Moat",
      question: "Menus are easily imitated across town. What unforgettable dining ritual makes your space inimitable?",
      suggestedAnswers: [
        "Unhurried communal hearth seatings.",
        "Chef-curated micro-seasonal pairings.",
        "Nightly bread and wild fermentation ritual."
      ],
      reasoning: "Ritual converts first-time diners into lifelong brand ambassadors.",
      readyForSynthesis: true
    };
  }

  if (domain === 'career') {
    if (round === 1) {
      return {
        currentRound: 1,
        stageLabel: "Target Candidate",
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

  // Developer fallback
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

/**
 * Sample 1-sentence pitches spanning diverse business categories
 */
export const samplePitches = [
  "An intimate wood-fired hearth restaurant in Brooklyn serving micro-seasonal dishes from regenerative local farms.",
  "A minimalist resume builder tailored for the 6-second glance of engineering managers.",
  "An in-memory developer database compiling complex SQL into bare-metal Rust in under 1 millisecond."
];
