import { type Org as OrgOrig } from '@prisma/client'

type Extend = {
  delete: 0 | 1
}

export const orgEntity = {
  id: '', // id
  name: '', // 名称
  parentId: '', // 父节点id
  delete: 0 // 删除 0-否 1-是
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
