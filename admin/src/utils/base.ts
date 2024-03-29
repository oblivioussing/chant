import { ContentTypeEnum } from '../enum'

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
// 简单数组去重
export function sole(arr: any[]) {
  return Array.from(new Set(arr))
}
