import 'dotenv/config';
import express, { type ErrorRequestHandler } from 'express';
import cors from 'cors';
import multer from 'multer';
import { analyzerRouter, MAX_UPLOAD_BYTES } from './routes/analyzer.js';
import { jobMatchRouter } from './routes/jobMatch.js';

export const app = express();
export default app;

const port = Number(process.env.PORT) || 8787;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/analyzer', analyzerRouter);
app.use('/api/job-match', jobMatchRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof multer.MulterError) {
    const message =
      err.code === 'LIMIT_FILE_SIZE'
        ? `File is too large. Max ${MAX_UPLOAD_BYTES / (1024 * 1024)}MB.`
        : err.message;
    res.status(400).json({ message });
    return;
  }
  console.error(err);
  res.status(500).json({ message: 'Unexpected server error.' });
};
app.use(errorHandler);

// Only start a standalone HTTP server when NOT running as a Vercel serverless function.
// Vercel sets `VERCEL=1` and imports `api/index.ts` which re-exports `app` instead.
if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`ResumeForge API listening on http://localhost:${port}`);
    if (!process.env.OPENROUTER_API_KEY) {
      console.warn('Warning: OPENROUTER_API_KEY is not set — analysis requests will fail. See .env.example.');
    }
    if (!process.env.AFFINDA_API_KEY) {
      console.warn('Warning: AFFINDA_API_KEY is not set — job-description matching will fail. See .env.example.');
    }
  });
}
