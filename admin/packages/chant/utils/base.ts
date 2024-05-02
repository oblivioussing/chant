import bus from './bus'
import { BusEnum, ContentTypeEnum, LangEnum, StorageEnum } from '../enum'
import storage from './storage'
import type { FormColumn, ListColumn } from '../type'

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
// 克隆
export function clone<T>(obj: T): T {
  let newobj: any
  if (typeof obj == 'object' && obj !== null) {
    newobj = obj instanceof Array ? [] : {}
    for (const i in obj) {
      newobj[i] = clone(obj[i])
    }
  } else {
    newobj = obj
  }
  return newobj
}
// 对象数组去重
export function distinct(arr: any[], field = 'id') {
  const res = new Map()
  return arr.filter((item) => !res.has(item[field]) && res.set(item[field], 1))
}
// 下载根据blob
export function downloadByBlob(row: {
  blob: Blob
  blobType: ContentTypeEnum
  filename: string
}) {
  const blob = new Blob([row.blob], { type: row.blobType })
  const url = window.URL.createObjectURL(blob)
  downloadByUrl({ url, filename: row.filename })
  URL.revokeObjectURL(url)
}
// 下载根据url
export function downloadByUrl(row: { url: string; filename?: string }) {
  const url = row.url
  let filename = row.filename
  if (!filename) {
    const list = row.url?.split('/')
    filename = list[list.length - 1]
  }
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.setAttribute('href', url)
  link.setAttribute('download', filename!)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
// 动态加载js文件
export function loadJs(url: string): Promise<void> {
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = url
    document.body.appendChild(script)
    script.addEventListener('load', () => {
      resolve()
    })
  })
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
// 国际化字符拼接
export function i18nJoint(list: string[]) {
  const lang = storage.getLocal(StorageEnum.Lang) as LangEnum
  let splicer = ''
  if ([LangEnum.En].includes(lang)) {
    splicer = ' '
  }
  return list.join(splicer)
}
// 移除路由参数缓存
export function removeRouterQuery(path: string) {
  const pageQuery = storage.getSession(StorageEnum.PageQuery)
  if (pageQuery) {
    Reflect.deleteProperty(pageQuery, path)
    storage.setSession(StorageEnum.PageQuery, pageQuery)
  }
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
// 简单数组去重
export function sole(arr: any[]) {
  return Array.from(new Set(arr))
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
