# BrandLoom ⚡

> **Adaptive Socratic Brand Architect & Design Token Synthesizer**  
> Formulate defensible positioning, verbal identity, and production-ready design tokens powered by Groq & Google Gemini.

---

## 🚀 Overview

Founders often struggle to articulate their brand identity, settling for generic copy, safe aesthetics, and cookie-cutter templates. **BrandLoom** breaks this paradigm using an un-templated **Socratic Brand Interviewer**:

1. **Strategic Refinement Gate:** Evaluates raw founder inputs, rejects gibberish/spam, and formulates 2 contrasting commercial directions tailored to that exact business premise.
2. **Adaptive 7-Question Socratic Discovery Engine:** Formulates seven highly customized, non-generic strategic questions (e.g. *Cast-Iron Ritual*, *Sourdough Stance*, *Cap Ergonomics*, *Usage Context*) with dynamic stage labels, grounding choices in category-specific realities with zero software jargon or demographic caricatures.
3. **Brand Kit & Monograph Synthesis:** Distills the dynamic discovery transcript into structured design tokens:
   - **Brand Strategy:** Mission, Anti-Hero Villain, Core Value Proposition, Differentiator ("Onlyness Test").
   - **Voice System:** Archetype, Tone Adjectives, Dos & Don'ts, Signature Lexicon.
   - **Visual Tokens:** Contrast-checked HSL/HEX palettes (warm cream & parchment canvases for food/CPG; dark mode reserved for nocturnal developer tooling), dynamic Google Fonts pairing, curvature, and style philosophy.
   - **Website Blueprint:** Sections, SKU grids, comparative ledgers, and hero CTAs.
   - **Launch Content:** Manifesto, Hero Headlines, Elevator Pitch, Viral Social Hooks.
4. **Interactive Website Simulator:** Real-time mobile & desktop viewports with zero horizontal scroll overflow.
5. **MVP "AI Prompts" Suite:** Export 1-click production-ready master prompts containing all Q&A context, design tokens, and component blueprints directly into **Lovable**, **Bolt.new**, **Google Antigravity**, **v0**, or **ChatGPT/Claude**.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Lucide React Icons, Google Fonts API.
- **Backend:** Node.js, Express, MongoDB Atlas (Mongoose), JWT, Google OAuth 2.0.
- **LLM Engine:** Groq SDK (`qwen/qwen3.8-27b`, `openai/gpt-oss-20b`, `llama-3.3`) + Google Gemini SDK (`@google/genai`) with automatic multi-model failover.
- **Data Contracts:** TypeScript Interfaces (`client/src/types/brand.ts`) & Gemini Structured JSON Schemas.

---

## 🌐 Deploying to Vercel

BrandLoom is pre-configured for seamless single-click full-stack deployment on Vercel using `vercel.json` and Vercel Serverless Functions (`api/index.js`).

### Option A: Vercel CLI (Recommended)

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy from repository root
vercel
```

### Option B: Vercel Web Dashboard

1. Push your code to GitHub / GitLab / Bitbucket.
2. Go to [Vercel Dashboard](https://vercel.com/new) $\rightarrow$ **Import Project**.
3. Select your repository.
4. Configure Project Settings:
   - **Framework Preset:** Vite
   - **Root Directory:** `./`
   - **Build Command:** `cd client && npm run build` (or leave default)
   - **Output Directory:** `client/dist`
5. Add **Environment Variables** in the Vercel Settings panel (see table below).
6. Click **Deploy**.

---

## 🔐 Vercel Environment Variables (`.env`)

Add the following environment variables to your Vercel Project under **Settings $\rightarrow$ Environment Variables**:

| Variable Name | Required? | Category | Description & Example Value |
| :--- | :---: | :---: | :--- |
| `GROQ_API_KEY` | **Recommended** | LLM Engine | Groq API Key for ultra-fast Socratic discovery & synthesis. Get yours at [console.groq.com](https://console.groq.com). <br>`gsk_...` |
| `LLM_PROVIDER` | Optional | LLM Engine | Primary provider selection (`groq` or `gemini`). Default: `groq`. |
| `GEMINI_API_KEY` | Optional | LLM Engine | Google Gemini API Key for fallback LLM requests. Get yours at [aistudio.google.com](https://aistudio.google.com). <br>`AIzaSy...` |
| `GEMINI_MODEL` | Optional | LLM Engine | Gemini model ID. Default: `gemini-2.5-flash`. |
| `MONGODB_URI` | **Recommended** | Database | MongoDB Atlas connection string for saving user sessions & brand library. <br>`mongodb+srv://user:pass@cluster.mongodb.net/brandloom?retryWrites=true` |
| `JWT_SECRET` | **Required** | Auth | Secret string used for signing JWT authentication tokens. <br>`brandloom-jwt-secret-key-2026` |
| `CLIENT_URL` | Optional | CORS | Deployed frontend domain. Vercel automatically accepts `*.vercel.app` subdomains. <br>`https://brandloom.vercel.app` |
| `GOOGLE_CLIENT_ID` | Optional | OAuth | Google OAuth 2.0 Client ID for 1-click Google Sign In. <br>`281883142806-....apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Optional | OAuth | Google OAuth 2.0 Client Secret. <br>`GOCSPX-....` |
| `VITE_GOOGLE_CLIENT_ID` | Optional | Client OAuth | Client-side Google Client ID (same value as `GOOGLE_CLIENT_ID`). |
| `VITE_API_URL` | Optional | Client API | Base API URL. On Vercel, leave empty (`""`) to use relative same-origin `/api`. |

> **Offline Demo Mode:** If no LLM keys are supplied, BrandLoom automatically activates high-fidelity domain-adaptive mock engines for zero-crash demonstrations!

---

## ⚡ Local Quickstart

### 1. Install Dependencies

```bash
# Install root, server, and client dependencies
npm run install:all
```

### 2. Configure Environment

Copy `.env.example` to `server/.env`:
```bash
cp .env.example server/.env
```

### 3. Run Development Servers

```bash
npm run dev
```

- **Client:** `http://localhost:5173`
- **Backend:** `http://localhost:5001`

### 4. Run Automated Test Suite

```bash
npm test
```

Verifies restaurant and denim brand synthesis pipelines, ensuring 100% category purity and zero dark-mode obsidian bias for food/CPG.

---

## 🎨 Interactive Features

- **Strategic Intake:** Raw input expansion into 2 commercial angles with anti-spam validation gate.
- **Adaptive Socratic Discovery:** 7 dynamically generated question dimensions with 3 high-signal choices.
- **Brand Kit Monograph:** Interactive typography rationale, color swatches, manifesto, and copy guidelines.
- **Live Device Preview:** Toggle desktop and mobile viewports with clean surface contrast and zero horizontal scroll overflow.
- **✨ AI Prompts Modal:** 1-click copy master prompts for **Lovable & Bolt.new**, **Google Antigravity & v0**, and **ChatGPT/Claude**.
- **Print & PDF Dossier:** Clean, printable executive brand monograph stylesheet (`@media print`).
- **Brand Library Archive:** Save, load, and manage created brand monographs with MongoDB Atlas persistence.

---

## 📜 License

MIT &copy; 2026 BrandLoom Team. Strategic Positioning, Verbal Identity & Design Systems.
