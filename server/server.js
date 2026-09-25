import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import brandRoutes from './routes/brandRoutes.js';
import authRoutes from './routes/authRoutes.js';
import brandHistoryRoutes from './routes/brandHistoryRoutes.js';
import { connectDB, isDbConnected } from './config/db.js';
import { isLlmConfigured } from './utils/llmClient.js';

dotenv.config();

// Connect to MongoDB Atlas (or graceful resilient fallback)
connectDB();

const app = express();
const PORT = process.env.PORT || 5001;
const CLIENT_ORIGIN = process.env.CLIENT_URL || process.env.CLIENT_ORIGIN || 'http://localhost:5173';

// Strict CORS whitelist — only explicitly allowed origins pass
const allowedOrigins = [
  CLIENT_ORIGIN,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000'
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no Origin header (curl, mobile apps, server-to-server)
    if (!origin) return callback(null, true);
    // Allow explicitly whitelisted origins
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // Allow known deployment platform subdomains
    if (
      origin.endsWith('.vercel.app') ||
      origin.endsWith('.netlify.app') ||
      origin.endsWith('.railway.app') ||
      origin.endsWith('.render.com')
    ) {
      return callback(null, true);
    }
    // Reject all other origins with a proper CORS error
    return callback(new Error(`CORS policy violation: Origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Body parser
app.use(express.json({ limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[HTTP] ${req.method} ${req.path} -> ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Health check endpoint
app.get(['/health', '/api/health'], (req, res) => {
  const provider = (process.env.LLM_PROVIDER || 'groq').split('#')[0].replace(/['"]/g, '').trim().toLowerCase();
  res.json({
    status: 'ok',
    service: 'brand-builder-server',
    provider,
    dbConnected: isDbConnected(),
    groqConfigured: Boolean(process.env.GROQ_API_KEY),
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    model: provider === 'groq' ? 'llama-3.3-70b-versatile' : (process.env.GEMINI_MODEL || 'gemini-2.5-flash'),
    uptime: process.uptime()
  });
});

// Mount Brand Interview API routes
app.use('/api/interview', brandRoutes);

// Mount Authentication & User Management routes
app.use('/api/auth', authRoutes);

// Mount Brand History & Library routes
app.use('/api/brands', brandHistoryRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[server] Uncaught server error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    const provider = (process.env.LLM_PROVIDER || 'groq').split('#')[0].replace(/['"]/g, '').trim().toLowerCase();
    console.log('----------------------------------------------------');
    console.log(`⚡ BrandLoom Backend running on http://localhost:${PORT}`);
    console.log(`🤖 Primary LLM Provider: ${provider.toUpperCase()} (${provider === 'groq' ? 'llama-3.3-70b-versatile' : (process.env.GEMINI_MODEL || 'gemini-2.5-flash')})`);
    console.log(`🔄 Fallback Engine: ${process.env.GEMINI_API_KEY ? 'Gemini API' : 'Domain-Adaptive Mock Engine'}`);
    console.log('----------------------------------------------------');
  });
}

export default app;
