# Graph Report - brand-builder  (2026-09-24)

## Corpus Check
- 27 files · ~20,121 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: .example 2, (none) 1, .css 1)

## Summary
- 183 nodes · 247 edges · 14 communities (11 shown, 3 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 11 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e5f1fdbd`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- App.jsx
- interviewerController.js
- client/package.json
- brand.ts
- server/package.json
- package.json
- Brand Builder ⚡
- run-dev.js
- DESIGN.md — Handhold Editorial Design System
- DEVSTATE.md — AI Agent Runtime & Architecture State
- devDependencies

## God Nodes (most connected - your core abstractions)
1. `react` - 8 edges
2. `handleNextQuestion()` - 8 edges
3. `handleCompileBrandKit()` - 8 edges
4. `generateStructuredJson()` - 8 edges
5. `scripts` - 7 edges
6. `extractDomain()` - 7 edges
7. `isFamilyIntent()` - 6 edges
8. `getGeminiClient()` - 6 edges
9. `Brand Builder ⚡` - 6 edges
10. `lucide-react` - 5 edges

## Surprising Connections (you probably didn't know these)
- `1. Project Overview & Sprint Status` --references--> `extractDomain()`  [INFERRED]
  DEVSTATE.md → server/controllers/interviewerController.js
- `Frontend Developer Agent:` --references--> `BrandKitDashboard()`  [INFERRED]
  DEVSTATE.md → client/src/components/BrandKitDashboard.jsx
- `Frontend Developer Agent:` --references--> `IntakeView()`  [INFERRED]
  DEVSTATE.md → client/src/components/IntakeView.jsx
- `Frontend Developer Agent:` --references--> `InterviewChat()`  [INFERRED]
  DEVSTATE.md → client/src/components/InterviewChat.jsx
- `Frontend Developer Agent:` --references--> `ProgressStepper()`  [INFERRED]
  DEVSTATE.md → client/src/components/ProgressStepper.jsx

## Import Cycles
- None detected.

## Communities (14 total, 3 thin omitted)

### Community 0 - "App.jsx"
Cohesion: 0.14
Nodes (23): App(), BrandKitDashboard(), cleanXml(), Header(), IntakeView(), InterviewChat(), BASE_STAGES, ProgressStepper() (+15 more)

### Community 1 - "interviewerController.js"
Cohesion: 0.15
Nodes (22): dotenv, express, brandNamesWithAmpersand, testQueries, brandKitSchema, extractDomain(), getDomainGuidance(), getMockBrandKit() (+14 more)

### Community 2 - "client/package.json"
Cohesion: 0.10
Nodes (19): dependencies, lucide-react, react, react-dom, name, private, scripts, build (+11 more)

### Community 3 - "brand.ts"
Cohesion: 0.11
Nodes (17): BrandKit, BrandStrategy, ChatMessage, ColorRole, ColorToken, LaunchContent, QuestionResponse, TypographyTokens (+9 more)

### Community 4 - "server/package.json"
Cohesion: 0.11
Nodes (18): cors, @google/genai, nodemon, dependencies, cors, dotenv, express, @google/genai (+10 more)

### Community 5 - "package.json"
Cohesion: 0.14
Nodes (13): author, description, keywords, license, name, scripts, build:client, dev (+5 more)

### Community 6 - "Brand Builder ⚡"
Cohesion: 0.20
Nodes (9): 1. Clone & Install Dependencies, 2. Configure Environment (Optional for Live Gemini API), 3. Run Development Servers, Brand Builder ⚡, 🎨 Interactive Features, 👥 Multi-Agent & Teammate Tooling, 🚀 Overview, ⚡ Quickstart (+1 more)

### Community 7 - "run-dev.js"
Cohesion: 0.20
Nodes (8): ref_child_process, ref_path, ref_url, client, __dirname, __filename, rootDir, server

### Community 8 - "DESIGN.md — Handhold Editorial Design System"
Cohesion: 0.22
Nodes (8): 1. Color Palette (Zero Chromatic Noise — Strict Monochrome), 2. Typography Contract (Two Fonts, Two Weights Only), 3. Geometry, Shapes & Elevation, 4. Component Manifest, Body & Interface, Critical Rules:, DESIGN.md — Handhold Editorial Design System, Display Headlines

### Community 9 - "DEVSTATE.md — AI Agent Runtime & Architecture State"
Cohesion: 0.22
Nodes (8): 1. Project Overview & Sprint Status, 3. Implemented Schemas & JSON Contracts, 4. Known Blockers & Next Actions for AI Agents, A. Question Schema (`questionSchema`), B. Brand Kit Schema (`brandKitSchema`), Backend Developer Agent:, Demo & Presentation Agent:, DEVSTATE.md — AI Agent Runtime & Architecture State

### Community 10 - "devDependencies"
Cohesion: 0.25
Nodes (8): devDependencies, autoprefixer, postcss, tailwindcss, @types/react, @types/react-dom, vite, @vitejs/plugin-react

## Knowledge Gaps
- **92 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+87 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 107 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `DEVSTATE.md — AI Agent Runtime & Architecture State` connect `DEVSTATE.md — AI Agent Runtime & Architecture State` to `brand.ts`?**
  _High betweenness centrality (0.343) - this node is a cross-community bridge._
- **Why does `4. Known Blockers & Next Actions for AI Agents` connect `DEVSTATE.md — AI Agent Runtime & Architecture State` to `App.jsx`?**
  _High betweenness centrality (0.278) - this node is a cross-community bridge._
- **Why does `Frontend Developer Agent:` connect `App.jsx` to `DEVSTATE.md — AI Agent Runtime & Architecture State`?**
  _High betweenness centrality (0.269) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _92 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13763440860215054 - nodes in this community are weakly interconnected._
- **Should `client/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `brand.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._