import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { caremapRouter } from './routes/caremap';
import { commitmentsRouter } from './routes/commitments';
import { appointmentsRouter } from './routes/appointments';
import { providersRouter } from './routes/providers';
import { recordsRouter } from './routes/records';
import { instructionsRouter } from './routes/instructions';
import { familyRouter } from './routes/family';
import { inboxRouter } from './routes/inbox';
import { signalsRouter } from './routes/signals';
import { askRouter } from './routes/ask';
import { analyticsRouter } from './routes/analytics';
import { auditRouter } from './routes/audit';
import { authRouter } from './routes/auth';
import { placesRouter } from './routes/places';
import { getCareState, calculateCompleteness, logAudit } from './db';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables in priority
dotenv.config({ path: path.resolve(process.cwd(), '.env.production.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.production') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3005;
const HOST = process.env.HOST || '0.0.0.0';

// Middlewares
const allowedOrigin = process.env.ALLOWED_ORIGIN;
app.use(cors({
  origin: allowedOrigin
    ? (allowedOrigin === '*' ? true : [allowedOrigin, 'https://mycaremap.in', 'https://meracare.in', 'http://localhost:3000', 'http://localhost:3002', 'http://localhost:3004'])
    : true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (req.path.startsWith('/api') && req.path !== '/api/health') {
      console.log(`[API] ${req.method} ${req.path} ${res.statusCode} - ${duration}ms`);
    }
  });
  next();
});

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  try {
    const state = getCareState();
    const completeness = calculateCompleteness(state);
    const activeMember = state.familyMembers?.find(m => m.id === state.activeFamilyMemberId);

    res.json({
      status: 'healthy',
      server: 'MyCareMap API Server v1.0',
      timestamp: new Date().toISOString(),
      activeProfile: activeMember?.name || state.profile.name,
      completenessScore: `${completeness.percentage}%`,
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
      googlePlacesConfigured: Boolean(process.env.GOOGLE_PLACES_API_KEY),
      uptimeSeconds: Math.floor(process.uptime())
    });
  } catch (err) {
    res.status(500).json({ status: 'unhealthy', error: String(err) });
  }
});

// Mount modular API routes
app.use('/api/caremap', caremapRouter);
app.use('/api/commitments', commitmentsRouter);
app.use('/api/appointments', appointmentsRouter);
app.use('/api/providers', providersRouter);
app.use('/api/places', placesRouter);
app.use('/api/records', recordsRouter);
app.use('/api/instructions', instructionsRouter);
app.use('/api/family', familyRouter);
app.use('/api/inbox', inboxRouter);
app.use('/api/signals', signalsRouter);
app.use('/api/ask', askRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/audit', auditRouter);
app.use('/api/auth', authRouter);

// Serve static build in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.resolve(__dirname, '../dist');
  app.use(express.static(distPath));
  app.get('*', (req: Request, res: Response) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.resolve(distPath, 'index.html'));
    }
  });
}

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[SERVER ERROR]', err);
  logAudit('SERVER_ERROR', 'system', { error: String(err), path: req.path });
  res.status(500).json({
    success: false,
    error: 'Internal server error occurred',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`🏥 MyCareMap Backend API Server is running`);
  console.log(`🔗 Local API: http://localhost:${PORT}/api/health`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🤖 Gemini AI: ${process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY' ? 'Enabled' : 'Offline Contextual Fallback Active'}`);
  console.log(`====================================================`);
});

export default app;
