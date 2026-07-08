import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'SafeRent Korea — 개구리 가족의 월세 검토',
        short_name: 'SafeRent',
        description: '개구리 가족의 월세 계약 검수 시스템',
        theme_color: '#1a56db',
        background_color: '#f4f6fa',
        display: 'standalone',
        lang: 'ko',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ],
})
