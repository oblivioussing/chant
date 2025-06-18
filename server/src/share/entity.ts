import { type ApiCode } from '@/type'

export class PageData<T> {
  extra?: any
  list: T[]
  total: number
}

export class Result<T = null> {
  code = '' as ApiCode
  data = null as T | null
  msg = ''
  // 成功
  success(row?: { data?: any; msg?: string }) {
    const { data, msg } = row || {}
    this.code = '1'
    this.data = data || this.data
    this.msg = msg || this.msg
  }
  // 失败
  fail(msg?: string) {
    this.code = '2'
    this.msg = msg || this.msg
  }
}
