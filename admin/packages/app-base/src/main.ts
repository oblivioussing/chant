import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import chant, { vuei18n } from 'chant'
import vxe from './plugs/vxe'
import router, { factory } from './router'

// element css
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-message-box.css'

const app = createApp(App)
// plugs
vxe(app)
// use
app.use(chant)
app.use(createPinia())
app.use(router)
app.use(vuei18n)

app.mount('#app')

factory()
