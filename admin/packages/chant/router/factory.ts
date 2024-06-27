import Develop from '@app-base/components/Develop.vue'
import { useAuthStore } from '../store'
import type { MenuItem } from '../type'
import app from './app'
import router from './index'

export type Modules = Record<string, () => Promise<{ [key: string]: any }>>
const modules = import.meta.glob('@app-base/views/**/*.vue') as Modules
const appPaths = app.map((item) => item.path)

function factory() {
  const routes = router.getRoutes()
  routes.forEach((item) => {
    if (!appPaths.includes(item.path)) {
      router.removeRoute(item.name!)
    }
  })
  // store
  const authStore = useAuthStore()
  // menu
  const menu = authStore.state.menu
  menu?.forEach((item) => {
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
    const component = modules[url] || Develop
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
