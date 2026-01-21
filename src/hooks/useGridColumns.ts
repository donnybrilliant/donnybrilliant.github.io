import { useSyncExternalStore } from "react";

// Define breakpoints matching the CSS grid
const BREAKPOINTS = {
  xl: "(min-width: 1280px)", // 4 columns
  lg: "(min-width: 900px)", // 3 columns
  md: "(min-width: 600px)", // 2 columns
} as const;

// Map column count to initial visible projects
const VISIBLE_COUNT_MAP: Record<number, number> = {
  1: 4,
  2: 6,
  3: 6,
  4: 8,
};

function getColumnCount(): number {
  if (typeof window === "undefined") return 1;

  if (window.matchMedia(BREAKPOINTS.xl).matches) return 4;
  if (window.matchMedia(BREAKPOINTS.lg).matches) return 3;
  if (window.matchMedia(BREAKPOINTS.md).matches) return 2;
  return 1;
}

function subscribe(callback: () => void): () => void {
  const mediaQueries = Object.values(BREAKPOINTS).map((query) =>
    window.matchMedia(query)
  );

  mediaQueries.forEach((mq) => mq.addEventListener("change", callback));

  return () => {
    mediaQueries.forEach((mq) => mq.removeEventListener("change", callback));
  };
}

/**
 * Hook that returns the current grid column count and corresponding
 * initial visible project count based on responsive breakpoints.
 *
 * Uses useSyncExternalStore for React 19 best practices.
 */
export function useGridColumns() {
  const columns = useSyncExternalStore(
    subscribe,
    getColumnCount,
    () => 1 // Server snapshot
  );

  const initialVisibleCount = VISIBLE_COUNT_MAP[columns] ?? 6;

  return { columns, initialVisibleCount };
}

