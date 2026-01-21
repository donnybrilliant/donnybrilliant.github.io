import { createContext } from "react";
import type { ProjectDetails } from "@/data/projects";

/**
 * Window state interface
 */
export interface WindowState {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  projectData?: ProjectDetails;
}

/**
 * Window context value interface
 */
export interface WindowContextValue {
  windows: WindowState[];
  openWindows: WindowState[];
  openWindow: (id: string, projectData?: ProjectDetails) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  toggleWindow: (id: string) => void;
  updateWindowPosition: (id: string, position: { x: number; y: number }) => void;
  updateWindowSize: (id: string, size: { width: number; height: number }) => void;
  registerWindowRef: (id: string, ref: HTMLDivElement | null) => void;
}

/**
 * Window context for accessing window management state
 */
export const WindowContext = createContext<WindowContextValue | null>(null);

