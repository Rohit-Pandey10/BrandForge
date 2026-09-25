# Graph Report - brand-builder  (2026-09-25)

## Corpus Check
- 55 files · ~37,967 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: .example 2, (none) 1, .css 1)

## Summary
- 412 nodes · 643 edges · 20 communities (15 shown, 5 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 32 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e015dbd1`
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
- BrandKitDashboard.jsx
- shared/domainConfig.js
- B. Authentication API (`/api/auth`)
- server/package.json
- package.json
- scripts
- vite.config.js

## God Nodes (most connected - your core abstractions)
1. `classifyDomain()` - 13 edges
2. `isFamilyIntent()` - 12 edges
3. `getMockQuestion()` - 12 edges
4. `getMockBatch()` - 12 edges
5. `useAuth()` - 11 edges
6. `getMockBrandKit()` - 11 edges
7. `scripts` - 10 edges
8. `generateNextQuestion()` - 10 edges
9. `compileBrandKit()` - 9 edges
10. `generateInterviewBatch()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `2. Active Pipeline State Machine` --references--> `AuthModal()`  [INFERRED]
  DEVSTATE.md → client/src/components/AuthModal.jsx
- `Backend Engineering:` --references--> `requireAuth()`  [INFERRED]
  DEVSTATE.md → server/middleware/authMiddleware.js
- `3. Synthesize Brand Kit (`POST /api/interview/compile`)` --references--> `BrandKit`  [INFERRED]
  DEVSTATE.md → client/src/types/brand.ts
- `2. Component-to-API Dependency Matrix` --references--> `BrandKit`  [INFERRED]
  graphify/architecture.graph.md → client/src/types/brand.ts
- `2. Component-to-API Dependency Matrix` --references--> `QuestionResponse`  [INFERRED]
  graphify/architecture.graph.md → client/src/types/brand.ts

## Import Cycles
- None detected.

## Communities (20 total, 5 thin omitted)

### Community 0 - "App.jsx"
Cohesion: 0.08
Nodes (36): App(), AuthModal(), ConceptSelector(), LivePreviewTab(), Header(), IntakeView(), InterviewChat(), ProgressStepper() (+28 more)

### Community 1 - "mockEngine.js"
Cohesion: 0.07
Nodes (56): 4. Completed Sprint Checklists, Backend Engineering:, Phase 7: Strategic Prompt Overhaul & Anti-Cliché Architecture:, brandNamesWithAmpersand, testQueries, server_controllers_interviewercontroller_extractdomain, handleCompileBrandKit(), handleExpandPitch() (+48 more)

### Community 2 - "client/package.json"
Cohesion: 0.06
Nodes (32): dependencies, lucide-react, react, react-dom, @react-oauth/google, devDependencies, autoprefixer, postcss (+24 more)

### Community 3 - "brand.ts"
Cohesion: 0.11
Nodes (17): BrandKit, BrandStrategy, ChatMessage, ColorRole, ColorToken, LaunchContent, QuestionResponse, TypographyTokens (+9 more)

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

### Community 9 - "BrandKitDashboard.jsx"
Cohesion: 0.18
Nodes (16): BrandKitDashboard(), TABS, BrandStrategyTab(), LaunchCopyTab(), getContrastVsWhite(), VIEWPORT_SIZES, VisualTokensTab(), wcagLevel() (+8 more)

### Community 10 - "shared/domainConfig.js"
Cohesion: 0.33
Nodes (3): DOMAINS, extractClientDomain, isClientFamilyIntent

### Community 14 - "B. Authentication API (`/api/auth`)"
Cohesion: 0.11
Nodes (17): 1. Expand Raw Pitch (`POST /api/interview/expand-pitch`), 1. Fetch Saved Sessions (`GET /api/brands`), 1. Project Overview & Sprint Status, 1. Register (`POST /api/auth/register`), 2. Active Pipeline State Machine, 2. Login (`POST /api/auth/login`), 2. Save Active Brand (`POST /api/brands`), 2. Start Interview (`POST /api/interview/start`) (+9 more)

### Community 16 - "server/package.json"
Cohesion: 0.06
Nodes (30): dependencies, bcryptjs, cors, dotenv, express, google-auth-library, @google/genai, groq-sdk (+22 more)

### Community 17 - "package.json"
Cohesion: 0.05
Nodes (39): author, description, devDependencies, autoprefixer, concurrently, nodemon, postcss, tailwindcss (+31 more)

### Community 18 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, build:client, dev, dev:client, dev:server, install:all, test, test:health (+2 more)

## Knowledge Gaps
- **188 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+183 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 223 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `DEVSTATE.md — AI Agent Runtime & Architecture State` connect `B. Authentication API (`/api/auth`)` to `mockEngine.js`?**
  _High betweenness centrality (0.214) - this node is a cross-community bridge._
- **Why does `4. Completed Sprint Checklists` connect `mockEngine.js` to `B. Authentication API (`/api/auth`)`?**
  _High betweenness centrality (0.182) - this node is a cross-community bridge._
- **Why does `2. Active Pipeline State Machine` connect `B. Authentication API (`/api/auth`)` to `App.jsx`?**
  _High betweenness centrality (0.155) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _188 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0803633822501747 - nodes in this community are weakly interconnected._
- **Should `mockEngine.js` be split into smaller, more focused modules?**
  _Cohesion score 0.07459207459207459 - nodes in this community are weakly interconnected._
- **Should `client/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06060606060606061 - nodes in this community are weakly interconnected._