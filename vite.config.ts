import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => ({
  // Base URL dla GitHub Pages - zmień na '/' dla innych hostingów
  base: process.env.GITHUB_PAGES === 'true' ? '/fachowiec-pwa/' : '/',
  server: {
    host: "127.0.0.1",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "robots.txt"],
      manifest: {
        name: "Fachowiec - Zarządzanie Zleceniami",
        short_name: "Fachowiec",
        description: "Kompleksowa aplikacja do zarządzania zleceniami, czasem pracy i klientami dla fachowców",
        theme_color: "#3b82f6",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        scope: process.env.GITHUB_PAGES === 'true' ? '/fachowiec-pwa/' : '/',
        start_url: process.env.GITHUB_PAGES === 'true' ? '/fachowiec-pwa/' : '/',
        icons: [
          {
            src: process.env.GITHUB_PAGES === 'true' ? "/fachowiec-pwa/pwa-192x192.png" : "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any"
          },
          {
            src: process.env.GITHUB_PAGES === 'true' ? "/fachowiec-pwa/pwa-512x512.png" : "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any"
          },
          {
            src: process.env.GITHUB_PAGES === 'true' ? "/fachowiec-pwa/pwa-maskable-192x192.png" : "/pwa-maskable-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable"
          },
          {
            src: process.env.GITHUB_PAGES === 'true' ? "/fachowiec-pwa/pwa-maskable-512x512.png" : "/pwa-maskable-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          }
        ],
        categories: ["business", "productivity", "utilities"],
        shortcuts: [
          {
            name: "Nowe zlecenie",
            short_name: "Zlecenie",
            description: "Utwórz nowe zlecenie",
            url: process.env.GITHUB_PAGES === 'true' ? "/fachowiec-pwa/jobs" : "/jobs",
            icons: [{ 
              src: process.env.GITHUB_PAGES === 'true' ? "/fachowiec-pwa/pwa-192x192.png" : "/pwa-192x192.png", 
              sizes: "192x192" 
            }]
          },
          {
            name: "Timer",
            short_name: "Timer",
            description: "Start time tracking",
            url: process.env.GITHUB_PAGES === 'true' ? "/fachowiec-pwa/time-tracking" : "/time-tracking",
            icons: [{ 
              src: process.env.GITHUB_PAGES === 'true' ? "/fachowiec-pwa/pwa-192x192.png" : "/pwa-192x192.png", 
              sizes: "192x192" 
            }]
          },
          {
            name: "Dashboard",
            short_name: "Dashboard",
            description: "Zobacz podsumowanie",
            url: process.env.GITHUB_PAGES === 'true' ? "/fachowiec-pwa/" : "/",
            icons: [{ 
              src: process.env.GITHUB_PAGES === 'true' ? "/fachowiec-pwa/pwa-192x192.png" : "/pwa-192x192.png", 
              sizes: "192x192" 
            }]
          }
        ]
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "images-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30
              }
            }
          }
        ],
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true
      },
      devOptions: {
        enabled: true,
        type: "module"
      }
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
