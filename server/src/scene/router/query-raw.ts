import { Prisma, type Router } from '@prisma/client'
import { prisma, toSelect } from '@/share'
import { routerEntity } from './model'

function getSelect(alias?: string) {
  return toSelect(routerEntity, {
    exclude: ['icon'],
    alias
  })
}
function like(val = '') {
  return Prisma.sql`${`%${val}%`}`
}

export default {
  // 获取树列表
  async getTreeList(router?: Router) {
    const rows = await prisma.$queryRaw<Router[]>`
      WITH RECURSIVE descendants AS (
        SELECT 
          ${getSelect()}
        FROM 
          router
        WHERE id = (
			    SELECT 
            id 
          FROM 
            router 
          WHERE 
            name LIKE ${like(router.name)}
          ORDER By 
            level ASC, sequence ASC 
          LIMIT 1
		    )
        UNION ALL
        SELECT 
          ${getSelect('r')}
        FROM 
          router r 
        INNER JOIN 
          descendants d 
        ON 
          r.parent_id = d.id
        AND 
          r.menu = '1'
        AND r.is_delete = 0
      )
      SELECT * FROM descendants ORDER BY sequence ASC;
    `
    return rows
  },
  // 获取后代id
  async getDescendantIds(id: string) {
    const rows = await prisma.$queryRaw<Router[]>`
      WITH RECURSIVE descendants AS (
        SELECT 
          id
        FROM 
          router
        WHERE 
          id = ${id}
        UNION ALL
        SELECT 
          r.id
        FROM 
          router r 
        INNER JOIN 
          descendants d ON r.parent_id = d.id
      )
      SELECT * FROM descendants;
    `
    return rows
  }
}
