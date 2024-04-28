import { fileURLToPath, URL } from 'node:url'
import autoImport from 'unplugin-auto-import/vite'
import components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import setupName from './vite-plugins/setup-name'

export default defineConfig(() => {
  return {
    base: '/',
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version)
    },
    envDir: './env',
    plugins: [
      autoImport({
        resolvers: [ElementPlusResolver()]
      }),
      components({
        resolvers: [ElementPlusResolver()]
      }),
      setupName(),
      vue()
    ],
    resolve: {
      alias: {
        '@app-base': fileURLToPath(new URL('./src', import.meta.url)),
        '@chant': fileURLToPath(new URL('../chant', import.meta.url))
      }
    },
    server: {
      port: 7001
    }
  }
})
