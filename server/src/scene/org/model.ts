import { type Org as OrgOrig } from '@prisma/client'

type Extend = {
  isDelete: 0 | 1
}

export const orgEntity = {
  id: '', // id
  level: 0, // 等级
  name: '', // 名称
  parentId: '', // 父节点id
  sequence: 0, // 序号
  isDelete: 0 // 删除 0-否 1-是
} as OrgOrig & Extend

export const orgDto = {
  ...orgEntity
}

export const orgVo = {
  ...orgEntity
}

export type Org = typeof orgEntity

export type OrgDto = typeof orgDto

export type OrgVo = typeof orgVo

export type OrgTree = Org & {
  children: OrgTree[]
}
