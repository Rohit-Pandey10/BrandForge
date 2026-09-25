# Graph Report - brand-builder  (2026-09-25)

## Corpus Check
- 42 files · ~28,896 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: .example 2, (none) 1, .css 1)

## Summary
- 316 nodes · 469 edges · 20 communities (15 shown, 5 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 13 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `fad76479`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- BrandKitDashboard.jsx
- interviewService.js
- client/package.json
- brand.ts
- server.js
- scripts
- Brand Builder ⚡
- run-dev.js
- DESIGN.md — Handhold Editorial Design System
- mockBrandData.js
- shared/domainConfig.js
- mockEngine.js
- server/package.json
- package.json
- devDependencies
- vite.config.js

## God Nodes (most connected - your core abstractions)
1. `classifyDomain()` - 12 edges
2. `isFamilyIntent()` - 12 edges
3. `getMockQuestion()` - 11 edges
4. `getMockBatch()` - 11 edges
5. `scripts` - 10 edges
6. `generateNextQuestion()` - 10 edges
7. `getMockBrandKit()` - 10 edges
8. `compileBrandKit()` - 9 edges
9. `generateInterviewBatch()` - 9 edges
10. `extractClientDomain` - 7 edges

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

## Communities (20 total, 5 thin omitted)

### Community 0 - "BrandKitDashboard.jsx"
Cohesion: 0.18
Nodes (16): BrandKitDashboard(), TABS, BrandStrategyTab(), LaunchCopyTab(), getContrastVsWhite(), VIEWPORT_SIZES, VisualTokensTab(), wcagLevel() (+8 more)

### Community 1 - "interviewService.js"
Cohesion: 0.18
Nodes (22): brandNamesWithAmpersand, testQueries, server_controllers_interviewercontroller_extractdomain, handleCompileBrandKit(), handleNextQuestion(), handleStartInterview(), validateHistory(), classifyDomain() (+14 more)

### Community 2 - "client/package.json"
Cohesion: 0.06
Nodes (30): dependencies, lucide-react, react, react-dom, devDependencies, autoprefixer, postcss, tailwindcss (+22 more)

### Community 3 - "brand.ts"
Cohesion: 0.07
Nodes (25): BrandKit, BrandStrategy, ChatMessage, ColorRole, ColorToken, LaunchContent, QuestionResponse, TypographyTokens (+17 more)

### Community 4 - "server.js"
Cohesion: 0.13
Nodes (17): ref_cors, ref_dotenv, ref_express, ref_google_genai, ref_groq_sdk, router, allowedOrigins, app (+9 more)

### Community 5 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, build:client, dev, dev:client, dev:server, install:all, test, test:health (+2 more)

### Community 6 - "Brand Builder ⚡"
Cohesion: 0.20
Nodes (9): 1. Clone & Install Dependencies, 2. Configure Environment (Optional for Live Gemini API), 3. Run Development Servers, Brand Builder ⚡, 🎨 Interactive Features, 👥 Multi-Agent & Teammate Tooling, 🚀 Overview, ⚡ Quickstart (+1 more)

### Community 7 - "run-dev.js"
Cohesion: 0.20
Nodes (8): ref_child_process, ref_path, ref_url, client, __dirname, __filename, rootDir, server

### Community 8 - "DESIGN.md — Handhold Editorial Design System"
Cohesion: 0.22
Nodes (8): 1. Color Palette (Zero Chromatic Noise — Strict Monochrome), 2. Typography Contract (Two Fonts, Two Weights Only), 3. Geometry, Shapes & Elevation, 4. Component Manifest, Body & Interface, Critical Rules:, DESIGN.md — Handhold Editorial Design System, Display Headlines

### Community 9 - "mockBrandData.js"
Cohesion: 0.09
Nodes (28): App(), LivePreviewTab(), Header(), IntakeView(), InterviewChat(), ProgressStepper(), SEVEN_STAGES, classifyDomain() (+20 more)

### Community 10 - "shared/domainConfig.js"
Cohesion: 0.33
Nodes (3): DOMAINS, extractClientDomain, isClientFamilyIntent

### Community 14 - "mockEngine.js"
Cohesion: 0.17
Nodes (21): DOMAINS, _careerBatch(), _careerKit(), _careerQuestion(), _developerBatch(), _developerKit(), _developerQuestion(), _familyBatch() (+13 more)

### Community 16 - "server/package.json"
Cohesion: 0.09
Nodes (22): dependencies, cors, dotenv, express, @google/genai, groq-sdk, description, devDependencies (+14 more)

### Community 17 - "package.json"
Cohesion: 0.06
Nodes (33): author, dependencies, cors, dotenv, express, @google/genai, groq-sdk, lucide-react (+25 more)

### Community 18 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, autoprefixer, concurrently, nodemon, postcss, tailwindcss, @types/react, @types/react-dom (+2 more)

## Knowledge Gaps
- **149 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+144 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 179 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `4. Known Blockers & Next Actions for AI Agents` connect `brand.ts` to `mockBrandData.js`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Why does `Frontend Developer Agent:` connect `mockBrandData.js` to `BrandKitDashboard.jsx`, `brand.ts`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _149 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `client/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06451612903225806 - nodes in this community are weakly interconnected._
- **Should `brand.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07407407407407407 - nodes in this community are weakly interconnected._
- **Should `server.js` be split into smaller, more focused modules?**
  _Cohesion score 0.13157894736842105 - nodes in this community are weakly interconnected._
- **Should `mockBrandData.js` be split into smaller, more focused modules?**
  _Cohesion score 0.09390243902439024 - nodes in this community are weakly interconnected._