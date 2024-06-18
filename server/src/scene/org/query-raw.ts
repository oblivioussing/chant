import { Prisma, type Org } from '@prisma/client'
import { prisma, toSelect } from '@/share'
import { orgEntity } from './model'

function like(val = '') {
  return Prisma.sql`${`%${val}%`}`
}
function getSelect(alias?: string) {
  return toSelect(orgEntity, {
    exclude: ['isDelete'],
    alias
  })
}

export default {
  // 获取列表
  async getList(org: Org) {
    const rows = await prisma.$queryRaw<Org[]>`
      WITH RECURSIVE descendants AS (
        SELECT ${getSelect()}
        FROM org
        WHERE parent_id = ${org.id} 
        AND name LIKE ${like(org.name)}
        AND is_delete = 0
        UNION ALL
        SELECT ${getSelect('o')}
        FROM org o 
        INNER JOIN descendants d ON o.parent_id = d.id 
        AND o.level = d.level
        AND o.is_delete = 0
      )
      SELECT * FROM descendants ORDER BY sequence ASC;
    `
    return rows
  },
  // 获取树列表
  async getTreeList(org?: Org) {
    const rows = await prisma.$queryRaw<Org[]>`
      WITH RECURSIVE descendants AS (
        SELECT ${getSelect()}
        FROM org
        WHERE id = (
			    SELECT id 
          FROM 
          org 
          WHERE name LIKE ${like(org.name)}
          ORDER By level ASC, sequence ASC 
          LIMIT 1
		    )
        UNION ALL
        SELECT ${getSelect('o')}
        FROM org o 
        INNER JOIN descendants d 
        ON o.parent_id = d.id
        AND o.is_delete = 0
      )
      SELECT * FROM descendants ORDER BY sequence ASC;
    `
    return rows
  },
  // 获取后代id
  async getDescendantIds(id: string) {
    const rows = await prisma.$queryRaw<Org[]>`
      WITH RECURSIVE descendants AS (
        SELECT id
        FROM org
        WHERE id = ${id}
        UNION ALL
        SELECT o.id
        FROM org o 
        INNER JOIN descendants d ON o.parent_id = d.id
      )
      SELECT * FROM descendants;
    `
    return rows
  }
}
