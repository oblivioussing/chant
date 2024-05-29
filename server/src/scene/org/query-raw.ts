import { Prisma, type Org } from '@prisma/client'
import { prisma, toSelect } from '@/share'
import { orgEntity } from './model'

function like(val = '') {
  return Prisma.raw(`'%${val}%'`)
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
        UNION ALL
        SELECT ${getSelect('r')}
        FROM org r 
        INNER JOIN descendants d ON r.parent_id = d.id 
        AND r.level = d.level
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
          chant.org 
          WHERE name LIKE ${like(org?.name)}
          ORDER By level ASC, sequence ASC 
          LIMIT 1
		    )
        AND is_delete = 0
        UNION ALL
        SELECT ${getSelect('r')}
        FROM org r 
        INNER JOIN descendants d 
        ON r.parent_id = d.id
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
        SELECT r.id
        FROM org r 
        INNER JOIN descendants d ON r.parent_id = d.id
      )
      SELECT * FROM descendants;
    `
    return rows
  }
}
