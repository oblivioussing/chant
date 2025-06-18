import { type Position } from '@prisma/client'

export const positionEntity = {
  id: '', // id
  name: '', // 名称
  orgId: '', // 组织id
  roleIds: [] as string[] // 角色ids
} satisfies Partial<Position>

export const positionDto = {
  ...positionEntity
}

export const positionVo = {
  ...positionEntity
}

export type PositionEntity = typeof positionEntity

export type PositionDto = typeof positionDto

export type PositionVo = typeof positionVo
