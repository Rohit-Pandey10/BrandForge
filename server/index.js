// server/index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { getNextQuestion, compileBrandKit } from './geminiService.js';
import { PRESET_PITCHES } from './mockData.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS & JSON body parsing
app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
  const hasGroq = Boolean(process.env.GROQ_API_KEY);
  const hasGemini = Boolean(process.env.GEMINI_API_KEY);
  const preferred = (process.env.LLM_PROVIDER || 'groq').toLowerCase();

  let activeProvider = 'mock';
  let activeModel = 'Deterministic Domain Engine';

  if (hasGroq && (preferred === 'groq' || !hasGemini)) {
    activeProvider = 'groq';
    activeModel = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
  } else if (hasGemini) {
    activeProvider = 'gemini';
    activeModel = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  }

  res.json({
    status: 'ok',
    service: 'brand-builder-server',
    timestamp: new Date().toISOString(),
    provider: activeProvider,
    model: activeModel,
    hasApiKey: Boolean(hasGroq || hasGemini),
    backupConfigured: Boolean(hasGroq && hasGemini)
  });
});

// Presets list
app.get('/api/presets', (req, res) => {
  res.json(
    PRESET_PITCHES.map((p) => ({
      id: p.id,
      title: p.title,
      category: p.category,
      tagline: p.tagline,
      pitch: p.pitch
    }))
  );
});

// Endpoint: POST /api/interview/next
app.post('/api/interview/next', async (req, res) => {
  try {
    const { pitch, history, currentRound, useMock, groqApiKey } = req.body;
    const apiKey = req.headers['x-gemini-key'] || req.body.apiKey;
    const effectiveGroqKey = req.headers['x-groq-key'] || groqApiKey;

    const questionResult = await getNextQuestion({
      pitch,
      history,
      currentRound: Number(currentRound) || 1,
      apiKey,
      groqApiKey: effectiveGroqKey,
      useMock: Boolean(useMock)
    });

    res.json(questionResult);
  } catch (error) {
    console.error('Error in /api/interview/next:', error);
    res.status(500).json({
      error: 'Failed to generate Socratic question',
      message: error.message
    });
  }
});

// Endpoint: POST /api/interview/compile
app.post('/api/interview/compile', async (req, res) => {
  try {
    const { pitch, history, useMock, groqApiKey } = req.body;
    const apiKey = req.headers['x-gemini-key'] || req.body.apiKey;
    const effectiveGroqKey = req.headers['x-groq-key'] || groqApiKey;

    const brandKit = await compileBrandKit({
      pitch,
      history,
      apiKey,
      groqApiKey: effectiveGroqKey,
      useMock: Boolean(useMock)
    });

    res.json(brandKit);
  } catch (error) {
    console.error('Error in /api/interview/compile:', error);
    res.status(500).json({
      error: 'Failed to synthesize Brand Kit',
      message: error.message
    });
  }
});

// Serve frontend build from dist if available
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../dist');

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    if (!req.url.startsWith('/api')) {
      res.sendFile(path.join(distPath, 'index.html'));
    }
  });
}

// Start listening if executed directly
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[Brand Builder Server] Listening on http://localhost:${PORT}`);
  });
}

export default app;
