import { type Position } from '@prisma/client'
import { prisma, toSelect, toWhere } from '@/share'
import { PositionEntity } from './model'

function getSelect(alias?: string) {
  return toSelect(PositionEntity, {
    alias
  })
}

export default {
  // 获取列表
  async getList(position: Position) {
    const rows = await prisma.$queryRaw<Position[]>`
      SELECT 
        ${getSelect('p')},
        COALESCE(GROUP_CONCAT(r.name ORDER BY r.name SEPARATOR ','), '') AS roleNames
      FROM 
        position p
      LEFT JOIN 
        JSON_TABLE(
          p.role_ids,
          '$[*]' COLUMNS (roleId varchar(20) PATH '$')
        ) AS jt ON jt.roleId IS NOT NULL
      LEFT JOIN 
        role r ON jt.roleId = r.id COLLATE utf8mb4_unicode_ci
      ${toWhere(position, { alias: 'p' })}
      AND
        p.is_delete = 0
      GROUP BY 
        p.id
      ORDER BY
        p.create_time desc
    `
    return rows
  }
}
