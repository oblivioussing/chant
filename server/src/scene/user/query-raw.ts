import { type Role, type User } from '@prisma/client'
import { prisma, toSelect, toWhere } from '@/share'
import { Page } from '@/type'
import { userEntity } from './model'

function getSelect() {
  return toSelect(userEntity, {
    alias: 'u',
    exclude: ['avatar', 'roleIds']
  })
}
function getWhere(user: User) {
  return toWhere(user, {
    alias: 'u',
    like: ['loginName', 'name', 'phone']
  })
}

export default {
  // 获取列表
  async getList(user: User, page: Page) {
    const offset = (page.pageNum - 1) * page.pageSize
    const rows = await prisma.$queryRaw<User[]>`
      SELECT 
        ${getSelect()},
        o.name as orgName,
        p.name as positionName,
        GROUP_CONCAT(r.name ORDER BY r.name SEPARATOR ',') as roleNames
      FROM 
        user u 
      LEFT JOIN 
        org o ON u.org_id = o.id
      LEFT JOIN
        position p ON u.position_id = p.id
      JOIN 
        JSON_TABLE(u.role_ids, '$[*]' COLUMNS (roleId varchar(20) PATH '$')) AS jt
      JOIN 
        role r ON jt.roleId = r.id COLLATE utf8mb4_unicode_ci
      ${getWhere(user)}
      GROUP BY 
        u.id, u.name, o.name
      ORDER BY
        u.create_time desc
      LIMIT
        ${page.pageSize} OFFSET ${offset};
    `
    const row = await prisma.$queryRaw`
      SELECT COUNT(id) as total FROM user as u ${getWhere(user)}
    `
    const total = Number(row[0]?.total)
    return { rows, total }
  },
  // 获取角色
  async getRoles(id: string) {
    const rows = await prisma.$queryRaw<Role[]>`
      SELECT 
        r.id,
        r.name
      FROM 
          user u
      LEFT JOIN 
        JSON_TABLE(
            u.role_ids,
            '$[*]' COLUMNS (roleId varchar(20) PATH '$')
        ) AS jt ON jt.roleId IS NOT NULL
      LEFT JOIN 
        role r ON jt.roleId = r.id COLLATE utf8mb4_unicode_ci
      WHERE 
        u.id = ${id};
    `
    return rows
  }
}
