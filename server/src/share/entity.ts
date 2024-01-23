import { ApiCode } from '../enum'

export class PageData<T> {
  extra?: any
  list: T[]
  total: number
}

export class Result<T = object> {
  code = '' as ApiCode
  data = null as T
  msg = ''
  // 成功
  success(row?: { data?: any; msg?: string }) {
    const { data, msg } = row || {}
    this.code = ApiCode.Success
    this.data = data || this.data
    this.msg = msg || this.msg
  }
  // 失败
  fail(msg?: string) {
    this.code = ApiCode.Fail
    this.msg = msg || this.msg
  }
}
