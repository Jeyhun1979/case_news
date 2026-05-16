import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const repositoryBase = '/case_news/'

function githubPagesSpaFallback() {
  return {
    name: 'github-pages-spa-fallback',
    closeBundle() {
      const indexPath = resolve(__dirname, 'dist/index.html')
      copyFileSync(indexPath, resolve(__dirname, 'dist/404.html'))
    },
  }
}

export default defineConfig(({ command }) => ({
  base: command === 'build' ? repositoryBase : '/',
  plugins: [react(), command === 'build' ? githubPagesSpaFallback() : null].filter(
    Boolean,
  ),
  server: {
    port: 3000,
    strictPort: true,
  },
}))
