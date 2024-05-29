import { type Router as RouterOrig } from '@prisma/client'

type Extend = {
  menu: 0 | 1
  threeMenu: 0 | 1
  type: '1' | '2' | '3' | '4' | '5' // 1-一级菜单 2-二级菜单 3-三级菜单 4-页面 5-功能
  isDelete: 0 | 1
}

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
} as RouterOrig & Extend

export const routerDto = {
  ...routerEntity
}

export const routerVo = {
  ...routerEntity
}

export type Router = typeof routerEntity

export type RouterDto = typeof routerDto

export type RouterVo = typeof routerVo

export type RouterTree = Router & {
  children: RouterTree[]
}
