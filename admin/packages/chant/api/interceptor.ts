import router from '@app-base/router'
import { useUserStore } from '../store'
import { type RequestConfig } from './ryougi'
import shiki, { type Result } from './shiki'

// 请求拦截器
shiki.interceptors.request.use((config: RequestConfig) => {
  const userStore = useUserStore()
  const token = userStore.state.token
  if (token) {
    if (!config.headers) {
      config.headers = {}
    }
    config.headers!['token'] = token
    config.headers!['lang'] = 'zh'
  }
  return config
})
// 响应拦截器
shiki.interceptors.response.use((result: Result) => {
  // 登录
  if (result.code === '3') {
    router.push({ path: '/login' })
  }
  return result
})
