import { useContext } from "react";
import { ThemeContext } from "@/context/ThemeContext";

/**
 * Hook to access theme context.
 *
 * @throws {Error} If used outside of ThemeProvider
 * @returns Theme context value with hue, setHue, isPending, and isGrayscale
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
