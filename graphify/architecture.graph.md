# Brand Builder: Architecture & Agent Navigation Graph

This document serves as the visual and semantic architectural guide for human developers and autonomous AI pair agents. It details the end-to-end data lifecycle, agent state transitions, and component-to-endpoint dependency matrix.

---

## 1. End-to-End System Sequence Diagram

The following Mermaid sequence diagram traces how user input flows from initial beachhead pitch through adaptive Socratic questioning to dynamic design token compilation.

```mermaid
sequenceDiagram
    autonumber
    actor Founder as Founder / User
    participant Intake as Client: IntakeView
    participant Chat as Client: InterviewChat
    participant Stepper as Client: ProgressStepper
    participant API as Express Server (/api/interview)
    participant Ctrl as InterviewerController
    participant Gemini as Google GenAI (gemini-3.6-flash via process.env.GEMINI_MODEL)
    participant Dash as Client: BrandKitDashboard

    %% Step 1: Intake
    Founder->>Intake: Submits 1-Sentence Pitch
    Intake->>Chat: Transitions stage & passes pitch into history
    
    %% Step 2: Next Question Loop
    rect rgb(240, 245, 255)
        note right of Chat: Socratic Loop (Rounds 1 - 3)
        Chat->>API: POST /api/interview/next { history }
        API->>Ctrl: handleNextQuestion(req, res)
        Ctrl->>Gemini: generateStructuredJson({ prompt, schema: questionSchema })
        Gemini-->>Ctrl: Raw Structured JSON string
        Ctrl->>Ctrl: Validate JSON shape & fallback guard
        Ctrl-->>API: { isComplete, currentRound, question, suggestedAnswers, reasoning }
        API-->>Chat: HTTP 200 Question Payload
        Chat->>Stepper: Update active step (1, 2, or 3)
        Chat->>Founder: Renders question + 3 quick-reply pill options
        Founder->>Chat: Selects pill or enters custom reply
    end

    %% Step 3: Synthesis
    rect rgb(245, 255, 240)
        note right of Chat: Synthesis Phase
        Chat->>API: POST /api/interview/compile { history }
        API->>Ctrl: handleCompileBrandKit(req, res)
        Ctrl->>Gemini: generateStructuredJson({ transcript, schema: brandKitSchema })
        Gemini-->>Ctrl: Full Structured BrandKit JSON
        Ctrl->>Ctrl: Validate tokens (palette, fonts, copy)
        Ctrl-->>API: { brandStrategy, voiceSystem, visualTokens, launchContent }
        API-->>Chat: HTTP 200 BrandKit Payload
        Chat->>Dash: Hydrates BrandKit & switches view
    end

    %% Step 4: Dashboard Interaction
    Dash->>Dash: Dynamically loads Google Fonts `<link>`
    Dash->>Dash: Binds dynamic CSS variables for theme colors
    Dash->>Founder: Renders interactive swatches, copyable manifesto, & token export
```

---

## 2. Component-to-API Dependency Matrix

Incoming AI agents must reference this matrix when altering state payloads or modifying contracts:

| React Component | File Path | Express Endpoint | Method | Request Payload | Response Schema | Fallback Behavior |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `IntakeView.jsx` | `client/src/components/IntakeView.jsx` | *None (Local state)* | - | - | - | Emits `onStartInterview(pitch)` or loads demo mock |
| `InterviewChat.jsx` | `client/src/components/InterviewChat.jsx` | `/api/interview/next` | `POST` | `{ history: Array<{role, content}> }` | `QuestionResponse` (`questionSchema`) | Offline deterministic questions with 3 adaptive pill chips |
| `InterviewChat.jsx` | `client/src/components/InterviewChat.jsx` | `/api/interview/compile` | `POST` | `{ history: Array<{role, content}> }` | `BrandKit` (`brandKitSchema`) | High-fidelity mock brand kit with dynamic palette & fonts |
| `ProgressStepper.jsx` | `client/src/components/ProgressStepper.jsx` | *None (Pure UI)* | - | `{ currentRound: 1\|2\|3, isComplete: boolean }` | Visual status tracker | Shows completion state & active pulse animation |
| `BrandKitDashboard.jsx`| `client/src/components/BrandKitDashboard.jsx`| *None (Consumer)* | - | `BrandKit` object | Interactive visualizer | Self-contained Google Font injector & HEX copy buttons |

---

## 3. Prompt Chain Architecture & Socratic Logic

The pipeline operates across 3 adaptive Socratic rounds before synthesizing into the Brand Kit:

```mermaid
graph TD
    A[Founder Pitch: 1-sentence value claim] --> B[Round 1: Beachhead & Acute Pain]
    B -->|Exposes true ICP & high-urgency friction| C[Round 2: Differentiation & Incumbent Critique]
    C -->|Deconstructs legacy flaws & sacred cows| D[Round 3: Attitude Boundaries & Edge]
    D -->|Establishes radical voice, tone & polarization limits| E[Stage 4: Gemini 3.6 Flash Brand Synthesis via process.env.GEMINI_MODEL]
    
    subgraph Brand Kit Outputs
        E --> F[Brand Strategy: Mission, Anti-Hero, Value Prop]
        E --> G[Voice System: Archetype, Dos/Donts, Lexicon]
        E --> H[Visual Tokens: Curated Hex Palette, Google Fonts, Curvature]
        E --> I[Launch Content: Hero Hooks, Manifesto, Social Snippets]
    end
```

---

## 4. Multi-Agent Navigation Guide

When joining this repository as an AI agent:
1. Check `DEVSTATE.md` to see the current active sprint stage and unresolved blockers.
2. If modifying prompt outputs or response shapes, keep `client/src/types/brand.ts` and `server/controllers/interviewerController.js` in strict parity.
3. Keep mock fallbacks enabled so all CI and local testing passes without requiring an active `GEMINI_API_KEY`.
