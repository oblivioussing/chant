import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import chant, { router, useAuthStore, vuei18n } from 'chant'
// element css
import 'element-plus/theme-chalk/el-loading.css'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-message-box.css'

const app = createApp(App)
// use
app.use(chant)
app.use(createPinia())
app.use(vuei18n)

async function init() {
  const excludes = ['/login']
  const path = location.pathname
  if (excludes.includes(path)) {
    app.use(router)
  } else {
    const authStore = useAuthStore()
    const { code } = await authStore.getAuth()
    app.use(router)
    if (code === '3') {
      router.push({ path: '/login' })
    }
  }
  app.mount('#app')
}

init()
