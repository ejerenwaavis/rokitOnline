import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5005,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'public_html',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-stripe': ['@stripe/stripe-js', '@stripe/react-stripe-js'],
          'vendor-tiptap': ['@tiptap/react', '@tiptap/starter-kit', '@tiptap/extension-placeholder'],
          'vendor-swiper': ['swiper'],
          'vendor-ui': ['lucide-react', 'react-hot-toast', 'react-helmet-async'],
          'vendor-lightbox': ['yet-another-react-lightbox'],
          'vendor-motion': ['framer-motion'],
        },
      },
    },
  },
})
