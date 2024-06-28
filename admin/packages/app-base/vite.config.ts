import { fileURLToPath, URL } from 'node:url'
import autoImport from 'unplugin-auto-import/vite'
import components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { defineConfig, loadEnv } from 'vite'
import { lazyImport, VxeResolver } from 'vite-plugin-lazy-import'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import setupName from './vite-plugins/setup-name'

export default defineConfig(({ mode }) => {
  const { VITE_API_URL } = loadEnv(mode, 'env')
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
        resolvers: [ElementPlusResolver({ importStyle: 'sass' })]
      }),
      lazyImport({
        resolvers: [
          VxeResolver({
            libraryName: 'vxe-table'
          })
        ]
      }),
      setupName(),
      vue(),
      vueJsx()
    ],
    resolve: {
      alias: {
        '@app-base': fileURLToPath(new URL('./src', import.meta.url)),
        '@chant': fileURLToPath(new URL('../chant', import.meta.url))
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@app-base/style/element-var.scss" as *;`
        }
      }
    },
    server: {
      port: 7001,
      proxy: {
        // api请求
        '/proxy': {
          target: VITE_API_URL,
          rewrite: (path) => path.replace(/proxy/, ''),
          changeOrigin: true,
          secure: false
        }
      }
    }
  }
})
