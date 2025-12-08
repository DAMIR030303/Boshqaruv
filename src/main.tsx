import { StrictMode } from 'react';

import { createRoot } from 'react-dom/client';

import App from './App.tsx';
import { registerServiceWorker } from './utils/pwa';
import './styles/globals.css';

// #region agent log
fetch('http://127.0.0.1:7242/ingest/96756b51-bfed-4036-adea-abfaa325b2f9', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    location: 'main.tsx:11',
    message: 'App initialization started',
    data: { userAgent: navigator.userAgent },
    timestamp: Date.now(),
    sessionId: 'debug-session',
    runId: 'run1',
    hypothesisId: 'A',
  }),
}).catch(() => {});
// #endregion agent log

// Register Service Worker for PWA (skip on Android WebView)
const isAndroidWebView =
  /Android/i.test(navigator.userAgent) && !/Chrome/i.test(navigator.userAgent);

// #region agent log
fetch('http://127.0.0.1:7242/ingest/96756b51-bfed-4036-adea-abfaa325b2f9', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    location: 'main.tsx:15',
    message: 'Service worker check',
    data: { isAndroidWebView, hasServiceWorker: 'serviceWorker' in navigator },
    timestamp: Date.now(),
    sessionId: 'debug-session',
    runId: 'run1',
    hypothesisId: 'B',
  }),
}).catch(() => {});
// #endregion agent log

if ('serviceWorker' in navigator && !isAndroidWebView) {
  window.addEventListener('load', () => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/96756b51-bfed-4036-adea-abfaa325b2f9', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'main.tsx:20',
        message: 'Service worker registration started',
        data: {},
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'run1',
        hypothesisId: 'B',
      }),
    }).catch(() => {});
    // #endregion agent log
    registerServiceWorker().catch(error => {
      // #region agent log
      fetch(
        'http://127.0.0.1:7242/ingest/96756b51-bfed-4036-adea-abfaa325b2f9',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            location: 'main.tsx:23',
            message: 'Service worker registration failed',
            data: { error: error?.message || String(error) },
            timestamp: Date.now(),
            sessionId: 'debug-session',
            runId: 'run1',
            hypothesisId: 'B',
          }),
        }
      ).catch(() => {});
      // #endregion agent log
      console.error('[PWA] Failed to register service worker:', error);
    });
  });
}

const rootElement = document.getElementById('root');

// #region agent log
fetch('http://127.0.0.1:7242/ingest/96756b51-bfed-4036-adea-abfaa325b2f9', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    location: 'main.tsx:30',
    message: 'Root element check',
    data: { rootElementExists: !!rootElement },
    timestamp: Date.now(),
    sessionId: 'debug-session',
    runId: 'run1',
    hypothesisId: 'A',
  }),
}).catch(() => {});
// #endregion agent log

if (!rootElement) {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/96756b51-bfed-4036-adea-abfaa325b2f9', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      location: 'main.tsx:33',
      message: 'Root element not found - CRITICAL ERROR',
      data: {},
      timestamp: Date.now(),
      sessionId: 'debug-session',
      runId: 'run1',
      hypothesisId: 'A',
    }),
  }).catch(() => {});
  // #endregion agent log
  throw new Error(
    'Root element not found. Make sure <div id="root"></div> exists in index.html'
  );
}

// #region agent log
fetch('http://127.0.0.1:7242/ingest/96756b51-bfed-4036-adea-abfaa325b2f9', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    location: 'main.tsx:37',
    message: 'Creating React root',
    data: {},
    timestamp: Date.now(),
    sessionId: 'debug-session',
    runId: 'run1',
    hypothesisId: 'A',
  }),
}).catch(() => {});
// #endregion agent log

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// #region agent log
fetch('http://127.0.0.1:7242/ingest/96756b51-bfed-4036-adea-abfaa325b2f9', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    location: 'main.tsx:44',
    message: 'React root rendered successfully',
    data: {},
    timestamp: Date.now(),
    sessionId: 'debug-session',
    runId: 'run1',
    hypothesisId: 'A',
  }),
}).catch(() => {});
// #endregion agent log
