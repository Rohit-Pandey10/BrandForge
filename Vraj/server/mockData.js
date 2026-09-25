// server/mockData.js
// Deterministic Mock Hydration engine for zero-dependency local development and hackathon demos
import { DOMAINS, classifyDomain, isFamilyIntent, extractPitchMetadata } from './domainConfig.js';

export const PRESET_PITCHES = [
  {
    id: 'developer-first-db',
    title: 'Developer-first DB',
    category: 'Infrastructure / Systems',
    tagline: 'Edge-native, sub-millisecond document store without DevOps burden',
    pitch: 'An edge-native, sub-millisecond document database that replaces MongoDB and Redis with zero operational maintenance.',
    rounds: [
      {
        round: 1,
        question: 'Who is the single engineer whose career or sanity is actively on fire because of current database operations?',
        reasoning: 'Forces founders out of broad "any backend engineer" vagueness into a visceral, hyper-specific beachhead user.',
        suggestedAnswers: [
          'Solo tech leads at Seed-to-Series A startups who spend every Sunday tuning replication lag instead of shipping features.',
          'Next.js full-stack builders who keep hitting cold-start limits and connection pool exhaustion in serverless lambdas.',
          'Platform teams at 50-person scaleups who are drowning in runaway AWS RDS bills and maintenance tickets.'
        ]
      },
      {
        round: 2,
        question: 'What is the deep, unspoken legacy lie that cloud databases tell developers, and who is your true villain?',
        reasoning: 'Uncovers the status quo enemy to establish a defiant point of view rather than a mild feature comparison.',
        suggestedAnswers: [
          'The villain is Cloud Vendor Captivity: they deliberately make database connections fragile so they can upsell proprietary proxies.',
          'The villain is "DevOps Theater": forcing product engineers to become distributed systems PhDs just to store JSON.',
          'The villain is the "Serverless Fallacy": pricing based on compute spikes rather than real stored value.'
        ]
      },
      {
        round: 3,
        question: 'When a prospective customer looks at your terminal CLI and docs, what is the visceral aesthetic attitude they must feel?',
        reasoning: 'Tests aesthetic polarization tolerance to decide whether the brand speaks in raw hacker minimalism or enterprise polish.',
        suggestedAnswers: [
          'Raw Cyber-Minimalism: Monospaced terminal purism, unapologetic dark mode, zero fluff, instant curl-to-deploy.',
          'Swiss Precision Engineering: Unshakable mechanical clarity, serene whitespace, industrial durability.',
          'Rebellious Anti-Enterprise: Witty, biting critiques of legacy cloud bloat with high-voltage developer craft.'
        ]
      }
    ],
    brandKit: {
      brandStrategy: {
        brandName: 'KestrelDB',
        tagline: 'The zero-maintenance edge document store for builders who refuse to babysit infrastructure.',
        mission: 'To eliminate operational anxiety from application data so product engineers can ship at the speed of thought.',
        targetAudience: 'Lead full-stack and systems architects at high-velocity startups tired of serverless cold starts and Redis connection hell.',
        coreValueProposition: 'Sub-millisecond global read/writes distributed to 300+ edge nodes with zero connection pooling, zero shard management, and instant local emulation.',
        antiHero: 'DevOps Theater and rent-seeking cloud database oligopolies that monetize complexity.',
        differentiator: 'Single-binary compile target with microsecond distributed consensus, embedded directly inside your runtime without separate VPC peering.'
      },
      voiceSystem: {
        archetype: 'The Master Artisan & Defiant Challenger',
        tone: ['Technically Rigorous', 'Concise & Unapologetic', 'Quietly Confident', 'Allergic to Fluff'],
        dos: [
          'Quote exact benchmark percentiles (p99 < 1.2ms) instead of buzzwords like "lightning fast".',
          'Acknowledge engineering trade-offs with radical transparency.',
          'Speak in clean terminal snippets, clear API signatures, and direct declarative sentences.'
        ],
        donts: [
          'Never use vague corporate words like "synergy", "seamless paradigm", or "next-gen".',
          'Never hide pricing behind a "Contact Enterprise Sales" dark pattern.',
          'Never patronize senior developers with oversimplified analogies.'
        ],
        vocabularyWords: ['Deterministic', 'Zero-allocation', 'Local-first', 'Microsecond', 'Primitive', 'Frictionless', 'Sovereign']
      },
      visualTokens: {
        palette: [
          { name: 'Terminal Charcoal', hex: '#111215', role: 'primary' },
          { name: 'Warm Cream Parchment', hex: '#f2f1ed', role: 'surface' },
          { name: 'Kestrel Electric Teal', hex: '#00e599', role: 'accent' },
          { name: 'Subtle Hairline', hex: '#dbd7cd', role: 'secondary' },
          { name: 'Carbon Black', hex: '#000000', role: 'text' }
        ],
        typography: {
          headingFont: 'Cormorant Garamond',
          bodyFont: 'Inter',
          googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300&family=Inter:wght@400&family=JetBrains+Mono:wght@400&display=swap'
        },
        stylePhilosophy: 'High-density technical typography paired with hairline editorial restraint. Pure functional clarity that honors the craft of coding.',
        borderCurvature: '9999px pill action buttons with 24px soft architectural slab cards.'
      },
      launchContent: {
        heroHeadline: 'Stop babysitting databases. Start shipping.',
        heroSubheadline: 'An edge-native, sub-millisecond document store with embedded consensus. No cluster configuration, no VPC peering, no connection pools.',
        callToAction: 'curl https://kestrel.dev/install | sh',
        manifesto: 'We believe that databases should behave like electricity: invisible, instantaneous, and unfailing. Somewhere along the way, cloud vendors decided that storing a JSON object required thirty-page configuration manifests, dedicated DevOps retainers, and unpredictable surge pricing. We reject this engineered complexity. Kestrel was forged for founders who build things people love, not engineers who spend weekends nursing replica nodes.',
        elevatorPitch: 'KestrelDB is a zero-ops, globally distributed document database designed for edge runtimes. It gives full-stack teams sub-millisecond latency anywhere on earth with zero connection overhead, eliminating the dual-stack headache of maintaining Redis and Mongo simultaneously.',
        socialHooks: [
          'Why did storing a JSON payload turn into a 40-hour DevOps sprint? Introducing KestrelDB.',
          'We benchmarked 100,000 concurrent serverless lambdas against traditional Postgres vs KestrelDB. Here is what broke first.',
          'If your database requires a dedicated Slack channel to stay alive, you are paying rent to the wrong architecture.'
        ]
      }
    }
  },
  {
    id: 'ai-nutritionist-for-gamers',
    title: 'AI Nutritionist for Gamers',
    category: 'Consumer BioTech / Esports',
    tagline: 'Bio-adaptive cognitive fuel and meal planning to eliminate APM drops',
    pitch: 'A bio-adaptive cognitive fuel and meal planner that prevents mental fatigue and APM drops during competitive gaming.',
    rounds: [
      {
        round: 1,
        question: 'At what exact moment in an 8-hour competitive session does your player realize they are losing not from skill, but physiological collapse?',
        reasoning: 'Pinpoints the acute emotional and physical threshold where standard energy drinks fail.',
        suggestedAnswers: [
          'Hour 4 during overtime match tie-breakers, when reaction latency slips by 70ms due to glycemic crash.',
          'Post-scrim mental brain fog where streamers cannot sustain commentary engagement without getting irritable.',
          'Midnight tournament brackets when caffeine jitter replaces precision mouse control and micro-decisions crumble.'
        ]
      },
      {
        round: 2,
        question: 'Who is the deceptive villain in the gamer wellness space that has been exploiting players for a decade?',
        reasoning: 'Separates the brand from sugary neon powder cans and toxic hyper-caffeinated marketing gimmicks.',
        suggestedAnswers: [
          'The neon "gamer powder" industry selling jittery high-dose sugar and synthetic dyes masquerading as focus.',
          'The toxic hustle culture that treats sleep deprivation and poor metabolic health as competitive badges of honor.',
          'Generic wellness apps that treat a 12-hour esports athlete like an office worker doing 10,000 steps.'
        ]
      },
      {
        round: 3,
        question: 'What is the tonal posture you take: clinical sports scientist, ruthless esports mentor, or underground cognitive apothecary?',
        reasoning: 'Locks in the voice system archetype and emotional resonance with competitive gamers.',
        suggestedAnswers: [
          'Clinical Neuro-Performance Lab: Peer-reviewed biomathematics, telemetry data, zero snake oil.',
          'The High-Stakes Esports Coach: Sharp, disciplined, demanding peak cognitive stamina for podium finishes.',
          'The Modern Cognitive Apothecary: Sophisticated, organic nootropics with an understated ritual feel.'
        ]
      }
    ],
    brandKit: {
      brandStrategy: {
        brandName: 'SynapseIQ',
        tagline: 'Neuro-adaptive metabolic fuel engineered for cognitive endurance and zero crash.',
        mission: 'To elevate competitive gaming into an elite cognitive athletics discipline powered by precision bio-nutrition.',
        targetAudience: 'Ranked competitive esports athletes, Twitch streamers, and high-intensity digital workers seeking sustained focus.',
        coreValueProposition: 'Real-time circadian meal protocol and natural neuro-nutrient stacks that sustain 120+ APM without caffeine shakes or insulin troughs.',
        antiHero: 'Neon chemical energy powders loaded with artificial stimulants and sugar crashes.',
        differentiator: 'Integrates real-time biometric telemetry (sleep, heart rate variability, match schedule) with tailor-blended cellular nootropics.'
      },
      voiceSystem: {
        archetype: 'The Cognitive Performance Architect',
        tone: ['Biometrically Precise', 'High-Discipline', 'Clear-Headed', 'Empowering'],
        dos: [
          'Reference biological mechanisms like dopamine receptor sensitivity and glycemic stability.',
          'Treat gaming as an Olympic cognitive sport.',
          'Offer actionable nutrient protocols timed to tournament match schedules.'
        ],
        donts: [
          'Never use screaming "EXTREME GAMER GAMING" marketing cliches.',
          'Never promote hazardous 36-hour binge sessions without rest.',
          'Never make unsubstantiated medical claims.'
        ],
        vocabularyWords: ['Telemetry', 'Sustained APM', 'Circadian', 'Neuro-nutrient', 'Equilibrium', 'Cognitive Stamina', 'Cellular Fuel']
      },
      visualTokens: {
        palette: [
          { name: 'Deep Graphite', hex: '#161719', role: 'primary' },
          { name: 'Parchment Canvas', hex: '#f2f1ed', role: 'surface' },
          { name: 'Synaptic Amber', hex: '#d97706', role: 'accent' },
          { name: 'Warm Divider', hex: '#dbd7cd', role: 'secondary' },
          { name: 'Pure Ink', hex: '#000000', role: 'text' }
        ],
        typography: {
          headingFont: 'Cormorant Garamond',
          bodyFont: 'Inter',
          googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300&family=Inter:wght@400&display=swap'
        },
        stylePhilosophy: 'Quiet clinical luxury. Moving far away from neon green RGB cliches into a grounded, elite editorial atmosphere.',
        borderCurvature: '28px smooth organic curves with pill-shaped interactive triggers.'
      },
      launchContent: {
        heroHeadline: 'Calm mind. Unshakable reaction time.',
        heroSubheadline: 'The bio-adaptive metabolic system formulated for competitive gaming. Zero artificial dyes, zero caffeine tremors, zero hour-4 crashes.',
        callToAction: 'Calculate Your Cognitive Fuel Profile',
        manifesto: 'Reaction speed is biological, not magical. When a match enters its twelfth hour, the deciding factor is rarely talent—it is glucose regulation, cerebral blood flow, and acetylcholine synthesis. For years, the gaming industry was poisoned by companies peddling neon sugar sludge in shaker cups. We built SynapseIQ because competitive athletes deserve nutrition formulated with the rigor of Formula 1 telemetry.',
        elevatorPitch: 'SynapseIQ is an AI-powered bio-nutrition platform that syncs with your gaming schedule and wearables to deliver sustained, crash-free mental focus. It replaces erratic energy drinks with precise, clinically validated nutritional protocols that keep your APM rock steady.',
        socialHooks: [
          'Your mouse has 8000Hz polling rate. Why are you fueling your brain with 80 grams of sugar?',
          'The science behind why high-dose taurine actually slows your micro-reactions after 90 minutes.',
          'What elite chess grandmasters know about glycemic pacing that esports athletes are just discovering.'
        ]
      }
    }
  },
  {
    id: 'anti-saas-accounting',
    title: 'Anti-SaaS Accounting',
    category: 'Fintech / Indie Sovereignty',
    tagline: 'Local-first, encrypted financial operating system with zero subscription rent',
    pitch: 'Local-first, encrypted financial operating system that ends the monthly subscription rent on your own balance sheets.',
    rounds: [
      {
        round: 1,
        question: 'What is the most offensive tax that cloud accounting tools impose on an independent business owner each month?',
        reasoning: 'Identifies the precise financial and philosophical indignation that drives customers away from legacy SaaS.',
        suggestedAnswers: [
          'Paying $80/month forever just to keep access to their own past invoices and tax records.',
          'Having their banking credentials and margin data secretly harvested and sold to lending brokers.',
          'Enduring constant interface redesigns and feature bloat that slow down a simple ledger entry to a crawl.'
        ]
      },
      {
        round: 2,
        question: 'How do you convince a cautious founder that "local-first" is safer and more reliable than a multi-billion dollar cloud provider?',
        reasoning: 'Forces the founder to articulate their security, backup, and sovereignty narrative without sounding like a hobbyist tool.',
        suggestedAnswers: [
          'By pointing out that cloud vendors get breached monthly, whereas AES-256 local files on your machine never leave your hardware.',
          'By providing peer-to-peer encrypted sync where only the user holds the private key.',
          'By packaging the software as a perpetual license executable that will run 30 years from now without any server dependency.'
        ]
      },
      {
        round: 3,
        question: 'Is your brand an austere Swiss private bank vault, or a defiant counter-culture manifesto against rentier capitalism?',
        reasoning: 'Establishes the fine boundary between institutional fiduciary trustworthiness and bold challenger energy.',
        suggestedAnswers: [
          'The Swiss Private Vault: Understated, timeless typography, absolute discretion, permanent archival quality.',
          'The Indie Hacker Sovereign: Uncompromising manifesto against SaaS greed, proudly open format, built for makers.',
          'The Master Craftsman Ledger: Hand-bound bookbinding aesthetic translated into modern offline software.'
        ]
      }
    ],
    brandKit: {
      brandStrategy: {
        brandName: 'LedgerStone',
        tagline: 'Perpetual financial sovereignty. Your books, your keys, zero subscription rent.',
        mission: 'To liberate independent enterprise from perpetual SaaS rent by building timeless, local-first financial instruments.',
        targetAudience: 'Self-employed architects, boutique agency owners, and indie software founders who value privacy and data sovereignty.',
        coreValueProposition: 'Buy it once, run it forever. Encrypted SQLite database stored on your disk with automated tax-ready double-entry bookkeeping and zero cloud lock-in.',
        antiHero: 'Rentier SaaS monopolies that hold historical business ledgers hostage behind recurring monthly paywalls.',
        differentiator: 'Single offline-first application with zero server dependencies, instant sub-millisecond search across 20 years of receipts, and zero telemetry.'
      },
      voiceSystem: {
        archetype: 'The Sovereign Fiduciary & Master Bookkeeper',
        tone: ['Stoic & Timeless', 'Radically Transparent', 'Archival Dignity', 'Independent'],
        dos: [
          'Use terms like "permanent ownership", "cryptographic sovereignty", and "double-entry integrity".',
          'Celebrate the quiet beauty of a balanced ledger.',
          'Commit to perpetual licensing and open file formats (Plain Text / SQLite).'
        ],
        donts: [
          'Never pitch "disruption" or "growth hacking".',
          'Never use urgency popups or recurring upsells.',
          'Never use dark patterns to lock data into proprietary formats.'
        ],
        vocabularyWords: ['Sovereignty', 'Archival', 'Perpetual', 'Double-entry', 'Cryptographic', 'Fiduciary', 'Durable']
      },
      visualTokens: {
        palette: [
          { name: 'Obsidian Ink', hex: '#0e0f10', role: 'primary' },
          { name: 'Warm Cream Parchment', hex: '#f2f1ed', role: 'surface' },
          { name: 'Banker Bronze', hex: '#8c704b', role: 'accent' },
          { name: 'Parchment Line', hex: '#dbd7cd', role: 'secondary' },
          { name: 'Deep Black', hex: '#000000', role: 'text' }
        ],
        typography: {
          headingFont: 'Cormorant Garamond',
          bodyFont: 'Inter',
          googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300&family=Inter:wght@400&display=swap'
        },
        stylePhilosophy: 'Understated European editorial layout. Evokes a leather-bound centuries-old financial ledger combined with a high-performance modern desktop engine.',
        borderCurvature: '32px quiet architectural radii with pill-shaped tactile buttons.'
      },
      launchContent: {
        heroHeadline: 'You should own your books. Not rent them.',
        heroSubheadline: 'A local-first, encrypted financial operating system. One payment, zero subscriptions, your data preserved on your machine forever.',
        callToAction: 'Acquire Perpetual License',
        manifesto: 'Accounting is not a cloud service; it is the permanent historical memory of human enterprise. For hundreds of years, merchants kept ledgers on parchment that survived fires, wars, and generational succession. Today, a handful of SaaS conglomerates charge you $900 a year simply to read your own income statements, threatening to wipe your records if a credit card expires. We built LedgerStone because your financial records belong to you, not to a Delaware server farm.',
        elevatorPitch: 'LedgerStone is a local-first double-entry accounting application for founders and boutique firms. It runs completely offline with client-side encryption and plain SQLite files, giving you instant financial clarity without recurring subscription fees.',
        socialHooks: [
          'What happens to your business records when a SaaS accounting company doubles its pricing or goes bankrupt?',
          'Why the best piece of financial software you will ever buy requires zero internet connection to balance your books.',
          'The math behind why a $199 perpetual license beats $14,000 of SaaS subscriptions over 15 years.'
        ]
      }
    }
  }
];

// Fallback dynamic generator when the user provides an ad-hoc custom pitch
export function generateGenericMockQuestion(currentRound, pitch) {
  const domain = classifyDomain(pitch);
  const isFamily = isFamilyIntent(pitch);

  // 1. HOSPITALITY & CULINARY (Restaurants, Cafes, Bakeries, Pizzerias)
  if (domain === DOMAINS.HOSPITALITY) {
    if (isFamily) {
      if (currentRound === 1) {
        return {
          isComplete: false,
          currentRound: 1,
          question: 'Family dinners have distinct rhythms. Are you built for fast weeknight neighborhood dinners or lively weekend family feasts?',
          suggestedAnswers: [
            'Fast weeknight neighborhood dinners',
            'Lively weekend family feasts',
            'All-day sourdough pizza & gelato counter'
          ],
          reasoning: 'Table turn speed and kid-friendly service style determine your dining room layout.'
        };
      }
      if (currentRound === 2) {
        return {
          isComplete: false,
          currentRound: 2,
          question: 'Many family spots use frozen shortcuts or bland kid menus. What compromise do you refuse to make?',
          suggestedAnswers: [
            'No frozen or boxed kid food shortcuts',
            'No artificial dough additives or speed yeast',
            'No cramped tables or stroller restrictions'
          ],
          reasoning: 'Real ingredient boundaries build lasting trust with health-conscious parents.'
        };
      }
      if (currentRound === 3) {
        return {
          isComplete: true,
          currentRound: 3,
          question: 'What memorable dining ritual will kids and parents look forward to every visit?',
          suggestedAnswers: [
            'Watch dough tossed at the open counter',
            'Family sharing platters sliced table-side',
            'Fresh soft-serve swirl station for kids'
          ],
          reasoning: 'Tangible interactive rituals turn first-time families into weekly regulars.'
        };
      }
    } else {
      if (currentRound === 1) {
        return {
          isComplete: false,
          currentRound: 1,
          question: 'Are you aiming for an energetic neighborhood joint or an intimate culinary dinner counter?',
          suggestedAnswers: [
            'Casual neighborhood joint with sharing tables',
            'Intimate chef counter with bespoke pairings',
            'Lively open-fire hearth with natural wines'
          ],
          reasoning: 'Your dining vibe dictates acoustic design, table spacing, and service cadence.'
        };
      }
      if (currentRound === 2) {
        return {
          isComplete: false,
          currentRound: 2,
          question: 'Most restaurants cut corners on ingredients or hospitality. What compromise will you refuse to make?',
          suggestedAnswers: [
            'No industrial freezer shortcuts or additives',
            'No pretentious tiny tasting-menu portions',
            'No rushed ninety-minute table limits'
          ],
          reasoning: 'Declaring kitchen and hospitality boundaries shapes menu pricing and guest trust.'
        };
      }
      if (currentRound === 3) {
        return {
          isComplete: true,
          currentRound: 3,
          question: 'What customer expectation are you completely comfortable turning away?',
          suggestedAnswers: [
            'Guests expecting fast-food speed',
            'Influencers seeking photo-only stunts',
            'Formal diners wanting stiff silence'
          ],
          reasoning: 'Defining who you reject gives your service team and brand a clear identity.'
        };
      }
    }
  }

  // 2. APPAREL & FASHION
  if (domain === DOMAINS.FASHION) {
    if (currentRound === 1) {
      return {
        isComplete: false,
        currentRound: 1,
        question: 'Fast fashion commoditizes clothing. Who is the passionate buyer who will obsess over your pieces?',
        suggestedAnswers: [
          'Raw selvedge denim and heritage purists',
          'Minimalist luxury essentials seekers',
          'Utilitarian technical streetwear enthusiasts'
        ],
        reasoning: 'A focused wardrobe archetype prevents generic apparel positioning.'
      };
    }
    if (currentRound === 2) {
      return {
        isComplete: false,
        currentRound: 2,
        question: 'The apparel industry relies on cheap shortcuts. What production compromise do you refuse to make?',
        suggestedAnswers: [
          'No synthetic blend fabrics or polyester',
          'No trend-chasing disposable micro-seasons',
          'No opaque sweatshop offshore supply chains'
        ],
        reasoning: 'Production integrity builds enduring customer trust and justifies premium pricing.'
      };
    }
    if (currentRound === 3) {
      return {
        isComplete: true,
        currentRound: 3,
        question: 'What aesthetic attitude must someone feel when wearing your collection?',
        suggestedAnswers: [
          'Understated quiet architectural luxury',
          'Rugged indestructible archival heritage',
          'Defiant raw-edge subcultural energy'
        ],
        reasoning: 'Aesthetic polarization creates fiercely loyal repeat collectors.'
      };
    }
  }

  // 3. WELLNESS & HEALTH
  if (domain === DOMAINS.WELLNESS) {
    if (currentRound === 1) {
      return {
        isComplete: false,
        currentRound: 1,
        question: 'Wellness is flooded with generic promises. Who is the exact person whose daily routine you transform?',
        suggestedAnswers: [
          'Burned-out high performers seeking recovery',
          'Holistic biohackers demanding verified purity',
          'Busy parents needing sustainable daily energy'
        ],
        reasoning: 'Specific daily habit targets drive high retention and organic referrals.'
      };
    }
    if (currentRound === 2) {
      return {
        isComplete: false,
        currentRound: 2,
        question: 'What predatory gimmick or empty wellness cliché do you reject completely?',
        suggestedAnswers: [
          'No proprietary blends hiding low dosages',
          'No fear-based detox and cleanse marketing',
          'No synthetic sweeteners or artificial fillers'
        ],
        reasoning: 'Radical formulation honesty stands out against noisy influencer brands.'
      };
    }
    if (currentRound === 3) {
      return {
        isComplete: true,
        currentRound: 3,
        question: 'How should your packaging and rituals feel on a customer’s morning counter?',
        suggestedAnswers: [
          'Apothecary amber glass with clinical precision',
          'Warm organic ceramic minimalism',
          'High-contrast technical athletic performance'
        ],
        reasoning: 'Countertop aesthetic value cements the product into morning rituals.'
      };
    }
  }

  // 4. CAREER & PROFESSIONAL
  if (domain === DOMAINS.CAREER) {
    if (currentRound === 1) {
      return {
        isComplete: false,
        currentRound: 1,
        question: 'Generic templates fail ambitious candidates. Who is the specific professional you help stand out?',
        suggestedAnswers: [
          'Senior engineers with non-traditional backgrounds',
          'Design and product leads showcasing deep craft',
          'Founders transitioning back into executive roles'
        ],
        reasoning: 'Targeting high-agency candidates prevents generic resume commoditization.'
      };
    }
    if (currentRound === 2) {
      return {
        isComplete: false,
        currentRound: 2,
        question: 'Most career tools optimize for bots rather than human leaders. What compromise do you refuse?',
        suggestedAnswers: [
          'Predatory recurring monthly subscription paywalls',
          'Fluffy buzzword checklists without verified impact',
          'Cluttered multi-column templates that fail ATS checks'
        ],
        reasoning: 'Highlighting incumbent compromises establishes an honest editorial standard.'
      };
    }
    if (currentRound === 3) {
      return {
        isComplete: true,
        currentRound: 3,
        question: 'What aesthetic and reading impression should the candidate dossier deliver?',
        suggestedAnswers: [
          'Restrained Swiss typographic executive monograph',
          'High-signal technical briefing on warm paper',
          'Understated minimalist portfolio with clear proof'
        ],
        reasoning: 'Typographic restraint signals seniority and disciplined craft to hiring managers.'
      };
    }
  }

  // 5. HEALTHCARE & CLINICAL (Hospitals, Doctors, Nurses, Healthcare IT)
  if (domain === DOMAINS.HEALTHCARE) {
    if (currentRound === 1) {
      return {
        isComplete: false,
        currentRound: 1,
        question: `'Hospital helper' is far too vague for a clinical buyer. Who is the exact clinician or caregiver whose acute burnout makes them desperate for "${pitch.slice(0, 60)}..." right now?`,
        suggestedAnswers: [
          'ICU nurses drowning in 40-click EHR charting',
          'ER physicians losing critical minutes during handoffs',
          'Clinic staff overwhelmed by chaotic patient triage'
        ],
        reasoning: 'Stage 1 tests the beachhead clinical user. Healthcare procurement rejects generic tools; you must solve one acute bedside pain.'
      };
    }
    if (currentRound === 2) {
      return {
        isComplete: false,
        currentRound: 2,
        question: 'What is the broken compromise or predatory status quo that legacy hospital software forces staff to endure?',
        suggestedAnswers: [
          'Bloated monopolistic EHR software designed for billing, not care',
          'Fragmented patient data silos creating life-threatening handoff gaps',
          'Soul-crushing administrative paperwork stealing time from bedside care'
        ],
        reasoning: 'Stage 2 uncovers the systemic villain. A strong healthcare brand champions the caregiver against bureaucratic bloat.'
      };
    }
    if (currentRound === 3) {
      return {
        isComplete: true,
        currentRound: 3,
        question: 'When a doctor or nurse interacts with your tool mid-shift, what is the visceral emotional posture it must deliver?',
        suggestedAnswers: [
          'Calm Clinical Precision: Zero distraction, sub-second bedside clarity',
          'Fierce Caregiver Advocacy: Relentless defense of human patient connection',
          'Defiant Anti-Bloat Utility: Fast, unburdensome ergonomics that just work'
        ],
        reasoning: 'Stage 3 defines the brand archetype under high-stress clinical conditions.'
      };
    }
  }

  // 6. LEGAL & COMPLIANCE
  if (domain === DOMAINS.LEGAL) {
    if (currentRound === 1) {
      return {
        isComplete: false,
        currentRound: 1,
        question: `Who is the specific legal practitioner whose billable sanity is breaking over "${pitch.slice(0, 60)}..." right now?`,
        suggestedAnswers: [
          'Litigation associates buried in document review',
          'Solo attorneys losing hours to billable invoicing',
          'In-house counsel drowning in redline diligence'
        ],
        reasoning: 'Legal procurement requires proving acute hour savings for a specific tier of counsel.'
      };
    }
    if (currentRound === 2) {
      return {
        isComplete: false,
        currentRound: 2,
        question: 'What is the broken industry practice or legacy compromise in legal services you reject?',
        suggestedAnswers: [
          'Clunky billing tools that reward inefficiency',
          'Fragmented document silos risking compliance errors',
          'Opaque discovery vendors charging extortionate fees'
        ],
        reasoning: 'Challenging legal status quo compromises gives the brand distinct authority.'
      };
    }
    if (currentRound === 3) {
      return {
        isComplete: true,
        currentRound: 3,
        question: 'What aesthetic impression must your interface convey to senior partners and judiciary?',
        suggestedAnswers: [
          'Archival Judicial Authority: Sovereign serif monograph',
          'Sub-Second Forensic Precision: High-density legal clarity',
          'Modern In-House Clarity: Crisp, unburdened contract briefs'
        ],
        reasoning: 'Senior legal buyers judge software by typographic discipline and institutional gravitas.'
      };
    }
  }

  // 7. FINANCE & ACCOUNTING
  if (domain === DOMAINS.FINANCE) {
    if (currentRound === 1) {
      return {
        isComplete: false,
        currentRound: 1,
        question: `Which exact financial operator is losing sleep over "${pitch.slice(0, 60)}..." during monthly close?`,
        suggestedAnswers: [
          'CPAs drowning in receipt reconciliation chaos',
          'Fractional CFOs wrestling messy multi-entity data',
          'Bookkeepers burned out by manual spreadsheet entry'
        ],
        reasoning: 'Targeting a specific finance role during month-end close unlocks immediate enterprise budget.'
      };
    }
    if (currentRound === 2) {
      return {
        isComplete: false,
        currentRound: 2,
        question: 'What predatory status quo in legacy financial software are you actively waging war against?',
        suggestedAnswers: [
          'Oligopoly suites hiking subscription prices annually',
          'Fragile API syncs causing bank reconciliation errors',
          'Artificial features masking basic spreadsheet flaws'
        ],
        reasoning: 'Accountants despise vendor price-gouging; taking a stand builds instant camaraderie.'
      };
    }
    if (currentRound === 3) {
      return {
        isComplete: true,
        currentRound: 3,
        question: 'When an accountant balances a ledger with your product, what visceral feeling must it evoke?',
        suggestedAnswers: [
          'Swiss Ledger Rigor: Unshakable mechanical precision',
          'Quiet Financial Sovereignty: Zero-sync local integrity',
          'High-Voltage Terminal Speed: Keyboard-first power user'
        ],
        reasoning: 'Financial software must radiate immutable precision and mathematical calm.'
      };
    }
  }

  // 8. EDUCATION & EDTECH
  if (domain === DOMAINS.EDUCATION) {
    if (currentRound === 1) {
      return {
        isComplete: false,
        currentRound: 1,
        question: `Who is the overburdened educator or administrator whose day is derailed without "${pitch.slice(0, 60)}..."?`,
        suggestedAnswers: [
          'Teachers losing evenings to repetitive grading',
          'Course creators struggling with student retention',
          'School leads drowning in compliance paperwork'
        ],
        reasoning: 'Educators reject generic tech; you must liberate their time for actual teaching.'
      };
    }
    if (currentRound === 2) {
      return {
        isComplete: false,
        currentRound: 2,
        question: 'What broken compromise in modern educational software do you refuse to tolerate?',
        suggestedAnswers: [
          'Sterile district portals that dehumanize learning',
          'Gamified gimmicks that distract from real mastery',
          'Surveillance features that destroy classroom trust'
        ],
        reasoning: 'Educational integrity demands fighting against sterile corporate compliance software.'
      };
    }
    if (currentRound === 3) {
      return {
        isComplete: true,
        currentRound: 3,
        question: 'What emotional tone should students and educators experience in your learning environment?',
        suggestedAnswers: [
          'Warm Mentorship Sanctuary: Human, inspiring, patient',
          'Rigorous Academic Craft: Intellectual depth and focus',
          'Playful Creative Studio: Sparking curious exploration'
        ],
        reasoning: 'Classroom tone dictates engagement and long-term institutional adoption.'
      };
    }
  }

  // 9. REAL ESTATE & PROPTECH
  if (domain === DOMAINS.REAL_ESTATE) {
    if (currentRound === 1) {
      return {
        isComplete: false,
        currentRound: 1,
        question: `Who is the property professional whose commission or portfolio is bleeding due to "${pitch.slice(0, 60)}..."?`,
        suggestedAnswers: [
          'Independent brokers juggling chaotic lead follow-ups',
          'Property managers chasing delinquent tenant maintenance',
          'Commercial leasing agents buried in redline leases'
        ],
        reasoning: 'Real estate tools must tie directly to transaction speed or portfolio NOI.'
      };
    }
    if (currentRound === 2) {
      return {
        isComplete: false,
        currentRound: 2,
        question: 'What industry gatekeeper or predatory middleman are you challenging in real estate?',
        suggestedAnswers: [
          'Monopolistic MLS portals charging high referral cuts',
          'Clunky property suites requiring manual data entry',
          'Opaque commission models that confuse clients'
        ],
        reasoning: 'Challenging MLS gatekeepers establishes a fearless, broker-first reputation.'
      };
    }
    if (currentRound === 3) {
      return {
        isComplete: true,
        currentRound: 3,
        question: 'What architectural and aesthetic atmosphere should your property portal radiate?',
        suggestedAnswers: [
          'Architectural Quiet Luxury: Serene editorial whitespace',
          'High-Velocity Transaction Engine: Pure closing speed',
          'Trustworthy Neighborhood Advisory: Warm civic authority'
        ],
        reasoning: 'Real estate aesthetics determine whether high-net-worth clients trust the brand.'
      };
    }
  }

  // 10. CONSTRUCTION, TRADES & FIELD SERVICES
  if (domain === DOMAINS.CONSTRUCTION_TRADES) {
    if (currentRound === 1) {
      return {
        isComplete: false,
        currentRound: 1,
        question: `Who is the contractor or tradesperson losing thousands on job sites without "${pitch.slice(0, 60)}..."?`,
        suggestedAnswers: [
          'General contractors losing margin on undocumented change orders',
          'Subcontractors delayed by chaotic material deliveries',
          'Independent trade pros burned out by late-night estimating'
        ],
        reasoning: 'Trade professionals demand tools that survive the job site and protect razor-thin margins.'
      };
    }
    if (currentRound === 2) {
      return {
        isComplete: false,
        currentRound: 2,
        question: 'What dirty secret in construction software do you refuse to impose on job sites?',
        suggestedAnswers: [
          'Fragile desktop tools that fail without cell service',
          'Bloated enterprise software requiring 3-week training',
          'Predatory pricing tiers that charge per subcontractor'
        ],
        reasoning: 'Field workers despise desk-bound bloat; offline durability is a killer wedge.'
      };
    }
    if (currentRound === 3) {
      return {
        isComplete: true,
        currentRound: 3,
        question: 'What aesthetic attitude should your field tool project on a dusty job site?',
        suggestedAnswers: [
          'Rugged Industrial Durability: High-contrast, sunlight-readable',
          'Master Builder Heritage: Celebrating enduring trade craft',
          'No-Bullshit Utility: Big tap targets, sub-second entry'
        ],
        reasoning: 'Field design requires high-contrast ergonomic utility that commands respect on-site.'
      };
    }
  }

  // 11. LOGISTICS, SUPPLY CHAIN & TRANSPORT
  if (domain === DOMAINS.LOGISTICS) {
    if (currentRound === 1) {
      return {
        isComplete: false,
        currentRound: 1,
        question: `Who in the logistics chain is eating costly delays without "${pitch.slice(0, 60)}..." right now?`,
        suggestedAnswers: [
          'Dispatchers scrambling to fill empty deadhead miles',
          'Warehouse supervisors bottlenecked at dock doors',
          'Fleet operators losing margin to erratic spot rates'
        ],
        reasoning: 'Logistics margin is won or lost in minutes; pinpointing the operator proves instant ROI.'
      };
    }
    if (currentRound === 2) {
      return {
        isComplete: false,
        currentRound: 2,
        question: 'What broken compromise in freight and supply chain are you attacking?',
        suggestedAnswers: [
          'Opaque broker markups taking 25% on driver sweat',
          'Ancient EDI systems that lose load status updates',
          'Paper bills of lading causing days of payment delays'
        ],
        reasoning: 'Freight operators rally behind technologies that eliminate broker parasitism.'
      };
    }
    if (currentRound === 3) {
      return {
        isComplete: true,
        currentRound: 3,
        question: 'What posture should your dispatch platform convey to freight coordinators?',
        suggestedAnswers: [
          'Mission Control Telemetry: Sub-second global tracking',
          'Highway Sovereignty: Driver-first unvarnished utility',
          'Precision Logistics Engine: Zero-slack operational flow'
        ],
        reasoning: 'Logistics software demands mission-control reliability under volatile road conditions.'
      };
    }
  }

  // 12. RETAIL & E-COMMERCE
  if (domain === DOMAINS.RETAIL) {
    if (currentRound === 1) {
      return {
        isComplete: false,
        currentRound: 1,
        question: `Which retail merchant is losing margin and sanity to "${pitch.slice(0, 60)}..." today?`,
        suggestedAnswers: [
          'Boutique owners losing sales to out-of-stock items',
          'Multi-channel brands struggling with inventory sync',
          'DTC founders bleeding margin to paid advertising'
        ],
        reasoning: 'Retailers operate on tight margins; solving stock desync drives immediate cash impact.'
      };
    }
    if (currentRound === 2) {
      return {
        isComplete: false,
        currentRound: 2,
        question: 'What broken compromise in retail commerce platforms do you reject?',
        suggestedAnswers: [
          'App store fee stacking that eats 15% of merchant revenue',
          'Heavy enterprise ERPs built for legacy department stores',
          'Commoditized storefront templates that look identical'
        ],
        reasoning: 'Merchants hate app store nickel-and-diming; standing for sovereignty builds loyalty.'
      };
    }
    if (currentRound === 3) {
      return {
        isComplete: true,
        currentRound: 3,
        question: 'What atmosphere should your commerce platform deliver to shoppers and store owners?',
        suggestedAnswers: [
          'Warm Neighborhood Atelier: Curated boutique warmth',
          'Frictionless Checkout Machine: Sub-second purchasing flow',
          'Defiant Independent Rebel: Anti-Amazon merchant craft'
        ],
        reasoning: 'Storefront aesthetics directly determine basket size and repeat customer retention.'
      };
    }
  }

  // 13. MANUFACTURING & HARDWARE
  if (domain === DOMAINS.MANUFACTURING) {
    if (currentRound === 1) {
      return {
        isComplete: false,
        currentRound: 1,
        question: `Who on the plant floor is battling costly scrap or downtime due to "${pitch.slice(0, 60)}..."?`,
        suggestedAnswers: [
          'Plant managers facing unscheduled assembly line stops',
          'Quality control leads catching high defect rates late',
          'CNC machinists bottlenecked by tooling changeovers'
        ],
        reasoning: 'Manufacturing demands tying technology directly to OEE, scrap reduction, and line uptime.'
      };
    }
    if (currentRound === 2) {
      return {
        isComplete: false,
        currentRound: 2,
        question: 'What antiquated status quo in manufacturing software are you replacing?',
        suggestedAnswers: [
          'Fragile SCADA legacy software built twenty years ago',
          'Manual clipboard logs that hide line bottlenecks',
          'Proprietary equipment vendor lock-in and high fees'
        ],
        reasoning: 'Plant operators resent proprietary vendor lock-in; open telemetry is a compelling wedge.'
      };
    }
    if (currentRound === 3) {
      return {
        isComplete: true,
        currentRound: 3,
        question: 'What aesthetic and operational impression should your telemetry dashboard project?',
        suggestedAnswers: [
          'Heavy Industrial Precision: High-density machine telemetry',
          'Lean Manufacturing Laboratory: Calm, clean visual flow',
          'Rugged Shop-Floor Terminal: Built for grease-proof quick taps'
        ],
        reasoning: 'Industrial software must inspire confidence under noisy, high-stakes factory conditions.'
      };
    }
  }

  // 14. AGRICULTURE & FARMING
  if (domain === DOMAINS.AGRICULTURE) {
    if (currentRound === 1) {
      return {
        isComplete: false,
        currentRound: 1,
        question: `Which grower or farm operator is taking massive financial risks without "${pitch.slice(0, 60)}..."?`,
        suggestedAnswers: [
          'Independent family farmers facing erratic input costs',
          'Vineyard managers managing fragile microclimate irrigation',
          'Ranchers tracking livestock health across vast acreage'
        ],
        reasoning: 'Farmers face unforgiving seasonal stakes; your tool must de-risk yield and operational input costs.'
      };
    }
    if (currentRound === 2) {
      return {
        isComplete: false,
        currentRound: 2,
        question: 'What corporate agricultural compromise do you refuse to impose on growers?',
        suggestedAnswers: [
          'Tractor and equipment vendors blocking right-to-repair',
          'Big seed monopolies locking farmers into high debt',
          'Impractical Silicon Valley drones that fail in weather'
        ],
        reasoning: 'Right-to-repair and anti-monopoly stances strike a deeply resonant chord in agriculture.'
      };
    }
    if (currentRound === 3) {
      return {
        isComplete: true,
        currentRound: 3,
        question: 'What posture should your brand convey across thousands of acres of farmland?',
        suggestedAnswers: [
          'Generational Earth Stewardship: Grounded, enduring trust',
          'Modern Precision Agronomy: Satellite telemetry clarity',
          'Fierce Grower Independence: Defending family farm sovereignty'
        ],
        reasoning: 'Agricultural branding requires honoring generational soil stewardship over fleeting tech hype.'
      };
    }
  }

  // 15. CREATIVE, MEDIA & AGENCY
  if (domain === DOMAINS.CREATIVE) {
    if (currentRound === 1) {
      return {
        isComplete: false,
        currentRound: 1,
        question: `Who is the creative lead whose vision is suffocating without "${pitch.slice(0, 60)}..."?`,
        suggestedAnswers: [
          'Boutique studio leads drowning in revision feedback',
          'Independent filmmakers managing chaotic media assets',
          'Design directors fighting committee consensus fatigue'
        ],
        reasoning: 'Creative founders need freedom from feedback paralysis and administrative asset chaos.'
      };
    }
    if (currentRound === 2) {
      return {
        isComplete: false,
        currentRound: 2,
        question: 'What soul-crushing compromise in the creative industry do you actively resist?',
        suggestedAnswers: [
          'Algorithmic content mills that destroy authentic taste',
          'Endless client review committees that sanitize vision',
          'Monopolistic creative suites hiking monthly subscriptions'
        ],
        reasoning: 'Creative pros rally behind platforms that champion authentic taste over algorithmic slop.'
      };
    }
    if (currentRound === 3) {
      return {
        isComplete: true,
        currentRound: 3,
        question: 'What artistic statement should your brand deliver to creators and audiences?',
        suggestedAnswers: [
          'Avant-Garde Iconoclast: Bold, unapologetic cultural statement',
          'Disciplined Atelier Craft: Typographic poise and reverence',
          'Raw Cyber-Minimalism: High-contrast utilitarian canvas'
        ],
        reasoning: 'Creative tools are judged ruthlessly on typography, whitespace, and artistic credibility.'
      };
    }
  }

  // 16. UNIVERSAL DYNAMIC ADAPTIVE FALLBACK (For novel pitches and any unlisted niche)
  const meta = extractPitchMetadata(pitch);
  if (currentRound === 1) {
    return {
      isComplete: false,
      currentRound: 1,
      question: `Who is the specific, high-friction ${meta.targetRole} whose urgent pain makes them desperate for "${meta.coreSubject.slice(0, 60)}..." right now?`,
      suggestedAnswers: [
        `${meta.targetRole} fighting acute operational friction`,
        `High-velocity operators escaping legacy compromises`,
        `Independent specialists demanding total workflow autonomy`
      ],
      reasoning: `Stage 1 tests the beachhead customer ICP for ${meta.industryName}. Targeting a specific role with acute friction prevents commoditization.`
    };
  }

  if (currentRound === 2) {
    return {
      isComplete: false,
      currentRound: 2,
      question: `What is the broken status quo or predatory compromise that incumbents in ${meta.industryName} force customers to accept every day?`,
      suggestedAnswers: [
        `${meta.systemicVillain.slice(0, 50)}`,
        `Overpriced legacy tools that monetize friction`,
        `Cookie-cutter solutions that ignore professional craft`
      ],
      reasoning: `Stage 2 uncovers the systemic villain in ${meta.industryName}. A compelling brand stands firmly against something specific.`
    };
  }

  if (currentRound === 3) {
    return {
      isComplete: true,
      currentRound: 3,
      question: `When a customer adopts your product in ${meta.industryName}, which uncompromising brand posture best defines its personality?`,
      suggestedAnswers: [
        `Calm Functional Precision: High-signal clarity and zero clutter`,
        `Defiant Category Challenger: Biting critiques of legacy compromise`,
        `Warm Editorial Authority: Sovereign human craft and unhurried trust`
      ],
      reasoning: `Stage 3 defines polarization boundaries for ${meta.industryName}. Great brands take a clear cultural stance.`
    };
  }

  return {
    isComplete: true,
    currentRound: 4,
    question: 'Brand identity compiled.',
    suggestedAnswers: [],
    reasoning: 'All rounds complete.'
  };
}

export function generateGenericMockBrandKit(pitch, history = []) {
  const domain = classifyDomain(pitch);
  const shortPitch = pitch || 'A transformative concept for high-craft builders.';

  // Domain-specific brand kit for Hospitality
  if (domain === DOMAINS.HOSPITALITY) {
    return {
      brandStrategy: {
        brandName: 'Fornello',
        tagline: 'Wood-fired neighborhood craft, built around honest shared tables.',
        mission: `To revive the lost art of neighborhood hospitality through authentic wood-fired cooking and genuine human warmth. Inspired by: "${shortPitch.slice(0, 90)}"`,
        targetAudience: 'Discerning neighborhood locals, family gatherings, and food lovers who value real kitchen craft over corporate chain gimmicks.',
        coreValueProposition: '72-hour naturally fermented sourdough crusts, open-hearth blistered dishes, and unpretentious communal hospitality with zero artificial shortcuts.',
        antiHero: 'Sanitized corporate restaurant chains with industrial freezer shortcuts and 90-minute table turnover evictions.',
        differentiator: 'Live-fire central hearth, transparent whole-ingredient sourcing, and warm, unhurried hospitality where staff know your name.'
      },
      voiceSystem: {
        archetype: 'The Generous Host & Open-Hearth Craftsman',
        tone: ['Warm & Unpretentious', 'Grounded Craft', 'Inviting & Lively', 'Anti-Corporate'],
        dos: [
          'Speak like a warm, generous host greeting friends at the door.',
          'Focus on ingredient origins, wood smoke, and shared table camaraderie.',
          'Keep language earthy, appetizing, and un-sanitized.'
        ],
        donts: [
          'Never use snobby culinary jargon or stiff wine-critic pretension.',
          'Never sound like a sterile franchise script with upsell language.',
          'Never hurry guests or talk down to family diners.'
        ],
        vocabularyWords: ['Hearth', 'Embers', 'Sourdough', 'Ferment', 'Gather', 'Generous', 'Unhurried', 'Cast-Iron']
      },
      visualTokens: {
        palette: [
          { name: 'Cast Iron', hex: '#22201E', role: 'primary' },
          { name: 'Flour Cream', hex: '#F7F5EE', role: 'surface' },
          { name: 'Warm Terracotta', hex: '#C85A32', role: 'accent' },
          { name: 'Embers Amber', hex: '#E5A93C', role: 'secondary' },
          { name: 'Charcoal Black', hex: '#141312', role: 'text' }
        ],
        typography: {
          headingFont: 'Cormorant Garamond',
          bodyFont: 'Inter',
          googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=Inter:wght@400;500&display=swap'
        },
        stylePhilosophy: 'Open hearth rustic minimalism: warm terracotta warmth, hand-turned stoneware textures, and generous whitespace.',
        borderCurvature: '20-28px rounded architectural cards with warm pill tags.'
      },
      launchContent: {
        heroHeadline: 'Honest fire. Shared tables. Zero pretension.',
        heroSubheadline: `Wood-fired sourdough, natural wines, and a dining room built to feel like home. ${shortPitch}`,
        callToAction: 'Reserve a Table',
        manifesto: 'Dining out used to mean feeling welcomed. Today it is QR codes, frozen shortcuts, and timers counting down your 90-minute table limit. We reject the corporate commoditization of the dinner table. We believe in firewood, 72-hour dough, sizzling cast iron, and conversations that stretch deep into the night. When you sit with us, you are family.',
        elevatorPitch: `A neighborhood culinary sanctuary transforming ${shortPitch} into an iconic wood-fired destination with handcrafted sourdough, warm hospitality, and timeless brand identity.`,
        socialHooks: [
          'Why the best restaurants in the world never use a timer on your table.',
          'The real secret behind 72-hour naturally fermented sourdough.',
          'Dining should feel like gathering around a hearth, not an industrial assembly line.'
        ]
      }
    };
  }

  // Domain-specific brand kit for Fashion
  if (domain === DOMAINS.FASHION) {
    return {
      brandStrategy: {
        brandName: 'Kuro Loom',
        tagline: 'Archival textiles and enduring silhouettes made to outlive seasons.',
        mission: `To liberate wardrobes from disposable fast-fashion through uncompromising raw materials and heirloom construction. Inspired by: "${shortPitch.slice(0, 90)}"`,
        targetAudience: 'Textile purists, design collectors, and conscious consumers who demand garments that age with dignity.',
        coreValueProposition: 'Custom shuttle-loom selvedge fabrics, zero synthetic blends, and architectural silhouettes engineered for decades of wear.',
        antiHero: 'Fast-fashion micro-seasons, synthetic polyester blends, and planned wardrobe obsolescence.',
        differentiator: 'Single-origin shuttle-loomed Japanese textiles with exposed chainstitch construction and lifetime repair guarantee.'
      },
      voiceSystem: {
        archetype: 'The Textile Monastic & Defiant Minimalist',
        tone: ['Understated Authority', 'Tactile Precision', 'Archival Reverence', 'Anti-Trend'],
        dos: [
          'Speak with quiet confidence about weave density, gram weight, and indigo wash depth.',
          'Treat garments as functional sculptures, not disposable fashion.',
          'Emphasize repair, patina, and longevity over novelty.'
        ],
        donts: [
          'Never use hyped streetwear FOMO slang like "cop" or "drop".',
          'Never push seasonal clearance discounts or impulse buy urgency.',
          'Never hide material composition.'
        ],
        vocabularyWords: ['Selvedge', 'Shuttle-Loom', 'Patina', 'Archival', 'Indigo', 'Heirloom', 'Enduring', 'Tactile']
      },
      visualTokens: {
        palette: [
          { name: 'Raw Indigo', hex: '#1A2840', role: 'primary' },
          { name: 'Ecru Loom', hex: '#F4EFE6', role: 'surface' },
          { name: 'Copper Rivet', hex: '#B86B3E', role: 'accent' },
          { name: 'Ecru Selvedge', hex: '#EAE4D9', role: 'secondary' },
          { name: 'Shuttle Black', hex: '#111111', role: 'text' }
        ],
        typography: {
          headingFont: 'Cormorant Garamond',
          bodyFont: 'Inter',
          googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;500&family=Inter:wght@400&display=swap'
        },
        stylePhilosophy: 'Archival atelier spread: deep indigo contrasts against ecru parchment with stark, sculptural layout geometry.',
        borderCurvature: '16-24px soft editorial corners with crisp monospaced pill indicators.'
      },
      launchContent: {
        heroHeadline: 'Built for decades. Never for seasons.',
        heroSubheadline: `Heirloom textiles, Japanese shuttle-loom selvedge, and architectural cuts. ${shortPitch}`,
        callToAction: 'Explore the Archive',
        manifesto: 'The modern clothing industry is a landfill pipeline disguised as self-expression. Five thousand micro-seasons a year, synthetic polyester that suffocates, and stitches designed to unravel after ten washes. We reject this race to the bottom. True style is archival. It is the weight of 16-ounce loomstate denim, the character of natural indigo patina, and the dignity of a garment made to be inherited.',
        elevatorPitch: `An archival apparel house turning ${shortPitch} into an enduring brand with single-origin textiles, zero-waste patterns, and iconic editorial presence.`,
        socialHooks: [
          'Why your clothes unravel after six months (and the lost art of shuttle-looming).',
          'True luxury is a garment you can repair for twenty years.',
          'If a piece cannot outlive a seasonal trend, it has no business being made.'
        ]
      }
    };
  }

  // Domain-specific brand kit for Healthcare & Clinical
  if (domain === DOMAINS.HEALTHCARE) {
    return {
      brandStrategy: {
        brandName: 'Aegis Clinical',
        tagline: 'Less screen time. More bedside care.',
        mission: `To liberate clinicians from soul-crushing administrative documentation so they can focus on what matters most: human patient healing. Inspired by: "${shortPitch.slice(0, 90)}"`,
        targetAudience: 'Emergency physicians, intensive care nurses, and surgical teams exhausted by 40-click legacy hospital software.',
        coreValueProposition: 'Sub-second ambient clinical capture, intelligent triage synthesis, and zero-click documentation built for real clinical workflows.',
        antiHero: 'Monopolistic, bloated legacy EHRs that turn world-class healers into exhausted data-entry clerks.',
        differentiator: 'Ergonomic, voice-first ambient intelligence with verified clinical audit trails and zero cognitive clutter.'
      },
      voiceSystem: {
        archetype: 'The Trusted Clinical Safeguard & Caregiver Ally',
        tone: ['Clinically Precise', 'Deeply Empathetic', 'Whisper-Quiet Focus', 'Anti-Bureaucracy'],
        dos: [
          'Speak with calm, bedside authority and zero hype.',
          'Respect clinician time by using concise, high-signal language.',
          'Acknowledge patient privacy, HIPAA compliance, and life-critical stakes.'
        ],
        donts: [
          'Never use frivolous tech buzzwords like "disrupting healthcare".',
          'Never minimize clinical complexity or administrative friction.',
          'Never produce bright, jarring visual or acoustic distractions.'
        ],
        vocabularyWords: ['Bedside', 'Precision', 'Triage', 'Sovereignty', 'Ambient', 'High-signal', 'Unburdened']
      },
      visualTokens: {
        palette: [
          { name: 'Surgical Slate', hex: '#0F172A', role: 'primary' },
          { name: 'Gauze White', hex: '#F8FAFC', role: 'surface' },
          { name: 'Clinical Teal', hex: '#0D9488', role: 'accent' },
          { name: 'Muted Sage', hex: '#94A3B8', role: 'secondary' },
          { name: 'Charcoal Deep', hex: '#020617', role: 'text' }
        ],
        typography: {
          headingFont: 'EB Garamond',
          bodyFont: 'Inter',
          googleFontsUrl: 'https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;600&family=Inter:wght@400;500&display=swap'
        },
        stylePhilosophy: 'Clinical sanctuary minimalism: calm surgical slate, sterile high-contrast whitespace, and serene serif hierarchy.',
        borderCurvature: '16-24px rounded cards with crisp pill tags.'
      },
      launchContent: {
        heroHeadline: 'Less screen time. More bedside care.',
        heroSubheadline: `Ambient documentation and intelligent triage built for clinicians who refused to be data-entry clerks. ${shortPitch}`,
        callToAction: 'Request Clinical Demo',
        manifesto: 'Healers went into medicine to save lives, not to click checkboxes in a database from 1998. Today, doctors spend two hours documenting for every hour of patient care. Burnout is at an all-time high, driven not by medicine, but by administrative bloat. We reject this theft of human empathy. We build tools that fade into the background—giving clinicians their sanity, their time, and their calling back.',
        elevatorPitch: `A modern clinical intelligence platform transforming ${shortPitch} into an indispensable workflow partner for hospital teams.`,
        socialHooks: [
          'Why the best doctors are burning out: it is not the medicine, it is the 40 clicks per patient chart.',
          'Software should serve the healer, not the billing department.',
          'What happens when bedside tools are designed with sub-second clinical ergonomics?'
        ]
      }
    };
  }

  // Universal Dynamic Brand Kit Fallback (Tailored to ANY pitch or unlisted profession)
  const meta = extractPitchMetadata(pitch);
  const cleanSubject = meta.coreSubject || pitch.trim();
  const meaningfulWords = cleanSubject
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .split(/\s+/)
    .filter(
      (w) =>
        ![
          'i', 'am', 'a', 'an', 'the', 'we', 'are', 'for', 'to', 'of', 'in', 'on', 'with', 'and', 'my', 'our', 'app', 'tool', 'platform', 'helper', 'works', 'innovation'
        ].includes(w.toLowerCase())
    );

  let computedBrandName = 'Venture';
  if (meaningfulWords.length > 0) {
    computedBrandName = meaningfulWords
      .slice(0, 2)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  } else if (meta.domain === 'hospitality') {
    computedBrandName = 'Krio Cold Craft';
  } else if (meta.domain === 'healthcare') {
    computedBrandName = 'Aegis Flow';
  }

  return {
    brandStrategy: {
      brandName: computedBrandName,
      tagline: `Quiet authority and sub-second execution for ${meta.targetRole}.`,
      mission: `To liberate ${meta.targetRole} by eliminating ${meta.acuteFriction.toLowerCase()} through uncompromising craft. Inspired by: "${shortPitch.slice(0, 90)}"`,
      targetAudience: `Discerning ${meta.targetRole} and high-agency operators who refuse ${meta.systemicVillain.toLowerCase()}.`,
      coreValueProposition: `High-signal clarity, instant execution, and modern ergonomics specifically engineered for ${meta.industryName}.`,
      antiHero: `${meta.systemicVillain}`,
      differentiator: `Tailored ergonomics and sub-second execution built specifically for ${meta.targetRole}, with zero unnecessary bloat.`
    },
    voiceSystem: {
      archetype: 'The Quiet Master & Dedicated Practitioner',
      tone: ['High-Signal & Precise', 'Deeply Respectful of Craft', 'Understated Luxury', 'Anti-Bureaucracy'],
      dos: [
        'Speak in measured, deliberate sentences with zero hype.',
        `Address the specific daily operational stakes of ${meta.targetRole}.`,
        'Use typographic hierarchy rather than neon colors to build emphasis.'
      ],
      donts: [
        'Never use generic startup cliches like "game-changing" or "seamless".',
        'Never scream in all-caps or use flashing animations.',
        'Never compromise taste for cheap engagement bait.'
      ],
      vocabularyWords: ['Craft', 'Sovereignty', 'Precision', 'Sub-second', 'Deliberate', 'Uncompromising', 'Frictionless']
    },
    visualTokens: {
      palette: [
        { name: 'Ink Black', hex: '#111215', role: 'primary' },
        { name: 'Paper Cream', hex: '#F7F5EE', role: 'surface' },
        { name: 'Warm Slate', hex: '#4B5563', role: 'secondary' },
        { name: 'Accent Ochre', hex: '#D97706', role: 'accent' },
        { name: 'Charcoal Black', hex: '#111215', role: 'text' }
      ],
      typography: {
        headingFont: 'Cormorant Garamond',
        bodyFont: 'Inter',
        googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;600&family=Inter:wght@400;500&display=swap'
      },
      stylePhilosophy: `Editorial monograph spread tailored for ${meta.industryName}: warm parchment under whispered serifs with zero chromatic noise.`,
      borderCurvature: '20-28px soft architectural cards with 9999px pill action buttons.'
    },
    launchContent: {
      heroHeadline: `Enduring craft. Built for ${meta.targetRole}.`,
      heroSubheadline: `A modern platform engineered to eliminate ${meta.acuteFriction.toLowerCase()}. ${shortPitch}`,
      callToAction: 'Experience the Standard',
      manifesto: `We live in an age drowned in chromatic noise, aggressive popups, and disposable software that ignores the real craft of ${meta.industryName}. Incumbent vendors profit by preserving friction, charging high fees while forcing ${meta.targetRole} to endure ${meta.systemicVillain.toLowerCase()}. We reject this race to the bottom. True distinction is not loud; it is precise. It is tools designed with deep respect for the people who do the real work.`,
      elevatorPitch: `A bespoke brand platform designed to turn ${shortPitch} into an iconic category leader in ${meta.industryName} with instant visual identity, voice tokens, and launch copy.`,
      socialHooks: [
        `Why the loudest tools in ${meta.industryName} are often the first to be replaced.`,
        `The real cost of ${meta.acuteFriction.toLowerCase()}: why craft matters more than vanity features.`,
        `If you can explain your entire value proposition in one sentence, you already won.`
      ]
    }
  };
}
