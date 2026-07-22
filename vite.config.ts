import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  define: {
    'process.env.DRAGGABLE_DEBUG': 'false',
  },
  server: { host: true },
  preview: { host: true },
  plugins: [react(), VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['favicon.svg', 'icons/*.svg'],
    manifest: {
      name: 'signa. - Signature PDF locale',
      short_name: 'signa.',
      description: 'Signez vos documents PDF localement et en toute confidentialité.',
      theme_color: '#17212b',
      background_color: '#f5f7f7',
      display: 'standalone',
      orientation: 'portrait-primary',
      icons: [
        { src: '/icons/icon-192.svg', sizes: '192x192', type: 'image/svg+xml', purpose: 'any maskable' },
        { src: '/icons/icon-512.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'any maskable' },
      ],
    },
    workbox: { navigateFallback: '/index.html', globPatterns: ['**/*.{js,css,html,svg,png,woff2}'] },
  })],
})
