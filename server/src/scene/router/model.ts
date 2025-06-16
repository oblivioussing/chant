import { type Router } from '@prisma/client'

export const RouterEntity = {
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
} satisfies Partial<Router>

export const RouterDto = {
  ...RouterEntity
}

export const RouterVo = {
  ...RouterEntity
}
export type RouterTree = Router & {
  children: RouterTree[]
}
