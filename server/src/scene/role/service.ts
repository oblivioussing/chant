import type { Role } from '@prisma/client'
import { prisma, BaseService, Result } from '@/share'
import { base } from '@/utils'
import {
  RoleEntity,
  type MenuItem,
  type RoleTree,
  type RouterItem,
  type RouterParams
} from './model'
import { routerEntity, type RouterEntity } from '../router/model'
import queryRaw from './query-raw'

export class RoleService extends BaseService {
  // 新增
  async add(roleDto: typeof RoleEntity) {
    const result = new Result()
    const data = { ...roleDto } as Role
    data.createId = this.getUserId()
    data.createTime = new Date()
    data.id = base.createId()
    data.isDelete = 0
    data.routerIds = []
    // 获取序号
    const count = await prisma.role.count({
      where: { level: data.level, parentId: roleDto.id }
    })
    data.sequence = count
    const row = await prisma.role.create({ data })
    if (row) {
      result.success({ msg: '角色新增成功' })
    } else {
      result.fail('角色新增失败')
    }
    return result
  }
  // 删除
  async delete(id: string) {
    const result = new Result()
    const rows = await queryRaw.getDescendantIds(id)
    const ids = rows.map((item) => item.id)
    const row = await prisma.role.updateMany({
      data: {
        isDelete: 1,
        updateId: this.getUserId(),
        updateTime: new Date()
      },
      where: { id: { in: ids } }
    })
    if (row.count) {
      result.success({ msg: '角色删除成功' })
    } else {
      result.fail('角色删除失败')
    }
    return result
  }
  // 详情
  async detail(id: string) {
    const result = new Result<Role>()
    const row = await prisma.role.findUnique({
      select: base.toSelect(RoleEntity),
      where: { id }
    })
    if (row) {
      result.success({ data: row, msg: '角色查询成功' })
    } else {
      result.fail('角色查询失败')
    }
    return result
  }
  // 根节点初始化
  async root() {
    const result = new Result()
    const routerEntity = structuredClone(RoleEntity)
    const data = { ...routerEntity } as Role
    data.name = '管理员'
    data.id = base.createId()
    data.createId = this.getUserId()
    data.createTime = new Date()
    // create
    const row = await prisma.role.create({ data })
    if (row) {
      result.success({ msg: '根节点初始化成功' })
    } else {
      result.fail('根节点初始化失败')
    }
    return result
  }
  // 路由列表
  async router(id: string) {
    const result = new Result()
    const role = await prisma.role.findUnique({
      select: { routerIds: true },
      where: { id }
    })
    const rows = await prisma.router.findMany({
      select: base.toSelect(routerEntity),
      where: { isDelete: 0, level: { gt: 0 } },
      orderBy: [{ level: 'asc' }, { sequence: 'asc' }]
    })
    // 角色的路由ids
    const routerIds = role.routerIds as string[]
    // 一级菜单列表
    const firstList = [] as RouterEntity[]
    // 二级菜单map
    const secondMap = {} as any
    // 三级菜单map
    const thirdMap = {} as any
    // 子菜单map
    const childrenMap = {} as Record<string, RouterEntity[]>
    // 给map赋值
    rows.forEach((item: RouterEntity) => {
      const { level, threeMenu } = item
      if (level === 1) {
        firstList.push(item)
        return
      }
      if (level === 2) {
        secondMap[item.id] = item
      }
      if (level === 3 && threeMenu === 1) {
        thirdMap[item.id] = item
      }
      if (childrenMap[item.parentId]) {
        childrenMap[item.parentId].push(item)
      } else {
        childrenMap[item.parentId] = [item]
      }
    })
    // list
    const list = [] as RouterItem[]
    firstList.forEach((item) => {
      const first = this.toMenuItem(item, routerIds)
      let childrens = childrenMap[item.id]
      // 添加功能
      const addFuns = (childrens: RouterEntity[], row: RouterItem) => {
        if (childrens) {
          row.funs = childrens.map((item) => this.toMenuItem(item, routerIds))
          list.push(row)
        } else {
          list.push(row)
        }
      }
      // 二级菜单
      childrens.forEach((item1) => {
        const second = this.toMenuItem(item1, routerIds)
        const row = { first, second } as RouterItem
        childrens = childrenMap[second.id]
        if (item1.threeMenu === 1) {
          // 三级菜单
          childrens.forEach((item2) => {
            const third = this.toMenuItem(item2, routerIds)
            const row = { first, second, third } as RouterItem
            childrens = childrenMap[third.id]
            // 添加功能
            addFuns(childrens, row)
          })
        } else {
          // 添加功能
          addFuns(childrens, row)
        }
      })
    })
    result.success({ data: list, msg: '路由列表查询成功' })
    return result
  }
  // 转化为menuItem对象
  private toMenuItem(data: RouterEntity, routerIds: string[]): MenuItem {
    return {
      id: data.id,
      name: data.name,
      checked: routerIds?.includes(data.id) ? 1 : 0
    }
  }
  // 树
  async tree(role: typeof RoleEntity) {
    const result = new Result<RoleTree>()
    const rows = await queryRaw.getTreeList(role)
    result.success({ data: base.toTree(rows), msg: '角色树查询成功' })
    return result
  }
  // 更新
  async update(role: typeof RoleEntity) {
    const result = new Result<Role>()
    const data = { ...role } as Role
    data.updateId = this.getUserId()
    data.updateTime = new Date()
    const row = await prisma.role.update({
      data,
      where: { id: role.id }
    })
    if (row) {
      result.success({ msg: '角色更新成功' })
    } else {
      result.fail('角色更新失败')
    }
    return result
  }
  // 更新路由
  async updateRouter(params: RouterParams) {
    const result = new Result()
    let status = false
    if (Number(params.relate) === 1) {
      status = await this.updateRoles(params)
    } else {
      const row = await prisma.role.update({
        data: { routerIds: params.routerIds },
        where: { id: params.id }
      })
      status = !!row
    }
    if (status) {
      result.success({ msg: '角色路由更新成功' })
    } else {
      result.fail('角色路由更新失败')
    }
    return result
  }
  // 批量修改角色
  private async updateRoles(params: RouterParams) {
    let routerIds = params.routerIds as string[]
    const ancestors = await queryRaw.getAncestors(params.id)
    const updates = ancestors.map((item) => {
      if (item.id !== params.id) {
        routerIds = routerIds.concat(item.routerIds as string[])
        routerIds = base.distinct(routerIds)
      }
      return prisma.role.update({
        data: {
          routerIds,
          updateId: this.getUserId(),
          updateTime: new Date()
        },
        where: { id: item.id }
      })
    })
    const rows = await prisma.$transaction(updates)
    return rows.length > 0
  }
}
