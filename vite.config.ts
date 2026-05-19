import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

// Local /api proxy: dev-only middleware that mirrors api/*.ts so the browser
// can hit /api/<route> in `npm run dev` exactly as on Vercel. Each route file
// must export a default handler with the Vercel Node-runtime signature.
function apiProxy(): Plugin {
  type Handler = (req: unknown, res: unknown) => unknown | Promise<unknown>;

  return {
    name: 'prayup-api-proxy',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ?? '';
        if (!url.startsWith('/api/')) return next();

        // Map /api/<route>[?query] → api/<route>.ts at the project root.
        const route = url.replace(/^\/api\//, '').split('?')[0].replace(/\/$/, '');
        if (!route || route.includes('..')) return next();
        const filePath = resolve(server.config.root, 'api', `${route}.ts`);
        if (!existsSync(filePath)) return next();

        // Parse JSON body (Vercel's Node handlers receive a parsed `req.body`).
        let body: unknown = undefined;
        if (req.method && req.method !== 'GET' && req.method !== 'HEAD') {
          let raw = '';
          for await (const chunk of req) raw += chunk;
          if (raw) {
            const ctype = (req.headers['content-type'] ?? '').toString();
            try {
              body = ctype.includes('application/json') ? JSON.parse(raw) : raw;
            } catch {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Invalid JSON body' }));
              return;
            }
          }
        }

        const mod = await server.ssrLoadModule(filePath) as { default?: Handler };
        const handler = mod.default;
        if (typeof handler !== 'function') {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: `No default export in ${route}.ts` }));
          return;
        }

        // Minimal Vercel-shaped req/res adapters.
        const reqAdapter = {
          method: req.method,
          url: req.url,
          headers: req.headers,
          body,
        };
        let statusCode = 200;
        let responded = false;
        const resAdapter = {
          status(code: number) { statusCode = code; return this; },
          setHeader(k: string, v: string) { res.setHeader(k, v); },
          json(b: unknown) {
            if (responded) return;
            responded = true;
            res.statusCode = statusCode;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(b));
          },
          end() {
            if (responded) return;
            responded = true;
            res.statusCode = statusCode;
            res.end();
          },
        };

        try {
          await handler(reqAdapter, resAdapter);
        } catch (err) {
          if (!responded) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: (err as Error).message }));
          }
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  // Hoist non-VITE_ env vars (MINIMAX_API_KEY, SUPABASE_SERVICE_ROLE_KEY, etc)
  // into process.env so server-side handler modules can read them during dev.
  const env = loadEnv(mode, process.cwd(), '');
  for (const [k, v] of Object.entries(env)) {
    if (process.env[k] === undefined) process.env[k] = v;
  }
  return {
    plugins: [react(), apiProxy()],
    server: { port: 5173, host: true },
  };
});
