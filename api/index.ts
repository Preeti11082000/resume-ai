// Vercel serverless entry — re-exports the Express app from server/index.ts.
// Vercel mounts this at /api (see vercel.json rewrites). The Express app already
// defines /api/health, /api/analyzer/* and /api/job-match/*, so a single
// catch-all function is enough. `server/index.ts` avoids calling `app.listen()`
// when `process.env.VERCEL` is set, which is how serverless execution is detected.
import app from '../server/index.js';

export default app;
