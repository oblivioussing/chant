import { type Role as RoleOrig } from '@prisma/client'

type Extend = {
  isDelete: 0 | 1
}

export const roleEntity = {
  id: '', // id
  level: 0, // 等级
  name: '', // 名称
  parentId: '', // 父节点id
  sequence: 0, // 序号
  isDelete: 0 // 删除 0-否 1-是
} as RoleOrig & Extend

export const roleDto = {
  ...roleEntity
}

export const roleVo = {
  ...roleEntity
}

export type Role = typeof roleEntity

export type RoleDto = typeof roleDto

export type RoleVo = typeof roleVo

export type RoleTree = Role & {
  children: RoleTree[]
}

export type RouteItem = {
  first: string
  second: string
  third: string
}
