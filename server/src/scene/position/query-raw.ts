import { prisma, toSelect, toWhere } from '@/share'
import { positionEntity, type PositionEntity } from './model'

function getSelect(alias?: string) {
  return toSelect(positionEntity, {
    alias
  })
}

export default {
  // 获取列表
  async getList(position: PositionEntity) {
    const rows = await prisma.$queryRaw<PositionEntity[]>`
      SELECT 
        ${getSelect('p')},
        COALESCE(GROUP_CONCAT(r.name ORDER BY jt.ord SEPARATOR ','), '') AS roleNames
      FROM 
        position p
      LEFT JOIN 
        JSON_TABLE(
          p.role_ids,
          '$[*]' COLUMNS (
            roleId varchar(20) PATH '$',
            ord FOR ORDINALITY
          )
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
