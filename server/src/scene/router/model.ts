import { type Router } from '@prisma/client'

export const routerEntity = {
  id: '', // id
  icon: '', // 图标
  level: 0, // 等级
  name: '', // 名称
  path: '' // 路径
} as Router

export const routerDto = {
  ...routerEntity
}

export const routerVo = {
  ...routerEntity
}

export type RouterDto = typeof routerDto
export type RouterVo = typeof routerVo
