import { type Position } from '@prisma/client'

export const PositionEntity = {
  id: '', // id
  name: '', // 名称
  orgId: '', // 组织id
  roleIds: [] as string[] // 角色ids
} satisfies Partial<Position>

export const positionDto = {
  ...PositionEntity
}

export const positionVo = {
  ...PositionEntity
}
