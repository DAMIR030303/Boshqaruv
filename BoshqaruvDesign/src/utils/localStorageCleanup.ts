/**
 * Utility to clean up localStorage entries and fix malformed data
 * This should be run once on app initialization to fix existing issues
 */

const BOSHQARUV_KEYS = [
  'boshqaruv-theme',
  'boshqaruv-active-page',
  'boshqaruv-sidebar-state',
  'boshqaruv-user-preferences'
];

export function cleanupLocalStorage() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }

  try {
    BOSHQARUV_KEYS.forEach(key => {
      const value = localStorage.getItem(key);
      if (value) {
        try {
          // Try to parse as JSON
          JSON.parse(value);
        } catch (error) {
          // If it fails and it's a known string value, keep it as string
          if (key === 'boshqaruv-active-page' && typeof value === 'string') {
            // It's already a valid string, no need to change
            console.info(`LocalStorage cleanup: ${key} is a valid string value`);
          } else if (key === 'boshqaruv-theme' && (value === 'true' || value === 'false')) {
            // Convert boolean strings to actual JSON booleans
            localStorage.setItem(key, JSON.stringify(value === 'true'));
            console.info(`LocalStorage cleanup: Fixed ${key} boolean value`);
          } else {
            // Unknown malformed data, remove it
            localStorage.removeItem(key);
            console.warn(`LocalStorage cleanup: Removed malformed data for ${key}`);
          }
        }
      }
    });

    // Force garbage collection if available (Chrome DevTools)
    if (typeof window.gc === 'function' && process.env.NODE_ENV === 'development') {
      window.gc();
    }

  } catch (error) {
    console.error('LocalStorage cleanup failed:', error);
  }
}

/**
 * Get localStorage item size in bytes
 */
export function getLocalStorageSize(): number {
  if (typeof window === 'undefined' || !window.localStorage) {
    return 0;
  }

  let total = 0;
  try {
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
  } catch (error) {
    console.error('Failed to calculate localStorage size:', error);
  }

  return total;
}

/**
 * Clear all Boshqaruv related localStorage data
 */
export function clearBoshqaruvData() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }

  try {
    BOSHQARUV_KEYS.forEach(key => {
      localStorage.removeItem(key);
    });
    console.info('Cleared all Boshqaruv localStorage data');
  } catch (error) {
    console.error('Failed to clear Boshqaruv data:', error);
  }
}