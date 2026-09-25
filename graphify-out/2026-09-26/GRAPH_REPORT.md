# Graph Report - brand-builder  (2026-09-25)

## Corpus Check
- 55 files · ~40,570 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: .example 2, (none) 1, .css 1)

## Summary
- 418 nodes · 646 edges · 23 communities (17 shown, 6 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 32 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `18420daa`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- App.jsx
- interviewService.js
- client/package.json
- run-dev.js
- scripts
- dependencies
- Brand Builder ⚡
- resilientStore.js
- DESIGN.md — Handhold Editorial Design System
- exportUtils.js
- shared/domainConfig.js
- brand.ts
- server/package.json
- package.json
- mockEngine.js
- vite.config.js
- geminiClient.js
- LivePreviewTab.jsx
- client_src_data_mockbranddata_extractclientdomain

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

## Communities (23 total, 6 thin omitted)

### Community 0 - "App.jsx"
Cohesion: 0.08
Nodes (37): App(), AuthModal(), TABS, ConceptSelector(), BrandStrategyTab(), LaunchCopyTab(), Header(), IntakeView() (+29 more)

### Community 1 - "interviewService.js"
Cohesion: 0.10
Nodes (36): Backend Engineering:, ref_google_genai, ref_groq_sdk, brandNamesWithAmpersand, testQueries, server_controllers_interviewercontroller_extractdomain, handleCompileBrandKit(), handleExpandPitch() (+28 more)

### Community 2 - "client/package.json"
Cohesion: 0.06
Nodes (32): dependencies, lucide-react, react, react-dom, @react-oauth/google, devDependencies, autoprefixer, postcss (+24 more)

### Community 3 - "run-dev.js"
Cohesion: 0.20
Nodes (8): ref_child_process, ref_path, ref_url, client, __dirname, __filename, rootDir, server

### Community 4 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, build:client, dev, dev:client, dev:server, install:all, test, test:health (+2 more)

### Community 5 - "dependencies"
Cohesion: 0.14
Nodes (14): dependencies, bcryptjs, cors, dotenv, express, google-auth-library, @google/genai, groq-sdk (+6 more)

### Community 6 - "Brand Builder ⚡"
Cohesion: 0.20
Nodes (9): 1. Clone & Install Dependencies, 2. Configure Environment (Optional for Live Gemini API), 3. Run Development Servers, Brand Builder ⚡, 🎨 Interactive Features, 👥 Multi-Agent & Teammate Tooling, 🚀 Overview, ⚡ Quickstart (+1 more)

### Community 7 - "resilientStore.js"
Cohesion: 0.07
Nodes (36): ref_bcryptjs, ref_cors, ref_dotenv, ref_express, ref_fs, ref_google_auth_library, ref_jsonwebtoken, ref_mongoose (+28 more)

### Community 8 - "DESIGN.md — Handhold Editorial Design System"
Cohesion: 0.22
Nodes (8): 1. Color Palette (Zero Chromatic Noise — Strict Monochrome), 2. Typography Contract (Two Fonts, Two Weights Only), 3. Geometry, Shapes & Elevation, 4. Component Manifest, Body & Interface, Critical Rules:, DESIGN.md — Handhold Editorial Design System, Display Headlines

### Community 9 - "exportUtils.js"
Cohesion: 0.27
Nodes (12): BrandKitDashboard(), getContrastVsWhite(), VIEWPORT_SIZES, VisualTokensTab(), wcagLevel(), buildCssTokens(), buildPaletteSvg(), cleanXml() (+4 more)

### Community 10 - "shared/domainConfig.js"
Cohesion: 0.33
Nodes (3): DOMAINS, extractClientDomain, isClientFamilyIntent

### Community 14 - "brand.ts"
Cohesion: 0.05
Nodes (37): BrandKit, BrandStrategy, ChatMessage, ColorRole, ColorToken, LaunchContent, QuestionResponse, TypographyTokens (+29 more)

### Community 16 - "server/package.json"
Cohesion: 0.06
Nodes (30): dependencies, bcryptjs, cors, dotenv, express, google-auth-library, @google/genai, groq-sdk (+22 more)

### Community 17 - "package.json"
Cohesion: 0.05
Nodes (39): author, description, devDependencies, autoprefixer, concurrently, nodemon, postcss, tailwindcss (+31 more)

### Community 18 - "mockEngine.js"
Cohesion: 0.14
Nodes (25): Phase 7: Strategic Prompt Overhaul & Anti-Cliché Architecture:, DOMAINS, _beverageBatch(), _beverageKit(), _beverageQuestion(), _careerBatch(), _careerKit(), _careerQuestion() (+17 more)

### Community 20 - "geminiClient.js"
Cohesion: 0.48
Nodes (6): CANDIDATE_MODELS, cleanJsonString(), generateStructuredJson(), getGeminiClient(), isTransientError(), sleep()

### Community 21 - "LivePreviewTab.jsx"
Cohesion: 0.32
Nodes (3): getContrastColor(), LivePreviewTab(), resolveArchetype()

## Knowledge Gaps
- **190 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+185 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 226 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `4. Completed Sprint Checklists` connect `brand.ts` to `interviewService.js`, `mockEngine.js`?**
  _High betweenness centrality (0.187) - this node is a cross-community bridge._
- **Why does `2. Active Pipeline State Machine` connect `brand.ts` to `App.jsx`?**
  _High betweenness centrality (0.156) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _190 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08148148148148149 - nodes in this community are weakly interconnected._
- **Should `interviewService.js` be split into smaller, more focused modules?**
  _Cohesion score 0.10241545893719807 - nodes in this community are weakly interconnected._
- **Should `client/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06060606060606061 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._