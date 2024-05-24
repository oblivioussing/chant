import { type Router } from '@prisma/client'
import { prisma } from '@/share'

export default {
  // 获取路由列表
  async getList(router: Router) {
    const rows = await prisma.$queryRaw<Router[]>`
      WITH RECURSIVE descendants AS (
        SELECT id,level,name,parent_id,path,sequence
        FROM router
        WHERE parent_id = ${router.id}
        UNION ALL
        SELECT r.id,r.level,r.name,r.parent_id,r.path,r.sequence
        FROM router r 
        INNER JOIN descendants d ON r.parent_id = d.id and r.level = d.level
      )
      SELECT * FROM descendants ORDER BY sequence ASC;
    `
    return rows
  }
}
