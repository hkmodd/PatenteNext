import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    base: '/PatenteNext/',
    plugins: [
      react(), 
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['icon.svg'],
        workbox: {
          globPatterns: ['**/*.{js,css,html,svg,woff2}'],
          runtimeCaching: [
            {
              // Cache signal images — CacheFirst (they never change)
              urlPattern: /\/images\/segnali\/.+\.png$/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'signal-images',
                expiration: {
                  maxEntries: 500,
                  maxAgeSeconds: 60 * 60 * 24 * 90, // 90 days
                },
              },
            },
            {
              // Cache database.json and db-shards — StaleWhileRevalidate
              urlPattern: /\/(database\.json|db-shards\/.+\.json)/i,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'app-data',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
                },
              },
            },
          ],
        },
        manifest: {
          name: 'PatenteNext',
          short_name: 'PatenteNext',
          description: 'Simulatore Esame Patente B',
          theme_color: '#030303',
          background_color: '#030303',
          display: 'standalone',
          scope: '/PatenteNext/',
          start_url: '/PatenteNext/',
          icons: [
            {
              src: 'icon.svg',
              sizes: 'any',
              type: 'image/svg+xml',
              purpose: 'any maskable'
            }
          ]
        }
      })
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
