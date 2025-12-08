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
    // Optimize bundle size - use esbuild instead of terser for faster builds
    minify: 'esbuild',
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
    // Source maps disabled for faster builds
    sourcemap: false,
    // Assets optimization
    assetsInlineLimit: 4096,
    // CSS code splitting
    cssCodeSplit: true,
    // Target modern browsers
    target: 'es2020',
    // Faster builds
    reportCompressedSize: false,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion', '@supabase/supabase-js'],
    exclude: [],
  },
})
