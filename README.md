# Brand Builder ⚡
> **Adaptive Socratic Brand Interviewer & Design Token Synthesizer**  
> Built for the 24-Hour Hackathon with React + Vite, Node.js + Express, and Google Gemini (`gemini-3.6-flash` via `@google/genai`).

---

## 🚀 Overview

Founders often struggle to articulate their brand identity, settling for generic copy, safe aesthetics, and cookie-cutter templates. **Brand Builder** breaks this paradigm using the **Brand Interviewer Pattern**: an adaptive, Socratic multi-stage interview that interrogates the founder's assumptions:

1. **Round 1: Beachhead & Acute Pain** — Cuts through vague claims to expose the exact user segment and their visceral friction point.
2. **Round 2: Differentiation & Incumbent Critique** — Unmasks the status quo "villain", attacking sacred industry cows and legacy trade-offs.
3. **Round 3: Attitude Boundaries & Edge** — Stresses brand voice, polarization tolerance, and visual aesthetic extremes.
4. **Synthesis: Brand Kit Compilation** — Powered by Gemini 3.6 Flash, the entire interview transcript is distilled into structured JSON tokens:
   - **Brand Strategy:** Mission, Anti-Hero, Value Proposition.
   - **Voice System:** Archetype, Tone Adjectives, Dos & Don'ts, Signature Lexicon.
   - **Visual Tokens:** Curated HEX Palette, dynamic Google Fonts pairing, curvature and style philosophy.
   - **Launch Content:** Manifesto, Hero Headlines, Elevator Pitch, Viral Social Hooks.

---

## 👥 Multi-Agent & Teammate Tooling

This repo is pre-configured for autonomous AI pair programmers and human team members:
- **`DEVSTATE.md`**: Live operational state machine tracking active sprint phases, exact JSON schema shapes, and task checklists.
- **`graphify/index.json`**: Machine-readable entity and component relationship index.
- **`graphify/architecture.graph.md`**: Visual Mermaid sequence diagrams, prompt chain topologies, and component-to-endpoint dependency matrix.
- **Mock Hydration Fallback**: Fully functional offline mock mode in both client and server, so anyone can demo and test the system immediately without API keys or rate limits.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Lucide Icons, dynamic Google Fonts injection.
- **Backend:** Node.js, Express, CORS, `@google/genai` SDK (`gemini-3.6-flash`).
- **Data Contracts:** TypeScript types (`client/src/types/brand.ts`) & Gemini Structured JSON Schemas.

---

## ⚡ Quickstart

### 1. Clone & Install Dependencies

From the repository root (`brand-builder`):

```bash
# Install root, server, and client dependencies
npm run install:all
```

Or install individually:
```bash
cd server && npm install
cd ../client && npm install
```

### 2. Configure Environment (Optional for Live Gemini API)

Copy `.env.example` to `server/.env`:
```bash
cp .env.example server/.env
```
Add your Gemini API key from [Google AI Studio](https://aistudio.google.com/):
```env
GEMINI_API_KEY=AIzaSy...
GEMINI_MODEL=gemini-3.6-flash
PORT=5001
CLIENT_ORIGIN=http://localhost:5173
```

> **Note:** If `GEMINI_API_KEY` is not provided, the server gracefully serves high-fidelity deterministic Socratic prompts and brand kit synthesis automatically!

### 3. Run Development Servers

Run both servers concurrently from the project root:
```bash
npm run dev
```

Or run in separate terminals:
- **Server:** `cd server && npm run dev` (Runs on `http://localhost:5001`)
- **Client:** `cd client && npm run dev` (Runs on `http://localhost:5173`)

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🎨 Interactive Features

- **1-Sentence Pitch Intake:** Quick-start with pre-populated prompt pills or your own raw idea.
- **Quick-Reply Answer Pills:** 3 adaptive response pills for each Socratic round, or write a custom answer.
- **Dynamic Brand Kit Dashboard:**
  - Real-time Google Font injection matching the generated font pairing.
  - Interactive color swatches with one-click HEX clipboard copying.
  - Formatted Brand Manifesto, Elevator Pitch, and Social Hooks.
  - One-click "Export Brand Kit JSON" for design handoff.
  - Instant "Preview Sample Brand Kit" toggle to view the dashboard immediately.
