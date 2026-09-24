# Graph Report - brand-builder  (2026-09-24)

## Corpus Check
- 40 files · ~22,031 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: .example 2, (none) 1, .css 1)

## Summary
- 241 nodes · 377 edges · 14 communities (11 shown, 3 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 10 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `43f37999`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- BrandKitDashboard.jsx
- mockEngine.js
- client/package.json
- brand.ts
- server/package.json
- package.json
- Brand Builder ⚡
- run-dev.js
- DESIGN.md — Handhold Editorial Design System
- mockBrandData.js
- shared/domainConfig.js

## God Nodes (most connected - your core abstractions)
1. `react` - 13 edges
2. `classifyDomain()` - 10 edges
3. `isFamilyIntent()` - 10 edges
4. `generateNextQuestion()` - 10 edges
5. `getMockQuestion()` - 10 edges
6. `compileBrandKit()` - 9 edges
7. `getMockBrandKit()` - 9 edges
8. `generateStructuredJson()` - 9 edges
9. `lucide-react` - 8 edges
10. `scripts` - 7 edges

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

## Communities (14 total, 3 thin omitted)

### Community 0 - "BrandKitDashboard.jsx"
Cohesion: 0.12
Nodes (26): BrandKitDashboard(), TABS, BrandStrategyTab(), LaunchCopyTab(), getContrastVsWhite(), VIEWPORT_SIZES, VisualTokensTab(), wcagLevel() (+18 more)

### Community 1 - "mockEngine.js"
Cohesion: 0.12
Nodes (34): brandNamesWithAmpersand, testQueries, server_controllers_interviewercontroller_extractdomain, handleCompileBrandKit(), handleNextQuestion(), validateHistory(), classifyDomain(), DOMAINS (+26 more)

### Community 2 - "client/package.json"
Cohesion: 0.07
Nodes (27): dependencies, lucide-react, react, react-dom, devDependencies, autoprefixer, postcss, tailwindcss (+19 more)

### Community 3 - "brand.ts"
Cohesion: 0.07
Nodes (25): BrandKit, BrandStrategy, ChatMessage, ColorRole, ColorToken, LaunchContent, QuestionResponse, TypographyTokens (+17 more)

### Community 4 - "server/package.json"
Cohesion: 0.09
Nodes (24): cors, dotenv, express, @google/genai, nodemon, dependencies, cors, dotenv (+16 more)

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

### Community 9 - "mockBrandData.js"
Cohesion: 0.14
Nodes (16): App(), LivePreviewTab(), classifyDomain(), DOMAINS, extractClientDomain, isClientFamilyIntent, isFamilyIntent(), careerBrandKit (+8 more)

### Community 10 - "shared/domainConfig.js"
Cohesion: 0.33
Nodes (3): DOMAINS, extractClientDomain, isClientFamilyIntent

## Knowledge Gaps
- **97 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+92 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 119 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Frontend Developer Agent:` connect `BrandKitDashboard.jsx` to `brand.ts`?**
  _High betweenness centrality (0.086) - this node is a cross-community bridge._
- **Why does `4. Known Blockers & Next Actions for AI Agents` connect `brand.ts` to `BrandKitDashboard.jsx`?**
  _High betweenness centrality (0.086) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _97 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `BrandKitDashboard.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11522048364153627 - nodes in this community are weakly interconnected._
- **Should `mockEngine.js` be split into smaller, more focused modules?**
  _Cohesion score 0.1184939091915836 - nodes in this community are weakly interconnected._
- **Should `client/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._
- **Should `brand.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07407407407407407 - nodes in this community are weakly interconnected._