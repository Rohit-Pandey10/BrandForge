export interface QuestionResponse {
  isComplete: boolean;
  currentRound: number; // 1, 2, or 3
  question: string;
  suggestedAnswers: string[]; // exactly 3 options
  reasoning: string;
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

export interface ColorSwatch {
  name: string;
  hex: string;
  role: 'primary' | 'secondary' | 'accent' | 'surface' | 'text';
}

export interface VisualTokens {
  palette: ColorSwatch[];
  typography: {
    headingFont: string;
    bodyFont: string;
    googleFontsUrl: string;
  };
  stylePhilosophy: string;
  borderCurvature: string;
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

export interface InterviewStep {
  round: number;
  question: string;
  reasoning: string;
  suggestedAnswers: string[];
  userAnswer?: string;
  selectedOptionIndex?: number;
}

export interface FounderPreset {
  id: string;
  title: string;
  tagline: string;
  pitch: string;
  category: string;
  mockAnswers?: string[];
}
