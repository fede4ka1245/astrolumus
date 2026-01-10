# SolidJS SSR Application

A SolidJS application with Server-Side Rendering (SSR) support.

## Getting Started

### Install Dependencies

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

### Build

Build the application for production:

```bash
npm run build
```

### Production

Start the production server:

```bash
npm start
```

The server will run on `http://localhost:3000` by default.

## Project Structure

```
frontend/
├── src/
│   ├── entry-client.tsx    # Client-side entry point
│   ├── entry-server.tsx    # Server-side entry point
│   ├── App.tsx            # Main app component
│   └── pages/             # Page components
├── server/
│   └── index.js           # Express server
├── index.html             # HTML template
├── vite.config.js         # Vite configuration
└── package.json           # Dependencies
```

## Features

- ✅ Server-Side Rendering (SSR)
- ✅ Client-Side Hydration
- ✅ Routing with @solidjs/router
- ✅ TypeScript support
- ✅ Vite for fast development and building
