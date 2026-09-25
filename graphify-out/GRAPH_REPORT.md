# Graph Report - brand-builder  (2026-09-26)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 449 nodes · 733 edges · 30 communities (24 shown, 6 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 32 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `444784cf`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- server.js
- App.jsx
- interviewService.js
- BrandKitDashboard.jsx
- mockEngine.js
- 4. Completed Sprint Checklists
- brand.ts
- package.json
- server/package.json
- client/package.json
- LivePreviewTab.jsx
- dependencies
- scripts
- devDependencies
- Brand Builder ⚡
- dependencies
- DESIGN.md — Handhold Editorial Design System
- devDependencies
- vercel.json
- geminiClient.js
- shared/domainConfig.js
- dependencies
- scripts
- vite.config.js
- scripts
- client_src_data_mockbranddata_extractclientdomain

## God Nodes (most connected - your core abstractions)
1. `classifyDomain()` - 13 edges
2. `getMockBatch()` - 13 edges
3. `getMockBrandKit()` - 13 edges
4. `getMockQuestion()` - 13 edges
5. `isFamilyIntent()` - 12 edges
6. `scripts` - 12 edges
7. `useAuth()` - 11 edges
8. `generateNextQuestion()` - 10 edges
9. `compileBrandKit()` - 9 edges
10. `expandRawPitch()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `Backend Engineering:` --references--> `requireAuth()`  [INFERRED]
  DEVSTATE.md → server/middleware/authMiddleware.js
- `2. Active Pipeline State Machine` --references--> `AuthModal()`  [INFERRED]
  DEVSTATE.md → client/src/components/AuthModal.jsx
- `Phase 7: Strategic Prompt Overhaul & Anti-Cliché Architecture:` --references--> `_beverageKit()`  [INFERRED]
  DEVSTATE.md → server/services/mockEngine.js
- `3. Synthesize Brand Kit (`POST /api/interview/compile`)` --references--> `BrandKit`  [INFERRED]
  DEVSTATE.md → client/src/types/brand.ts
- `2. Component-to-API Dependency Matrix` --references--> `BrandKit`  [INFERRED]
  graphify/architecture.graph.md → client/src/types/brand.ts

## Import Cycles
- None detected.

## Communities (30 total, 6 thin omitted)

### Community 0 - "server.js"
Cohesion: 0.06
Nodes (43): ref_bcryptjs, ref_child_process, ref_cors, ref_dotenv, ref_express, ref_fs, ref_google_auth_library, ref_jsonwebtoken (+35 more)

### Community 1 - "App.jsx"
Cohesion: 0.08
Nodes (38): App(), AuthModal(), ConceptSelector(), Header(), IntakeView(), PRESET_PITCHES, InterviewChat(), MethodologyModal() (+30 more)

### Community 2 - "interviewService.js"
Cohesion: 0.10
Nodes (38): Backend Engineering:, ref_google_genai, ref_groq_sdk, brandNamesWithAmpersand, testQueries, server_controllers_interviewercontroller_extractdomain, handleCompileBrandKit(), handleExpandPitch() (+30 more)

### Community 3 - "BrandKitDashboard.jsx"
Cohesion: 0.13
Nodes (25): AiMvpBuilderView(), BrandKitDashboard(), TABS, BrandStrategyTab(), LaunchCopyTab(), PrintBrandDossier(), getContrastVsWhite(), VIEWPORT_SIZES (+17 more)

### Community 4 - "mockEngine.js"
Cohesion: 0.14
Nodes (27): DOMAINS, _beverageBatch(), _beverageKit(), _beverageQuestion(), _burgerBatch(), _burgerKit(), _careerBatch(), _careerKit() (+19 more)

### Community 5 - "4. Completed Sprint Checklists"
Cohesion: 0.09
Nodes (21): 1. Expand Raw Pitch (`POST /api/interview/expand-pitch`), 1. Fetch Saved Sessions (`GET /api/brands`), 1. Project Overview & Sprint Status, 1. Register (`POST /api/auth/register`), 2. Active Pipeline State Machine, 2. Login (`POST /api/auth/login`), 2. Save Active Brand (`POST /api/brands`), 2. Start Interview (`POST /api/interview/start`) (+13 more)

### Community 6 - "brand.ts"
Cohesion: 0.11
Nodes (17): BrandKit, BrandStrategy, ChatMessage, ColorRole, ColorToken, LaunchContent, QuestionResponse, TypographyTokens (+9 more)

### Community 7 - "package.json"
Cohesion: 0.11
Nodes (17): author, description, cors, express, mongoose, nodemon, postcss, react (+9 more)

### Community 8 - "server/package.json"
Cohesion: 0.11
Nodes (17): bcryptjs, dotenv, google-auth-library, @google/genai, groq-sdk, jsonwebtoken, description, devDependencies (+9 more)

### Community 9 - "client/package.json"
Cohesion: 0.12
Nodes (15): postcss, react, vite, name, private, type, version, autoprefixer (+7 more)

### Community 10 - "LivePreviewTab.jsx"
Cohesion: 0.19
Nodes (7): getContrastColor(), HospitalityPreview(), isDarkColor(), LivePreviewTab(), resolveArchetype(), RetailCpgPreview(), RitualSteps()

### Community 11 - "dependencies"
Cohesion: 0.14
Nodes (14): dependencies, bcryptjs, cors, dotenv, express, google-auth-library, @google/genai, groq-sdk (+6 more)

### Community 12 - "scripts"
Cohesion: 0.17
Nodes (12): scripts, build, build:client, dev, dev:client, dev:server, install:all, test (+4 more)

### Community 13 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, autoprefixer, concurrently, nodemon, postcss, tailwindcss, @types/react, @types/react-dom (+3 more)

### Community 14 - "Brand Builder ⚡"
Cohesion: 0.20
Nodes (9): 1. Clone & Install Dependencies, 2. Configure Environment (Optional for Live Gemini API), 3. Run Development Servers, Brand Builder ⚡, 🎨 Interactive Features, 👥 Multi-Agent & Teammate Tooling, 🚀 Overview, ⚡ Quickstart (+1 more)

### Community 15 - "dependencies"
Cohesion: 0.20
Nodes (10): dependencies, bcryptjs, cors, dotenv, express, google-auth-library, @google/genai, groq-sdk (+2 more)

### Community 16 - "DESIGN.md — Handhold Editorial Design System"
Cohesion: 0.22
Nodes (8): 1. Color Palette (Zero Chromatic Noise — Strict Monochrome), 2. Typography Contract (Two Fonts, Two Weights Only), 3. Geometry, Shapes & Elevation, 4. Component Manifest, Body & Interface, Critical Rules:, DESIGN.md — Handhold Editorial Design System, Display Headlines

### Community 17 - "devDependencies"
Cohesion: 0.25
Nodes (8): devDependencies, autoprefixer, postcss, tailwindcss, @types/react, @types/react-dom, vite, @vitejs/plugin-react

### Community 18 - "vercel.json"
Cohesion: 0.25
Nodes (7): maxDuration, buildCommand, functions, api/index.js, outputDirectory, rewrites, version

### Community 19 - "geminiClient.js"
Cohesion: 0.48
Nodes (6): CANDIDATE_MODELS, cleanJsonString(), generateStructuredJson(), getGeminiClient(), isTransientError(), sleep()

### Community 20 - "shared/domainConfig.js"
Cohesion: 0.33
Nodes (3): DOMAINS, extractClientDomain, isClientFamilyIntent

### Community 21 - "dependencies"
Cohesion: 0.40
Nodes (5): dependencies, lucide-react, react, react-dom, @react-oauth/google

### Community 22 - "scripts"
Cohesion: 0.50
Nodes (4): scripts, build, dev, preview

### Community 24 - "scripts"
Cohesion: 0.67
Nodes (3): scripts, dev, start

## Knowledge Gaps
- **171 isolated node(s):** `BrandStrategy`, `ChatMessage`, `ColorRole`, `ColorToken`, `LaunchContent` (+166 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 210 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `4. Completed Sprint Checklists` connect `4. Completed Sprint Checklists` to `interviewService.js`?**
  _High betweenness centrality (0.208) - this node is a cross-community bridge._
- **Why does `2. Active Pipeline State Machine` connect `4. Completed Sprint Checklists` to `App.jsx`?**
  _High betweenness centrality (0.190) - this node is a cross-community bridge._
- **What connects `BrandStrategy`, `ChatMessage`, `ColorRole` to the rest of the system?**
  _171 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `server.js` be split into smaller, more focused modules?**
  _Cohesion score 0.056866303690260134 - nodes in this community are weakly interconnected._
- **Should `App.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07706766917293233 - nodes in this community are weakly interconnected._
- **Should `interviewService.js` be split into smaller, more focused modules?**
  _Cohesion score 0.09663120567375887 - nodes in this community are weakly interconnected._
- **Should `BrandKitDashboard.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1268939393939394 - nodes in this community are weakly interconnected._