import { useRoute, useRouter } from 'vue-router'
import qs from 'qs'
import { StorageEnum } from '@/enum'
import { storage } from '@/utils'

function useChaoser() {
  const route = useRoute()
  const router = useRouter()

  // 路由跳转
  function push(config: { path: string; query?: any }) {
    const path = route?.path || ''
    const obj = storage.getSession(StorageEnum.PageParent) || {}
    obj[config.path] = path
    storage.setSession(StorageEnum.PageParent, obj)
    router.push({ path: config.path, query: config.query })
  }
  // 根据path获取meta
  function getMetaByPath(path?: string) {
    path = path || route.path
    path = path.replace(/\/$/g, '')
    const routes = router.getRoutes()
    const row = routes.find((item) => item.path === path)
    return row?.meta as any
  }
  // 修改页面url参数
  function updateUrlParams(query: Record<string, any>) {
    const queryString = qs.stringify(query)
    history.replaceState(history.state, '', `${route.path}?${queryString}`)
  }

  return { push, getMetaByPath, updateUrlParams }
}

export default useChaoser
