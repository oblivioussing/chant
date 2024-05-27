import { type Router } from '@prisma/client'

export const routerEntity = {
  id: '', // id
  icon: '', // 图标
  level: 0, // 等级
  menu: 0, // 菜单
  name: '', // 名称
  parentId: '', // 父节点id
  path: '', // 路径
  sequence: 0, // 序号
  threeLevel: 0 // 三级菜单
} as Router
export const routerDto = {
  ...routerEntity
}
export const routerVo = {
  ...routerEntity
}
export type RouterDto = typeof routerDto
export type RouterVo = typeof routerVo
export type RouterTree = Router & {
  children: RouterTree[]
}
