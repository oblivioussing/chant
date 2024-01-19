import qs from 'qs'
import {
  createRouter,
  createWebHistory,
  type RouteLocationNormalized
} from 'vue-router'
import { StorageEnum } from '@/enum'
import { base, storage } from '@/utils'

import app from './app' // app
import trade from './trade' // 交易管理
import user from './user' // 用户管理
import salary from './salary' // 工资管理

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...app, ...trade, ...user, ...salary]
})

// 全局解析守卫
router.beforeResolve((to: RouteLocationNormalized) => {
  // 跳转的页面参数
  const queryMap = storage.getSession(StorageEnum.PageQuery) || ({} as any)
  const { path, query } = to
  const store = queryMap[path]
  const queryEmpty = base.isEmptyObject(query)
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

export default router
