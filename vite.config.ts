import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { portfolioPlugin } from './content/vite-plugin.ts'

export default defineConfig({ plugins: [portfolioPlugin(), react()] })
