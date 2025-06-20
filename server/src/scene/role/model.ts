import { type Role } from '@prisma/client'

export const roleEntity = {
  id: '', // id
  level: 0, // 等级
  name: '', // 名称
  parentId: '', // 父节点id
  routerIds: [], // 路由ids
  sequence: 0, // 序号
  isDelete: 0 // 删除 0-否 1-是
} satisfies Partial<Role>

export const roleDto = {
  ...roleEntity
}

export const roleVo = {
  ...roleEntity
}

export type RoleEntity = typeof roleEntity

export type RoleDto = typeof roleDto

export type RoleVo = typeof roleVo

export type RoleTree = Role & {
  children: RoleTree[]
}

export type MenuItem = {
  id: string
  name: string
  checked: 0 | 1
}

export type RouterItem = {
  id: string
  first: MenuItem
  second: MenuItem
  third: MenuItem
  funs: MenuItem[]
}

export type RouterParams = {
  id: string
  relate?: 0 | 1
  routerIds?: string[]
}
