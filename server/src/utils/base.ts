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
// 数据添加模糊查询
export function toContains<T>(data: T, keys: (keyof T)[]) {
  for (const item in data) {
    if (keys.includes(item)) {
      data[item] = { contains: data[item] } as any
    }
  }
}
// 数据转实体
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
// 实体转查询字段
export function toSelect<T>(
  entity: T,
  exclude?: (keyof T)[]
): Record<keyof T, boolean> {
  const obj = {} as Record<keyof T, boolean>
  for (const item in entity) {
    if (!exclude?.includes(item)) {
      obj[item] = true
    }
  }
  return obj
}
// 列表转树
export function toTree(data: any[]) {
  const obj = {} as any
  data.forEach((item: any) => {
    obj[item.id] = item
  })
  const list = [] as any
  data.forEach((item: any) => {
    const parent = obj[item.pId]
    if (parent) {
      parent.children = parent.children || []
      parent.children.push(item)
    } else {
      list.push(item)
    }
  })
  return list
}
