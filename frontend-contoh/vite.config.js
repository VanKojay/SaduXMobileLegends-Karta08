import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 9020, // ubah ke port yang kamu mau
    host: true, // agar bisa diakses dari network (IP LAN)
  },
})
