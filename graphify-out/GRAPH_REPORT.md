# Graph Report - FounderEditor  (2026-09-24)

## Corpus Check
- Corpus is ~22,834 words - fits in a single context window. You may not need a graph.

## Summary
- 172 nodes · 254 edges · 11 communities
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.81)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- React UI Components
- TypeScript Config & Toolchain
- Brand Builder App & Socratic Interview
- Gemini AI Service (TS)
- Dev Dependencies
- Runtime Dependencies
- Brand Design Systems
- Express Server & API Routes
- Build Scripts & Package

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `playPillClickSound()` - 9 edges
3. `Handhold Style Reference` - 8 edges
4. `BrandKit` - 7 edges
5. `Handshake Style Reference` - 7 edges
6. `scripts` - 6 edges
7. `QuestionResponse` - 6 edges
8. `DEVSTATE — AI Agent Runtime & Architecture State` - 6 edges
9. `Brand Kit Schema (brandKitSchema) — POST /api/interview/compile` - 6 edges
10. `getNextQuestion()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `Visual Tokens Entity (palette, typography, stylePhilosophy, borderCurvature)` --semantically_similar_to--> `Handshake Style Reference`  [INFERRED] [semantically similar]
  message.txt → DESIGN(handshake).md
- `Visual Tokens Entity (palette, typography, stylePhilosophy, borderCurvature)` --semantically_similar_to--> `Handhold Style Reference`  [INFERRED] [semantically similar]
  message.txt → DESIGN.md
- `Google Fonts Loading (Cormorant Garamond, EB Garamond, Inter, Newsreader, JetBrains Mono)` --semantically_similar_to--> `Inter Typography System`  [INFERRED] [semantically similar]
  index.html → DESIGN.md
- `bureauSerif Typography System` --semantically_similar_to--> `SansPlomb Display Typography`  [INFERRED] [semantically similar]
  DESIGN.md → DESIGN(handshake).md
- `Monochrome + Single Accent Design Pattern` --semantically_similar_to--> `Zero Chromatic Color Principle`  [INFERRED] [semantically similar]
  DESIGN(handshake).md → DESIGN.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Brand Builder Socratic Interview Flow** — message_stage1_intake_icp, message_stage2_differentiation, message_stage3_attitude_edge, message_stage4_brand_kit_synthesis [EXTRACTED 1.00]
- **Handhold Editorial Design System** — design_md_bureauserif_typography, design_md_inter_typography, design_md_zero_chromatic_color_principle, design_md_shadow_free_elevation_principle, design_md_paper_cream_canvas [EXTRACTED 1.00]
- **Handshake Chromatic Identity System** — design_handshake__voltage_lime_design_token, design_handshake__hero_gradient_banner, design_handshake__monochrome_plus_one_accent_pattern, design_handshake__sansplomb_typography [EXTRACTED 1.00]

## Communities (11 total, 0 thin omitted)

### Community 0 - "React UI Components"
Cohesion: 0.11
Nodes (26): App(), AnnouncementBar(), AnnouncementBarProps, ApiKeyModal(), ApiKeyModalProps, BrandKitDashboard(), BrandKitDashboardProps, InterviewChat() (+18 more)

### Community 1 - "TypeScript Config & Toolchain"
Cohesion: 0.09
Nodes (22): DOM, DOM.Iterable, ES2020, src, vite.config.ts, compilerOptions, allowImportingTsExtensions, isolatedModules (+14 more)

### Community 2 - "Brand Builder App & Socratic Interview"
Cohesion: 0.13
Nodes (19): Brand Builder App (index.html), Google Fonts Loading (Cormorant Garamond, EB Garamond, Inter, Newsreader, JetBrains Mono), Main TSX Entrypoint (/src/main.tsx), Socratic Brand Interviewer & Token Synthesizer, Brand Builder Project (Socratic Brand Interviewer & Token Synthesizer), Brand Kit Schema (brandKitSchema) — POST /api/interview/compile, Brand Strategy Entity (brandName, tagline, mission, targetAudience, coreValueProposition, antiHero, differentiator), DEVSTATE — AI Agent Runtime & Architecture State (+11 more)

### Community 3 - "Gemini AI Service (TS)"
Cohesion: 0.20
Nodes (14): CompileBrandKitParams, NextQuestionParams, compileBrandKit(), getNextQuestion(), retryWithBackoff(), PresetPitch, PresetRound, generateGenericMockBrandKit() (+6 more)

### Community 4 - "Dev Dependencies"
Cohesion: 0.12
Nodes (17): devDependencies, @types/cors, @types/express, @types/node, @types/react, @types/react-dom, typescript, vite (+9 more)

### Community 5 - "Runtime Dependencies"
Cohesion: 0.13
Nodes (15): cors, dotenv, express, @google/genai, lucide-react, dependencies, cors, dotenv (+7 more)

### Community 6 - "Brand Design Systems"
Cohesion: 0.19
Nodes (15): Handshake Style Reference, Hero Gradient Banner Component, Monochrome + Single Accent Design Pattern, NoiGrotesk Typography System, Pillow-Soft Border Radius System, SansPlomb Display Typography, Voltage Lime (#d3fb52) Design Token, bureauSerif Typography System (+7 more)

### Community 7 - "Express Server & API Routes"
Cohesion: 0.29
Nodes (10): compileBrandKit(), getNextQuestion(), retryWithBackoff(), app, __dirname, distPath, __filename, generateGenericMockBrandKit() (+2 more)

### Community 8 - "Build Scripts & Package"
Cohesion: 0.18
Nodes (10): name, private, scripts, build, dev, preview, server, start (+2 more)

## Knowledge Gaps
- **67 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+62 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Dev Dependencies` to `Build Scripts & Package`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Runtime Dependencies` to `Build Scripts & Package`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _67 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `React UI Components` be split into smaller, more focused modules?**
  _Cohesion score 0.10952380952380952 - nodes in this community are weakly interconnected._
- **Should `TypeScript Config & Toolchain` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._
- **Should `Brand Builder App & Socratic Interview` be split into smaller, more focused modules?**
  _Cohesion score 0.13450292397660818 - nodes in this community are weakly interconnected._
- **Should `Dev Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._