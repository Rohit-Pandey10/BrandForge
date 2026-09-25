/**
 * Strict TypeScript Interfaces & JSON Data Contracts for BrandLoom
 */

export type ColorRole = 'primary' | 'secondary' | 'accent' | 'surface' | 'text';

export interface ColorToken {
  name: string;
  hex: string;
  role: ColorRole;
}

export interface TypographyTokens {
  headingFont: string;
  bodyFont: string;
  googleFontsUrl: string;
}

export interface VisualTokens {
  palette: ColorToken[];
  typography: TypographyTokens;
  stylePhilosophy: string;
  borderCurvature: string;
}

export interface BrandStrategy {
  brandName: string;
  tagline: string;
  mission: string;
  targetAudience: string;
  coreValueProposition: string;
  antiHero: string;
  differentiator: string;
}

export interface VoiceSystem {
  archetype: string;
  tone: string[];
  dos: string[];
  donts: string[];
  vocabularyWords: string[];
}

export interface LaunchContent {
  heroHeadline: string;
  heroSubheadline: string;
  callToAction: string;
  manifesto: string;
  elevatorPitch: string;
  socialHooks: string[];
}

export interface BrandKit {
  brandStrategy: BrandStrategy;
  voiceSystem: VoiceSystem;
  visualTokens: VisualTokens;
  launchContent: LaunchContent;
}

export interface QuestionResponse {
  isComplete: boolean;
  currentRound: number;
  question: string;
  suggestedAnswers: string[];
  reasoning: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: number;
  reasoning?: string;
  suggestedAnswers?: string[];
}

export type ViewStage = 'intake' | 'interview' | 'dashboard';
