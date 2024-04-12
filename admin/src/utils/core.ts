import type { FormColumn, ListColumn } from '@/chant'
import { BusEnum, LangEnum, StorageEnum } from '@/enum'
import { clone } from './base'
import bus from './bus'
import storage from './storage'

type Columns = FormColumn[] | ListColumn[]

type PageStorage = {
  formType?: string
  tableFilter?: any
}

// 清空url参数
export function clearUrlQuery(path: string) {
  // 移除路由参数缓存
  removeRouterQuery(path)
  history.replaceState(history.state, '', path)
}
// 关闭页面
export function closePage(path?: string) {
  bus.emit(BusEnum.ClosePage, path || '')
}
// 获取父页面路径
export function getParentPath(path: string) {
  const obj = storage.getSession(StorageEnum.PageParent)
  return obj && obj[path]
}
// 获取页面缓存
export function getPageStorage(path: string): PageStorage | undefined {
  const obj = storage.getLocal(StorageEnum.Page)
  return obj && obj[path]
}
// 设置路由缓存
export function setPageStorage(
  path: string,
  type: keyof PageStorage,
  data: any
) {
  const obj = storage.getLocal(StorageEnum.Page) || {}
  const pageStorage = getPageStorage(path) || {}
  pageStorage[type] = data
  obj[path] = pageStorage
  storage.setLocal(StorageEnum.Page, obj)
}
// 移除路由参数缓存
export function removeRouterQuery(path: string) {
  const pageQuery = storage.getSession(StorageEnum.PageQuery)
  if (pageQuery) {
    Reflect.deleteProperty(pageQuery, path)
    storage.setSession(StorageEnum.PageQuery, pageQuery)
  }
}
// 修改字段
export function updateColumn<T extends Columns>(
  list: T,
  row: FormColumn | ListColumn,
  config?: { delete?: boolean; merge?: boolean }
): T {
  list = clone(list)
  const index = list.findIndex((item) => item.prop === row.prop)
  if (config?.merge) {
    list[index] = Object.assign(list[index], row)
  } else if (config?.delete) {
    list.splice(index, 1)
  } else {
    list[index] = row
  }
  return list
}
// 国际化字符拼接
export function i18nJoint(list: string[]) {
  const lang = storage.getLocal(StorageEnum.Lang) as LangEnum
  let splicer = ''
  if ([LangEnum.En].includes(lang)) {
    splicer = ' '
  }
  return list.join(splicer)
}
