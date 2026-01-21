import { useEffect } from "react";

/**
 * Updates the browser theme-color meta tag to match the navbar/footer.
 * This creates visual continuity between the browser chrome and the site.
 *
 * Colors match the .dark-surface CSS class:
 * - Light mode (prefers-color-scheme: light): dark navbar (#212631)
 * - Dark mode (prefers-color-scheme: dark): light navbar (#f2f2f2)
 */
const updateBrowserThemeColor = () => {
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  if (!themeColorMeta) return;

  const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const color = isDarkMode ? "#f2f2f2" : "#212631";

  themeColorMeta.setAttribute("content", color);
};

export const useBrowserTheme = () => {
  useEffect(() => {
    // Set initial theme color
    updateBrowserThemeColor();

    // Listen for system preference changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => updateBrowserThemeColor();

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);
};

