/**
 * Mock Engine — Deterministic Multi-Domain Fallback Generators
 *
 * Produces high-fidelity Socratic questions and brand kits for offline testing,
 * quota exhaustion, and network failures. No LLM dependency.
 *
 * Imported by interviewService and compilerService as the last resort layer.
 */

import { DOMAINS, classifyDomain, isFamilyIntent } from '../data/domainConfig.js';

// ---------------------------------------------------------------------------
// MOCK QUESTIONS
// ---------------------------------------------------------------------------

export function getMockQuestion(round, userContext = '') {
  const lower = String(userContext || '').toLowerCase();
  if (/(burger|smash|patty|patties|bun|fries|shake)/i.test(lower)) {
    const batch = _burgerBatch();
    const q = batch[Math.min(round - 1, batch.length - 1)];
    return {
      currentRound: round,
      stageLabel: q.stageLabel,
      question: q.question,
      suggestedAnswers: q.suggestedAnswers,
      reasoning: q.reasoning,
      allowMultiple: Boolean(q.allowMultiple),
      readyForSynthesis: round >= 3
    };
  }
  const domain = classifyDomain(userContext);
  const isFamily = isFamilyIntent(userContext);

  if (domain === DOMAINS.FASHION) return _fashionQuestion(round);
  if (domain === DOMAINS.BEVERAGE) return _beverageQuestion(round);
  if (domain === DOMAINS.HOSPITALITY) {
    if (isFamily) return _familyQuestion(round);
    return _hospitalityQuestion(round);
  }
  if (domain === DOMAINS.CAREER) return _careerQuestion(round);
  if (domain === DOMAINS.DEVELOPER) return _developerQuestion(round);
  return _generalQuestion(round);
}

// ---------------------------------------------------------------------------
// 7-DIMENSION BATCH DISCOVERY QUESTIONS
// ---------------------------------------------------------------------------

export function getMockBatch(userContext = '') {
  const lower = String(userContext || '').toLowerCase();
  if (/(burger|smash|patty|patties|bun|fries|shake)/i.test(lower)) {
    return _burgerBatch();
  }
  const domain = classifyDomain(userContext);
  const isFamily = isFamilyIntent(userContext);

  if (domain === DOMAINS.FASHION) return _fashionBatch();
  if (domain === DOMAINS.BEVERAGE) return _beverageBatch();
  if (domain === DOMAINS.HOSPITALITY) {
    return isFamily ? _familyBatch() : _hospitalityBatch();
  }
  if (domain === DOMAINS.CAREER) return _careerBatch();
  if (domain === DOMAINS.DEVELOPER) return _developerBatch();
  return _generalBatch();
}

function _burgerBatch() {
  return [
    {
      id: 1,
      stageLabel: "Audience & Occasion",
      question: "Which craving moment brings customers to your burger counter first?",
      suggestedAnswers: ["Quick weekday lunch grab", "Late-night craveable post-bar feast", "Weekend neighborhood comfort ritual"],
      reasoning: "Defines order volume peaks, counter speed, and opening hours.",
      allowMultiple: false
    },
    {
      id: 2,
      stageLabel: "Taste & Physical Friction",
      question: "What physical burger flaw will you refuse to tolerate?",
      suggestedAnswers: ["Soggy buns from steam traps", "Dry overcooked grey beef patties", "Excess grease dissolving the bun"],
      reasoning: "Directs griddle temperature, wrapping material, and bun toast degree.",
      allowMultiple: true
    },
    {
      id: 3,
      stageLabel: "The Fast-Food Standard We Reject",
      question: "Which fast-food compromise does your brand declare war against?",
      suggestedAnswers: ["Frozen pre-formed mystery beef pucks", "Sugary dressing hiding flavorless patties", "Microwaved warming-drawer burgers"],
      reasoning: "Builds high-conviction anti-hero positioning that earns trust.",
      allowMultiple: false
    },
    {
      id: 4,
      stageLabel: "Dining & Delivery Atmosphere",
      question: "How should customers experience the ordering environment?",
      suggestedAnswers: ["Screaming hot open griddle counter", "Fast takeout in unbleached butcher wraps", "Retro diner warmth with counter seats"],
      reasoning: "Directs kitchen layout, exhaust styling, and packaging choice.",
      allowMultiple: true
    },
    {
      id: 5,
      stageLabel: "Pricing & Menu Tier",
      question: "What pricing stance signals your culinary standard?",
      suggestedAnswers: ["Accessible everyday street-eats ($9–$13)", "Gourmet double-smash craft tier ($14–$18)", "Curated bundle with tallow fries"],
      reasoning: "Shapes check averages and ingredient sourcing margins.",
      allowMultiple: false
    },
    {
      id: 6,
      stageLabel: "Aesthetic & Packaging Stance",
      question: "What visual identity sets your butcher wrap and store apart?",
      suggestedAnswers: ["Parchment wrap with bold stamped typography", "Warm cream, paprika, and mustard tones", "Vintage roadside diner neon nostalgia"],
      reasoning: "Dictates color tokens, wrapper grease-proof paper, and signage.",
      allowMultiple: true
    },
    {
      id: 7,
      stageLabel: "The Irresistible Flavor Edge",
      question: "What is the singular taste detail competitors cannot clone?",
      suggestedAnswers: ["Caramelized crispy lacy maillard edges", "Martin's potato buns toasted in beef tallow", "Dry-aged brisket blend with secret relish"],
      reasoning: "Creates word-of-mouth conviction that competitors cannot match.",
      allowMultiple: false
    }
  ];
}

function _familyBatch() {
  return [
    {
      id: 1,
      stageLabel: "Audience",
      question: "Who is the primary crowd filling your tables first?",
      suggestedAnswers: ["Parents with energetic young kids", "Multi-generation Sunday family gatherings", "Neighborhood sports teams after practice"],
      reasoning: "Identifies table sizes, seating flow, and high chair needs."
    },
    {
      id: 2,
      stageLabel: "Experience",
      question: "What frustrating reality of dining out brings families to you?",
      suggestedAnswers: ["Tiny overpriced portions leaving kids hungry", "Stiff quiet rooms where kids get glared at", "Slow kitchen waits causing toddler meltdowns"],
      reasoning: "Focuses your kitchen pace and hospitality posture."
    },
    {
      id: 3,
      stageLabel: "Villain",
      question: "What tired cliché or bad habit in family dining do you refuse to copy?",
      suggestedAnswers: ["Frozen processed chicken nuggets and fries", "Sticky laminated menus with cheap shortcuts", "Artificial dough additives and speed doughs"],
      reasoning: "Establishes real ingredient boundaries that earn parental trust."
    },
    {
      id: 4,
      stageLabel: "Vibe",
      question: "What atmosphere and physical environment do families walk into?",
      suggestedAnswers: ["Sunlit open hearth with big wooden tables", "Bustling mess-friendly neighborhood pizzeria", "Warm wood and brass with lively acoustic hum"],
      reasoning: "Shapes acoustic treatment, lighting, and furniture durability."
    },
    {
      id: 5,
      stageLabel: "Pricing",
      question: "What is your pricing and accessibility stance for busy families?",
      suggestedAnswers: ["Accessible everyday weeknight value", "Honest neighborhood craft without markup", "Special celebratory weekend feast packages"],
      reasoning: "Determines menu architecture, check average, and repeat frequency."
    },
    {
      id: 6,
      stageLabel: "Tone",
      question: "What must the brand and service team NEVER sound or look like?",
      suggestedAnswers: ["Pretentious wine bar or quiet lounge", "Cold sterile corporate fast food chain", "Over-formal fine dining with stiff rules"],
      reasoning: "Prevents confusing brand signals and keeps staff aligned."
    },
    {
      id: 7,
      stageLabel: "Edge",
      question: "What singular reason makes parents choose you over the spot down the street?",
      suggestedAnswers: ["72-hour naturally fermented sourdough crust", "Kids watch dough stretched at counter", "Giant wooden sharing tables fit everyone"],
      reasoning: "Creates word-of-mouth conviction that competitors cannot copy."
    }
  ];
}

function _hospitalityBatch() {
  return [
    {
      id: 1,
      stageLabel: "Audience",
      question: "Who is the first person walking through your doors on a Friday night?",
      suggestedAnswers: ["Neighborhood regulars seeking great craft", "Date nights wanting unpretentious warmth", "Lively groups sharing wine and pizzas"],
      reasoning: "Determines table turns, lighting, and hospitality pacing."
    },
    {
      id: 2,
      stageLabel: "Experience",
      question: "What frustrating compromise in neighborhood dining brings guests to you?",
      suggestedAnswers: ["Overpriced tiny portions with stiff service", "Noisy generic chains with bland food", "Ninety-minute rush limits on tables"],
      reasoning: "Defines the core emotional relief your hospitality delivers."
    },
    {
      id: 3,
      stageLabel: "Villain",
      question: "What conventional restaurant habit or cliché do you strictly refuse to adopt?",
      suggestedAnswers: ["Pretentious tasting menus and lectures", "Industrial freezer dough and canned sauces", "Whispering servers with stiff attitudes"],
      reasoning: "Declaring kitchen and service boundaries builds guest loyalty."
    },
    {
      id: 4,
      stageLabel: "Vibe",
      question: "What environment and sensory mood greets someone walking in?",
      suggestedAnswers: ["Blistering wood hearth and cast-iron glow", "Energetic room with loud vinyl and laughter", "Intimate counter seating facing live fire"],
      reasoning: "Shapes tactile materials, room acoustics, and interior details."
    },
    {
      id: 5,
      stageLabel: "Pricing",
      question: "What is your pricing philosophy and accessibility stance?",
      suggestedAnswers: ["Neighborhood everyday dining value", "Accessible craft pricing with zero pretension", "High-end artisanal weekend destination"],
      reasoning: "Positions the brand in the local dining hierarchy."
    },
    {
      id: 6,
      stageLabel: "Tone",
      question: "What must your brand and voice NEVER sound like?",
      suggestedAnswers: ["Pretentious consultant food-critic speak", "Corporate sanitized casual chain script", "Aloof hipster dining club attitude"],
      reasoning: "Keeps copy, menus, and staff conversations grounded."
    },
    {
      id: 7,
      stageLabel: "Edge",
      question: "What is the unfair differentiator that makes this impossible to replicate?",
      suggestedAnswers: ["Live-oak wood oven in center of room", "Naturally fermented 72-hour crispy dough", "Warm generous host who knows your name"],
      reasoning: "The enduring advantage that drives organic recommendations."
    }
  ];
}

function _developerBatch() {
  return [
    {
      id: 1,
      stageLabel: "Audience",
      question: "Who is the technical user adopting your product on day one?",
      suggestedAnswers: ["Systems engineers fighting query latency", "DevOps leads tackling cloud cost overruns", "Staff engineers fed up with ORM bloat"],
      reasoning: "Narrow developer personas drive organic grassroots adoption."
    },
    {
      id: 2,
      stageLabel: "Experience",
      question: "What developer friction or broken workflow are you eliminating entirely?",
      suggestedAnswers: ["Multi-second query compile latency", "Complex distributed cluster setup", "Opaque cloud vendor lock-in"],
      reasoning: "Focuses developer documentation and CLI developer experience."
    },
    {
      id: 3,
      stageLabel: "Villain",
      question: "What enterprise software cliché or bloated practice do you eliminate?",
      suggestedAnswers: ["Mandatory sales calls before seeing pricing", "Heavy JVM/Python runtime overhead", "Over-abstracted YAML configuration sprawl"],
      reasoning: "Engineers trust tools with radical architectural transparency."
    },
    {
      id: 4,
      stageLabel: "Vibe",
      question: "What is the technical environment and operational posture?",
      suggestedAnswers: ["Bare-metal single binary CLI tool", "Cloud-native distributed Kubernetes engine", "In-memory sub-millisecond local cache"],
      reasoning: "Sets the visual brutalism, documentation style, and benchmarks."
    },
    {
      id: 5,
      stageLabel: "Pricing",
      question: "What is your commercialization and pricing stance?",
      suggestedAnswers: ["Open source core with enterprise support", "Predictable consumption billing with no seat tax", "Free local dev with paid cloud hosting"],
      reasoning: "Aligns developer trust with sustainable enterprise monetization."
    },
    {
      id: 6,
      stageLabel: "Tone",
      question: "What must your brand and documentation NEVER sound like?",
      suggestedAnswers: ["Vague enterprise marketing hype", "Patronizing baby-talk onboarding guides", "Pastel corporate SaaS brochureware"],
      reasoning: "Preserves technical credibility among senior systems engineers."
    },
    {
      id: 7,
      stageLabel: "Edge",
      question: "What contrarian architectural conviction makes your product uncopyable?",
      suggestedAnswers: ["Compiled Rust execution under 1ms", "Zero-dependency embedded architecture", "Deterministic memory safety without GC"],
      reasoning: "Forms a defensible technical moat that incumbents cannot easily patch."
    }
  ];
}

function _careerBatch() {
  return [
    {
      id: 1,
      stageLabel: "Audience",
      question: "Who is the specific candidate you help win high-stakes interviews?",
      suggestedAnswers: ["Senior engineers with non-traditional backgrounds", "Design leaders showcasing deep case studies", "Founders transitioning into executive roles"],
      reasoning: "Focusing on a high-agency user prevents generic resume commoditization."
    },
    {
      id: 2,
      stageLabel: "Experience",
      question: "What broken hiring reality are you rescuing candidates from?",
      suggestedAnswers: ["Black-hole automated ATS bot filters", "Messy 1-page summaries hiding architectural depth", "Keyword stuffing recommendations from recruiters"],
      reasoning: "Directly solves the 6-second glance frustration of hiring managers."
    },
    {
      id: 3,
      stageLabel: "Villain",
      question: "What predatory industry habit or resume cliché do you refuse to adopt?",
      suggestedAnswers: ["Recurring monthly subscription paywalls", "Fluffy buzzword checklists without proof", "Cluttered multi-column infographic templates"],
      reasoning: "Positions the brand as an honest, high-signal editorial standard."
    },
    {
      id: 4,
      stageLabel: "Vibe",
      question: "What aesthetic and reading impression should the dossier deliver?",
      suggestedAnswers: ["Restrained Swiss typographic monograph", "Executive technical dossier on warm paper", "Minimalist high-contrast portfolio site"],
      reasoning: "Typographic restraint signals seniority and disciplined craft."
    },
    {
      id: 5,
      stageLabel: "Pricing",
      question: "What is your pricing and accessibility posture?",
      suggestedAnswers: ["Transparent one-time purchase forever", "Pay-once export with no subscription trap", "Premium bespoke review service"],
      reasoning: "Eliminates predatory consumer subscription fatigue."
    },
    {
      id: 6,
      stageLabel: "Tone",
      question: "What must your brand and candidate copy NEVER sound like?",
      suggestedAnswers: ["Cheesy motivational LinkedIn influencer speak", "Stuffy corporate HR compliance jargon", "Apologetic hedging and passive voice"],
      reasoning: "Ensures the voice remains declarative, sharp, and authoritative."
    },
    {
      id: 7,
      stageLabel: "Edge",
      question: "What is the unfair differentiator that wins candidate conviction?",
      suggestedAnswers: ["Verified impact proof-of-work layouts", "Executive typography tailored to hiring managers", "Instant conversion from raw messy notes"],
      reasoning: "The definitive reason a candidate pays instead of opening Google Docs."
    }
  ];
}

function _generalBatch() {
  return [
    {
      id: 1,
      stageLabel: "Audience",
      question: "Who is the acute early adopter who will buy immediately?",
      suggestedAnswers: ["Discerning buyers craving authentic craft", "Frustrated users fleeing legacy compromises", "Early-adopter power users building fast"],
      reasoning: "A narrow beachhead audience unlocks rapid organic traction."
    },
    {
      id: 2,
      stageLabel: "Experience",
      question: "What painful status quo or broken compromise brings them to you?",
      suggestedAnswers: ["Overpriced mediocre mass-market options", "Clunky tools designed by committee consensus", "Slow unresponsive legacy service"],
      reasoning: "Defines the core problem and primary customer relief."
    },
    {
      id: 3,
      stageLabel: "Villain",
      question: "What conventional practice or bad habit in this category do you reject?",
      suggestedAnswers: ["Sterile corporate homogenization", "Hidden fee pricing and aggressive lock-in", "Cheap materials disguised with fancy marketing"],
      reasoning: "Anti-heroes create ideological contrast and brand loyalty."
    },
    {
      id: 4,
      stageLabel: "Vibe",
      question: "What is the environment and personality of the brand experience?",
      suggestedAnswers: ["High-craft editorial with disciplined whitespace", "Warm energetic community-first space", "Bold modern minimalist utility"],
      reasoning: "Determines visual tokens, geometry, and presentation tone."
    },
    {
      id: 5,
      stageLabel: "Pricing",
      question: "What is your pricing and accessibility stance in the market?",
      suggestedAnswers: ["Accessible everyday value for the community", "Honest craft pricing without agency markup", "Premium luxury tier for demanding clients"],
      reasoning: "Anchors customer expectations and commercial viability."
    },
    {
      id: 6,
      stageLabel: "Tone",
      question: "What must the brand NEVER look or sound like?",
      suggestedAnswers: ["Generic beige corporate brochureware", "Aggressive spammy infomercial sales pitch", "Tired academic jargon and consultant speak"],
      reasoning: "Negative brand boundaries preserve distinct identity."
    },
    {
      id: 7,
      stageLabel: "Edge",
      question: "What singular advantage makes you impossible to replace?",
      suggestedAnswers: ["Uncompromising dedication to raw materials", "Radical speed and algorithmic synthesis", "Deep personal relationship with every buyer"],
      reasoning: "The core reason customers remain fiercely loyal."
    }
  ];
}

function _familyQuestion(round) {
  const questions = [
    {
      currentRound: 1, stageLabel: 'Family Dining Flow',
      question: 'Family dinners have different rhythms. Fast weeknight school-night dinners or celebratory weekend feasts?',
      suggestedAnswers: ['Fast weeknight neighborhood dinners', 'Lively weekend family feasts', 'All-day pizza & gelato counter'],
      reasoning: 'Table turn speed and kid-friendly service style determine your dining room layout.',
      readyForSynthesis: false
    },
    {
      currentRound: 2, stageLabel: 'Kitchen Boundaries',
      question: 'Many family spots use frozen shortcuts or bland kid menus. What compromise do you refuse to make?',
      suggestedAnswers: ['No frozen or boxed kid food', 'No artificial dough improvers', 'No cramped tables or stroller bans'],
      reasoning: 'Real ingredient boundaries build lasting trust with health-conscious parents.',
      readyForSynthesis: false
    },
    {
      currentRound: 3, stageLabel: 'Family Ritual',
      question: 'What memorable dining ritual will kids and parents look forward to every visit?',
      suggestedAnswers: ['Watch dough tossed at counter', 'Family sharing platters sliced table-side', 'Soft-serve swirl station for kids'],
      reasoning: 'Tangible interactive rituals turn first-time families into weekly regulars.',
      readyForSynthesis: true
    }
  ];
  return questions[Math.min(round - 1, 2)] ?? {
    currentRound: round, stageLabel: 'Neighborhood Role',
    question: 'How will your dining room become an indispensable hub for local families?',
    suggestedAnswers: ['Host post-game youth sports tables', 'Host weeknight dough workshops', 'Dine-in and speedy family takeout'],
    reasoning: 'Community integration drives repeat visits throughout the entire school year.',
    readyForSynthesis: true
  };
}

function _hospitalityQuestion(round) {
  const questions = [
    {
      currentRound: 1, stageLabel: 'Dinner Vibe',
      question: 'Are you aiming for an energetic neighborhood joint or an intimate dinner counter?',
      suggestedAnswers: ['Casual neighborhood joint', 'Intimate dinner counter', 'Lively open-fire table'],
      reasoning: 'Your room vibe dictates table spacing, seating cadence, and music volume.',
      readyForSynthesis: false
    },
    {
      currentRound: 2, stageLabel: 'Kitchen Conviction',
      question: 'Most restaurants cut corners on ingredients. What compromise will you refuse to make?',
      suggestedAnswers: ['No freezer shortcuts or additives', 'No tiny pretentious tasting portions', 'No rushed ninety-minute table limits'],
      reasoning: 'Declaring kitchen boundaries shapes menu pricing and guest trust.',
      readyForSynthesis: false
    },
    {
      currentRound: 3, stageLabel: 'Guest Fit',
      question: 'What kind of customer expectation are you completely comfortable turning away?',
      suggestedAnswers: ['Guests expecting fast-food speed', 'Influencers seeking photo-only stunts', 'Formal diners wanting stiff quiet'],
      reasoning: 'Defining who you reject gives your service team clear identity.',
      readyForSynthesis: true
    }
  ];
  return questions[Math.min(round - 1, 2)] ?? {
    currentRound: round, stageLabel: 'Signature Ritual',
    question: 'What memorable table ritual will guests tell their friends about tomorrow morning?',
    suggestedAnswers: ['Sizzling skillet brought table-side', 'Generous carafes poured at table', 'Warm bread fresh from embers'],
    reasoning: 'Signature rituals create word-of-mouth without paid marketing.',
    readyForSynthesis: true
  };
}

function _careerQuestion(round) {
  const questions = [
    {
      currentRound: 1, stageLabel: 'Target Candidates',
      question: 'Generic templates fail ambitious candidates. Who is the specific professional you help win interviews?',
      suggestedAnswers: ['Senior engineers with non-traditional gaps.', 'Career switchers translating past experience.', 'New grads needing verified proof.'],
      reasoning: 'Focusing on a specific target user prevents commoditization.',
      readyForSynthesis: false
    },
    {
      currentRound: 2, stageLabel: 'Incumbent Critique',
      question: 'Most tools optimize for bots rather than managers. What industry compromise do you refuse to make?',
      suggestedAnswers: ['Predatory recurring subscription traps.', 'Visual templates that fail ATS checks.', 'Graphics hiding actual business impact.'],
      reasoning: 'Clear differentiation requires highlighting the compromises of existing solutions.',
      readyForSynthesis: false
    }
  ];
  return questions[Math.min(round - 1, 1)] ?? {
    currentRound: round, stageLabel: 'Brand Edge',
    question: 'Safe brands get ignored. What specific corporate habit are you comfortable alienating?',
    suggestedAnswers: ['Polite corporate buzzwords and clichés.', 'Inflated vanity metrics on resumes.', 'Generic pastel career advice tropes.'],
    reasoning: 'Setting clear negative boundaries defines your visual and verbal identity.',
    readyForSynthesis: true
  };
}

function _developerQuestion(round) {
  const questions = [
    {
      currentRound: 1, stageLabel: 'Technical ICP',
      question: 'Broad positioning dilutes early traction. Who feels this developer problem so acutely they will adopt today?',
      suggestedAnswers: ['Systems engineers crippled by query latency.', 'DevOps teams fighting cloud cost overruns.', 'Platform leads tired of complex ORMs.'],
      reasoning: 'Narrow beachheads provide rapid organic developer adoption.',
      readyForSynthesis: false
    },
    {
      currentRound: 2, stageLabel: 'Architecture Critique',
      question: 'Legacy databases sacrifice speed for enterprise bloat. What fundamental compromise do you refuse?',
      suggestedAnswers: ['Bloated garbage-collected runtimes.', 'Opaque proprietary cloud lock-in.', 'Complex multi-node clustering overhead.'],
      reasoning: 'Differentiators must highlight legacy compromises.',
      readyForSynthesis: false
    }
  ];
  return questions[Math.min(round - 1, 1)] ?? {
    currentRound: round, stageLabel: 'Engineering Conviction',
    question: 'Competitors will copy features quickly. What contrarian engineering belief makes your product impossible to replicate?',
    suggestedAnswers: ['Bare-metal compiled performance over abstractions.', 'Zero-dependency single-binary simplicity.', 'Radical transparency with power users.'],
    reasoning: 'Philosophical conviction forms an enduring competitive moat.',
    readyForSynthesis: true
  };
}

function _generalQuestion(round) {
  if (round === 1) return {
    currentRound: 1, stageLabel: 'Target Audience',
    question: 'Broad positioning dilutes early traction. Who feels this problem so acutely they will pay immediately?',
    suggestedAnswers: ['Passionate early adopters craving quality.', 'Frustrated customers escaping legacy tools.', 'Discerning buyers demanding bespoke craft.'],
    reasoning: 'A narrow beachhead audience provides rapid organic traction.',
    readyForSynthesis: false
  };
  if (round === 2) return {
    currentRound: 2, stageLabel: 'Incumbent Critique',
    question: 'Incumbents rely on feature bloat and vanity claims. What fundamental industry compromise do you refuse?',
    suggestedAnswers: ['Cheap mass-produced commodity shortcuts.', 'Slow, bloated agency retainers.', 'Sterile corporate homogenisation.'],
    reasoning: 'True differentiation comes from ideological contrast with legacy options.',
    readyForSynthesis: false
  };
  return {
    currentRound: round, stageLabel: 'Brand Edge',
    question: 'Safe brands get ignored in a crowded market. What specific habit are you comfortable alienating?',
    suggestedAnswers: ['Bureaucratic committee consensus.', 'Sterile corporate buzzwords.', 'Polite surface-level marketing.'],
    reasoning: 'Negative boundaries define visual and verbal edge.',
    readyForSynthesis: true
  };
}

// ---------------------------------------------------------------------------
// MOCK BRAND KITS
// ---------------------------------------------------------------------------

export function getDomainSwot(kit = {}) {
  const name = kit?.brandStrategy?.brandName || 'Brand';
  const diff = kit?.brandStrategy?.differentiator || 'Craft-first production and direct sourcing';
  const antiHero = kit?.brandStrategy?.antiHero || 'Generic mass-market commodities';
  const audience = kit?.brandStrategy?.targetAudience || 'Discerning customers';
  const valProp = kit?.brandStrategy?.coreValueProposition || 'High-integrity experience';

  return {
    summary: `High-conviction positioning built around "${diff.slice(0, 80)}", establishing distinct pricing power against "${antiHero.slice(0, 60)}" while requiring defensive hedges around unit cost friction and customer education.`,
    strengths: [
      {
        title: "Distinct Operational Differentiator",
        analysis: `Deliberate commitment to ${diff.toLowerCase().slice(0, 110)}, creating authentic commercial defensibility that generic competitors cannot easily replicate.`,
        description: `Deliberate commitment to ${diff.toLowerCase().slice(0, 110)}, creating authentic commercial defensibility that generic competitors cannot easily replicate.`,
        transcriptAnchor: diff.slice(0, 45)
      },
      {
        title: "Polarizing Anti-Hero Stance",
        analysis: `Explicit rejection of ${antiHero.toLowerCase().slice(0, 95)}, forging immediate trust and emotional tribal alignment with core users.`,
        description: `Explicit rejection of ${antiHero.toLowerCase().slice(0, 95)}, forging immediate trust and emotional tribal alignment with core users.`,
        transcriptAnchor: antiHero.slice(0, 45)
      },
      {
        title: "High-Margin Core Proposition",
        analysis: `Value proposition grounded in ${valProp.toLowerCase().slice(0, 100)}, commanding premium price inelasticity over mass-produced alternatives.`,
        description: `Value proposition grounded in ${valProp.toLowerCase().slice(0, 100)}, commanding premium price inelasticity over mass-produced alternatives.`,
        transcriptAnchor: valProp.slice(0, 45)
      }
    ],
    weaknesses: [
      {
        title: "Higher Unit Production & Operating Costs",
        analysis: "Uncompromising ingredient/material selection and non-standard processes compress initial gross margins at lower volumes.",
        description: "Uncompromising ingredient/material selection and non-standard processes compress initial gross margins at lower volumes.",
        mitigation: "Establish numbered limited batch runs and pre-order deposit mechanics to lock in forward cash flow."
      },
      {
        title: "Customer Education Barrier",
        analysis: "Refusal to adopt conventional shortcuts requires educating buyers on why the product feels, tastes, or operates differently.",
        description: "Refusal to adopt conventional shortcuts requires educating buyers on why the product feels, tastes, or operates differently.",
        mitigation: "Publish transparent sourcing breakdowns, process dossiers, and tactile unboxing guides."
      },
      {
        title: "Niche Subculture Friction",
        analysis: "High-conviction aesthetic posture risks appearing intimidating or exclusionary to broader adjacent segments.",
        description: "High-conviction aesthetic posture risks appearing intimidating or exclusionary to broader adjacent segments.",
        mitigation: "Maintain welcoming, grounded service touchpoints and clear introductory product tiers."
      }
    ],
    opportunities: [
      {
        title: "Bespoke Physical Studio & Tasting Spaces",
        analysis: "Transform physical spaces into sensorial brand epicenters featuring live workshops, tastings, and community salons.",
        description: "Transform physical spaces into sensorial brand epicenters featuring live workshops, tastings, and community salons.",
        vector: "Pop-up architectural flagships in culturally aligned cultural capitals.",
        growthVector: "Pop-up architectural flagships in culturally aligned cultural capitals."
      },
      {
        title: "Limited-Run Archive Capsule Editions",
        analysis: "Release rare micro-batches and experimental formulas celebrating seasonal or technical craft breakthroughs.",
        description: "Release rare micro-batches and experimental formulas celebrating seasonal or technical craft breakthroughs.",
        vector: "Numbered collectors' capsules with digital provenance certificates.",
        growthVector: "Numbered collectors' capsules with digital provenance certificates."
      },
      {
        title: "Curated Strategic Wholesale & Stockist Network",
        analysis: "Partner with independent specialty boutiques, boutique hotels, and design galleries over indiscriminate retail distribution.",
        description: "Partner with independent specialty boutiques, boutique hotels, and design galleries over indiscriminate retail distribution.",
        vector: "Selective global placement in top-tier design destination stockists.",
        growthVector: "Selective global placement in top-tier design destination stockists."
      }
    ],
    threats: [
      {
        title: "Mass-Market Incumbent Greenwashing",
        analysis: "Legacy conglomerate competitors launching superficial clone lines that mimic the aesthetic without the genuine craft.",
        description: "Legacy conglomerate competitors launching superficial clone lines that mimic the aesthetic without the genuine craft.",
        defense: "Publish radical ingredient transparency, open-source lab tests, and mill/farm audit certificates.",
        defensivePlay: "Publish radical ingredient transparency, open-source lab tests, and mill/farm audit certificates."
      },
      {
        title: "Raw Material & Commodity Price Volatility",
        analysis: "Fluctuating agricultural harvest yields or specialized material costs threatening unit economics.",
        description: "Fluctuating agricultural harvest yields or specialized material costs threatening unit economics.",
        defense: "Secure multi-year fixed forward agreements and build strategic safety inventory reserves.",
        defensivePlay: "Secure multi-year fixed forward agreements and build strategic safety inventory reserves."
      },
      {
        title: "Fast-Follower Low-Cost Copycats",
        analysis: "Aggressive copycats deploying cheap synthetic replicas and subsidized digital ad spend.",
        description: "Aggressive copycats deploying cheap synthetic replicas and subsidized digital ad spend.",
        defense: "Deepen trademark protections and anchor brand value in tangible physical rituals that cannot be dropshipped.",
        defensivePlay: "Deepen trademark protections and anchor brand value in tangible physical rituals that cannot be dropshipped."
      }
    ]
  };
}

export function getMockBrandKit(founderPitch = '', fullHistory = []) {
  const combined = [founderPitch, ...fullHistory.map(m => m.content)].join(' ');
  const lower = combined.toLowerCase();
  const domain = classifyDomain(combined);
  const isFamily = isFamilyIntent(combined);

  let kit;
  // 1. Direct burger / smash / diner check
  if (/(burger|smash|patty|patties|bun|fries|shake)/i.test(lower)) {
    kit = _burgerKit(founderPitch);
  } else if (domain === DOMAINS.FASHION) {
    kit = _fashionKit();
  } else if (domain === DOMAINS.BEVERAGE) {
    kit = _beverageKit();
  } else if (domain === DOMAINS.HOSPITALITY) {
    kit = isFamily ? _familyHospitalityKit() : _hospitalityKit();
  } else if (domain === DOMAINS.CAREER) {
    kit = _careerKit();
  } else if (domain === DOMAINS.DEVELOPER) {
    kit = _developerKit();
  } else {
    kit = _hospitalityKit();
  }

  if (kit && !kit.swotAnalysis) {
    kit.swotAnalysis = getDomainSwot(kit);
  }
  return kit;
}

function _fashionKit() {
  return {
    brandStrategy: {
      brandName: 'Atelier Selvaggio',
      tagline: 'Heirloom Shuttle-Loom Denim & Garments',
      mission: 'To liberate denim from disposable fast-fashion and synthetic stretch through 14oz shuttle-loom raw selvedge built to fade over decades.',
      targetAudience: 'Discerning creatives, denim purists, architects, and makers seeking a timeless, durable daily uniform that molds to their body.',
      coreValueProposition: 'Unwashed 14oz narrow-loom Japanese raw selvedge, custom solid copper hardware, and free lifetime repairs.',
      antiHero: 'Fast-fashion mall jeans with synthetic elastane stretch, fake laser-whisker distressing, and disposable 6-month lifespans.',
      differentiator: 'Woven on restored vintage Toyoda shuttle looms in Kojima, Japan; zero synthetic fibers, and a lifelong repair guarantee.'
    },
    voiceSystem: {
      archetype: 'The Heritage Purist',
      tone: ['Tactile', 'Restrained', 'Uncompromising', 'Enduring'],
      dos: ['Talk about weave tension, fabric weight, copper rivets, and honest patina.', 'Celebrate the slow break-in ritual and natural indigo fades.', 'Emphasize durability, repairs, and timeless silhouette over seasonal hype.'],
      donts: ['Never mention food, dining, kitchen, or culinary terms.', 'Never use tech buzzwords like SaaS, algorithms, or APIs.', 'No fake marketing hype or disposable trend chasing.'],
      vocabularyWords: ['Selvedge', 'Shuttle Loom', 'Patina', 'Ring-Spun', 'Unwashed', 'Rivets']
    },
    visualTokens: {
      palette: [
        { name: 'Raw Indigo Navy', hex: '#16233B', role: 'primary' },
        { name: 'Selvedge Redline', hex: '#A82020', role: 'accent' },
        { name: 'Unbleached Ecru', hex: '#F3EDE2', role: 'surface' },
        { name: 'Gunmetal Copper', hex: '#3A3532', role: 'secondary' },
        { name: 'Obsidian Ink', hex: '#11141A', role: 'text' }
      ],
      typography: {
        headingFont: 'Space Grotesk',
        bodyFont: 'Inter',
        googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500&display=swap',
        rationale: 'Space Grotesk provides muscular, industrial modernist geometry for garment labels and lookbooks, paired with Inter for clear digital e-commerce specifications.'
      },
      stylePhilosophy: 'Restrained industrial minimalism inspired by vintage Japanese textile mills, with deep raw indigo, selvedge redline accents, and tactile ecru surfaces.',
      borderCurvature: 'rounded-lg'
    },
    launchContent: {
      heroHeadline: 'Built to Fade. Made to Endure.',
      heroSubheadline: '14oz narrow-loom Japanese raw selvedge cut for daily creative work. Zero synthetic stretch, unwashed authenticity, and lifetime repairs.',
      callToAction: 'Shop Collection',
      manifesto: 'Denim was never meant to be disposable. Somewhere along the line, the industry replaced durable 14-ounce cotton with plastic stretch blends and washed away character with chemical distressing before you even touched it. We reject artificial aging. We weave on slow, vintage shuttle looms where every imperfection tells a story. Put them on stiff. Wear them hard. Earn your fades.',
      elevatorPitch: 'Atelier Selvaggio crafts heirloom 14oz shuttle-loom raw selvedge denim for creatives and purists who value uncompromised textile craft and lifetime durability.',
      socialHooks: [
        'No synthetic stretch. No fake laser fades. Just 14oz raw Japanese selvedge.',
        'Denim that molds to your life, not a mall mannequin. Earn your fades.',
        'Woven on vintage low-tension shuttle looms. Built to outlive the hype.'
      ]
    }
  };
}

function _beverageKit() {
  return {
    brandStrategy: {
      brandName: 'Kura Botanicals',
      tagline: 'Clean Plant Energy & Adaptogenic Clarity',
      mission: 'To liberate daily energy from synthetic caffeine crashes, jittery taurine, and neon dyes through wild-harvested adaptogens and cold-pressed botanical infusions.',
      targetAudience: 'High-focus founders, creatives, and athletes who demand sustained clean mental clarity without palpitations, sugar crashes, or artificial sweeteners.',
      coreValueProposition: '120mg slow-release green tea caffeine paired with organic Lion\'s Mane, L-Theanine, and sparkling spring water.',
      antiHero: 'Neon-colored gas station energy cans pumped with synthetic caffeine, sucralose, and artificial taurine.',
      differentiator: 'Single-origin cold-brewed botanicals with clinical doses of adaptogens and zero stevia aftertaste.'
    },
    voiceSystem: {
      archetype: 'The Botanical Purist',
      tone: ['Crisp', 'Grounded', 'Invigorating', 'Restrained'],
      dos: ['Focus on crisp rituals, clean energy curves, and wild botanical provenance.', 'Celebrate mental clarity and zero-crash focus.', 'Highlight real organic ingredients and gentle carbonation.'],
      donts: ['Never use extreme sports tropes or neon monster energy cliches.', 'No synthetic stimulant jargon or jittery hype.', 'Avoid clinical sterile pharma phrasing.'],
      vocabularyWords: ['Botanical', 'Clarity', 'Adaptogen', 'Crisp', 'Infusion', 'Sustained']
    },
    visualTokens: {
      palette: [
        { name: 'Forest Moss', hex: '#2D4739', role: 'primary' },
        { name: 'Citrus Zest', hex: '#E89D38', role: 'accent' },
        { name: 'Pure Linen', hex: '#F7F5F0', role: 'surface' },
        { name: 'Deep Charcoal', hex: '#1C2421', role: 'text' },
        { name: 'Wild Juniper', hex: '#5C7668', role: 'secondary' }
      ],
      typography: {
        headingFont: 'Plus Jakarta Sans',
        bodyFont: 'Inter',
        googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;700&family=Inter:wght@400;500&display=swap',
        rationale: 'A modern, crisp sans-serif with natural balance, evoking organic purity and contemporary wellness culture.'
      },
      stylePhilosophy: 'Clean botanical minimalism with warm linen surfaces, deep forest green contrast, and vibrant citrus accents.',
      borderCurvature: 'rounded-2xl'
    },
    launchContent: {
      heroHeadline: 'Clean Fire. Zero Crash. Pure Botanical Energy.',
      heroSubheadline: 'Naturally brewed green tea caffeine and organic Lion\'s Mane in sparkling mountain spring water. No taurine, no neon dye, no jitters.',
      callToAction: 'Taste the Ritual',
      manifesto: 'Energy drinks were built on an outdated lie: that high performance requires flooding your nervous system with synthetic taurine, chemical dyes, and cheap sugar spikes. We reject the crash cycle. We believe real vitality comes from clean soil, wild adaptogens, and slow-release botanicals that sharpen your mind while respecting your body. Drink clean. Stay lucid.',
      elevatorPitch: 'Kura Botanicals crafts clean sparkling adaptogenic energy elixirs formulated with organic botanicals and slow-burn caffeine for sustained mental focus without the crash.',
      socialHooks: [
        'No neon cans. No synthetic taurine. Just wild adaptogens and clean caffeine.',
        'Your brain deserves better than gas-station chemical sludge. Upgrade your daily ritual.',
        'Sustained mental clarity from 9 AM to 6 PM. Zero palpitations, zero 3 PM crash.'
      ]
    }
  };
}

function _beverageBatch() {
  return [
    { id: 1, stageLabel: 'Audience Wedge', question: 'Which consumer group feels most underserved by current energy drinks?', suggestedAnswers: ['Health-conscious professionals', 'Endurance athletes & movers', 'Mindful creators & builders'], reasoning: 'Focusing on a specific ritual wedge builds defensibility.' },
    { id: 2, stageLabel: 'The Tension / Friction', question: 'What frustrating side effect of commercial energy drinks will you eradicate?', suggestedAnswers: ['Jittery palpitations and anxiety', 'The brutal 3 PM sugar crash', 'Chemical aftertaste from sucralose'], reasoning: 'Addressing real physical friction drives organic word of mouth.' },
    { id: 3, stageLabel: 'The Sacred Cow', question: 'Which sacred assumption of the beverage industry do you openly challenge?', suggestedAnswers: ['More caffeine equals better energy', 'Energy drinks must taste like candy', 'Neon cans with aggressive graphics'], reasoning: 'Challenging an industry dogma establishes clear brand positioning.' },
    { id: 4, stageLabel: 'Atmosphere & Setting', question: 'In what exact ritual should this drink become indispensable?', suggestedAnswers: ['Morning deep-work focus block', 'Mid-day post-lunch reset', 'Pre-workout movement ritual'], reasoning: 'Grounding the drink in daily rituals creates habitual repeat purchases.', allowMultiple: true },
    { id: 5, stageLabel: 'Pricing Stance', question: 'How should your price point signal your formulation standard?', suggestedAnswers: ['Premium single-can craft tier', 'Everyday accessible wellness tier', 'Direct-to-consumer case subscriptions'], reasoning: 'Price communicates ingredient integrity and target market tier.' },
    { id: 6, stageLabel: 'Aesthetic Boundary', question: 'What visual direction immediately sets your can apart on the shelf?', suggestedAnswers: ['Botanical elegance with linen textures', 'Muted earth tones and warm minimalism', 'Vibrant citrus blocks with crisp typography'], reasoning: 'Shelf visual contrast stops scrolling and commands attention.', allowMultiple: true },
    { id: 7, stageLabel: 'Unfair Moat', question: 'What core ingredient or formulation truth cannot be easily cloned?', suggestedAnswers: ['Clinically dosed wild adaptogens', 'Direct-farm botanical extracts', 'Zero artificial sweeteners or gums'], reasoning: 'A defensible product truth builds enduring brand equity.' }
  ];
}

function _beverageQuestion(round) {
  const batch = _beverageBatch();
  const q = batch[Math.min(round - 1, batch.length - 1)];
  return {
    currentRound: round,
    stageLabel: q.stageLabel,
    question: q.question,
    suggestedAnswers: q.suggestedAnswers,
    reasoning: q.reasoning,
    allowMultiple: Boolean(q.allowMultiple),
    readyForSynthesis: round >= 3
  };
}

function _fashionBatch() {
  return [
    { id: 1, stageLabel: 'Audience', question: 'Who is the primary person investing in your denim on day one?', suggestedAnswers: ['Raw denim purists & collectors', 'Architects & studio creatives', 'Everyday workwear enthusiasts'], reasoning: 'Clarifies fit requirements, price tolerance, and fabric weight.' },
    { id: 2, stageLabel: 'Experience', question: 'What frustrating flaw in modern jeans brings buyers to you?', suggestedAnswers: ['Cheap elastane stretch blowout', 'Fake laser-whisker distressing', 'Fast-fashion disposable quality'], reasoning: 'Sharpens your textile stance against disposable garments.' },
    { id: 3, stageLabel: 'Villain', question: 'Which common fashion industry habit do you reject completely?', suggestedAnswers: ['Planned obsolescence & stretch blends', 'Seasonal clearance hype cycles', 'Chemical wash environmental damage'], reasoning: 'Establishes your brand\'s moral and material anti-hero.' },
    { id: 4, stageLabel: 'Vibe', question: 'What is the aesthetic feel of your studio or packaging?', suggestedAnswers: ['Japanese mill minimalism', 'Raw industrial workwear', 'Restrained gallery archive'], reasoning: 'Shapes your visual tokens, unboxing, and store atmosphere.' },
    { id: 5, stageLabel: 'Pricing', question: 'How should buyers view your price point?', suggestedAnswers: ['Heirloom investment ($180–$250)', 'Accessible direct-to-consumer craft', 'Limited-edition luxury run'], reasoning: 'Anchors your margin model and hardware specifications.' },
    { id: 6, stageLabel: 'Tone', question: 'What must your brand voice NEVER sound like?', suggestedAnswers: ['Trendy hypebeast influencer slang', 'Snobby luxury elitism', 'Corporate mass-market cheer'], reasoning: 'Defines negative brand voice and verbal boundaries.' },
    { id: 7, stageLabel: 'Edge', question: 'What singular reason makes someone choose you over Levi\'s?', suggestedAnswers: ['14oz Toyoda shuttle-loom selvedge', 'Free lifetime repair guarantee', 'Zero synthetic fibers, custom fit'], reasoning: 'Your singular unfair competitive advantage in apparel.' }
  ];
}

function _fashionQuestion(round) {
  const batch = _fashionBatch();
  const q = batch[Math.min(round - 1, batch.length - 1)];
  return {
    currentRound: round,
    stageLabel: q.stageLabel,
    question: q.question,
    suggestedAnswers: q.suggestedAnswers,
    reasoning: q.reasoning,
    readyForSynthesis: round >= 3
  };
}

function _familyHospitalityKit() {
  return {
    brandStrategy: {
      brandName: 'Campiña Family Table',
      tagline: 'Wood-Fired Pizza & Big Sharing Tables',
      mission: 'To bring families and neighborhoods together around honest wood-fired pizzas, hearty pasta platters, and joyful, welcoming tables.',
      targetAudience: 'Neighborhood families, parents with hungry kids, multi-generational gatherings, and local regulars looking for wholesome food and warm hospitality.',
      coreValueProposition: 'Naturally fermented crispy sourdough pizzas, kid-approved handmade crusts, and family-style platters served in a warm, mess-friendly dining room.',
      antiHero: 'Pretentious, quiet dining rooms with tiny portions, side-eye glances at energetic toddlers, and sixty-dollar tasting plates.',
      differentiator: 'Giant wooden sharing tables, open dough-stretching counter where kids can watch, and speedy, warm weeknight hospitality.'
    },
    voiceSystem: {
      archetype: 'The Welcoming Host',
      tone: ['Warm', 'Generous', 'Down-to-Earth', 'Joyful'],
      dos: ['Celebrate hearty crusts, bubbly cheese, and shared family laughter.', 'Welcome strollers, big groups, and kids with open arms.', 'Focus on fresh simple ingredients and generous portions.'],
      donts: ['Never mention wine pairings, date-night intimacy, or cocktail bars.', 'No stiff quiet rules or formal dining etiquette.', 'Never talk down to casual family diners.'],
      vocabularyWords: ['Hearth', 'Gather', 'Share', 'Warmth', 'Crisp', 'Generous']
    },
    visualTokens: {
      palette: [
        { name: 'Warm Terracotta', hex: '#C85A32', role: 'primary' },
        { name: 'Golden Wheat', hex: '#D99E32', role: 'secondary' },
        { name: 'Forest Olive', hex: '#4A6044', role: 'accent' },
        { name: 'Soft Buttermilk', hex: '#FAF7F0', role: 'surface' },
        { name: 'Deep Espresso', hex: '#261E1A', role: 'text' }
      ],
      typography: {
        headingFont: 'Fraunces',
        bodyFont: 'Inter',
        googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;600&family=Inter:wght@400;500&display=swap',
        rationale: 'A warm, approachable heritage serif for friendly menus and storefront signage, paired with a clean, highly legible sans-serif for family online ordering.'
      },
      stylePhilosophy: 'Warm, sunlit family hospitality design with golden wheat tones, terracotta accents, soft buttermilk surfaces, and welcoming rounded geometry.',
      borderCurvature: 'rounded-2xl'
    },
    launchContent: {
      heroHeadline: 'Big Tables. Honest Slices. Bring Everyone.',
      heroSubheadline: 'Hand-stretched wood-fired sourdough pizzas, fresh pasta platters, and generous family dining where kids and grandparents feel right at home.',
      callToAction: 'Reserve a Family Table',
      manifesto: 'Family dinner shouldn\'t be stressful or stuffy. We got tired of restaurants where strollers are treated like hazards and kids are given frozen nuggets while parents whisper. We built a room with big oak tables, high heat, and fresh dough stretched right before your eyes. Bring the team after the game, bring the grandparents on Sunday, or pull up a chair on a busy Tuesday. There is always a seat at our table.',
      elevatorPitch: 'Campiña Family Table is a welcoming neighborhood pizzeria offering handcrafted wood-fired pizzas, sharing platters, and vibrant family-friendly hospitality.',
      socialHooks: ['Messy hands, full bellies, big smiles. Pass the pizza.', 'Built for family weeknights and Sunday teams. Big tables always open.', 'Real wood-fired dough. Honest ingredients. Every generation welcome.']
    }
  };
}

function _hospitalityKit() {
  return {
    brandStrategy: {
      brandName: 'Campiña Hearth & Table',
      tagline: 'Wood-Fired Dining & Neighborhood Hospitality',
      mission: 'To make neighborhood dining unpretentious, delicious, and centered around an open fire table.',
      targetAudience: 'Neighborhood regulars, hungry friends, and lively dinner parties who want blistering sourdough pizza, delicious hospitality, and zero stiff service.',
      coreValueProposition: '72-hour naturally fermented dough fired at 900 degrees over seasoned oak, served at neighborhood prices in a warm, communal room.',
      antiHero: 'Stiff, overpriced dining rooms with whispering servers, tiny portions, and pretentious tasting lecture scripts.',
      differentiator: 'Blistering live-fire oven right in the center of a loud, energetic, communal dining room where you can always hear your friends.'
    },
    voiceSystem: {
      archetype: 'The Warm Host',
      tone: ['Warm', 'Direct', 'Generous', 'Lively'],
      dos: ['Talk passionately about sizzling crusts, melted cheeses, and cold pours.', 'Keep the dining room casual, energetic, and welcoming to everyone.', 'Welcome guests warmly with zero pretension or stiff lectures.'],
      donts: ['Never use pretentious buzzwords like terroir, provenance, or quiet luxury.', 'No stiff white tablecloth etiquette or whisper-only rules.', 'Never rush guests off their tables with artificial time limits.'],
      vocabularyWords: ['Oak', 'Crust', 'Table', 'Sizzle', 'Hearth', 'Lively']
    },
    visualTokens: {
      palette: [
        { name: 'Warm Cream', hex: '#FAF8F5', role: 'surface' },
        { name: 'Deep Terracotta', hex: '#C25E3E', role: 'primary' },
        { name: 'Toasted Fennel', hex: '#556B2F', role: 'secondary' },
        { name: 'Aged Brass', hex: '#C49A45', role: 'accent' },
        { name: 'Cast Iron Charcoal', hex: '#1C1917', role: 'text' }
      ],
      typography: {
        headingFont: 'Fraunces',
        bodyFont: 'Inter',
        googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;600&family=Inter:wght@400;500&display=swap',
        rationale: 'A classic, high-contrast serif for printed daily menus and signage paired with a modern neutral sans-serif for responsive reservations and digital ordering.'
      },
      stylePhilosophy: 'Warm, tactile hospitality design with cast-iron contrast, deep terracotta accents, and unpretentious editorial typography.',
      borderCurvature: 'rounded-xl'
    },
    launchContent: {
      heroHeadline: 'Open Fire. Honest Slices. No Stiff Collars.',
      heroSubheadline: 'A lively neighborhood dining room with wood-fired sourdough pizzas and unpretentious neighborhood service.',
      callToAction: 'Grab a Table',
      manifesto: 'Dining out should be loud, joyful, and deeply satisfying. We are tired of stiff restaurants where you can\'t hear your friends and the bill feels like a down payment. We build around what matters: seasoned oak, blistering heat, fermented dough, and honest food served freely. Pull up a chair, order a pie, and stay as long as you want.',
      elevatorPitch: 'Campiña Hearth & Table is a vibrant wood-fired pizza and neighborhood dining room dedicated to sourdough craft, lively tables, and zero dining pretension.',
      socialHooks: ['Life is too short for stiff dining rooms and quiet whispers. Pass the pizza.', '72-hour fermented dough. 900-degree oak fire. 0 pretension.', 'Great hospitality doesn\'t need a lecture. Just pull up a chair.']
    },
    websiteBlueprint: {
      badge: 'Naturally Fermented · Wood-Fired at 900°',
      heroLayout: 'centered_minimal',
      announcementBar: 'Naturally fermented sourdough pies baked over seasoned oak.',
      primaryCta: 'Reserve a Table',
      secondaryCta: 'View Evening Menu',
      sections: [
        {
          type: 'catalog_grid',
          title: 'Daily Hearth Specials',
          subtitle: '72-hour sourdough crusts fired with local ingredients.',
          items: [
            { label: 'Charred Margherita Reserve', description: 'Crushed San Marzano tomatoes, buffalo mozzarella, fresh basil, cold-pressed olive oil.', metricOrPrice: '$21', tag: 'CLASSIC' },
            { label: 'Spicy Soppressata & Hot Honey', description: 'Aged provolone, artisanal dry-cured soppressata, chili-infused wildflower honey.', metricOrPrice: '$24', tag: 'FAVORITE' },
            { label: 'Wild Foraged Mushroom & Taleggio', description: 'Roasted maitake and chanterelles, creamy taleggio, fresh thyme, garlic cream.', metricOrPrice: '$26', tag: 'SEASONAL' }
          ]
        },
        {
          type: 'comparative_ledger',
          title: 'The Table Standard',
          subtitle: 'Why honest hearth dining outclasses stiff dining rooms.',
          items: [
            { label: 'Dough Fermentation', description: 'Campiña: 72-hour wild sourdough ferment. Conventional: 2-hour commercial yeast with dough relaxers.' },
            { label: 'Dining Hospitality', description: 'Campiña: Generous, loud, communal sharing tables. Conventional: Stiff whispering rooms with rushed seat turn limits.' }
          ]
        }
      ]
    }
  };
}

function _burgerKit(founderPitch = '') {
  return {
    brandStrategy: {
      brandName: 'Iron & Patty',
      tagline: 'Dry-Aged Smash Patties & Screaming Griddles',
      mission: 'To liberate the classic American hamburger from frozen grey patties, limp buns, and corporate drive-thru shortcuts through live-fire smashed beef, caramelized lace crusts, and unbleached butcher paper.',
      targetAudience: 'Discerning burger purists, late-night comfort seekers, and neighborhood food lovers who crave uncompromising smash patties with crispy maillard edges.',
      coreValueProposition: 'Double dry-aged brisket & chuck blend smashed paper-thin on a 500° chrome flattop with charred crispy lace, melted aged cheddar, house pickle chips, and toasted Martin\'s potato buns.',
      antiHero: 'Corporate fast-food giants serving lukewarm, frozen pre-formed pucks smothered in sugary secret sauce to conceal bland, grey beef.',
      differentiator: 'Crispy lacy edges smashed paper-thin on seasoned cast-iron with tallow-toasted potato buns and zero frozen shortcuts.'
    },
    voiceSystem: {
      archetype: 'The Culinary Craftsman',
      tone: ['Punchy', 'Appetizing', 'Unpretentious', 'Obsessive'],
      dos: ['Talk passionately about sizzling tallow, crispy lacy crusts, and toasted potato buns.', 'Keep the dining posture casual, energetic, and focused on pure craveability.', 'Celebrate dry-aged beef blend and house-pickled cucumbers.'],
      donts: ['Never mention technical users, systems engineers, devops, or software.', 'No corporate wellness buzzwords or sterile diet claims.', 'Never apologize for unapologetic, craveable culinary indulgence.'],
      vocabularyWords: ['Smashed', 'Lacy Crust', 'Flattop', 'Tallow', 'Potato Bun', 'Caramelized']
    },
    visualTokens: {
      palette: [
        { name: 'Warm Cream', hex: '#FAF8F5', role: 'surface' },
        { name: 'Smashed Paprika', hex: '#C84B31', role: 'primary' },
        { name: 'Toasted Sesame', hex: '#D9B48F', role: 'secondary' },
        { name: 'Golden Mustard', hex: '#E89D38', role: 'accent' },
        { name: 'Rich Charcoal', hex: '#18181B', role: 'text' }
      ],
      typography: {
        headingFont: 'Fraunces',
        bodyFont: 'Inter',
        googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;700&family=Inter:wght@400;500;600&display=swap',
        rationale: 'A muscular heritage serif that feels hand-stamped on butcher paper, paired with an ultra-clean sans-serif for responsive ordering.'
      },
      stylePhilosophy: 'Warm, appetizing culinary design with warm cream parchment surfaces, fiery paprika accents, and golden griddle warmth.',
      borderCurvature: 'rounded-2xl'
    },
    launchContent: {
      heroHeadline: 'Screaming Hot Griddles. Crispy Lacy Edges. Zero Freezers.',
      heroSubheadline: 'Double dry-aged brisket patties smashed to order on 500-degree cast-iron, served on butter-toasted potato buns.',
      callToAction: 'Order for Pickup',
      manifesto: 'A burger should be an event, not a compromise. We got tired of lukewarm grey patties kept under heat lamps and drowned in high-fructose corn syrup dressing. We built Iron & Patty around one simple obsession: fresh ground beef smashed violently against scorching hot cast-iron until the edges caramelize into an irresistible crispy lace. Grab a double, grab some tallow fries, and taste what real burgers were meant to be.',
      elevatorPitch: 'Iron & Patty is a neighborhood smash burger joint dedicated to dry-aged heritage beef, caramelized lacy crusts, and zero frozen shortcuts.',
      socialHooks: [
        'If the edges aren\'t crispy enough to shatter, it\'s not a real smash burger.',
        'Zero frozen patties. Screaming hot cast iron. Smashed to order.',
        'Martin\'s potato bun, dry-aged beef, house pickles. Nothing hidden.'
      ]
    },
    websiteBlueprint: {
      badge: 'Dry-Aged Beef · Smashed to Order',
      heroLayout: 'centered_minimal',
      announcementBar: 'Complimentary house beef-tallow fries with any double smash combo today.',
      primaryCta: 'Order for Pickup',
      secondaryCta: 'The Smash Technique',
      sections: [
        {
          type: 'catalog_grid',
          title: 'The Griddle Lineup',
          subtitle: 'Double patties, screaming cast-iron, and tallow-toasted buns.',
          items: [
            { label: 'The Classic Double Smash', description: 'Double dry-aged blend, American cheddar, grilled onions, house pickle chips, secret griddle sauce.', metricOrPrice: '$14', tag: 'BESTSELLER' },
            { label: 'Smoked Jalapeño & Bacon Smash', description: 'Double beef, charred pickled jalapeños, applewood smoked bacon, pepper jack, spicy paprika aioli.', metricOrPrice: '$16', tag: 'CHEF PICK' },
            { label: 'The Truffle & Embers Reserve', description: 'Double patty, caramelized shallots, melted gruyère, black truffle aioli on toasted brioche.', metricOrPrice: '$18', tag: 'LIMITED' }
          ]
        },
        {
          type: 'comparative_ledger',
          title: 'The Onlyness Standard',
          subtitle: 'Why our screaming griddle beats the fast-food status quo.',
          items: [
            { label: 'Beef Provenance', description: 'Iron & Patty: Fresh daily dry-aged brisket & chuck grind. The Incumbent: Frozen pre-formed flash-frozen mystery pucks.' },
            { label: 'The Crust Metric', description: 'Iron & Patty: Crispy, lacy caramelized maillard edges. The Incumbent: Steamed, rubbery grey meat cooked in warming drawers.' },
            { label: 'The Bun Stance', description: 'Iron & Patty: Martin\'s potato buns toasted in beef tallow. The Incumbent: Dry, airy sesame buns loaded with preservatives.' }
          ]
        }
      ]
    }
  };
}

function _careerKit() {
  return {
    brandStrategy: {
      brandName: 'Signal Folio',
      tagline: 'The Unapologetic Proof of Work for High-Agency Builders',
      mission: 'To eliminate keyword-stuffed corporate resumes and replace them with high-signal, verified evidence of real impact.',
      targetAudience: 'Exceptional engineers, designers, and operators who refuse to play the ATS automated filtering game.',
      coreValueProposition: 'Convert messy career histories into a crisp, editorial monograph designed for the 10-second scan of decision-makers.',
      antiHero: 'Predatory ATS resume optimization farms that encourage keyword stuffing and robotic corporate clichés.',
      differentiator: 'Zero fluff, structured project case studies, and instant typography that signals senior executive craft.'
    },
    voiceSystem: {
      archetype: 'The Discerning Editor',
      tone: ['Clear', 'Restrained', 'Authoritative', 'Impact-First'],
      dos: ['Show measurable architectural impact, not task checklists.', 'Use sharp, declarative language with active verbs.', 'Treat career milestones as design case studies.'],
      donts: ['Never use hollow buzzwords like "passionate leader" or "detail-oriented".', 'Avoid multi-column visual clutter that confuses readers.', 'Never obscure the actual technical deliverable.'],
      vocabularyWords: ['Clarity', 'Signal', 'Provenance', 'Evidence', 'Craft', 'Impact']
    },
    visualTokens: {
      palette: [
        { name: 'Paper Cream', hex: '#F2F1ED', role: 'surface' },
        { name: 'Deep Ink', hex: '#111111', role: 'primary' },
        { name: 'Neutral Stone', hex: '#737373', role: 'secondary' },
        { name: 'Warm Linen', hex: '#DBD7CD', role: 'accent' },
        { name: 'Pure White', hex: '#FFFFFF', role: 'text' }
      ],
      typography: {
        headingFont: 'Cormorant Garamond',
        bodyFont: 'Inter',
        googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=Inter:wght@400;500&display=swap'
      },
      stylePhilosophy: 'Restrained Swiss editorial design with warm tactile paper tones and razor-sharp typographic discipline.',
      borderCurvature: 'rounded-lg'
    },
    launchContent: {
      heroHeadline: 'Your Career Is Not A Keyword-Stuffed Template.',
      heroSubheadline: 'Editorial monographs that communicate deep technical mastery to senior hiring leaders in under ten seconds.',
      callToAction: 'Build Your Dossier',
      manifesto: 'The corporate hiring pipeline is broken by automated bots screening for buzzwords. Exceptional candidates are reduced to 1-page PDF summaries that conceal their true genius. We believe your craft deserves an editorial standard.',
      elevatorPitch: 'Signal Folio turns developer career trajectories into pristine, high-signal monographs that skip automated filters and win executive interviews.',
      socialHooks: ['ATS filters reward buzzword stuffing. Real leaders reward proof of work.', 'If your resume looks like a 2005 Word document, you\'re pricing yourself at a discount.', 'Stop describing duties. Start publishing verified architectural impact.']
    }
  };
}

function _developerKit() {
  return {
    brandStrategy: {
      brandName: 'Lattice Systems',
      tagline: 'High-Velocity Brand Architecture for Relentless Builders',
      mission: 'To liberate ambitious founders from corporate design mediocrity through algorithmic, unapologetic brand identity synthesis.',
      targetAudience: 'Technical founders, indie hackers, and zero-to-one product leaders who value speed, craft, and distinct edge.',
      coreValueProposition: 'Turn raw technical concepts into category-defining design tokens and punchy positioning in under 3 minutes.',
      antiHero: 'Bloated legacy branding agencies charging $30k for pastel slides and vague stakeholder alignment decks.',
      differentiator: 'Algorithmic Socratic interrogation combined with instant design token compilation (HEX, typography, and launch manifesto).'
    },
    voiceSystem: {
      archetype: 'The Systems Architect',
      tone: ['Hyper-Direct', 'Unapologetic', 'Punchy', 'Technically Astute'],
      dos: ['Call out industry vanity metrics directly.', 'Use active verbs and short, muscular sentences.', 'Emphasize tangible output over abstract theories.'],
      donts: ['Never use enterprise buzzwords like "synergize" or "paradigm".', 'Do not hedge statements with "maybe" or "we try to".', 'Never apologize for having a strong aesthetic opinion.'],
      vocabularyWords: ['Velocity', 'Signal', 'Frictionless', 'Uncompromising', 'Architecture', 'Synthesis']
    },
    visualTokens: {
      palette: [
        { name: 'Obsidian Core', hex: '#0A0D14', role: 'surface' },
        { name: 'Electric Indigo', hex: '#6366F1', role: 'primary' },
        { name: 'Hyper Cyan', hex: '#06B6D4', role: 'secondary' },
        { name: 'Solar Amber', hex: '#F59E0B', role: 'accent' },
        { name: 'Pure Ghost', hex: '#F8FAFC', role: 'text' }
      ],
      typography: {
        headingFont: 'Space Grotesk',
        bodyFont: 'Inter',
        googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;600&display=swap'
      },
      stylePhilosophy: 'High-contrast dark mode brutalism with luminous neon accents and razor-sharp typographic scale.',
      borderCurvature: 'rounded-xl'
    },
    launchContent: {
      heroHeadline: 'Stop Sounding Like a Corporate Brochure.',
      heroSubheadline: 'Autonomous brand architecture that gives ambitious founders the voice and visual edge of a category leader.',
      callToAction: 'Deploy Your Identity',
      manifesto: 'The software world is drowning in polite consensus. Every landing page looks like the same pastel template created by the same committee. We believe true category leaders don\'t blend in—they plant a flag, declare an enemy, and build with relentless conviction. Your code is exceptional. Your brand should hit just as hard.',
      elevatorPitch: 'Lattice Systems is an AI-powered brand architecture engine that transforms raw technical pitches into complete visual identities, voice systems, and launch copy in minutes.',
      socialHooks: ['90% of SaaS landing pages look identical because founders design by consensus. Break the cycle.', 'Your product solves a hard technical problem. Why does your marketing sound like a 2012 B2B slide deck?', 'Real brand strategy isn\'t colors and logos. It\'s declaring who you\'re willing to alienate.']
    }
  };
}

