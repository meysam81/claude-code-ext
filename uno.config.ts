import {
  defineConfig,
  presetUno,
  presetIcons,
  presetAttributify,
  transformerDirectives,
} from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      cdn: 'https://esm.sh/',
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
    }),
  ],
  transformers: [
    transformerDirectives(),
  ],
  theme: {
    colors: {
      // Claude brand-inspired colors
      claude: {
        primary: '#D97757',
        surface: {
          light: '#FFFFFF',
          dark: '#1A1A1A',
        },
        text: {
          light: '#1A1A1A',
          dark: '#F5F5F5',
        },
        border: {
          light: '#E5E5E5',
          dark: '#333333',
        },
        hover: {
          light: '#F5F5F5',
          dark: '#2A2A2A',
        },
      },
    },
  },
  shortcuts: {
    // Base component shortcuts
    'cc-input': 'w-full px-4 py-3 bg-transparent border-none outline-none text-base placeholder-gray-400',
    'cc-item': 'flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors duration-150',
    'cc-item-hover': 'bg-claude-hover-light dark:bg-claude-hover-dark',
    'cc-kbd': 'px-1.5 py-0.5 text-xs font-mono rounded border bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700',
    'cc-badge': 'px-2 py-0.5 text-xs rounded-full',
  },
  safelist: [
    'i-lucide-search',
    'i-lucide-git-branch',
    'i-lucide-message-square',
    'i-lucide-clock',
    'i-lucide-x',
    'i-lucide-command',
    'i-lucide-corner-down-left',
    'i-lucide-arrow-up',
    'i-lucide-arrow-down',
  ],
})
