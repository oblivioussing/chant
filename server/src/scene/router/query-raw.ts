import { Prisma, type Router } from '@prisma/client'
import { prisma } from '@/share'

function like(val = '') {
  return Prisma.raw(`'%${val}%'`)
}

export default {
  // 获取路由列表
  async getList(router: Router) {
    const rows = await prisma.$queryRaw<Router[]>`
      WITH RECURSIVE descendants AS (
        SELECT id, level, name, parent_id as parentId, path, sequence
        FROM router
        WHERE parent_id = ${router.id} 
        AND name LIKE ${like(router.name)}
        AND path LIKE ${like(router.path)}
        UNION ALL
        SELECT r.id, r.level, r.name, r.parent_id as parentId, r.path, r.sequence
        FROM router r 
        INNER JOIN descendants d ON r.parent_id = d.id and r.level = d.level
      )
      SELECT * FROM descendants ORDER BY sequence ASC;
    `
    return rows
  },
  // 获取路由树列表
  async getTreeList(router: Router) {
    const rows = await prisma.$queryRaw<Router[]>`
      WITH RECURSIVE descendants AS (
        SELECT id, level, name, parent_id as parentId, path, sequence, three_level as threeLevel
        FROM router
        WHERE id = (
			    SELECT id 
          FROM 
          chant.router 
          WHERE name LIKE ${like(router.name)}
          ORDER By level ASC, sequence ASC 
          LIMIT 1
		    )
        UNION ALL
        SELECT r.id, r.level, r.name, r.parent_id as parentId, r.path, r.sequence, three_level
        FROM router r 
        INNER JOIN descendants d 
        ON r.parent_id = d.id
        AND menu = '1'
      )
      SELECT * FROM descendants ORDER BY sequence ASC;
    `
    return rows
  },
  // 获取后代id
  async getDescendantIds(id: string) {
    const rows = await prisma.$queryRaw<Router[]>`
      WITH RECURSIVE descendants AS (
        SELECT id
        FROM router
        WHERE id = ${id}
        UNION ALL
        SELECT r.id
        FROM router r 
        INNER JOIN descendants d ON r.parent_id = d.id
      )
      SELECT * FROM descendants;
    `
    return rows
  }
}
