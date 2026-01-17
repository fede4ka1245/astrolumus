# Руководство по замене доменов в контенте

## Обзор

Система автоматически заменяет домены в контенте, который приходит с сервера, на актуальные домены из Firebase конфигурации.

## Что обрабатывается

### ✅ Компоненты с автоматической заменой доменов:

1. **Тарифы** (`/src/pages/rates/`)
   - Ссылки в тарифах с автоматическим добавлением `email` в query params
   - HTML контент с картинками и ссылками
   - Описания тарифов

2. **Видео** (`/src/components/video/Video.tsx`)
   - URL изображений видео (`video.image`)
   - Ссылки при клике на видео (`video.image_link`)
   - Ссылки на видео файлы (`video.video_link`)

3. **Модалки с ограничениями** (`/src/components/processorRestrictionModal/`)
   - HTML контент в description
   - Ссылки на оплату с email пользователя

## Доступные хелперы

### `replaceDomainInUrl(url: string): string`

Заменяет домен в одном URL на актуальный из конфигурации.

```typescript
import { replaceDomainInUrl } from './helpers/replaceDomainsInContent';

const oldUrl = 'https://old-backend.com/api/endpoint';
const newUrl = replaceDomainInUrl(oldUrl); // https://backm.alpha-astro.com/api/endpoint
```

### `replaceDomainsInHtml(html: string): string`

Заменяет все домены в HTML контенте (src, href, srcset атрибуты).

```typescript
import { replaceDomainsInHtml } from './helpers/replaceDomainsInContent';

const html = '<img src="https://old-storage.com/image.jpg"/>';
const processed = replaceDomainsInHtml(html); 
// <img src="https://media.alpha-astro.com/image.jpg"/>
```

### `processTariffLink(url: string, email?: string): string`

Обрабатывает ссылку тарифа: заменяет домен и добавляет email в query параметры.

```typescript
import { processTariffLink } from './helpers/replaceDomainsInContent';

const link = 'https://old-preview.com/payment';
const processed = processTariffLink(link, 'user@example.com');
// https://app.alpha-astro.com/payment?email=user@example.com
```

### `addUserEmailToUrl(url: string, email: string): string`

Добавляет email пользователя к URL.

```typescript
import { addUserEmailToUrl } from './helpers/replaceDomainsInContent';

const url = 'https://example.com/page?param=value';
const withEmail = addUserEmailToUrl(url, 'user@example.com');
// https://example.com/page?param=value&email=user@example.com
```

## Как добавить обработку в новый компонент

### Для отдельных URL:

```typescript
import { replaceDomainInUrl } from '../helpers/replaceDomainsInContent';
import { useMemo } from 'react';

function MyComponent({ imageUrl, linkUrl }) {
  const processedImage = useMemo(() => {
    return replaceDomainInUrl(imageUrl);
  }, [imageUrl]);

  const processedLink = useMemo(() => {
    return replaceDomainInUrl(linkUrl);
  }, [linkUrl]);

  return (
    <a href={processedLink}>
      <img src={processedImage} alt="..." />
    </a>
  );
}
```

### Для HTML контента:

```typescript
import { replaceDomainsInHtml } from '../helpers/replaceDomainsInContent';
import { useMemo } from 'react';

function MyComponent({ htmlContent }) {
  const processedHtml = useMemo(() => {
    return replaceDomainsInHtml(htmlContent);
  }, [htmlContent]);

  return (
    <div dangerouslySetInnerHTML={{ __html: processedHtml }} />
  );
}
```

### Для ссылок с email:

```typescript
import { processTariffLink } from '../helpers/replaceDomainsInContent';
import { useGetEmail } from '../store/selectors';
import { useMemo } from 'react';

function MyComponent({ paymentLink }) {
  const userEmail = useGetEmail();

  const processedLink = useMemo(() => {
    return processTariffLink(paymentLink, userEmail);
  }, [paymentLink, userEmail]);

  return (
    <a href={processedLink}>Оплатить</a>
  );
}
```

## Как работает система

1. **Получение конфигурации**: При запуске приложение загружает список доменов из Firebase
2. **Выбор fastest backend**: Система пингует все backends и выбирает самый быстрый
3. **Сохранение в Redux**: Выбранные домены сохраняются в store
4. **Автоматическая замена**: При рендере компонентов домены автоматически заменяются

## Типы доменов

- **backend** - API домен (например, `backm.alpha-astro.com`)
- **preview** - Preview/Frontend домен (например, `app.alpha-astro.com`)
- **storage** - Media/Storage домен (например, `media.alpha-astro.com`)

## Пример конфигурации в Firebase

```json
[
  {
    "backend": "https://backm.alpha-astro.com",
    "preview": "https://app.alpha-astro.com",
    "storage": "https://media.alpha-astro.com"
  },
  {
    "backend": "https://backm2.alpha-astro.com",
    "preview": "https://app2.alpha-astro.com",
    "storage": "https://media2.alpha-astro.com"
  }
]
```

## Поддержка

Если система не работает:
1. Проверьте консоль на наличие ошибок при инициализации доменов
2. Убедитесь, что Firebase Realtime Database настроена корректно
3. Проверьте, что все backends отвечают на `/ping` endpoint

## Fallback

Если система не может загрузить домены из Firebase, автоматически используются значения из `.env`:
- `VITE_APP_API_URL`
- `VITE_APP_PREVIEW_PAGE_URL`
- `VITE_APP_STORAGE_URL`
