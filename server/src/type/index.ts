export type ApiCode =
  | '1' // 成功
  | '2' // 失败
  | '3' // 权限校验失败
  | '4' // 参数错误
  | '5' // 系统异常

export type Many<T> = {
  all?: 0 | 1
  extra?: Record<string, any>
  ids?: string[]
  search?: T
}

export type Page = {
  pageNum: number
  pageSize: number
}
