import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { resolve } from 'path'

// Build mode from environment
const isBackground = process.env.BUILD_TARGET === 'background'

export default defineConfig({
  plugins: [
    vue(),
    UnoCSS(),
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
