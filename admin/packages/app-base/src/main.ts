import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import chant, { router, useAuthStore, vuei18n } from 'chant'
import vxe from './plugs/vxe'

// element css
import 'element-plus/theme-chalk/el-loading.css'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-message-box.css'

const app = createApp(App)
// plugs
vxe(app)
// use
app.use(chant)
app.use(createPinia())
app.use(vuei18n)

async function init() {
  const authStore = useAuthStore()
  await authStore.getAuth()
  app.use(router)
  app.mount('#app')
}

init()
