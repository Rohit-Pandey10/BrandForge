# Graph Report - brand-builder  (2026-09-25)

## Corpus Check
- 54 files · ~34,988 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: .example 2, (none) 1, .css 1)

## Summary
- 387 nodes · 604 edges · 19 communities (14 shown, 5 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 26 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4b29e392`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- App.jsx
- mockEngine.js
- client/package.json
- brand.ts
- llmClient.js
- dependencies
- Brand Builder ⚡
- resilientStore.js
- DESIGN.md — Handhold Editorial Design System
- mockBrandData.js
- shared/domainConfig.js
- server/package.json
- package.json
- devDependencies
- vite.config.js

## God Nodes (most connected - your core abstractions)
1. `classifyDomain()` - 12 edges
2. `isFamilyIntent()` - 12 edges
3. `useAuth()` - 11 edges
4. `getMockQuestion()` - 11 edges
5. `getMockBatch()` - 11 edges
6. `scripts` - 10 edges
7. `generateNextQuestion()` - 10 edges
8. `getMockBrandKit()` - 10 edges
9. `compileBrandKit()` - 9 edges
10. `generateInterviewBatch()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `Frontend Developer Agent:` --references--> `BrandKitDashboard()`  [INFERRED]
  DEVSTATE.md → client/src/components/BrandKitDashboard.jsx
- `Frontend Developer Agent:` --references--> `IntakeView()`  [INFERRED]
  DEVSTATE.md → client/src/components/IntakeView.jsx
- `Frontend Developer Agent:` --references--> `InterviewChat()`  [INFERRED]
  DEVSTATE.md → client/src/components/InterviewChat.jsx
- `Frontend Developer Agent:` --references--> `ProgressStepper()`  [INFERRED]
  DEVSTATE.md → client/src/components/ProgressStepper.jsx
- `2. Active Pipeline State Machine` --references--> `BrandKit`  [INFERRED]
  DEVSTATE.md → client/src/types/brand.ts

## Import Cycles
- None detected.

## Communities (19 total, 5 thin omitted)

### Community 0 - "App.jsx"
Cohesion: 0.10
Nodes (34): App(), AuthModal(), BrandKitDashboard(), TABS, BrandStrategyTab(), LaunchCopyTab(), getContrastVsWhite(), VIEWPORT_SIZES (+26 more)

### Community 1 - "mockEngine.js"
Cohesion: 0.10
Nodes (43): brandNamesWithAmpersand, testQueries, server_controllers_interviewercontroller_extractdomain, handleCompileBrandKit(), handleNextQuestion(), handleStartInterview(), validateHistory(), classifyDomain() (+35 more)

### Community 2 - "client/package.json"
Cohesion: 0.06
Nodes (32): dependencies, lucide-react, react, react-dom, @react-oauth/google, devDependencies, autoprefixer, postcss (+24 more)

### Community 3 - "brand.ts"
Cohesion: 0.07
Nodes (25): BrandKit, BrandStrategy, ChatMessage, ColorRole, ColorToken, LaunchContent, QuestionResponse, TypographyTokens (+17 more)

### Community 4 - "llmClient.js"
Cohesion: 0.23
Nodes (10): ref_google_genai, ref_groq_sdk, CANDIDATE_MODELS, cleanJsonString(), generateStructuredJson(), getGeminiClient(), isTransientError(), sleep() (+2 more)

### Community 5 - "dependencies"
Cohesion: 0.14
Nodes (14): dependencies, bcryptjs, cors, dotenv, express, google-auth-library, @google/genai, groq-sdk (+6 more)

### Community 6 - "Brand Builder ⚡"
Cohesion: 0.20
Nodes (9): 1. Clone & Install Dependencies, 2. Configure Environment (Optional for Live Gemini API), 3. Run Development Servers, Brand Builder ⚡, 🎨 Interactive Features, 👥 Multi-Agent & Teammate Tooling, 🚀 Overview, ⚡ Quickstart (+1 more)

### Community 7 - "resilientStore.js"
Cohesion: 0.06
Nodes (44): ref_bcryptjs, ref_child_process, ref_cors, ref_dotenv, ref_express, ref_fs, ref_google_auth_library, ref_jsonwebtoken (+36 more)

### Community 8 - "DESIGN.md — Handhold Editorial Design System"
Cohesion: 0.22
Nodes (8): 1. Color Palette (Zero Chromatic Noise — Strict Monochrome), 2. Typography Contract (Two Fonts, Two Weights Only), 3. Geometry, Shapes & Elevation, 4. Component Manifest, Body & Interface, Critical Rules:, DESIGN.md — Handhold Editorial Design System, Display Headlines

### Community 9 - "mockBrandData.js"
Cohesion: 0.13
Nodes (17): LivePreviewTab(), classifyDomain(), DOMAINS, extractClientDomain, isClientFamilyIntent, isFamilyIntent(), careerBrandKit, developerBrandKit (+9 more)

### Community 10 - "shared/domainConfig.js"
Cohesion: 0.33
Nodes (3): DOMAINS, extractClientDomain, isClientFamilyIntent

### Community 16 - "server/package.json"
Cohesion: 0.06
Nodes (30): dependencies, bcryptjs, cors, dotenv, express, google-auth-library, @google/genai, groq-sdk (+22 more)

### Community 17 - "package.json"
Cohesion: 0.05
Nodes (39): author, description, autoprefixer, bcryptjs, cors, dotenv, express, google-auth-library (+31 more)

### Community 18 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, autoprefixer, concurrently, nodemon, postcss, tailwindcss, @types/react, @types/react-dom (+2 more)

## Knowledge Gaps
- **178 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+173 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 212 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Frontend Developer Agent:` connect `App.jsx` to `brand.ts`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Why does `4. Known Blockers & Next Actions for AI Agents` connect `brand.ts` to `App.jsx`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _178 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09877551020408164 - nodes in this community are weakly interconnected._
- **Should `mockEngine.js` be split into smaller, more focused modules?**
  _Cohesion score 0.10105580693815988 - nodes in this community are weakly interconnected._
- **Should `client/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06060606060606061 - nodes in this community are weakly interconnected._
- **Should `brand.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07407407407407407 - nodes in this community are weakly interconnected._