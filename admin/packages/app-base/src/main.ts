import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { VxeColumn, VxeIcon, VxeTable, VxeTooltip } from 'vxe-table'

import App from './App.vue'
import chant, { vuei18n } from 'chant'
import router, { factory } from './router'

// element css
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-message-box.css'
// vxe-table css
import 'vxe-table/styles/cssvar.scss'
// shiki 拦截器
import 'chant/api/interceptor'

const app = createApp(App)
// use
app.use(chant)
app.use(createPinia())
app.use(router)
app.use(vuei18n)
app.use(VxeColumn)
app.use(VxeIcon)
app.use(VxeTable)
app.use(VxeTooltip)

app.mount('#app')

factory()
