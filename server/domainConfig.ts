// server/domainConfig.ts
/**
 * Universal Domain Detection and Intent Classification
 * Comprehensive multi-industry taxonomy and dynamic pitch entity extractor.
 */

export const DOMAINS = {
  HEALTHCARE: 'healthcare',
  LEGAL: 'legal',
  FINANCE: 'finance',
  EDUCATION: 'education',
  REAL_ESTATE: 'real_estate',
  CONSTRUCTION_TRADES: 'construction_trades',
  LOGISTICS: 'logistics',
  HOSPITALITY: 'hospitality',
  RETAIL: 'retail',
  MANUFACTURING: 'manufacturing',
  AGRICULTURE: 'agriculture',
  DEVELOPER: 'developer',
  CREATIVE: 'creative',
  FASHION: 'fashion',
  WELLNESS: 'wellness',
  CAREER: 'career',
  GENERAL: 'general'
} as const;

export type DomainType = typeof DOMAINS[keyof typeof DOMAINS];

export interface PitchMetadata {
  domain: DomainType;
  targetRole: string;
  industryName: string;
  acuteFriction: string;
  systemicVillain: string;
  coreSubject: string;
}

/**
 * Classify pitch text into one of 16 comprehensive industry verticals,
 * or fallback to dynamic semantic general.
 */
export function classifyDomain(text = ''): DomainType {
  const lower = String(text).toLowerCase();

  // 1. HEALTHCARE, CLINICAL & MEDICAL
  if (
    /(hospital|clinic|doctor|physician|nurse|patient|medical|healthtech|healthcare|ehr|emr|triage|clinical|surgery|surgeon|paramedic|ambulance|radiology|pharmacist|pharmacy|telehealth|telemedicine|caregiver|diagnosis|bedside|pathology|dentist|dental|pediatric|oncology|veterinar)/i.test(
      lower
    )
  ) {
    return DOMAINS.HEALTHCARE;
  }

  // 2. LEGAL, COMPLIANCE & GOVERNANCE
  if (
    /(legal|lawyer|attorney|law firm|litigation|paralegal|\bcontracts?\b|\bcontractual\b|compliance|arbitration|court|judiciary|case law|depository|\bbriefs?\b|counsel|subpoena|patent|trademark|intellectual property)/i.test(
      lower
    )
  ) {
    return DOMAINS.LEGAL;
  }

  // 3. FINANCE, ACCOUNTING & FINTECH
  if (
    /(accounting|accountant|cpa|bookkeep|taxes|wealth management|financial advisor|cfo|invoicing|payroll|banking|fintech|audit|ledger|tax return|equity|treasury|reconciliation|accounts payable|cash flow)/i.test(
      lower
    )
  ) {
    return DOMAINS.FINANCE;
  }

  // 4. EDUCATION, ACADEMIA & EDTECH
  if (
    /(education|teacher|professor|student|school|classroom|tutoring|tutor|university|k-12|curriculum|syllabus|grading|edtech|admissions|coursework|academic|principal)/i.test(
      lower
    )
  ) {
    return DOMAINS.EDUCATION;
  }

  // 5. REAL ESTATE & PROPTECH
  if (
    /(real estate|realtor|broker|property management|landlord|tenant|proptech|leasing|commercial real estate|mortgage|escrow|appraisal|multifamily|closing agent|listings)/i.test(
      lower
    )
  ) {
    return DOMAINS.REAL_ESTATE;
  }

  // 6. CONSTRUCTION, TRADES & HOME SERVICES
  if (
    /(construction|contractor|plumb|electrician|hvac|roofing|carpenter|remodel|handyman|subcontractor|job site|blueprints|permits|tradesman|flooring|drywall|landscap)/i.test(
      lower
    )
  ) {
    return DOMAINS.CONSTRUCTION_TRADES;
  }

  // 7. LOGISTICS, SUPPLY CHAIN & TRANSPORT
  if (
    /(logistics|trucking|freight|dispatch|warehouse|supply chain|shipping|cargo|fleet|carrier|delivery|transportation|3pl|cold storage|last-mile|inventory routing)/i.test(
      lower
    )
  ) {
    return DOMAINS.LOGISTICS;
  }

  // 8. HOSPITALITY, RESTAURANTS & CULINARY
  if (
    /(restaurant|food|dining|cuisine|culinary|chef|bistro|cafe|bakery|coffee|eatery|pizza|pizzeria|burger|pasta|taco|hospitality|kitchen|menu|dish|dishes|brewery|bar(?!code|chart)|cocktail|wine|diner|breakfast|lunch|dinner|tasting menu|dining table|sourdough|gelato|hotel|bartender|sommelier|drink|drinks|beverage|beverages|cold drink|soda|juice|iced tea|refreshment|smoothie|craft beer|seltzer|hydration|kombucha)/i.test(
      lower
    )
  ) {
    return DOMAINS.HOSPITALITY;
  }

  // 9. RETAIL, COMMERCE & DTC
  if (
    /(retail|storefront|boutique|merchandis|shopify|point of sale|pos system|e-commerce|dtc|wholesal|checkout|cart|store owner|inventory stock)/i.test(
      lower
    )
  ) {
    return DOMAINS.RETAIL;
  }

  // 10. MANUFACTURING & HARDWARE
  if (
    /(manufactur|factory|cnc|machin|assembly line|production facility|fabrication|tooling|industrial equipment|oem|quality control|scrap rate|tolerance)/i.test(
      lower
    )
  ) {
    return DOMAINS.MANUFACTURING;
  }

  // 11. AGRICULTURE & FARMING
  if (
    /(agricultur|farming|farmer|grower|crops|livestock|harvest|agtech|soil|tractor|rancher|orchard|irrigation|fertilizer|greenhouse)/i.test(
      lower
    )
  ) {
    return DOMAINS.AGRICULTURE;
  }

  // 12. DEVELOPER TOOLS & INFRASTRUCTURE
  if (
    /(sql|database|rust|in-memory|backend|api|infrastructure|dev|developer|compiler|cloud|devops|kubernetes|linux|saas|terminal|cli|software|b2b saas|sdk|platform|git|microservices)/i.test(
      lower
    )
  ) {
    return DOMAINS.DEVELOPER;
  }

  // 13. CREATIVE, MEDIA & AGENCY
  if (
    /(creative|agency|design studio|animation|film|music|video|branding agency|photography|studio|creator|podcast|audio production|vfx|cinematography)/i.test(
      lower
    )
  ) {
    return DOMAINS.CREATIVE;
  }

  // 14. APPAREL & FASHION
  if (
    /(jeans?|denim|selvedge|apparel|clothing|fashion|wear|garment|streetwear|shoe|shoes|sneakers?|boots?|jacket|coat|hoodie|pants|trousers|shirts?|t-shirt|tee|textile|tailor|collection|fabric|raw denim|leather|accessories|luxury basics|couture|wardrobe|knitwear|outerwear|cotton|weave|cut|fit guide)/i.test(
      lower
    )
  ) {
    return DOMAINS.FASHION;
  }

  // 15. WELLNESS, FITNESS & ATHLETICS
  if (
    /(fitness|wellness|gym|workout|yoga|longevity|nutrition|mental health|therapy|meditation|supplement|skincare|recovery|athlete|trainer|crossfit|biohack)/i.test(
      lower
    )
  ) {
    return DOMAINS.WELLNESS;
  }

  // 16. CAREER & TALENT RECRUITING
  if (
    /(resume|cv|career|job|hiring|recruiting|portfolio|interview|candidate|ats|recruitment|headhunter|talent acquisition)/i.test(
      lower
    )
  ) {
    return DOMAINS.CAREER;
  }

  return DOMAINS.GENERAL;
}

/**
 * Extracts key semantic entity metadata from any raw pitch string,
 * enabling intelligent, bespoke fallback questions even for completely novel pitches.
 */
export function extractPitchMetadata(pitch = ''): PitchMetadata {
  const domain = classifyDomain(pitch);
  const clean = pitch.trim();

  // Strip conversational self-introductory fluff ("i am a", "we are building a", etc.)
  const strippedSubject = clean
    .replace(/^(?:i am a|i am an|i am|we are a|we are an|we are|we build a|we build an|we make a|this is a|this is an|an app for|a platform for|a tool for|helper for)\s+/i, '')
    .trim();

  // Try extracting specific "for [Audience]" pattern
  const forMatch = clean.match(/\b(?:for|targeting|helping|designed for)\s+([a-zA-Z0-9\s-]{3,40})/i);
  const subjectRole = forMatch ? forMatch[1].trim() : '';

  switch (domain) {
    case DOMAINS.HEALTHCARE:
      return {
        domain,
        targetRole: subjectRole || 'Clinical specialists and on-call nurses',
        industryName: 'Healthcare & Clinical Operations',
        acuteFriction: 'Drowning in 40-click EHR charting and chaotic shift handoffs',
        systemicVillain: 'Bloated legacy hospital software and bureaucratic administrative overhead',
        coreSubject: strippedSubject || clean
      };
    case DOMAINS.LEGAL:
      return {
        domain,
        targetRole: subjectRole || 'Litigators and corporate paralegals',
        industryName: 'Legal & Compliance Services',
        acuteFriction: 'Manual contract diligence and billable hour bookkeeping fatigue',
        systemicVillain: 'Opaque billable-hour software and fragmented document discovery silos',
        coreSubject: strippedSubject || clean
      };
    case DOMAINS.FINANCE:
      return {
        domain,
        targetRole: subjectRole || 'CPAs, CFOs, and bookkeeping leads',
        industryName: 'Finance & Accounting',
        acuteFriction: 'End-of-month reconciliations and messy receipt tracking',
        systemicVillain: 'Clunky legacy accounting suites and repetitive manual data entry',
        coreSubject: strippedSubject || clean
      };
    case DOMAINS.EDUCATION:
      return {
        domain,
        targetRole: subjectRole || 'Educators, course directors, and faculty',
        industryName: 'Education & Learning Systems',
        acuteFriction: 'Hours spent grading repetitive assignments rather than mentoring students',
        systemicVillain: 'Rigid school district portals and impersonal learning management bloat',
        coreSubject: strippedSubject || clean
      };
    case DOMAINS.REAL_ESTATE:
      return {
        domain,
        targetRole: subjectRole || 'Commercial brokers and residential property managers',
        industryName: 'Real Estate & Property Management',
        acuteFriction: 'Chasing delinquent tenant paperwork and juggling unorganized showings',
        systemicVillain: 'Fragmented MLS listing portals and predatory broker commission tolls',
        coreSubject: strippedSubject || clean
      };
    case DOMAINS.CONSTRUCTION_TRADES:
      return {
        domain,
        targetRole: subjectRole || 'General contractors and trade subcontractors',
        industryName: 'Construction & Field Trades',
        acuteFriction: 'Job-site change order disputes and delayed subcontractor payments',
        systemicVillain: 'Paper-based clipboards and desktop software that fails on the field job site',
        coreSubject: strippedSubject || clean
      };
    case DOMAINS.LOGISTICS:
      return {
        domain,
        targetRole: subjectRole || 'Freight dispatchers and warehouse fleet operators',
        industryName: 'Logistics & Supply Chain',
        acuteFriction: 'Deadhead miles, delayed BOL paperwork, and spot-market price volatility',
        systemicVillain: 'Opaque freight broker markups and antiquated EDI mainframe systems',
        coreSubject: strippedSubject || clean
      };
    case DOMAINS.HOSPITALITY:
      const isBeverage = /(drink|beverage|soda|juice|tea|coffee|refreshment|smoothie|beer|seltzer|water)/i.test(clean);
      return {
        domain,
        targetRole: subjectRole || (isBeverage ? 'Beverage craft creators and discerning drinkers' : 'Executive chefs and neighborhood restaurant operators'),
        industryName: isBeverage ? 'Craft Beverage & Refreshment' : 'Hospitality & Culinary Craft',
        acuteFriction: isBeverage ? 'Artificial chemical syrups, synthetic preservatives, and midday sugar crashes' : 'Table turn bottlenecks and third-party delivery commission robbery',
        systemicVillain: isBeverage ? 'Mass-market corporate soda oligopolies pushing artificial corn syrup and synthetic flavors' : 'Sterile corporate franchise scripts and predatory third-party delivery platforms',
        coreSubject: strippedSubject || clean
      };
    case DOMAINS.RETAIL:
      return {
        domain,
        targetRole: subjectRole || 'Independent shopkeepers and omnichannel merchants',
        industryName: 'Retail & Modern Commerce',
        acuteFriction: 'Dead inventory stockouts and multi-channel inventory desynchronization',
        systemicVillain: 'Heavy enterprise ERPs designed for massive box-store chains',
        coreSubject: clean
      };
    case DOMAINS.MANUFACTURING:
      return {
        domain,
        targetRole: subjectRole || 'Plant managers and CNC machine operators',
        industryName: 'Manufacturing & Industrial Production',
        acuteFriction: 'Unscheduled assembly downtime and high defect scrap rates',
        systemicVillain: 'Antiquated SCADA monitoring tools and disconnected paper work orders',
        coreSubject: clean
      };
    case DOMAINS.AGRICULTURE:
      return {
        domain,
        targetRole: subjectRole || 'Independent growers and farm operators',
        industryName: 'Agriculture & Food Production',
        acuteFriction: 'Erratic input costs, yield loss, and weather telemetry blindspots',
        systemicVillain: 'Oligopolistic seed/chemical distributors and disconnected tractor telemetry',
        coreSubject: clean
      };
    case DOMAINS.DEVELOPER:
      return {
        domain,
        targetRole: subjectRole || 'Senior systems architects and backend engineers',
        industryName: 'Developer Infrastructure & Systems',
        acuteFriction: 'DevOps toil, serverless cold starts, and runaway cloud bills',
        systemicVillain: 'Proprietary cloud monopolies that profit by overcomplicating simple primitives',
        coreSubject: clean
      };
    case DOMAINS.CREATIVE:
      return {
        domain,
        targetRole: subjectRole || 'Boutique studio directors and independent creators',
        industryName: 'Creative Direction & Media',
        acuteFriction: 'Unending client revision rounds and creative asset version chaos',
        systemicVillain: 'Soul-crushing committee consensus and commoditizing content mills',
        coreSubject: clean
      };
    case DOMAINS.FASHION:
      return {
        domain,
        targetRole: subjectRole || 'Apparel designers and textile connoisseurs',
        industryName: 'Apparel & Archival Fashion',
        acuteFriction: 'Garment degradation from synthetic blends and micro-season pressure',
        systemicVillain: 'Disposable fast-fashion landfills and planned wardrobe obsolescence',
        coreSubject: clean
      };
    case DOMAINS.WELLNESS:
      return {
        domain,
        targetRole: subjectRole || 'Athletes, biohackers, and wellness practitioners',
        industryName: 'Health, Wellness & Bio-Endurance',
        acuteFriction: 'Energy crashes, chronic inflammation, and morning routine fragmentation',
        systemicVillain: 'Proprietary blend supplements hiding low doses behind neon marketing',
        coreSubject: clean
      };
    case DOMAINS.CAREER:
      return {
        domain,
        targetRole: subjectRole || 'Senior talent and high-agency craftspeople',
        industryName: 'Career Architecture & Talent',
        acuteFriction: 'Getting filtered out by brainless ATS keyword bots',
        systemicVillain: 'Predatory subscription job boards and commoditizing resume templates',
        coreSubject: clean
      };
    default: {
      const cleanSubject = strippedSubject || clean;
      return {
        domain: DOMAINS.GENERAL,
        targetRole: subjectRole || `${cleanSubject} practitioners`,
        industryName: `${cleanSubject} Ventures`,
        acuteFriction: `Operational bottlenecks and friction when trying to execute ${cleanSubject}`,
        systemicVillain: `Incumbent legacy vendors who profit by preserving friction in ${cleanSubject}`,
        coreSubject: cleanSubject
      };
    }
  }
}

/**
 * Detect family dining intent from pitch text.
 */
export function isFamilyIntent(text = ''): boolean {
  const lower = String(text).toLowerCase();
  const isFoodContext = /(restaurant|dining|food|pizza|pizzeria|bistro|cafe|eatery|kitchen|diner|meal|menu|chef)/i.test(lower);
  const isFamilyKeywords = /(family|kid|child|children|toddler|parent|all-ages|all ages|multi-generation|high chair|sports team)/i.test(lower);
  return Boolean(isFoodContext && isFamilyKeywords);
}
