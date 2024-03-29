export type Many<T> = {
  allFlag?: 0 | 1
  extra?: Record<string, any>
  idList?: string[]
  search?: T
}
export type Page = {
  pageNum: number
  pageSize: number
}
