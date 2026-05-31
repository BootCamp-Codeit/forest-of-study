import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import router from './routes/index.js';
import { ENV } from './config/env.js';
import { corsMiddleware } from './config/cors.js';
import { securityMiddleware } from './config/security.js';
import { notFound } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { swaggerUi, swaggerSpec } from './config/swagger.js';
import { logger } from './utils/logger.js';

dotenv.config();

const app = express();

app.use(corsMiddleware);
app.use(securityMiddleware);
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  logger.info(`REQ ${req.method} ${req.url}`);
  next();
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', router);

app.use(notFound);

app.use((err, req, res, next) => {
  logger.error(`ERR ${err.message}`, { stack: err.stack });
  next(err);
});

app.use(errorHandler);

app.listen(ENV.port, () => {
  logger.info(`✅ Server running on port ${ENV.port}`);
});
