import { prisma, BaseService, Result } from '@/share'
import { base } from '@/utils'
import { routerEntity, type Router, type RouterTree } from './model'
import queryRaw from './query-raw'

export class RouterService extends BaseService {
  constructor() {
    super()
  }
  // 根节点初始化
  async root() {
    const result = new Result()
    const data = base.toEntity({}, routerEntity, true)
    data.name = '系统'
    data.id = base.createId()
    data.createId = this.getUid()
    data.createTime = new Date()
    // create
    const row = await prisma.router.create({ data })
    if (row) {
      result.success({ msg: '根节点初始化成功' })
    } else {
      result.fail('根节点初始化失败')
    }
    return result
  }
  // 新增
  async add(router: Router) {
    let result = new Result()
    const data = base.toEntity(router, routerEntity, true)
    data.id = base.createId()
    data.createId = this.getUid()
    data.createTime = new Date()
    // 数据处理
    result = await this.dataDeal(data)
    if (result.code !== '1') {
      return result
    }
    // 获取序号
    const count = await prisma.router.count({
      where: { level: data.level, parentId: router.id }
    })
    data.sequence = count
    // create
    const row = await prisma.router.create({ data })
    if (row) {
      result.success({ msg: '路由新增成功' })
    } else {
      result.fail('路由新增失败')
    }
    return result
  }
  // 更新
  async update(router: Router) {
    let result = new Result()
    const data = base.toEntity(router, routerEntity) as Router
    data.updateId = this.getUid()
    data.updateTime = new Date()
    // 数据处理
    result = await this.dataDeal(data)
    if (result.code !== '1') {
      return result
    }
    const row = await prisma.router.update({
      data,
      where: { id: data.id }
    })
    if (row) {
      result.success({ msg: '路由更新成功' })
    } else {
      result.fail('路由更新失败')
    }
    return result
  }
  // 数据处理
  private async dataDeal(data: Router) {
    const result = new Result()
    const { level } = data
    // 等级校验
    if (level <= 2) {
      data.menu = 1
      if (level <= 1) {
        data.path = ''
      }
      data.type = level.toString() as '1' | '2'
    }
    // 三级菜单
    if (data.threeMenu === 1) {
      if (level === 2) {
        data.path = ''
      }
      if (level === 3) {
        data.menu = 1
        data.type = '3'
      }
    }
    // 类型
    if (data.type === '5') {
      data.path = ''
    }
    // path
    if (data.path) {
      data.path = '/' + data.path.replace(/^\/|\/$/g, '')
    }
    if (data.path) {
      const row = await prisma.router.findFirst({ where: { path: data.path } })
      if (row && row.id !== data.id) {
        result.fail('路由已经存在')
        return result
      }
    }
    result.code = '1'
    return result
  }
  // 删除
  async delete(id: string) {
    const result = new Result()
    const rows = await queryRaw.getDescendantIds(id)
    const ids = rows.map((item) => item.id)
    const row = await prisma.router.updateMany({
      data: {
        isDelete: 1,
        updateId: this.getUid(),
        updateTime: new Date()
      },
      where: { id: { in: ids } }
    })
    if (row.count) {
      result.success({ msg: '路由删除成功' })
    } else {
      result.fail('路由删除失败')
    }
    return result
  }
  // 详情
  async detail(id: string) {
    const result = new Result<Router>()
    const row = await prisma.router.findUnique({
      select: base.toSelect(routerEntity),
      where: { id }
    })
    if (row) {
      result.data = row as Router
      result.success({ msg: '路由查询成功' })
    } else {
      result.fail('路由查询失败')
    }
    return result
  }
  // 列表
  async list(router: Router) {
    const result = new Result<Router[]>()
    const rows = await queryRaw.getList(router)
    result.success({ data: rows, msg: '路由列表查询成功' })
    return result
  }
  // 排序
  async sort(ids: string[]) {
    const result = new Result()
    const updates = ids.map((item, index) => {
      return prisma.router.update({
        data: { sequence: index },
        where: { id: item }
      })
    })
    const rows = await prisma.$transaction(updates)
    if (rows.length) {
      result.success({ msg: '排序成功' })
    } else {
      result.fail('排序失败')
    }
    return result
  }
  // 转移
  async transfer(params: { id: string; ids: string[] }) {
    const result = new Result()
    const row = await prisma.router.updateMany({
      data: { parentId: params.id },
      where: { id: { in: params.ids } }
    })
    if (row.count) {
      result.success({ msg: '转移成功' })
    } else {
      result.fail('转移失败')
    }
    return result
  }
  // 树
  async tree(router: Router) {
    const result = new Result<RouterTree>()
    const rows = await queryRaw.getTreeList(router)
    result.success({ data: base.toTree(rows), msg: '路由树查询成功' })
    return result
  }
  // 源
  async source() {
    const result = new Result<RouterTree>()
    const rows = await prisma.router.findMany({
      select: base.toSelect(routerEntity),
      where: {
        parentId: { not: '' },
        level: { not: 3 },
        menu: 1
      },
      orderBy: { sequence: 'asc' }
    })
    result.success({ data: base.toTree(rows), msg: '路由源查询成功' })
    return result
  }
  // 目标
  async target() {
    const result = new Result<RouterTree>()
    const rows = await prisma.router.findMany({
      select: base.toSelect(routerEntity),
      where: {
        parentId: { not: '' },
        level: 1,
        menu: 1
      },
      orderBy: { sequence: 'asc' }
    })
    result.success({ data: base.toTree(rows), msg: '路由目标查询成功' })
    return result
  }
}
