import { prisma, BaseService, Result } from '@/share'
import { base } from '@/utils'
import {
  roleEntity,
  type MenuItem,
  type Role,
  type RoleTree,
  type RouterItem
} from './model'
import queryRaw from './query-raw'

export class RoleService extends BaseService {
  constructor() {
    super()
  }

  // 根节点初始化
  async root() {
    const result = new Result()
    const data = base.toEntity({}, roleEntity, true)
    data.name = '管理员'
    data.id = base.createId()
    data.createId = this.getUid()
    data.createTime = new Date()
    console.log(data)
    // create
    const row = await prisma.role.create({ data })
    if (row) {
      result.success({ msg: '根节点初始化成功' })
    } else {
      result.fail('根节点初始化失败')
    }
    return result
  }
  // 新增
  async add(role: Role) {
    const result = new Result()
    const data = base.toEntity(role, roleEntity, true)
    data.createId = this.getUid()
    data.createTime = new Date()
    data.id = base.createUid()
    // 获取序号
    const count = await prisma.role.count({
      where: { level: data.level, parentId: role.id }
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
  // 更新
  async update(role: Role) {
    const result = new Result<Role>()
    const data = base.toEntity(role, roleEntity) as Role
    data.updateId = this.getUid()
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
  // 删除
  async delete(id: string) {
    const result = new Result()
    const rows = await queryRaw.getDescendantIds(id)
    const ids = rows.map((item) => item.id)
    const row = await prisma.role.updateMany({
      data: {
        isDelete: 1,
        updateId: this.getUid(),
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
      select: base.toSelect(roleEntity),
      where: { id }
    })
    if (row) {
      result.data = row as Role
      result.success({ msg: '角色查询成功' })
    } else {
      result.fail('角色查询失败')
    }
    return result
  }
  // 路由列表
  async router(id: string) {
    const result = new Result()
    const rows = await prisma.router.findMany({
      select: {
        id: true,
        level: true,
        name: true,
        parentId: true,
        threeMenu: true
      },
      where: { isDelete: 0, level: { gt: 0 } },
      orderBy: [{ level: 'asc' }, { sequence: 'asc' }]
    })
    // 一级菜单列表
    const firstList = [] as typeof rows
    // 二级菜单map
    const secondMap = {} as any
    // 三级菜单map
    const thirdMap = {} as any
    // 子菜单map
    const childrenMap = {} as Record<string, typeof rows>
    // 给map赋值
    rows.forEach((item) => {
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
      const first = this.toMenuItem(item)
      let childrens = childrenMap[item.id]
      // 添加功能
      const addFuns = (childrens: typeof rows, row: RouterItem) => {
        if (childrens) {
          row.funs = childrens.map((item) => this.toMenuItem(item))
          list.push(row)
        } else {
          list.push(row)
        }
      }
      // 二级菜单
      childrens.forEach((item1) => {
        const second = this.toMenuItem(item1)
        const row = { first, second } as RouterItem
        childrens = childrenMap[second.id]
        if (item1.threeMenu === 1) {
          // 三级菜单
          childrens.forEach((item2) => {
            const third = this.toMenuItem(item2)
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
  toMenuItem(data: any): MenuItem {
    return { id: data.id, name: data.name, checked: 0 }
  }
  // 树
  async tree(role: Role) {
    const result = new Result<RoleTree>()
    const rows = await queryRaw.getTreeList(role)
    result.success({ data: base.toTree(rows), msg: '角色树查询成功' })
    return result
  }
}