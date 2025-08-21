export const safeLocalStorage = {
  getItem: (key: string, fallback: any = null) => {
    try {
      if (typeof window === 'undefined') return fallback;
      const item = localStorage.getItem(key);
      if (!item) return fallback;
      
      try {
        return JSON.parse(item);
      } catch (parseError) {
        if (typeof item === 'string' && (item === 'true' || item === 'false')) {
          return item === 'true';
        }
        return item;
      }
    } catch (error) {
      console.warn(`Error reading from localStorage for key "${key}":`, error);
      return fallback;
    }
  },
  
  setItem: (key: string, value: any) => {
    try {
      if (typeof window === 'undefined') return;
      
      if (typeof value === 'string') {
        localStorage.setItem(key, value);
      } else {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.warn(`Error writing to localStorage for key "${key}":`, error);
    }
  },

  clearAllExcept: (keysToKeep: string[]) => {
    try {
      const allKeys = Object.keys(localStorage);
      
      allKeys.forEach(key => {
        if (!keysToKeep.includes(key)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Error clearing localStorage:', error);
    }
  }
};