import { defineConfig } from 'vite'

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "./node_modules/@uswds";
          @import "./node_modules/@uswds/uswds/packages";
          @import "./src/styles/_variables.scss";
        `
      }
    }
  }
})
