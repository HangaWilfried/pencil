import { defineConfig } from 'cypress'

export default defineConfig({
  viewportHeight: 1024,
  viewportWidth: 800,
  e2e: {
    specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}',
    baseUrl: 'http://localhost:4173',
  },
})
