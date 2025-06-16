import { type Org } from '@prisma/client'

export const OrgEntity = {
  id: '', // id
  level: 0, // 等级
  name: '', // 名称
  roleIds: [], // 角色ids
  parentId: '', // 父节点id
  sequence: 0, // 序号
  isDelete: 0 // 删除 0-否 1-是
} satisfies Partial<Org>

export const orgDto = {
  ...OrgEntity
}

export const orgVo = {
  ...OrgEntity
}

export type OrgTree = Org & {
  children: OrgTree[]
}
