import {
  shiki,
  useUserStore,
  ApiCode,
  type RequestConfig,
  type Result
} from '@chant'
import router from '@app-base/router'

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
  if (result.code === ApiCode.AuthFailed) {
    router.push({ path: '/login' })
  }
  return result
})
