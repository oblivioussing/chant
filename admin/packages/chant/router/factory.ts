import { useAuthStore } from '../store'
import type { MenuItem } from '../type'
import router from './index'

export type Modules = Record<string, () => Promise<{ [key: string]: any }>>
const modules = import.meta.glob('@app-base/views/**/*.vue') as Modules

function factory() {
  // store
  const authStore = useAuthStore()
  // routes
  const routes = authStore.state.menu
  routes?.forEach((item) => {
    // 加载路由
    addRoute(item)
  })
}
// 加载路由
function addRoute(row: MenuItem) {
  const { meta, path } = row
  if (path) {
    let url: any
    if (row.level === 2 || (row.level === 3 && row.threeMenu)) {
      url = `/src/views${path}/index.vue`
    } else {
      url = `/src/views${path}.vue`
    }
    const component = modules[url]
    router.addRoute('/', {
      path,
      name: path,
      component,
      meta
    })
  }
  if (row.children) {
    row.children.forEach((item) => {
      addRoute(item)
    })
  }
}

export default factory
