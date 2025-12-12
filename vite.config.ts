import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { resolve } from 'path'

// Build mode from environment
const isBackground = process.env.BUILD_TARGET === 'background'

/**
 * Plugin to inline CSS into JS for Chrome extension content scripts
 * This ensures styles are properly injected when the content script loads
 */
function inlineCssPlugin(): Plugin {
  return {
    name: 'inline-css',
    enforce: 'post',
    generateBundle(_, bundle) {
      // Find the CSS and JS files
      let cssCode = ''
      const cssFiles: string[] = []

      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (fileName.endsWith('.css') && chunk.type === 'asset') {
          cssCode += chunk.source
          cssFiles.push(fileName)
        }
      }

      // Remove CSS files from bundle
      for (const cssFile of cssFiles) {
        delete bundle[cssFile]
      }

      // Inject CSS into JS
      if (cssCode) {
        for (const [_, chunk] of Object.entries(bundle)) {
          if (chunk.type === 'chunk' && chunk.isEntry) {
            const injectCode = `
(function() {
  const style = document.createElement('style');
  style.setAttribute('data-claude-code-ext', '');
  style.textContent = ${JSON.stringify(cssCode)};
  document.head.appendChild(style);
})();
`
            chunk.code = injectCode + chunk.code
          }
        }
      }
    },
  }
}

export default defineConfig({
  plugins: [
    vue(),
    UnoCSS(),
    // Only inline CSS for content script, not background
    ...(!isBackground ? [inlineCssPlugin()] : []),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: !isBackground, // Only empty on first build (content)
    target: 'esnext',
    minify: 'esbuild',
    cssCodeSplit: false,
    sourcemap: false,
    rollupOptions: {
      input: isBackground
        ? { background: resolve(__dirname, 'src/background/index.ts') }
        : { content: resolve(__dirname, 'src/content/index.ts') },
      output: {
        entryFileNames: '[name].js',
        assetFileNames: 'assets/[name][extname]',
        // Bundle everything into single files for Chrome extension
        inlineDynamicImports: !isBackground,
        format: 'iife',
      },
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
})
