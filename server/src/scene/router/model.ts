import { type Router } from '@prisma/client'

export const routerEntity = {
  id: '', // id
  code: '', // 编号
  icon: '', // 图标
  level: 0, // 等级
  menu: 0, // 菜单
  name: '', // 名称
  parentId: '', // 父节点id
  path: '', // 路径
  sequence: 0, // 序号
  threeMenu: 0, // 三级菜单
  type: '', // 类型
  isDelete: 0 // 删除
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
