import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Константы
const STATIC_ASSETS_REGEX = /\.(js|css|png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|eot|json)$/;
const HTML_PLACEHOLDER = '<!--app-html-->';
const TEMPLATE_PATH = path.resolve(__dirname, '../dist/client/index.html');
const STATIC_PATH = path.resolve(__dirname, '../dist/client');
const PORT = process.env.PORT || 8080;

/**
 * Читает HTML шаблон
 */
function readTemplate() {
  return fs.readFileSync(TEMPLATE_PATH, 'utf-8');
}

/**
 * Заменяет placeholder на сгенерированный HTML и добавляет preload для CSS
 */
function replacePlaceholder(template, html) {
  let result = template.replace(HTML_PLACEHOLDER, html);
  
  try {
    const assetsDir = path.join(STATIC_PATH, 'assets');
    if (fs.existsSync(assetsDir)) {
      const files = fs.readdirSync(assetsDir);
      const cssFiles = files.filter(file => file.endsWith('.css'));
      
      if (cssFiles.length > 0) {
        cssFiles.sort((a, b) => {
          if (a.startsWith('index-')) return -1;
          if (b.startsWith('index-')) return 1;
          return a.localeCompare(b);
        });
        
        const cssPreloads = cssFiles.map(cssFile => 
          `    <link rel="preload" as="style" href="/assets/${cssFile}" />`
        ).join('\n') + '\n';
        
        result = result.replace('</head>', cssPreloads + '  </head>');
      }
    }
  } catch (error) {
    console.warn('[SSR] Could not add CSS preload:', error);
  }
  
  return result;
}

/**
 * Отправляет HTML ответ клиенту
 */
function sendHTML(res, html) {
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
}

/**
 * Обработчик SSR маршрута
 */
async function handleSSR(req, res, next) {
  // Пропускаем статические файлы и специальные файлы
  if (req.url.match(STATIC_ASSETS_REGEX) || req.url === '/robots.txt' || req.url === '/sitemap.xml') {
    return next();
  }

  try {
    console.log(`[SSR] Processing request for: ${req.url}`);

    const template = readTemplate();
    const { render } = await import('../dist/server/entry-server.js');
    const html = await render(req.url);

    if (!html || html.trim().length === 0) {
      console.warn('[SSR] Warning: Empty HTML returned, using template as-is');
      return sendHTML(res, template);
    }

    const response = replacePlaceholder(template, html);
    sendHTML(res, response);
  } catch (error) {
    console.error('[SSR] Error:', error);
    if (error instanceof Error) {
      console.error('[SSR] Error message:', error.message);
      console.error('[SSR] Error stack:', error.stack);
    }
    
    // Fallback: отправляем шаблон без SSR
    try {
      const template = readTemplate();
      sendHTML(res, template);
    } catch (fallbackError) {
      res.status(500).send('Internal Server Error');
    }
  }
}

app.get('/robots.txt', (req, res) => {
  const robotsPath = path.join(STATIC_PATH, 'robots.txt');
  if (fs.existsSync(robotsPath)) {
    res.type('text/plain');
    res.sendFile(robotsPath);
  } else {
    res.status(404).send('Not found');
  }
});

app.get('/sitemap.xml', (req, res) => {
  const sitemapPath = path.join(STATIC_PATH, 'sitemap.xml');
  if (fs.existsSync(sitemapPath)) {
    res.type('application/xml');
    res.sendFile(sitemapPath);
  } else {
    res.status(404).send('Not found');
  }
});

app.get('*', handleSSR);

// Статические файлы (после SSR маршрута)
app.use(express.static(STATIC_PATH));

// Запуск сервера
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
