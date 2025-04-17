import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import commonjs from 'vite-plugin-commonjs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [preact(), commonjs()],
  build: {
    commonjsOptions: { transformMixedEsModules: true }, // Change
  },
  assetsInclude: ["**/*.xml"]
})
