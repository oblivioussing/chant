import { Prisma, PrismaClient } from '@prisma/client'

// prisma实例
export const prisma = new PrismaClient()
// 实体转查询字段
export function toSelect<T>(
  entity: T,
  config?: {
    alias?: string
    exclude?: (keyof T)[]
  }
) {
  const exclude = config?.exclude
  const alias = config?.alias
  const list = [] as string[]
  for (const item in entity) {
    if (!exclude?.includes(item)) {
      let field = item.replace(/([A-Z])/g, '_$1').toLowerCase()
      if (alias) {
        field = `${alias}.${field}`
      }
      if (field.indexOf('_') >= 0) {
        field = `${field} as ${item}`
      }
      list.push(field)
    }
  }
  return Prisma.raw(list.join(','))
}
// 实体转查询条件
export function toWhere<T extends Record<string, any>>(
  entity: T,
  config?: {
    alias?: string
    like?: (keyof T)[]
  }
) {
  const keys = Object.keys(entity)
  if (!keys.length) {
    return Prisma.empty
  }
  const alias = config?.alias
  return keys.reduce((acc: any, cur, index) => {
    let field = cur.replace(/([A-Z])/g, '_$1').toLowerCase()
    if (alias) {
      field = `${alias}.${field}`
    }
    const column = Prisma.raw(field)
    let value
    if (config?.like.includes(cur)) {
      value = Prisma.sql`${Prisma.raw('LIKE')} '%${entity[cur]}%'`
    } else {
      value = Prisma.sql`= ${entity[cur]}`
    }
    return Prisma.sql`${acc} ${column} ${value}`
  }, Prisma.sql`WHERE`)
}
