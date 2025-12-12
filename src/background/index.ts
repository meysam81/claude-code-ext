/**
 * Background service worker for Claude Code Utilities
 * Handles keyboard shortcuts and extension lifecycle
 */

// Handle keyboard shortcut commands
chrome.commands.onCommand.addListener(async (command) => {
  if (command === "open-command-palette") {
    // Get the active tab
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (tab?.id && tab.url?.includes("claude.ai")) {
      // Send message to content script to open command palette
      chrome.tabs.sendMessage(tab.id, { action: "open-command-palette" });
    }
  }
});

// Log extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    console.log("[Claude Code Utilities] Extension installed");
  } else if (details.reason === "update") {
    console.log("[Claude Code Utilities] Extension updated");
  }
});
