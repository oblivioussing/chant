import { type Org } from '@prisma/client'

export const orgEntity = {
  id: '', // id
  level: 0, // 等级
  name: '', // 名称
  roleIds: [], // 角色ids
  parentId: '', // 父节点id
  sequence: 0, // 序号
  isDelete: 0 // 删除 0-否 1-是
} satisfies Partial<Org>

export const orgDto = {
  ...orgEntity
}

export const orgVo = {
  ...orgEntity
}

export type OrgEntity = typeof orgEntity

export type OrgDto = typeof orgDto

export type OrgVo = typeof orgVo

export type OrgTree = Org & {
  children: OrgTree[]
}
