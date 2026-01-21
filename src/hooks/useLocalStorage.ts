import { useState, useEffect, useCallback } from "react";

/**
 * A hook that syncs state with localStorage.
 * Handles JSON serialization/deserialization automatically.
 * 
 * @param key - The localStorage key
 * @param initialValue - The initial value if no stored value exists
 * @returns A tuple of [value, setValue, removeValue]
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // Initialize state from localStorage or use initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      console.warn(`Error reading localStorage key "${key}":`, key);
      return initialValue;
    }
  });

  // Update localStorage when state changes
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue));
    } catch {
      console.warn(`Error writing to localStorage key "${key}":`, key);
    }
  }, [key, storedValue]);

  // Wrapped setter that handles function updates
  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStoredValue((prev) => {
      const nextValue = value instanceof Function ? value(prev) : value;
      return nextValue;
    });
  }, []);

  // Remove from localStorage
  const removeValue = useCallback(() => {
    try {
      localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch {
      console.warn(`Error removing localStorage key "${key}":`, key);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

