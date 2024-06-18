import { type Position } from '@prisma/client'

export const positionEntity = {
  id: '', // id
  name: '', // 名称
  orgId: '', // 组织id
  isDelete: 0 // 删除 0-否 1-是
} as Position

export const positionDto = {
  ...positionEntity
}

export const positionVo = {
  ...positionEntity
}

export type PositionDto = typeof positionDto

export type PositionVo = typeof positionVo
