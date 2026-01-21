import { useEffect, useTransition, useMemo, type ReactNode } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { ThemeContext, type ThemeContextValue } from "@/context/ThemeContext";

// Theme colors configuration
const BASE_HUES = {
  primary: 358,
  secondary: 44,
  tertiary: 137,
  quad: 201,
};

/**
 * Calculate the primary color HSL string from hue
 */
const getPrimaryColor = (hue: number): string => {
  if (hue === 360) {
    return "hsl(0, 0%, 90%)";
  }
  const h = (BASE_HUES.primary + hue) % 360;
  return `hsl(${h}, 100%, 67%)`;
};

/**
 * Apply theme CSS variables to the document
 */
const applyTheme = (hue: number) => {
  const root = document.documentElement;

  if (hue === 360) {
    // Grayscale mode
    root.style.setProperty("--primary", "0 0% 90%");
    root.style.setProperty("--secondary", "0 0% 85%");
    root.style.setProperty("--tertiary", "0 0% 80%");
    root.style.setProperty("--quad", "0 0% 75%");
  } else {
    // Shift hues
    root.style.setProperty(
      "--primary",
      `${(BASE_HUES.primary + hue) % 360} 100% 67%`
    );
    root.style.setProperty(
      "--secondary",
      `${(BASE_HUES.secondary + hue) % 360} 100% 68%`
    );
    root.style.setProperty(
      "--tertiary",
      `${(BASE_HUES.tertiary + hue) % 360} 79% 54%`
    );
    root.style.setProperty(
      "--quad",
      `${(BASE_HUES.quad + hue) % 360} 100% 70%`
    );
  }
};

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Provider component for theme context.
 * Manages theme hue state and applies CSS variables.
 */
export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [hue, setHueValue] = useLocalStorage("themeHue", 0);
  const [isPending, startTransition] = useTransition();

  // Calculate primary color for immediate use (e.g., Avatar maskBackgroundColor)
  const primaryColor = useMemo(() => getPrimaryColor(hue), [hue]);

  // Apply theme on mount and when hue changes
  useEffect(() => {
    applyTheme(hue);
  }, [hue]);

  // Wrap hue changes in a transition for smooth updates
  const setHue = (newHue: number) => {
    startTransition(() => {
      setHueValue(newHue);
    });
  };

  const value: ThemeContextValue = {
    hue,
    setHue,
    isPending,
    isGrayscale: hue === 360,
    primaryColor,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

