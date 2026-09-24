# DEVSTATE.md — AI Agent Runtime & Architecture State

> **Notice for Teammate Agents:** Read this file before initiating any code changes. Update this state file after completing any pipeline phase, modifying API contracts, or resolving blockers.



## 1. Project Overview & Sprint Status
- **Project Name:** Brand Builder (Socratic Brand Interviewer & Token Synthesizer)
- **Target Event:** 24-Hour Hackathon
- **Current Sprint Phase:** Phase 4 (Studio Card Decision Architecture, Tabbed Monograph Dashboard, and Multi-Format Token Exporters)
- **Design System:** Handhold Editorial (`DESIGN.md`) — Warm paper cream (`#f2f1ed`), pure white surfaces (`#ffffff`), ink black (`#000000`), hairline dividers (`#dbd7cd`), Cormorant Garamond 300 display typography, Inter 400 interface typography, flat zero-shadow elevation.
- **Frontend Architecture:**
  - `Header.jsx`: Lowercase serif wordmark `brand builder.`, status badge `Socratic Brand Studio`, context-aware utility actions (`Skip to Synthesis`, `Export JSON`, `Export CSS Tokens`, `Download SVG`, `Print / PDF`).
  - `InterviewChat.jsx`: Focused Studio Decision Card featuring display question headline, expandable `Under-the-Hood Strategic Rationale` diagnostic disclosure, stacked structured radio rows with custom text refinement textarea, and primary round progression CTA.
  - `BrandKitDashboard.jsx`: 5-tab segmented dashboard (`Live Brand Preview`, `Brand Strategy`, `Voice & Tone`, `Visual Design Tokens`, `Launch Copy & Manifesto`) with generous color swatch slabs, typography sandboxes, live browser preview hero, and inspectable `:root` CSS token panel.
- **Primary Model Target:** `gemini-3.6-flash` via `@google/genai` (Configured dynamically via `process.env.GEMINI_MODEL`, with resilient candidate failover across `gemini-3.6-flash`, `gemini-3-flash-preview`, `gemini-flash-lite-latest`, `gemini-3.8-flash`, and `gemini-flash-latest`, with a 25s execution budget).
- **Domain Adaptation Engine:** Dynamic domain classification (`extractDomain`) detecting hospitality/culinary, fashion, wellness, career, and systems software. Injects domain-specific guidance and bans SaaS tropes for consumer/dining products.
- **Continuous Discovery Engine:** Founders can explore multi-round strategy or synthesize on demand once baseline context is established (Round >= 3).
- **API Health:** Verified LIVE with Google Gemini API; culinary queries tested with live browser subagent confirming authentic gastronomic positioning, terracotta/olive color tokens, and Fraunces typography.
- **Fallback Mode:** Dual-layer domain-adaptive mock hydration safety net (both server-side and client-side) ensuring restaurant inputs never see Vortex Labs or developer jargon under any network condition.

---

## 2. Active Pipeline State Machine

```
[Stage 1: Intake & ICP] ──> [Stage 2: Differentiation] ──> [Stage 3: Attitude & Edge] ──> [Stage 4+: Deepening / Synthesis]
       (Verified)                  (Verified)                     (Verified)                (Verified)
```

| Pipeline Stage | Focus / Objective | Output Entity | Status | Next Milestone |
| :--- | :--- | :--- | :--- | :--- |
| **Stage 1: Intake & ICP Discovery** | Captures 1-sentence value claim; probes beachhead user, severe pain, and urgency via `gemini-3.6-flash`. | Initial Pitch + Round 1 response | **Verified** | Concise 2-sentence mentor format with <8-word pills |
| **Stage 2: Differentiation & Critique** | Uncovers the incumbent status quo, attacks legacy compromises, enforces Anti-Cliche mandate via `gemini-3.6-flash`. | Round 2 response | **Verified** | Highlight compromise and unique angle in real-time |
| **Stage 3: Attitude Boundaries & Edge** | Tests tone boundaries, negative constraints, and brand aesthetic archetype via `gemini-3.6-flash`. | Round 3 response + readyForSynthesis flag | **Verified** | 3 quick-reply pill options under 8 words each |
| **Stage 4: Brand Kit Synthesis** | Full Socratic transcript is compiled into strategic narrative + visual/voice design tokens with SVG/PDF exports. | Complete `BrandKit` object | **Verified** | Export tokens.json, palette.svg, and print-ready Brand Book PDF |

---

## 3. Implemented Schemas & JSON Contracts

### A. Question Schema (`questionSchema`)
Endpoint: `POST /api/interview/next`
```json
{
  "type": "object",
  "properties": {
    "isComplete": {
      "type": "boolean",
      "description": "True if all 3 interview rounds are concluded and the brand is ready to synthesize."
    },
    "currentRound": {
      "type": "integer",
      "description": "Current interview round (1, 2, or 3)."
    },
    "question": {
      "type": "string",
      "description": "Sharp, probing Socratic question drilling into the founder's brand identity."
    },
    "suggestedAnswers": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Exactly 3 distinct, high-signal suggested responses the user can click."
    },
    "reasoning": {
      "type": "string",
      "description": "Under-the-hood rationale for why this question challenges the founder's assumptions."
    }
  },
  "required": ["isComplete", "currentRound", "question", "suggestedAnswers", "reasoning"]
}
```

### B. Brand Kit Schema (`brandKitSchema`)
Endpoint: `POST /api/interview/compile`
```json
{
  "type": "object",
  "properties": {
    "brandStrategy": {
      "type": "object",
      "properties": {
        "brandName": { "type": "string" },
        "tagline": { "type": "string" },
        "mission": { "type": "string" },
        "targetAudience": { "type": "string" },
        "coreValueProposition": { "type": "string" },
        "antiHero": { "type": "string" },
        "differentiator": { "type": "string" }
      },
      "required": ["brandName", "tagline", "mission", "targetAudience", "coreValueProposition", "antiHero", "differentiator"]
    },
    "voiceSystem": {
      "type": "object",
      "properties": {
        "archetype": { "type": "string" },
        "tone": { "type": "array", "items": { "type": "string" } },
        "dos": { "type": "array", "items": { "type": "string" } },
        "donts": { "type": "array", "items": { "type": "string" } },
        "vocabularyWords": { "type": "array", "items": { "type": "string" } }
      },
      "required": ["archetype", "tone", "dos", "donts", "vocabularyWords"]
    },
    "visualTokens": {
      "type": "object",
      "properties": {
        "palette": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "name": { "type": "string" },
              "hex": { "type": "string" },
              "role": { "type": "string", "enum": ["primary", "secondary", "accent", "surface", "text"] }
            },
            "required": ["name", "hex", "role"]
          }
        },
        "typography": {
          "type": "object",
          "properties": {
            "headingFont": { "type": "string" },
            "bodyFont": { "type": "string" },
            "googleFontsUrl": { "type": "string" }
          },
          "required": ["headingFont", "bodyFont", "googleFontsUrl"]
        },
        "stylePhilosophy": { "type": "string" },
        "borderCurvature": { "type": "string" }
      },
      "required": ["palette", "typography", "stylePhilosophy", "borderCurvature"]
    },
    "launchContent": {
      "type": "object",
      "properties": {
        "heroHeadline": { "type": "string" },
        "heroSubheadline": { "type": "string" },
        "callToAction": { "type": "string" },
        "manifesto": { "type": "string" },
        "elevatorPitch": { "type": "string" },
        "socialHooks": { "type": "array", "items": { "type": "string" } }
      },
      "required": ["heroHeadline", "heroSubheadline", "callToAction", "manifesto", "elevatorPitch", "socialHooks"]
    }
  },
  "required": ["brandStrategy", "voiceSystem", "visualTokens", "launchContent"]
}
```

---

## 4. Known Blockers & Next Actions for AI Agents

### Backend Developer Agent:
- [x] Scaffold Express server with CORS & JSON body parsing
- [x] Configure `@google/genai` wrapper with structured response schemas
- [x] Implement robust mock fallback for `POST /api/interview/next`
- [x] Implement robust mock fallback for `POST /api/interview/compile`
- [x] Add rate-limit retry logic with exponential backoff for Gemini API calls
- [ ] Implement optional server-side streaming or SSE for compiling long manifesto copy

### Frontend Developer Agent:
- [x] Build `IntakeView` component with interactive sample pitch pills
- [x] Build `InterviewChat` component with 3 clickable suggested answer pill chips
- [x] Build `ProgressStepper` component with 3-stage visual progress
- [x] Build `BrandKitDashboard` with dynamic Google Fonts loading, interactive HEX copy buttons, and CSS variables
- [x] Integrate instant Mock Hydration toggle so anyone can test the dashboard immediately
- [x] Add PDF / SVG export button for design tokens and color swatches
- [ ] Add sound effects or haptic micro-interactions on pill selection

### Demo & Presentation Agent:
- [x] Ensure zero-setup mock mode allows a full demo even without a `GEMINI_API_KEY`
- [x] Prepare 3 preset founder pitch cards (e.g., "Developer-first DB", "AI Nutritionist for Gamers", "Anti-SaaS Accounting")
- [ ] Record a 60-second walkthrough video of the Socratic flow generating a cyber-punk developer tool brand
