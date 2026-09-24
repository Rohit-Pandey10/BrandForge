/**
 * Domain Configuration — Single Source of Truth
 * 
 * This module provides the keyword matchers, domain names, and structural
 * configuration used by both the server-side controller and client-side
 * mock hydration engine. Any change to domain detection lives here.
 */

export const DOMAINS = {
  HOSPITALITY: 'hospitality',
  FASHION: 'fashion',
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

  if (/(restaurant|food|dining|cuisine|culinary|chef|bistro|cafe|bakery|coffee|eatery|pizza|burger|pasta|taco|hospitality|kitchen|table|menu|dish|bar(?!code|chart)|cocktail)/i.test(lower)) {
    return DOMAINS.HOSPITALITY;
  }
  if (/(fashion|clothing|apparel|wear|luxury|garment|streetwear|shoe|jewelry|bag|textile|tailor|collection)/i.test(lower)) {
    return DOMAINS.FASHION;
  }
  if (/(fitness|wellness|health|gym|workout|yoga|longevity|nutrition|mental health|therapy|meditation|supplement)/i.test(lower)) {
    return DOMAINS.WELLNESS;
  }
  if (/(resume|cv|career|job|hiring|recruiting|portfolio|interview|candidate|ats)/i.test(lower)) {
    return DOMAINS.CAREER;
  }
  if (/(sql|database|rust|in-memory|backend|api|infrastructure|dev|developer|compiler|cloud|devops|kubernetes|linux|saas|terminal|cli|software)/i.test(lower)) {
    return DOMAINS.DEVELOPER;
  }
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
