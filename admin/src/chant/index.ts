import { type App } from 'vue'
import components from './components'

function install(app: App<Element>) {
  components(app)
}

export default { install }
export * from './type'
export * from './utils'
