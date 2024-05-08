import { customAlphabet } from 'nanoid'
import { Prisma } from '@prisma/client'
import type { Many, Page } from '@/type'
import { decrypt } from './crypto'

type PageHelper = {
  skip: number
  take: number
  orderBy?: any
}

// 创建id
export function createId() {
  const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 20)
  return nanoid()
}
// 创建uid
export function createUid() {
  const nanoid = customAlphabet('1234567890', 20)
  return nanoid()
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
// 根据token获取uid
export function getUidByToken(token: string) {
  const [iv, hash] = token?.split('.') || []
  if (iv && hash) {
    return decrypt(iv, hash)
  } else {
    return ''
  }
}
// 是否为Date
export function isDate(value: any) {
  return value instanceof Date
}
// 是否为空
export function isEmpty(value: any) {
  return value === null || value === undefined || value === ''
}
// 是否不为空
export function isNotEmpty(value: any) {
  return value !== null && value !== undefined && value !== ''
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
      const value = data[item]
      const entityValue = entity[item]
      const isNumber = typeof entityValue === 'number'
      const isDecimal = entityValue instanceof Prisma.Decimal
      if (isDate(entityValue)) {
        if (value) {
          obj[item] = new Date(value)
        } else {
          obj[item] = undefined
        }
      } else if (isNumber || isDecimal) {
        obj[item] = Number(value)
      } else if (typeof entityValue === 'string') {
        obj[item] = isNotEmpty(value) ? String(value) : ''
      } else {
        obj[item] = value
      }
    }
  }
  return obj
}
