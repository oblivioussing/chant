import { type App } from 'vue'
import components from './components/index'

// shiki 拦截器
import './api/interceptor'

function install(app: App<Element>) {
  components(app)
}

export default { install }

export * from './api'
export * from './enum'
export * from './plugs'
export * from './store'
export * from './type'
export * from './use'
export * from './utils'
