import { type Org } from '@prisma/client'
import { prisma, toSelect, toWhere } from '@/share'
import { orgEntity } from './model'

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
      SELECT 
        ${getSelect('o')},
        COALESCE(GROUP_CONCAT(r.name ORDER BY r.name SEPARATOR ','), '') AS roleNames
      FROM 
        org o
      LEFT JOIN 
        JSON_TABLE(
          o.role_ids,
          '$[*]' COLUMNS (roleId varchar(20) PATH '$')
        ) AS jt ON jt.roleId IS NOT NULL
      LEFT JOIN 
        role r ON jt.roleId = r.id COLLATE utf8mb4_unicode_ci
      WHERE
        o.parent_id = ${org.parentId}
      AND
        o.is_delete = 0
      GROUP BY 
        o.id
      ORDER BY
        o.sequence asc
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
			    SELECT 
            id 
          FROM 
            org 
          ${toWhere(org, { like: ['name'] })}
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
