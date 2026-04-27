import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API proxy route to fetch lottery data
  app.options('/api/get-lottery-data', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
    res.sendStatus(200);
  });

  app.post('/api/get-lottery-data', async (req, res) => {
    // Add basic CORS headers in case it's fetched from a different preview origin
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');

    try {
      const response = await fetch('https://api.bigwinqaz.com/api/webapi/GetNoaverageEmerdList', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'Accept': 'application/json, text/plain, */*',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOiIxNzc3MjI3NDI3IiwibmJmIjoiMTc3NzIyNzQyNyIsImV4cCI6IjE3NzcyMjkyMjciLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL2V4cGlyYXRpb24iOiI0LzI3LzIwMjYgMToxNzowNyBBTSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFjY2Vzc19Ub2tlbiIsIlVzZXJJZCI6IjUzMTc0OCIsIlVzZXJOYW1lIjoiOTU5OTcwNTQwNzc1IiwiVXNlclBob3RvIjoiNiIsIk5pY2tOYW1lIjoiTUcgVEhBTlQgIiwiQW1vdW50IjoiMy4zMCIsIkludGVncmFsIjoiMCIsIkxvZ2luTWFyayI6Ikg1IiwiTG9naW5UaW1lIjoiNC8yNy8yMDI2IDEyOjQ3OjA3IEFNIiwiTG9naW5JUEFkZHJlc3MiOiI1Ni42OS44LjI0MSIsIkRiTnVtYmVyIjoiMCIsIklzdmFsaWRhdG9yIjoiMCIsIktleUNvZGUiOiI2NjUiLCJUb2tlblR5cGUiOiJBY2Nlc3NfVG9rZW4iLCJQaG9uZVR5cGUiOiIxIiwiVXNlck5hbWUyIjoiIiwiaXNzIjoiand0SXNzdWVyIiwiYXVkIjoibG90dGVyeVRpY2tldCJ9.zdUrQdPnr7j0CCxHE5Yxg_VnTlz4ohN9RpK5tgmRcGE',
        },
        body: JSON.stringify({
          pageSize: 10,
          pageNo: 1,
          typeId: 30,
          language: 7,
          random: "3fe4e5921ae8447684950b797885bae3",
          signature: "150F7E0EA4888F7ED469301318A0C7E6",
          timestamp: 1777227450
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: String(error) });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
