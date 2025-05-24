import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';

import { listingsRouter } from './routes/listings';
import { categoriesRouter } from './routes/categories';
import { usersRouter } from './routes/users';
import { authRouter } from './routes/auth';
import { searchRouter } from './routes/search';

export interface Env {
  MONGODB_URI: string;
  JWT_SECRET: string;
  GOOGLE_MAPS_API_KEY: string;
  GOOGLE_PLACES_API_KEY: string;
  CACHE: KVNamespace;
  ENVIRONMENT: string;
  API_VERSION: string;
  CORS_ORIGINS: string;
}

const app = new Hono<{ Bindings: Env }>();

// Middleware
app.use('*', logger());
app.use('*', prettyJSON());
app.use('*', cors({
  origin: (origin, c) => {
    const allowedOrigins = c.env.CORS_ORIGINS.split(',');
    return allowedOrigins.includes(origin) || origin === undefined;
  },
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Health check
app.get('/', (c) => {
  return c.json({
    message: 'MOBB API v3',
    version: c.env.API_VERSION,
    environment: c.env.ENVIRONMENT,
    timestamp: new Date().toISOString(),
  });
});

app.get('/health', (c) => {
  return c.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.route('/api/v1/auth', authRouter);
app.route('/api/v1/listings', listingsRouter);
app.route('/api/v1/categories', categoriesRouter);
app.route('/api/v1/users', usersRouter);
app.route('/api/v1/search', searchRouter);

// 404 handler
app.notFound((c) => {
  return c.json({
    success: false,
    error: 'Not Found',
    message: 'The requested endpoint does not exist',
  }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error('API Error:', err);
  
  return c.json({
    success: false,
    error: 'Internal Server Error',
    message: c.env.ENVIRONMENT === 'development' ? err.message : 'Something went wrong',
  }, 500);
});

export default app;
