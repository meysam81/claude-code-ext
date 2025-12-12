/**
 * Composable for dark mode detection
 * Automatically syncs with Claude's theme
 */

import { ref, onMounted, onUnmounted } from "vue";

export function useDarkMode() {
  const isDark = ref(false);

  function detectDarkMode(): boolean {
    // Check Claude's theme via body/html classes
    const html = document.documentElement;
    const body = document.body;

    // Claude uses 'dark' class on html element
    if (html.classList.contains("dark")) return true;
    if (body.classList.contains("dark")) return true;

    // Fallback to system preference
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  function updateDarkMode() {
    isDark.value = detectDarkMode();
  }

  let observer: MutationObserver | null = null;
  let mediaQuery: MediaQueryList | null = null;

  onMounted(() => {
    // Initial detection
    updateDarkMode();

    // Watch for class changes on html/body
    observer = new MutationObserver(() => {
      updateDarkMode();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Watch for system preference changes
    mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", updateDarkMode);
  });

  onUnmounted(() => {
    observer?.disconnect();
    mediaQuery?.removeEventListener("change", updateDarkMode);
  });

  return {
    isDark,
  };
}
