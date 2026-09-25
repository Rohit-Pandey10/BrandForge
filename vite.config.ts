import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import { getNextQuestion, compileBrandKit } from './server/geminiService';
import { PRESET_PITCHES, PresetPitch } from './server/mockData';

dotenv.config({ override: true });

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'api-server-middleware',
      configureServer(server) {
        // Handle /api routes directly inside Vite dev server
        server.middlewares.use(async (req, res, next) => {
          const url = req.url || '';
          if (!url.startsWith('/api/')) {
            return next();
          }

          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-gemini-key, Authorization');

          if (req.method === 'OPTIONS') {
            res.statusCode = 204;
            return res.end();
          }

          if (url === '/api/health' && req.method === 'GET') {
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

            res.statusCode = 200;
            return res.end(
              JSON.stringify({
                status: 'ok',
                service: 'brand-builder-server',
                timestamp: new Date().toISOString(),
                provider: activeProvider,
                model: activeModel,
                hasApiKey: Boolean(hasGroq || hasGemini),
                backupConfigured: Boolean(hasGroq && hasGemini)
              })
            );
          }

          if (url === '/api/presets' && req.method === 'GET') {
            res.statusCode = 200;
            return res.end(
              JSON.stringify(
                PRESET_PITCHES.map((p: PresetPitch) => ({
                  id: p.id,
                  title: p.title,
                  category: p.category,
                  tagline: p.tagline,
                  pitch: p.pitch
                }))
              )
            );
          }

          // Buffer request body for POST
          if (req.method === 'POST') {
            let bodyStr = '';
            req.on('data', (chunk) => {
              bodyStr += chunk;
            });
            req.on('end', async () => {
              try {
                const body = bodyStr ? JSON.parse(bodyStr) : {};
                const apiKey = (req.headers['x-gemini-key'] as string) || body.apiKey;
                const groqApiKey = (req.headers['x-groq-key'] as string) || body.groqApiKey;

                if (url === '/api/interview/next') {
                  const result = await getNextQuestion({
                    pitch: body.pitch,
                    history: body.history || [],
                    currentRound: Number(body.currentRound) || 1,
                    apiKey,
                    groqApiKey,
                    useMock: Boolean(body.useMock)
                  });
                  res.statusCode = 200;
                  return res.end(JSON.stringify(result));
                }

                if (url === '/api/interview/compile') {
                  const brandKit = await compileBrandKit({
                    pitch: body.pitch,
                    history: body.history || [],
                    apiKey,
                    groqApiKey,
                    useMock: Boolean(body.useMock)
                  });
                  res.statusCode = 200;
                  return res.end(JSON.stringify(brandKit));
                }

                res.statusCode = 404;
                return res.end(JSON.stringify({ error: 'Endpoint not found' }));
              } catch (err: unknown) {
                const error = err as Error;
                console.error('[API Middleware Error]', error);
                res.statusCode = 500;
                return res.end(JSON.stringify({ error: error?.message || 'Internal Server Error' }));
              }
            });
            return;
          }

          next();
        });
      }
    }
  ],
  server: {
    port: 5173,
    host: true,
    watch: {
      ignored: ['**/Rohit/**', '**/scratch/**']
    }
  }
});
