import { Prisma, PrismaClient } from '@prisma/client'

// prisma实例
export const prisma = new PrismaClient()
// 实体转查询字段
export function toSelect<T>(
  entity: T,
  config?: {
    exclude?: (keyof T)[]
    alias?: string
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
