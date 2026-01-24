import { useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";

export type ScanlinesThickness = "min" | "mid" | "max";
export type ScanlinesHardness = "min" | "mid" | "max";
export type ScanlinesColor = "min" | "mid" | "max" | string;

export interface ScanlinesSettings {
  enabled: boolean;
  thickness: ScanlinesThickness;
  hardness: ScanlinesHardness;
  color: ScanlinesColor;
}

const defaultSettings: ScanlinesSettings = {
  enabled: false,
  thickness: "mid",
  hardness: "mid",
  color: "mid",
};

/**
 * Hook to manage global scanlines effect across the entire document
 * Persists state to localStorage and applies class to body element
 */
export const useGlobalScanlines = () => {
  const [settings, setSettings] = useLocalStorage<ScanlinesSettings>(
    "global-scanlines",
    defaultSettings
  );

  useEffect(() => {
    const root = document.documentElement;
    
    if (settings.enabled) {
      document.body.classList.add("global-scanlines");
      
      // Set CSS variables based on settings
      // min = old mid values, mid = between min and max, max = strongest
      const thicknessMap = { min: "2px", mid: "3px", max: "4px" };
      const hardnessMap = { min: 0.08, mid: 0.11, max: 0.15 };
      
      // Determine color with opacity
      let colorRgba = "rgba(0, 0, 0, 0.08)";
      const opacity = hardnessMap[settings.hardness];
      
      if (settings.color === "min") {
        colorRgba = `rgba(0, 0, 0, ${opacity})`; // Standard black
      } else if (settings.color === "mid") {
        // Between black and red - slight red tint
        colorRgba = `rgba(128, 0, 0, ${opacity})`;
      } else if (settings.color === "max") {
        colorRgba = `rgba(255, 0, 0, ${opacity})`; // Red tint for max
      } else if (settings.color.startsWith("#")) {
        // Convert hex to rgba with opacity
        const hex = settings.color.replace("#", "");
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        colorRgba = `rgba(${r}, ${g}, ${b}, ${opacity})`;
      } else if (settings.color.startsWith("rgb")) {
        // Extract rgb values and add opacity
        const rgbMatch = settings.color.match(/\d+/g);
        if (rgbMatch && rgbMatch.length >= 3) {
          colorRgba = `rgba(${rgbMatch[0]}, ${rgbMatch[1]}, ${rgbMatch[2]}, ${opacity})`;
        }
      }
      
      root.style.setProperty("--scanlines-thickness", thicknessMap[settings.thickness]);
      root.style.setProperty("--scanlines-color-rgba", colorRgba);
    } else {
      document.body.classList.remove("global-scanlines");
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove("global-scanlines");
    };
  }, [settings]);

  const toggleScanlines = () => {
    setSettings((prev) => ({ ...prev, enabled: !prev.enabled }));
  };

  const updateSettings = (updates: Partial<ScanlinesSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  return {
    scanlinesEnabled: settings.enabled,
    settings,
    setScanlinesEnabled: (enabled: boolean) => updateSettings({ enabled }),
    toggleScanlines,
    updateSettings,
  };
};
