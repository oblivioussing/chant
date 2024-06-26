import { ElMessage } from 'element-plus'
import { ContentTypeEnum } from '../enum'
import Ryougi, { type RequestConfig } from './ryougi'

type Config = {
  successTip?: boolean
  failTip?: boolean
}

type ApiCode =
  | '1' // 成功
  | '2' // 失败
  | '3' // 权限校验失败
  | '4' // 参数错误
  | '5' // 系统异常

export type Result = {
  code?: ApiCode
  data?: any
  msg?: string
}

class Shiki {
  private ryougi = new Ryougi()
  // 请求拦截器
  private requestInterceptors: Function[] = []
  // 响应拦截器
  private responseInterceptors: Function[] = []
  // 拦截器
  interceptors = {
    request: {
      use: (callback: Function) => {
        this.requestInterceptors.push(callback)
      }
    },
    response: {
      use: (callback: Function) => {
        this.responseInterceptors.push(callback)
      }
    }
  }

  constructor() {
    this.ryougi.baseurl = import.meta.env.DEV ? '/proxy/' : '/'
  }

  // get请求
  async get(url: string, params?: any, config?: Config) {
    const requestConfig: RequestConfig = { url, params, method: 'GET' }
    if (!config) {
      config = { successTip: false, failTip: true }
    }
    const result = await this.request(requestConfig, config)
    return result
  }
  // post请求
  async post(url: string, body?: object | FormData, config?: Config) {
    const requestConfig: RequestConfig = {
      url,
      body,
      method: 'POST'
    }
    if (!(body instanceof FormData)) {
      requestConfig.headers = {
        'content-type': ContentTypeEnum.Json
      }
    }
    if (!config) {
      config = { successTip: true, failTip: true }
    }
    const result = await this.request(requestConfig, config)
    return result
  }
  // fetch请求
  async request(requestConfig: RequestConfig, config?: Config) {
    // 请求拦截器
    this.requestInterceptors.forEach((callback) => {
      requestConfig = callback(requestConfig)
    })
    const response = await this.ryougi.request(requestConfig)
    let result = {} as Result
    if (response?.status !== 200) {
      this.message('error', response?.statusText, config)
      return result
    }
    const headers = response?.headers
    const contentType = headers?.get('content-type')?.split(';')[0]
    // json
    if (contentType === ContentTypeEnum.Json) {
      result = await response?.json()
      // 响应拦截器
      this.responseInterceptors.forEach((callback) => {
        result = callback(result)
      })
      const type = result.code === '1' ? 'success' : 'error'
      this.message(type, result.msg, config)
    }
    return result
  }
  // 消息提示
  private message(
    type: 'success' | 'error',
    message?: string,
    config?: Config
  ) {
    const successStatus = type === 'success' && config?.successTip
    const errorStatus = type === 'error' && config?.failTip
    if (successStatus || errorStatus) {
      ElMessage.closeAll()
      ElMessage({ type, message, duration: 3000, showClose: true })
    }
  }
}

export default new Shiki()
