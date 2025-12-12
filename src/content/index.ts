/**
 * Content script - Entry point for Claude Code Utilities
 * Injects the Vue app into the Claude AI page
 */

import { createApp } from 'vue'
import App from '@/App.vue'
import 'virtual:uno.css'
import '@unocss/reset/tailwind.css'

// Prevent double injection
if (!document.getElementById('claude-code-ext-root')) {
  // Create mount point
  const container = document.createElement('div')
  container.id = 'claude-code-ext-root'
  document.body.appendChild(container)

  // Create and mount Vue app
  const app = createApp(App)
  app.mount(container)

  // Listen for commands from background script
  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'open-command-palette') {
      // Dispatch custom event to open palette
      window.dispatchEvent(new CustomEvent('claude-code-ext:open'))
    }
  })

  console.log('[Claude Code Utilities] Extension loaded')
}
