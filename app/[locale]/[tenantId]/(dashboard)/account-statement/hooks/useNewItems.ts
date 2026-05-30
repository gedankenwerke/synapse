import { useState, useEffect, useRef } from "react";

export function useNewItems<T>(currentItems: T[], getKey: (item: T) => string) {
  const prevKeysRef = useRef<Set<string>>(new Set());
  const [newItemIds, setNewItemIds] = useState<Set<string>>(new Set());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const currentKeys = new Set(currentItems.map(getKey));
    const newKeys = new Set(
      currentItems
        .filter((item) => !prevKeysRef.current.has(getKey(item)))
        .map(getKey)
    );

    if (newKeys.size > 0 && prevKeysRef.current.size > 0) {
      setNewItemIds(newKeys);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setNewItemIds(new Set()), 500);
    }

    prevKeysRef.current = currentKeys;
  }, [currentItems, getKey]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { newItemIds };
}