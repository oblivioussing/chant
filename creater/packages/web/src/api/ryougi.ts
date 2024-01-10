import qs from 'qs'
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch'

export enum ContentTypeEnum {
  Audio = 'audio/wav',
  Excel = 'application/vnd.ms-excel',
  Text = 'text/javascript',
  Wrod = 'application/msword',
  Json = 'application/json'
}

// 请求配置
export type RequestConfig = {
  body?: any
  headers?: Record<string, string>
  method?: 'GET' | 'POST'
  params?: any
  timeout?: number
  url: string
}

class Ryougi {
  // 基础请求url
  baseurl = '/'

  // fetch请求
  async request(config: RequestConfig) {
    const controller = new AbortController()
    const signal = controller.signal
    const timeout = config.timeout || 10 * 1000
    // fetch
    try {
      const response = await Promise.race([
        this.timeoutSetting(timeout, controller),
        this.fetch(config, signal)
      ])
      return response
    } catch (error) {
      console.error(error)
    }
  }

  // 超时设置
  private timeoutSetting(
    timeout: number,
    controller: AbortController
  ): Promise<Response> {
    return new Promise((resolve) => {
      setTimeout(() => {
        controller.abort()
        resolve(new Response('timeout', { status: 504, statusText: 'timeout' }))
      }, timeout)
    })
  }
  // fetch请求
  private async fetch(
    config: RequestConfig,
    signal: AbortSignal
  ): Promise<Response> {
    let { url, headers = {}, body } = config
    // 请求地址拼接
    if (!url.includes('http')) {
      url = `${this.baseurl}${url}`
    }
    // get
    if (config.method === 'GET') {
      // 参数拼接在url里面
      if (config.params) {
        const params = qs.stringify(config.params)
        url = `${url}?${params}`
      }
    }
    // post
    if (config.method === 'POST') {
      if (!headers['content-type']) {
        headers['content-type'] = ContentTypeEnum.Json
      }
    }
    // 序列化JSON字符串
    if (headers['content-type'] === ContentTypeEnum.Json) {
      body = JSON.stringify(body)
    }
    // 请求配置
    let requestInit: RequestInit = {
      body,
      headers,
      method: config.method,
      mode: 'cors',
      signal
    }
    const response = await fetch(url, requestInit)
    return response
  }
}

export default Ryougi
