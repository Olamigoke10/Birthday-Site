import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Expose both VITE_ and NEXT_PUBLIC_ env vars to the browser
  // (Vercel-Supabase integration uses NEXT_PUBLIC_ prefix)
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
})
