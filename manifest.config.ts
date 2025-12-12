import { defineManifest } from "@crxjs/vite-plugin";
import pkg from "./package.json";

export default defineManifest({
  manifest_version: 3,
  name: "Claude Code Utilities",
  version: pkg.version,
  description:
    "Enhanced utilities for Claude Code web UI - Quick session search, keyboard shortcuts, and more.",
  author: {
    email: "contact@meysam.io",
  },
  homepage_url: "https://github.com/meysam81/claude-code-ext",
  permissions: ["storage", "activeTab"],
  host_permissions: ["https://claude.ai/*"],
  background: {
    service_worker: "src/background/index.ts",
    type: "module",
  },
  content_scripts: [
    {
      matches: ["https://claude.ai/*"],
      js: ["src/content/index.ts"],
    },
  ],
  commands: {
    "open-command-palette": {
      suggested_key: {
        default: "Ctrl+K",
        mac: "Command+K",
      },
      description: "Open the command palette",
    },
  },
  web_accessible_resources: [
    {
      resources: ["assets/*"],
      matches: ["https://claude.ai/*"],
    },
  ],
});
