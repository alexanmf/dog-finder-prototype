import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANT: replace with your repo name
const repoName = 'dog-finder-prototype'

export default defineConfig({
  plugins: [react()],
  base: `/${repoName}/`,
})
