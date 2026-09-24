/**
 * Domain Configuration — Single Source of Truth
 * 
 * This module provides the keyword matchers, domain names, and structural
 * configuration used by both the server-side controller and client-side
 * mock hydration engine. Any change to domain detection lives here.
 */

export const DOMAINS = {
  FASHION: 'fashion',
  HOSPITALITY: 'hospitality',
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

  // 1. APPAREL & FASHION (Check first to avoid bleeding into other domains)
  if (/(jeans?|denim|selvedge|apparel|clothing|fashion|wear|garment|streetwear|shoe|shoes|sneakers?|boots?|jacket|coat|hoodie|pants|trousers|shirts?|t-shirt|tee|textile|tailor|collection|fabric|raw denim|leather|accessories|luxury basics|couture|wardrobe|knitwear|outerwear|cotton|weave|cut|fit guide)/i.test(lower)) {
    return DOMAINS.FASHION;
  }

  // 2. HOSPITALITY & CULINARY (Require explicit dining/food terms; do NOT match bare "table")
  if (/(restaurant|food|dining|cuisine|culinary|chef|bistro|cafe|bakery|coffee|eatery|pizza|pizzeria|burger|pasta|taco|hospitality|kitchen|menu|dish|dishes|brewery|bar(?!code|chart)|cocktail|wine|diner|breakfast|lunch|dinner|tasting menu|dining table)/i.test(lower)) {
    return DOMAINS.HOSPITALITY;
  }

  // 3. DEVELOPER TOOLS & SAAS
  if (/(sql|database|rust|in-memory|backend|api|infrastructure|dev|developer|compiler|cloud|devops|kubernetes|linux|saas|terminal|cli|software|b2b saas|sdk|platform)/i.test(lower)) {
    return DOMAINS.DEVELOPER;
  }

  // 4. WELLNESS & HEALTH
  if (/(fitness|wellness|health|gym|workout|yoga|longevity|nutrition|mental health|therapy|meditation|supplement|skincare)/i.test(lower)) {
    return DOMAINS.WELLNESS;
  }

  // 5. CAREER & PROFESSIONAL
  if (/(resume|cv|career|job|hiring|recruiting|portfolio|interview|candidate|ats)/i.test(lower)) {
    return DOMAINS.CAREER;
  }

  // 6. CREATIVE & AGENCY
  if (/(creative|agency|design studio|animation|film|music|video|branding agency|photography)/i.test(lower)) {
    return DOMAINS.CREATIVE;
  }

  return DOMAINS.GENERAL;
}

/**
 * Detect family dining intent from text.
 * Strictly requires culinary/food context so non-food family businesses aren't treated as restaurants.
 * @param {string} text
 * @returns {boolean}
 */
export function isFamilyIntent(text = '') {
  const lower = String(text).toLowerCase();
  const isFoodContext = /(restaurant|dining|food|pizza|pizzeria|bistro|cafe|eatery|kitchen|diner|meal|menu|chef)/i.test(lower);
  const isFamilyKeywords = /(family|kid|child|children|toddler|parent|all-ages|all ages|multi-generation|high chair|soccer team)/i.test(lower);
  return Boolean(isFoodContext && isFamilyKeywords);
}
