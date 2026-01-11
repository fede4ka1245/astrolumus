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
const PORT = process.env.PORT || 3000;

/**
 * Читает HTML шаблон
 */
function readTemplate() {
  return fs.readFileSync(TEMPLATE_PATH, 'utf-8');
}

/**
 * Заменяет placeholder на сгенерированный HTML
 */
function replacePlaceholder(template, html) {
  return template.replace(HTML_PLACEHOLDER, html);
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
  // Пропускаем статические файлы
  if (req.url.match(STATIC_ASSETS_REGEX)) {
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

// SSR маршрут должен быть перед статическими файлами
app.get('*', handleSSR);

// Статические файлы (после SSR маршрута)
app.use(express.static(STATIC_PATH));

// Запуск сервера
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
