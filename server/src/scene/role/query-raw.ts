import { Prisma, type Role } from '@prisma/client'
import { prisma, toSelect } from '@/share'
import { roleEntity } from './model'

function like(val = '') {
  return Prisma.raw(`'%${val}%'`)
}
function getSelect(alias?: string) {
  return toSelect(roleEntity, {
    exclude: ['isDelete', 'routerIds'],
    alias
  })
}

export default {
  // 获取列表
  async getList(role: Role) {
    const rows = await prisma.$queryRaw<Role[]>`
      WITH RECURSIVE descendants AS (
        SELECT ${getSelect()}
        FROM role
        WHERE parent_id = ${role.id} 
        AND name LIKE ${like(role.name)}
        AND is_delete = 0
        UNION ALL
        SELECT ${getSelect('r')}
        FROM role r 
        INNER JOIN descendants d ON r.parent_id = d.id 
        AND r.level = d.level
        AND r.is_delete = 0
      )
      SELECT * FROM descendants ORDER BY sequence ASC;
    `
    return rows
  },
  // 获取树列表
  async getTreeList(role?: Role) {
    const rows = await prisma.$queryRaw<Role[]>`
      WITH RECURSIVE descendants AS (
        SELECT ${getSelect()}
        FROM role
        WHERE id = (
			    SELECT id 
          FROM 
          role 
          WHERE name LIKE ${like(role?.name)}
          ORDER By level ASC, sequence ASC 
          LIMIT 1
		    )
        UNION ALL
        SELECT ${getSelect('r')}
        FROM role r 
        INNER JOIN descendants d 
        ON r.parent_id = d.id
        AND r.is_delete = 0
      )
      SELECT * FROM descendants ORDER BY sequence ASC;
    `
    return rows
  },
  // 获取后代id
  async getDescendantIds(id: string) {
    const rows = await prisma.$queryRaw<Role[]>`
      WITH RECURSIVE descendants AS (
        SELECT id
        FROM role
        WHERE id = ${id}
        UNION ALL
        SELECT r.id
        FROM role r 
        INNER JOIN descendants d ON r.parent_id = d.id
      )
      SELECT * FROM descendants;
    `
    return rows
  }
}
