const { defineConfig } = require('vite')
const vue = require('@vitejs/plugin-vue2')
const path = require('path')

module.exports = defineConfig({
  base: process.env.GITHUB_PAGES ? '/etag-exception-pda/' : '/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    host: true,
    port: 5180,
    strictPort: true
  }
})
