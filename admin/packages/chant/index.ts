import { type App } from 'vue'
import components from './components'

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
