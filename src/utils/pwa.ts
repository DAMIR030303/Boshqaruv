/**
 * PWA (Progressive Web App) utility functions
 * Service Worker registration va PWA funksiyalari
 */

/**
 * Service Worker'ni register qilish
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    console.warn('[PWA] Service Worker not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });

    console.log('[PWA] Service Worker registered:', registration.scope);

    // Update check
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (
            newWorker.state === 'installed' &&
            navigator.serviceWorker.controller
          ) {
            // New version available
            console.log('[PWA] New version available');
            // You can show a notification here
          }
        });
      }
    });

    return registration;
  } catch (error) {
    console.error('[PWA] Service Worker registration failed:', error);
    return null;
  }
}

/**
 * PWA install prompt'ni ko'rsatish
 */
export function showInstallPrompt(): Promise<boolean> {
  return new Promise(resolve => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      resolve(false);
      return;
    }

    // Check for beforeinstallprompt event
    let deferredPrompt: BeforeInstallPromptEvent | null = null;

    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault();
      deferredPrompt = e as BeforeInstallPromptEvent;
      resolve(true);
    });

    // If no prompt after 1 second, resolve false
    setTimeout(() => {
      if (!deferredPrompt) {
        resolve(false);
      }
    }, 1000);
  });
}

/**
 * PWA install qilish
 */
export async function installPWA(): Promise<boolean> {
  // Check if already installed
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return false;
  }

  // This will be handled by the beforeinstallprompt event
  return false;
}

/**
 * PWA holatini tekshirish
 */
export function isPWAInstalled(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches;
}

/**
 * PWA offline holatini tekshirish
 */
export function isOffline(): boolean {
  return !navigator.onLine;
}

/**
 * Online/Offline event listener'lar
 */
export function setupOnlineOfflineListeners(
  onOnline: () => void,
  onOffline: () => void
): () => void {
  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);

  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  };
}

/**
 * Service Worker'ni yangilash
 */
export async function updateServiceWorker(): Promise<void> {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  const registration = await navigator.serviceWorker.ready;

  if (registration.waiting) {
    // New service worker waiting, activate it
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
  }

  // Check for updates
  await registration.update();
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}
