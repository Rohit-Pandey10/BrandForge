# DEVSTATE.md — AI Agent Runtime & Architecture State

> **Notice for Teammate Agents:** Read this file before initiating any code changes. Update this state file after completing any pipeline phase, modifying API contracts, or resolving blockers.

---

## 1. Project Overview & Sprint Status
- **Project Name:** Brand Builder (Socratic Brand Interviewer, Token Synthesizer & Brand Library)
- **Current Sprint Phase:** Phase 5 (Authentication, Guest-First Gating, MongoDB Atlas Persistence, and Session History Sidebar)
- **Design System:** Handhold Editorial (`DESIGN.md`) — Warm paper cream (`#f2f1ed`), pure white surfaces (`#ffffff`), ink black (`#000000`), hairline dividers (`#dbd7cd`), Cormorant Garamond 300 display typography, Inter 400 interface typography, flat zero-shadow elevation.
- **Frontend Architecture:**
  - `Header.jsx`: Lowercase serif wordmark `brand builder.`, Socratic Studio badge, Left Sidebar trigger (`Library`), context-aware persistence gating action (`Save to Library`), guest usage counter (`X/2 Free`), user profile pill, and export actions (`JSON`, `CSS`, `Download SVG`, `Print / PDF`).
  - `Sidebar.jsx`: Expandable/collapsible Left Sidebar drawer featuring saved MongoDB Atlas brand sessions, 1-click brand rehydration into the active workspace, visual token color swatches, session deletion, and guest pass usage meter.
  - `AuthModal.jsx`: Contextual authentication modal supporting Google One-Click Sign-In (`@react-oauth/google`), strict `@gmail.com` validation regex (`/^[a-zA-Z0-9._%+-]+@gmail\.com$/`), and registration with real-time confirm-password match validation.
  - `AuthContext.jsx`: Global authentication & session provider managing JWT tokens, guest run gating (`MAX_GUEST_RUNS = 2`), local guest brand buffering, automatic post-login MongoDB migration, and library state.
  - `IntakeView.jsx`: High-aesthetic input card with domain-adaptive sample chips and 1-sentence value proposition input.
  - `InterviewChat.jsx`: Focused Studio Decision Card with batch question progression, structured radio options, and strategic rationale disclosures.
  - `BrandKitDashboard.jsx`: 5-tab segmented brand monograph (`Live Brand Preview`, `Brand Strategy`, `Voice & Tone`, `Visual Design Tokens`, `Launch Copy & Manifesto`) with embedded `"Save to Library"` action and floating export toolbar.
- **LLM Orchestration:**
  - **Primary Provider:** Groq (`llama-3.3-70b-versatile`) for ultra-low latency structured JSON generation.
  - **Secondary Provider:** Google Gemini API (`gemini-3.6-flash` / `@google/genai`) configured with automatic candidate failovers.
  - **Domain Adaptation Engine:** Real-time domain detection (`extractDomain`) preventing tech/SaaS bias for culinary, fashion, and consumer brands.
- **Database & Storage Architecture:**
  - **Primary:** MongoDB Atlas via Mongoose (`User` and `BrandSession` schemas) connected with secure TLS connection strings.
  - **Resilience Engine:** `resilientStore.js` dual-mode adapter ensuring that if MongoDB Atlas is offline or credentials are missing during local development, all auth and brand persistence operations fall back gracefully without 500 crashes.

---

## 2. Active Pipeline State Machine

```
[Guest Trial: 0/2 Used] ──> [Guest Trial: 1/2 Used] ──> [Guest Limit: 2/2 Used]
           │                           │                          │
           ▼                           ▼                          ▼
   [Create Brand 1]            [Create Brand 2]         [GATED: Auth Modal]
           │                           │                          │
           └───────────────────────────┴──────────────────────────┘
                                       │
                                (Login / Register)
                                       │
                                       ▼
                       [Auto-Migrate In-Memory Kits]
                                       │
                                       ▼
                     [MongoDB Atlas Cloud Brand Library]
                                       │
                    [1-Click Workspace Rehydration Sidebar]
```

| Pipeline Milestone | Status | Key Contract / Responsibility |
| :--- | :--- | :--- |
| **Guest-First Flow** | **Verified** | Allows unauthenticated visitors up to 2 full brand creation tests. 3rd attempt is hard-gated by `AuthModal`. |
| **Persistence Gating** | **Verified** | Prominent `"Save to Library"` button in Header and Dashboard. Prompts guest to sign in or saves directly for authenticated users. |
| **Strict @gmail.com Auth** | **Verified** | Custom credentials reject non-`@gmail.com` addresses on client & server (`GMAIL_REGEX`). Bcrypt hash + 14d JWT tokens. |
| **Confirm Password Match** | **Verified** | Registration view provides real-time matching indicator and locks submission until passwords match. |
| **Google OAuth** | **Verified** | One-click Google sign-in via `@react-oauth/google` with server-side ID token verification (`google-auth-library`). |
| **Session Auto-Migration** | **Verified** | Unsaved guest creations buffer in `localStorage` and automatically migrate to MongoDB Atlas on login (`POST /api/brands/sync-guest`). |
| **Left Sidebar & Rehydration** | **Verified** | Expandable drawer with saved sessions, color swatch dots, delete action, and 1-click active workspace rehydration. |
| **MongoDB Atlas Connection** | **Verified** | Connected to live Atlas shard `ac-9qpotsl-shard-00-02.wrf7nno.mongodb.net` with resilient local fallback. |

---

## 3. Implemented API Contracts & Schemas

### A. Authentication API (`/api/auth`)

#### 1. Register (`POST /api/auth/register`)
- **Body:** `{ email: string, password: string, displayName?: string }`
- **Rule:** `email` MUST match `/^[a-zA-Z0-9._%+-]+@gmail\.com$/`
- **Response (201):** `{ token: string, user: { id, email, displayName, authProvider }, message: string }`

#### 2. Login (`POST /api/auth/login`)
- **Body:** `{ email: string, password: string }`
- **Response (200):** `{ token: string, user: { id, email, displayName, authProvider }, message: string }`

#### 3. Google OAuth (`POST /api/auth/google`)
- **Body:** `{ credential: string }` (Google ID Token)
- **Response (200):** `{ token: string, user: { id, email, displayName, avatarUrl, authProvider } }`

#### 4. Current User (`GET /api/auth/me`)
- **Headers:** `Authorization: Bearer <token>`
- **Response (200):** `{ user: { id, email, displayName, avatarUrl, authProvider } }`

---

### B. Brand History & Library API (`/api/brands`)
*All endpoints require `Authorization: Bearer <token>`.*

#### 1. Fetch Saved Sessions (`GET /api/brands`)
- **Response (200):** `{ sessions: BrandSession[], count: number }`

#### 2. Save Active Brand (`POST /api/brands`)
- **Body:** `{ brandName, tagline, initialPitch, domain, brandKit }`
- **Response (201):** `{ session: BrandSession, message: string }`

#### 3. Auto-Migrate Guest Kits (`POST /api/brands/sync-guest`)
- **Body:** `{ brandSessions: Array<{ brandName, tagline, initialPitch, domain, brandKit }> }`
- **Response (200):** `{ syncedCount: number, sessions: BrandSession[], message: string }`

#### 4. Delete Brand Session (`DELETE /api/brands/:id`)
- **Response (200):** `{ success: true, id: string, message: string }`

---

### C. Socratic Interview & Synthesis API (`/api/interview`)

#### 1. Start Interview (`POST /api/interview/start`)
- **Body:** `{ initialPitch: string }`
- **Response (200):** `{ questions: Question[], domain: string }` (Generates 7 upfront questions)

#### 2. Synthesize Brand Kit (`POST /api/interview/compile`)
- **Body:** `{ initialPitch: string, answers: Array<{ question, answer }> }`
- **Response (200):** Complete `BrandKit` object adhering to:
  - `brandStrategy`: `{ brandName, tagline, mission, targetAudience, coreValueProposition, antiHero, differentiator }`
  - `voiceSystem`: `{ archetype, tone, dos, donts, vocabularyWords }`
  - `visualTokens`: `{ palette: Array<{ name, hex, role }>, typography: { headingFont, bodyFont, googleFontsUrl }, stylePhilosophy, borderCurvature }`
  - `launchContent`: `{ heroHeadline, heroSubheadline, callToAction, manifesto, elevatorPitch, socialHooks }`

---

## 4. Completed Sprint Checklists

### Backend Engineering:
- [x] Scaffold Express API with strict CORS whitelist and request timing middleware
- [x] Configure dual LLM orchestration: Groq (`llama-3.3-70b-versatile`) + Gemini API (`gemini-3.6-flash`)
- [x] Scaffold Mongoose `User` schema with strict `@gmail.com` regex validation
- [x] Scaffold Mongoose `BrandSession` schema with user association and timestamps
- [x] Build `resilientStore.js` dual-mode fallback data layer for local/offline testing
- [x] Implement JWT Bearer token middleware (`requireAuth`)
- [x] Implement Auth Controller (`register`, `login`, `googleAuth`, `getMe`)
- [x] Implement Brand History Controller (`list`, `save`, `syncGuest`, `delete`)
- [x] Connect backend to live MongoDB Atlas cluster (`ac-9qpotsl-shard-00-02.wrf7nno.mongodb.net`)

### Frontend Engineering & UI/UX:
- [x] Implement `AuthContext.jsx` with guest run tracker (`MAX_GUEST_RUNS = 2`)
- [x] Build editorial `AuthModal.jsx` with Google Sign-In, strict `@gmail.com` warning, and password match validation
- [x] Build expandable/collapsible `Sidebar.jsx` with 1-click brand rehydration, swatch dots, and session deletion
- [x] Add `"Save to Library"` persistence gating button to sticky `Header.jsx` and `BrandKitDashboard.jsx`
- [x] Implement automatic post-login migration of buffered guest creations (`syncGuestSessions`)
- [x] Verify complete guest flow in Playwright browser (2 tests permitted, 3rd blocked, registration, auto-migration, and rehydration)
- [x] Keep all Git commits local on `main` (no unapproved remote pushes)
