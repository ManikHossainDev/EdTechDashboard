import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    allowedHosts: ["mobilklar.merinasib.shop",],
    host:"0.0.0.0",
    port: 3232,
  }
})
