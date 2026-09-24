import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import backendApp, { initDatabase } from './backend/server.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

async function startServer() {
  try {
    if (typeof initDatabase === 'function') {
      await initDatabase();
    }
  } catch (err) {
    console.error('[Database Init Error in server.ts]', err);
  }

  const app = express();

  app.use(backendApp);

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Full-Stack App] Running at http://localhost:${PORT}`);
  });
}

startServer();
