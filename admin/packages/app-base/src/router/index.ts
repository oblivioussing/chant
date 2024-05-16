import qs from 'qs'
import {
  createRouter,
  createWebHistory,
  type RouteLocationNormalized
} from 'vue-router'
import { storage, StorageEnum } from 'chant'

import app from './app' // app
import trade from './trade' // 交易管理
import salary from './salary' // 工资管理
import auth from './auth' // 权限管理

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...app, ...trade, ...salary, ...auth]
})

// 全局解析守卫
router.beforeResolve((to: RouteLocationNormalized) => {
  // 跳转的页面参数
  const queryMap = storage.getSession(StorageEnum.PageQuery) || ({} as any)
  const { path, query } = to
  const store = queryMap[path]
  const queryEmpty = isEmptyObject(query)
  if (queryEmpty && store) {
    const queryString = qs.stringify(store)
    setTimeout(() => {
      history.replaceState(history.state, '', `${path}?${queryString}`)
    }, 0)
    to.query = store
  } else {
    if (!queryEmpty) {
      queryMap[path] = query
      storage.setSession(StorageEnum.PageQuery, queryMap)
    }
  }
})
// 是否为空对象
function isEmptyObject(data: object) {
  if (typeof data === 'object') {
    const keys = Object.keys(data)
    return keys.length === 0
  } else {
    return true
  }
}

export default router
