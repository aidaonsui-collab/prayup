import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

// Local /api proxy: dev-only middleware that mirrors api/prayer.ts so the
// browser can hit /api/prayer in `npm run dev` exactly as on Vercel.
function apiProxy(): Plugin {
  return {
    name: 'prayup-api-proxy',
    configureServer(server) {
      server.middlewares.use('/api/prayer', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'POST only' }));
          return;
        }
        let raw = '';
        for await (const chunk of req) raw += chunk;
        let payload: { mood?: string; heart?: string; verse?: { body: string; ref: string } };
        try { payload = raw ? JSON.parse(raw) : {}; } catch {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Invalid JSON' }));
          return;
        }
        if (!payload.mood) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'mood is required' }));
          return;
        }
        const { generatePrayer } = await server.ssrLoadModule('/api/_lib/prayer-handler.ts') as typeof import('./api/_lib/prayer-handler');
        const result = await generatePrayer(payload as Parameters<typeof generatePrayer>[0]);
        if (result.source === 'fallback') {
          res.statusCode = 502;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: result.error || 'Generation failed' }));
          return;
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'no-store');
        res.end(JSON.stringify({ prayer: result.prayer, source: result.source }));
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  // Hoist non-VITE_ env vars (MINIMAX_API_KEY, etc) into process.env so the
  // shared handler module can read them server-side during local dev.
  const env = loadEnv(mode, process.cwd(), '');
  for (const [k, v] of Object.entries(env)) {
    if (process.env[k] === undefined) process.env[k] = v;
  }
  return {
    plugins: [react(), apiProxy()],
    server: { port: 5173, host: true },
  };
});
