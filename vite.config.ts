import path from 'path'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    global: 'globalThis',
  },
  publicDir: 'public',
  server: {
    port: 3000,
    host: true
  },
  build: {
    // Optimize bundle size
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // Keep console for Android WebView debugging
        drop_debugger: true,
        // Keep console.error and console.warn for error tracking
        pure_funcs: ['console.trace'], // Only remove trace
      },
    },
    // Split vendor chunks
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'motion-vendor': ['framer-motion', 'motion'],
          'utils-vendor': ['date-fns', 'clsx', 'tailwind-merge'],
          'supabase-vendor': ['@supabase/supabase-js'],
          'form-vendor': ['react-hook-form', 'zod'],
          'crypto-vendor': ['bcryptjs', 'jsonwebtoken'],
        },
      },
    },
    // Chunk size warnings
    chunkSizeWarningLimit: 1000,
    // Source maps only in development
    sourcemap: false,
    // Assets optimization
    assetsInlineLimit: 4096,
    // CSS code splitting
    cssCodeSplit: true,
    // Target modern browsers
    target: 'es2020',
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion', '@supabase/supabase-js'],
    exclude: [],
  },
})
