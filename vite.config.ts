import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],

    server: {
      port: 3000,
      host: true
    },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },

    define: {
      'process.env': env
    },

    build: {
      outDir: 'dist'
    },

    base: '/'
  }
})