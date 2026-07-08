import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// TensorFlow.js is loaded at runtime from a CDN (see src/lib/recognition.js),
// so it is intentionally NOT bundled here — keeps the bundle small and lets the
// model URL be swapped without a rebuild.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
