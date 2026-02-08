import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ["api.mobilklar.no"],
    host: "0.0.0.0",
    port: 9500,
  },
});
