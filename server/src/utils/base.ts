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
// 对象数组去重
export function distinct(arr: any[], key?: string) {
  if (key) {
    const res = new Map()
    return arr.filter((item) => !res.has(item[key]) && res.set(item[key], 1))
  } else {
    return Array.from(new Set(arr))
  }
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
  if (params.all === 1) {
    const search = params.search || {}
    for (const item in search) {
      if (!search[item]) {
        Reflect.deleteProperty(search, item)
      }
    }
    return toEntity(search, entity)
  } else {
    return { id: { in: params.ids } }
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
// 数据转实体
export function toEntity<T>(
  data: Record<string, any>,
  entity: T,
  fill?: boolean
): T {
  const obj = {} as any
  for (const item in entity) {
    if (!fill && isEmpty(data[item])) {
      continue
    }
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
      obj[item] = isNotEmpty(value) ? Number(value) : entityValue
    } else if (typeof entityValue === 'string') {
      obj[item] = isNotEmpty(value) ? String(value) : entityValue
    } else {
      obj[item] = value
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
export function toTree(
  data: any[],
  config?: { idKey?: string; parentKey?: string; exclude?: string[] }
) {
  const idKey = config?.idKey || 'id'
  const parentKey = config?.parentKey || 'parentId'
  const obj = {} as any
  data.forEach((item: any) => {
    obj[item[idKey]] = item
  })
  const list = [] as any[]
  function exclude(row: any) {
    if (config?.exclude) {
      config.exclude.forEach((item) => {
        Reflect.deleteProperty(row, item)
      })
    }
    return row
  }
  data.forEach((item: any) => {
    if (item[idKey] === item[parentKey]) {
      list.push(exclude(item))
      return
    }
    const parent = obj[item[parentKey]]
    if (parent) {
      parent.children = parent.children || []
      parent.children.push(exclude(item))
    } else {
      list.push(exclude(item))
    }
  })
  return list
}
// 数据转查询条件
export function toWhere<T>(
  data: T,
  config?: {
    like?: (keyof T)[]
  }
) {
  const obj = {} as any
  for (const item in data) {
    if (config?.like.includes(item)) {
      obj[item] = { contains: data[item] } as any
    } else {
      obj[item] = data[item]
    }
  }
  return obj
}
