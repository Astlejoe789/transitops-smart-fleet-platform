const STORAGE_PREFIX = 'transitops_';

/**
 * Type-safe localStorage wrapper with prefixed keys.
 */
export const storage = {
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
      return item ? (JSON.parse(item) as T) : null;
    } catch {
      return null;
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
    } catch (error) {
      console.error(`Failed to set storage key "${key}":`, error);
    }
  },

  remove(key: string): void {
    localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
  },

  clear(): void {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(STORAGE_PREFIX))
      .forEach((key) => localStorage.removeItem(key));
  },
};
