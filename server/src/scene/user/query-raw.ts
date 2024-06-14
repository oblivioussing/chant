import { type User } from '@prisma/client'
import { prisma, toSelect } from '@/share'
import { userEntity } from './model'

function getSelect() {
  return toSelect(userEntity, {
    exclude: ['avatar', 'roleIds'],
    alias: 'u'
  })
}

export default {
  // 获取列表
  async getList(user: User) {
    const rows = await prisma.$queryRaw<User[]>`
      SELECT 
        ${getSelect()},
        o.name as orgName,
        GROUP_CONCAT(r.name ORDER BY r.name SEPARATOR ',') as roleNames
      FROM 
        user u 
      LEFT JOIN 
        org o ON u.org_id = o.id
      JOIN 
        JSON_TABLE(u.role_ids, '$[*]' COLUMNS (roleId varchar(20) PATH '$')) AS jt
      INNER JOIN 
        role r ON jt.roleId = r.id COLLATE utf8mb4_unicode_ci
      GROUP BY 
        u.id, u.name, o.name
      ORDER BY
        u.create_time desc;
    `
    return rows
  }
}
