import { useContext } from "react";
import { WindowContext } from "@/context/WindowContext";

/**
 * Hook to access window context.
 * 
 * @throws {Error} If used outside of WindowProvider
 * @returns Window context value with window management functions
 */
export const useWindows = () => {
  const context = useContext(WindowContext);
  if (!context) {
    throw new Error("useWindows must be used within a WindowProvider");
  }
  return context;
};

