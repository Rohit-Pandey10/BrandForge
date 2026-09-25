/**
 * Domain Configuration — Single Source of Truth
 * 
 * Synchronized keyword matchers, domain identifiers, and industry classification
 * rules used across the frontend client and backend server.
 */

export const DOMAINS = {
  FASHION: 'fashion',
  HOSPITALITY: 'hospitality',
  BEVERAGE: 'beverage',
  WELLNESS: 'wellness',
  CAREER: 'career',
  DEVELOPER: 'developer',
  CREATIVE: 'creative',
  GENERAL: 'general'
};

/**
 * Classify text into a business domain.
 * @param {string} text - Any combination of user pitches and conversation turns.
 * @returns {string} One of the DOMAINS values.
 */
export function classifyDomain(text = '') {
  const lower = String(text).toLowerCase();

  // 1. APPAREL & FASHION
  if (/(fashion|clothing|apparel|wear|luxury|garment|streetwear|shoe|jewelry|bag|textile|tailor|collection|jeans?|denim|selvedge)/i.test(lower)) {
    return DOMAINS.FASHION;
  }

  // 2. BEVERAGE & FUNCTIONAL DRINKS
  if (/(drink|drinks|beverage|beverages|energy drink|clean caffeine|caffeine|adaptogen|adaptogens|kombucha|seltzer|soda|tonic|botanicals?|elixir|nootropics?|hydration|smoothie|juice|cold brew|sparkling water)/i.test(lower)) {
    return DOMAINS.BEVERAGE;
  }

  // 3. HOSPITALITY & CULINARY
  if (/(restaurant|food|dining|cuisine|culinary|chef|bistro|cafe|bakery|coffee|eatery|pizza|burger|pasta|taco|hospitality|kitchen|table|menu|dish|bar(?!code|chart)|cocktail|wine)/i.test(lower)) {
    return DOMAINS.HOSPITALITY;
  }

  // 4. DEVELOPER TOOLS & SAAS
  if (/(sql|database|rust|in-memory|backend|api|infrastructure|dev|developer|compiler|cloud|devops|kubernetes|linux|saas|terminal|cli|software)/i.test(lower)) {
    return DOMAINS.DEVELOPER;
  }

  // 5. WELLNESS & HEALTH
  if (/(fitness|wellness|health|gym|workout|yoga|longevity|nutrition|mental health|therapy|meditation|supplement|skincare)/i.test(lower)) {
    return DOMAINS.WELLNESS;
  }

  // 6. CAREER & PROFESSIONAL
  if (/(resume|cv|career|job|hiring|recruiting|portfolio|interview|candidate|ats)/i.test(lower)) {
    return DOMAINS.CAREER;
  }

  // 7. CREATIVE & AGENCY
  if (/(creative|agency|design studio|animation|film|music|video|branding agency|photography)/i.test(lower)) {
    return DOMAINS.CREATIVE;
  }

  return DOMAINS.GENERAL;
}

/**
 * Detect family dining intent from text.
 * @param {string} text
 * @returns {boolean}
 */
export function isFamilyIntent(text = '') {
  return /(family|kid|child|children|toddler|parent|all-ages|all ages|multi-generation|casual diner|sharing table|high chair|soccer team)/i.test(String(text));
}

export const extractClientDomain = classifyDomain;
export const isClientFamilyIntent = isFamilyIntent;
