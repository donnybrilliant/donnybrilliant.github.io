import { createContext } from "react";

/**
 * Theme context value interface
 */
export interface ThemeContextValue {
  /** Current hue offset (0-360, or 360 for grayscale) */
  hue: number;
  /** Set the hue offset */
  setHue: (hue: number) => void;
  /** Whether a theme transition is in progress */
  isPending: boolean;
  /** Whether the theme is in grayscale mode */
  isGrayscale: boolean;
  /** Pre-calculated primary color as HSL string */
  primaryColor: string;
}

/**
 * Theme context for accessing theme state
 */
export const ThemeContext = createContext<ThemeContextValue | null>(null);

