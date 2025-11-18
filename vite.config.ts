import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      "/images": {  // Прокси для картинок
        target: "http://172.20.10.2:9000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/images/, "/sqlanalyzer"),
      }
    }, 
    port: 3000,
    watch: {
      usePolling: true,
    },
    host: true,
    strictPort: true,
    https: {  
      key: fs.readFileSync(path.resolve(__dirname, 'ca.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'ca.crt')),
    },
  },
  plugins: [
    react(),
    mkcert(), // Это создаст самоподписанные сертификаты
  ],
  base: "/sql-analyzer",
})