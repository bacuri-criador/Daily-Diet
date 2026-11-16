import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { usersRoutes } from './routes/users-routes.js';
import { mealsRoutes } from './routes/meals-routes.js';
import { errorHandler, notFoundHandler } from './middlewares/error-handler.js';

const app = express();
const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(helmet());
app.use(cors({ origin: allowedOrigin.split(',').map((origin) => origin.trim()) }));
app.use(express.json({ limit: '20kb' }));
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: 'draft-7', legacyHeaders: false }));

app.get('/health', (request, response) => response.json({ status: 'ok', service: 'daily-diet-api' }));
app.use('/api', usersRoutes);
app.use('/api', mealsRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

export { app };
