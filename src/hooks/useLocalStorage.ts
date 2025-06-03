import { useEffect } from 'react';
import { initializeStorage } from '../services/localStorage';

export function useLocalStorage() {
  useEffect(() => {
    // Initialize local storage with default data
    initializeStorage();

    // Add event listener for storage changes from other tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && e.newValue) {
        // Optionally handle cross-tab synchronization here
        // For example, you could emit an event or update your app state
        const event = new CustomEvent('localStorageChange', {
          detail: { key: e.key, value: JSON.parse(e.newValue) }
        });
        window.dispatchEvent(event);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
} 