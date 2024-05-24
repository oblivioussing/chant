import { Prisma, type Router } from '@prisma/client'
import { prisma } from '@/share'

export default {
  // 获取路由列表
  async getList(router: Router) {
    const { name, path } = router
    const rows = await prisma.$queryRaw<Router[]>`
      WITH RECURSIVE descendants AS (
        SELECT id, level, name, parent_id as parentId, path, sequence
        FROM router
        WHERE parent_id = ${router.id} 
        AND name LIKE  ${Prisma.raw(`'%${name || ''}%'`)}
        AND path LIKE  ${Prisma.raw(`'%${path || ''}%'`)}
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
    const name = router.name || ''
    const rows = await prisma.$queryRaw<Router[]>`
      WITH RECURSIVE descendants AS (
        SELECT id, level, name, parent_id as parentId, path, sequence
        FROM router
        WHERE id = (
			    SELECT id 
          FROM 
          chant.router 
          WHERE name LIKE ${Prisma.raw(`'%${name}%'`)}
          ORDER By level ASC, sequence ASC 
          LIMIT 1
		    )
        UNION ALL
        SELECT r.id, r.level, r.name, r.parent_id as parentId, r.path, r.sequence
        FROM router r 
        INNER JOIN descendants d ON r.parent_id = d.id
      )
      SELECT * FROM descendants ORDER BY sequence ASC;
    `
    return rows
  }
}
