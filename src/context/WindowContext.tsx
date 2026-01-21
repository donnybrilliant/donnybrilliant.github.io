import { useState, useCallback, useEffect, useRef, type ReactNode } from "react";
import type { ProjectDetails } from "@/data/projects";
import {
  WindowContext,
  type WindowContextValue,
  type WindowState,
} from "@/context/WindowContext";

/**
 * WindowContext - Centralized window management for the portfolio.
 * 
 * This context provides:
 * - Window state management (open, closed, minimized, position, size)
 * - Z-index management for window stacking
 * - Centralized Tab key handler for focus management across windows
 * - Window ref registration for focus traversal
 * 
 * Architecture:
 * - Single source of truth for all window state
 * - Global Tab handler traps focus within open windows
 * - Window refs stored in Map for O(1) lookup during focus management
 */

// Default window configurations
const DEFAULT_SIZES: Record<string, { width: number; height: number }> = {
  terminal: { width: 700, height: 450 },
  default: { width: 600, height: 500 },
};

// Initial windows
const initialWindows: WindowState[] = [
  {
    id: "terminal",
    title: "terminal.sh",
    isOpen: false,
    isMinimized: false,
    zIndex: 100,
    position: { x: 100, y: 100 },
    size: DEFAULT_SIZES.terminal,
  },
  {
    id: "packageJson",
    title: "package.json",
    isOpen: false,
    isMinimized: false,
    zIndex: 100,
    position: { x: 100, y: 100 },
    size: DEFAULT_SIZES.default,
  },
];


// Provider component
export const WindowProvider = ({ children }: { children: ReactNode }) => {
  const [windows, setWindows] = useState<WindowState[]>(initialWindows);
  const [maxZ, setMaxZ] = useState(100);
  
  /**
   * Store refs to window DOM elements for focus management.
   * Used by the centralized Tab handler to:
   * - Determine which window contains the active element
   * - Query focusable elements within each window
   * - Focus elements when cycling between windows
   */
  const windowRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  /**
   * Register/unregister a window's DOM ref.
   * Called by DraggableWindow on mount/unmount.
   * 
   * @param id - Window ID
   * @param ref - Window DOM element or null (on unmount)
   */
  const registerWindowRef = useCallback((id: string, ref: HTMLDivElement | null) => {
    if (ref) {
      windowRefs.current.set(id, ref);
    } else {
      windowRefs.current.delete(id);
    }
  }, []);

  // Open a window
  const openWindow = useCallback((id: string, projectData?: ProjectDetails) => {
    setMaxZ((prev) => prev + 1);

    setWindows((prev) => {
      const existingWindow = prev.find((w) => w.id === id);

      if (existingWindow) {
        return prev.map((w) =>
          w.id === id
            ? {
                ...w,
                isOpen: true,
                isMinimized: false,
                zIndex: maxZ + 1,
              }
            : w
        );
      }

      // Calculate initial position to avoid overlapping
      const openCount = prev.filter((w) => w.isOpen).length;
      const offset = 30;

      return [
        ...prev,
        {
          id,
          title: projectData?.title || id,
          isOpen: true,
          isMinimized: false,
          zIndex: maxZ + 1,
          position: { x: 100 + openCount * offset, y: 100 + openCount * offset },
          size: DEFAULT_SIZES[id] || DEFAULT_SIZES.default,
          projectData,
        },
      ];
    });
  }, [maxZ]);

  // Close a window
  const closeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isOpen: false } : w))
    );
  }, []);

  // Minimize a window
  const minimizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w))
    );
  }, []);

  // Focus a window (bring to front)
  const focusWindow = useCallback((id: string) => {
    setMaxZ((prev) => prev + 1);
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, zIndex: maxZ + 1, isMinimized: false } : w
      )
    );
  }, [maxZ]);

  // Toggle window (minimize/restore from taskbar)
  const toggleWindow = useCallback((id: string) => {
    setWindows((prev) => {
      const window = prev.find((w) => w.id === id);
      if (!window) return prev;

      if (window.isMinimized) {
        setMaxZ((p) => p + 1);
        return prev.map((w) =>
          w.id === id ? { ...w, isMinimized: false, zIndex: maxZ + 1 } : w
        );
      }
      return prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w));
    });
  }, [maxZ]);

  // Update window position
  const updateWindowPosition = useCallback(
    (id: string, position: { x: number; y: number }) => {
      setWindows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, position } : w))
      );
    },
    []
  );

  // Update window size
  const updateWindowSize = useCallback(
    (id: string, size: { width: number; height: number }) => {
      setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, size } : w)));
    },
    []
  );

  /**
   * Get sorted open windows (by zIndex, highest first).
   * Used for tab navigation order.
   */
  const getOpenWindowsSorted = useCallback(() => {
    return windows
      .filter((w) => w.isOpen && !w.isMinimized)
      .sort((a, b) => b.zIndex - a.zIndex);
  }, [windows]);

  /**
   * Get all focusable elements in a window, sorted in correct tab order.
   * Handles special cases:
   * - When overlay (expanded image) is visible: only overlay elements and controls
   * - Normal mode: thumbnails first, then content, then controls
   * 
   * @param windowEl - The window DOM element
   * @returns Array of focusable elements in tab order
   */
  const getFocusableElements = useCallback((windowEl: HTMLDivElement): HTMLElement[] => {
    const allFocusable = windowEl.querySelectorAll<HTMLElement>(
      'button, a, input, textarea, select, [tabindex], [role="button"]'
    );

    const thumbnails: HTMLElement[] = [];
    const contentElements: HTMLElement[] = [];
    const controlElements: HTMLElement[] = [];
    const overlayElements: HTMLElement[] = [];

    // Check for overlay (expanded image) - look for the specific structure
    const overlay = windowEl.querySelector('.z-50');
    const isOverlayVisible = overlay && 
      window.getComputedStyle(overlay).display !== 'none' &&
      parseFloat(window.getComputedStyle(overlay).opacity) > 0.5;

    allFocusable.forEach((el) => {
      if (el.tabIndex === -1) return;

      const style = window.getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden') return;
      if ((el as HTMLButtonElement).disabled) return;

      const ariaLabel = el.getAttribute('aria-label') || '';
      const isControl = el.tabIndex >= 1000;
      const isInOverlay = overlay?.contains(el);
      
      // When overlay is visible, only include:
      // 1. Window controls (tabIndex >= 1000)
      // 2. Elements inside the overlay (like close expanded image button)
      if (isOverlayVisible) {
        if (isControl) {
          controlElements.push(el);
        } else if (isInOverlay) {
          overlayElements.push(el);
        }
        // Skip all other elements when overlay is visible
        return;
      }

      // Normal mode (no overlay)
      const isThumbnail = ariaLabel.toLowerCase().includes('expand image') && 
                          el.getAttribute('role') === 'button';

      if (isThumbnail) {
        if (!thumbnails.includes(el)) thumbnails.push(el);
      } else if (isControl) {
        if (!controlElements.includes(el)) controlElements.push(el);
      } else {
        if (!contentElements.includes(el)) contentElements.push(el);
      }
    });

    // Sort controls by tabIndex
    controlElements.sort((a, b) => a.tabIndex - b.tabIndex);

    // When overlay is visible: overlay elements first, then controls
    if (isOverlayVisible) {
      return [...overlayElements, ...controlElements];
    }

    // Normal mode: thumbnails first, then content (DOM order), then controls
    return [...thumbnails, ...contentElements, ...controlElements];
  }, []);

  /**
   * Find thumbnail element in a window (for project modals).
   * Returns null if overlay is visible (expanded image) or thumbnail not found.
   * 
   * @param windowEl - The window DOM element
   * @returns The thumbnail element or null
   */
  const findThumbnail = useCallback((windowEl: HTMLDivElement): HTMLElement | null => {
    // Check if overlay is visible - if so, thumbnail shouldn't be focused
    const overlay = windowEl.querySelector('.z-50');
    const isOverlayVisible = overlay && 
      window.getComputedStyle(overlay).display !== 'none' &&
      parseFloat(window.getComputedStyle(overlay).opacity) > 0.5;
    
    if (isOverlayVisible) return null;
    
    // Direct query for thumbnail - most reliable method
    const thumbnail = windowEl.querySelector<HTMLElement>(
      '[role="button"][aria-label*="Expand image"], [role="button"][aria-label*="expand image"]'
    );
    if (thumbnail && thumbnail.tabIndex >= 0) {
      const style = window.getComputedStyle(thumbnail);
      if (style.display !== 'none' && style.visibility !== 'hidden') {
        return thumbnail;
      }
    }
    return null;
  }, []);

  /**
   * Centralized Tab key handler for all windows.
   * Manages focus cycling between windows and traps focus within open windows.
   * 
   * Behavior:
   * - Cycles through focusable elements within each window
   * - Moves to next/previous window when reaching end of current window
   * - Prioritizes thumbnails when entering a window
   * - Handles overlay state (expanded images)
   * - Traps focus: if focus is outside windows, brings it to topmost window
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const openWindowsSorted = getOpenWindowsSorted();
      if (openWindowsSorted.length === 0) return;

      const activeElement = document.activeElement as HTMLElement;
      
      // Find which window contains the active element
      let currentWindowIndex = -1;
      let currentWindowEl: HTMLDivElement | null = null;

      for (let i = 0; i < openWindowsSorted.length; i++) {
        const windowEl = windowRefs.current.get(openWindowsSorted[i].id);
        if (windowEl?.contains(activeElement)) {
          currentWindowIndex = i;
          currentWindowEl = windowEl;
          break;
        }
      }

      // If focus is not in any window, bring focus to topmost window
      if (currentWindowIndex === -1 || !currentWindowEl) {
        e.preventDefault();
        e.stopImmediatePropagation();
        
        // Focus the topmost window's first element
        const topmostWindow = openWindowsSorted[0];
        const topmostWindowEl = windowRefs.current.get(topmostWindow.id);
        
        if (topmostWindowEl) {
          const focusable = getFocusableElements(topmostWindowEl);
          if (focusable.length > 0) {
            // Try thumbnail first for project modals
            const thumbnail = findThumbnail(topmostWindowEl);
            if (thumbnail) {
              thumbnail.focus();
            } else {
              focusable[0].focus();
            }
          }
        }
        return;
      }

      const focusableElements = getFocusableElements(currentWindowEl);
      if (focusableElements.length === 0) return;

      const activeIndex = focusableElements.indexOf(activeElement);

      e.preventDefault();
      e.stopImmediatePropagation();

      if (e.shiftKey) {
        // Shift+Tab - move backward
        if (activeIndex <= 0) {
          // Move to previous window's last element
          const prevWindowIndex = currentWindowIndex === 0 
            ? openWindowsSorted.length - 1 
            : currentWindowIndex - 1;
          const prevWindow = openWindowsSorted[prevWindowIndex];
          const prevWindowEl = windowRefs.current.get(prevWindow.id);
          
          if (prevWindowEl) {
            const prevFocusable = getFocusableElements(prevWindowEl);
            if (prevFocusable.length > 0) {
              prevFocusable[prevFocusable.length - 1].focus();
            }
          }
        } else {
          // Move to previous element in current window
          focusableElements[activeIndex - 1].focus();
        }
      } else {
        // Tab - move forward
        if (activeIndex >= focusableElements.length - 1 || activeIndex === -1) {
          // Move to next window's first element
          const nextWindowIndex = (currentWindowIndex + 1) % openWindowsSorted.length;
          const nextWindow = openWindowsSorted[nextWindowIndex];
          const nextWindowEl = windowRefs.current.get(nextWindow.id);
          
          if (nextWindowEl) {
            // Try thumbnail first for project modals
            const thumbnail = findThumbnail(nextWindowEl);
            if (thumbnail) {
              thumbnail.focus();
            } else {
              const nextFocusable = getFocusableElements(nextWindowEl);
              if (nextFocusable.length > 0) {
                nextFocusable[0].focus();
              }
            }
          }
        } else {
          // Move to next element in current window
          focusableElements[activeIndex + 1].focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown, true);
    return () => document.removeEventListener('keydown', handleKeyDown, true);
  }, [getOpenWindowsSorted, getFocusableElements, findThumbnail]);

  const openWindows = windows.filter((w) => w.isOpen);

  const value: WindowContextValue = {
    windows,
    openWindows,
    openWindow,
    closeWindow,
    minimizeWindow,
    focusWindow,
    toggleWindow,
    updateWindowPosition,
    updateWindowSize,
    registerWindowRef,
  };

  return (
    <WindowContext.Provider value={value}>{children}</WindowContext.Provider>
  );
};

