import type { Many, Page } from '@/type'
import { isDate } from './base'
import { Prisma } from '@prisma/client'

type PageHelper = {
  skip: number
  take: number
  orderBy?: any
}

// 实体转select
export function entityToSelect<T extends object>(
  entity: T
): Record<keyof T, boolean> {
  const obj = {} as Record<keyof T, boolean>
  for (const item in entity) {
    obj[item] = true
  }
  return obj
}
// 批量操作查询条件
export function manyWhere<T>(params: Many<T>, entity: object) {
  if (params.allFlag === 1) {
    const search = params.search || {}
    for (const item in search) {
      if (!search[item]) {
        Reflect.deleteProperty(search, item)
      }
    }
    return toEntity(search, entity)
  } else {
    return { id: { in: params.idList } }
  }
}
// 分页
export function pageHelper(page: Page, orderBy?: 'asc' | 'desc'): PageHelper {
  const { pageNum, pageSize } = page || {}
  const config = {
    skip: (pageNum - 1) * pageSize,
    take: pageSize
  }
  if (orderBy) {
    config['orderBy'] = { createTime: orderBy }
  }
  return config
}
// 实体转化
export function toEntity<T>(data: Record<string, any>, entity: T): T {
  const obj = {} as T
  for (const item in data) {
    if (entity.hasOwnProperty(item)) {
      const entityValue = entity[item]
      const dataValue = data[item]
      const isNumber = typeof entityValue === 'number'
      const isDecimal = entityValue instanceof Prisma.Decimal
      if (isDate(entityValue)) {
        if (dataValue) {
          obj[item] = new Date(dataValue)
        } else {
          obj[item] = undefined
        }
      } else if (isNumber || isDecimal) {
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
