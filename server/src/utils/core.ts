import type { Many, Page } from '@/type'
import { isDate } from './base'

// 批量操作查询条件
export function manyWhere<T>(params: Many<T>, entity: object) {
  if (params.allFlag === 1) {
    const search = params.search || {}
    for (const item in search) {
      if (search[item] === '') {
        Reflect.deleteProperty(search, item)
      }
    }
    return toModel(search, entity)
  } else {
    return { id: { in: params.idList } }
  }
}
// 实体转化
export function toModel<T>(data: Record<string, any>, entity: T): T {
  const obj = {} as T
  for (const item in data) {
    if (entity.hasOwnProperty(item)) {
      const entityValue = entity[item]
      const dataValue = data[item]
      if (isDate(entityValue)) {
        if (dataValue) {
          obj[item] = new Date(dataValue)
        } else {
          obj[item] = null
        }
      } else if (dataValue === null) {
        obj[item] = entityValue
      } else if (typeof entityValue === 'number') {
        obj[item] = Number(dataValue)
      } else if (typeof entityValue === 'string') {
        obj[item] = String(dataValue)
      } else {
        obj[item] = dataValue
      }
    }
  }
  return obj
}
// 分页
export function pageHelper(page: Page) {
  const { pageNum, pageSize } = page || {}
  return {
    skip: (pageNum - 1) * pageSize,
    take: pageSize
  }
}
