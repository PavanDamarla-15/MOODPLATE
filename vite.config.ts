import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

function moodAiApiPlugin(): Plugin {
  return {
    name: 'mood-ai-dev-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/mood-ai' && req.method === 'POST') {
          let bodyStr = '';
          req.on('data', (chunk) => {
            bodyStr += chunk;
          });
          req.on('end', async () => {
            try {
              const body = bodyStr ? JSON.parse(bodyStr) : {};
              let statusCode = 200;
              const vercelReq = {
                method: req.method,
                body,
                headers: req.headers,
                query: {},
              };
              const vercelRes = {
                status(code: number) {
                  statusCode = code;
                  return this;
                },
                json(data: unknown) {
                  res.statusCode = statusCode;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(data));
                  return this;
                },
              };

              const mod = await server.ssrLoadModule('./api/mood-ai.ts');
              await mod.default(vercelReq, vercelRes);
            } catch (err: unknown) {
              const message = err instanceof Error ? err.message : 'Server error';
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: message }));
            }
          });
          return;
        }
        next();
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), moodAiApiPlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
