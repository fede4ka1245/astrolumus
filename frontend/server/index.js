import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Serve static files from the dist directory
app.use(express.static(path.resolve(__dirname, '../dist/client')));

app.get('*', async (req, res) => {
  try {
    const template = fs.readFileSync(
      path.resolve(__dirname, '../dist/client/index.html'),
      'utf-8'
    );

    // Import the server entry
    const { render } = await import('../dist/server/entry-server.js');
    const html = await render(req.url);

    // Replace the app placeholder with the rendered HTML
    const response = template.replace(`<!--app-html-->`, html);

    res.setHeader('Content-Type', 'text/html');
    res.send(response);
  } catch (error) {
    console.error('SSR Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
