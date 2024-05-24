import type { Prisma, Router } from '@prisma/client'
import { prisma, BaseService, Result } from '@/share'
import { Many } from '@/type'
import { base } from '@/utils'
import { routerEntity, type RouterTree, type RouterVo } from './model'
import queryRaw from './query-raw'

export class RouterService extends BaseService {
  constructor() {
    super()
  }
  // 新增
  async add(router: Router) {
    const result = new Result()
    const data = base.toEntity(
      router,
      routerEntity,
      true
    ) as Prisma.RouterCreateInput
    data.id = base.createId()
    // 获取序号
    const level = data.level
    const count = await prisma.router.count({ where: { level } })
    data.sequence = count
    // 菜单
    if (level <= 2) {
      data.menu = '1'
    }
    if (level === 3 && data.threeLevel) {
      data.menu = '1'
      data.threeLevel = ''
    }
    // create
    const row = await prisma.router.create({ data })
    if (row) {
      result.success({ msg: '路由新增成功' })
    } else {
      result.fail('路由新增失败')
    }
    return result
  }
  // 删除
  async delete(id: string) {
    const result = new Result()
    const row = prisma.router.deleteMany({
      where: { id: { in: [id] } }
    })
    if (row) {
      result.success({ msg: '路由删除成功' })
    } else {
      result.fail('路由删除失败')
    }
    return result
  }
  // 删除树
  async deleteTree(id: string) {
    const result = new Result()
    const rows = await queryRaw.getDescendantIds(id)
    const ids = rows.map((item) => item.id)
    const row = await prisma.router.deleteMany({
      where: { id: { in: ids } }
    })
    if (row.count) {
      result.success({ msg: '路由删除成功' })
    } else {
      result.fail('路由删除失败')
    }
    return result
  }
  // 批量删除
  async deletes(params: Many<Router>) {
    const result = new Result()
    const where = base.manyWhere(params, routerEntity)
    const row = await prisma.router.deleteMany({ where })
    if (row.count) {
      result.success({ msg: '路由批量删除成功' })
    } else {
      result.fail('路由批量删除失败')
    }
    return result
  }
  // 详情
  async detail(id: string) {
    const result = new Result<RouterVo>()
    const row = await prisma.router.findUnique({
      select: base.toSelect(routerEntity),
      where: { id }
    })
    if (row) {
      result.data = row
      result.success({ msg: '路由查询成功' })
    } else {
      result.fail('路由查询失败')
    }
    return result
  }
  // 列表
  async list(router: Router) {
    const result = new Result<RouterVo[]>()
    const rows = await queryRaw.getList(router)
    result.success({ data: rows, msg: '路由列表查询成功' })
    return result
  }
  // 树
  async tree(router: Router) {
    const result = new Result<RouterTree>()
    const rows = await queryRaw.getTreeList(router)
    result.success({ data: base.toTree(rows), msg: '路由树查询成功' })
    return result
  }
  // 更新
  async update(router: Router) {
    const result = new Result<Router>()
    const data = base.toEntity(router, routerEntity) as Router
    const row = await prisma.router.update({
      data,
      where: { id: router.id }
    })
    if (row) {
      result.success({ msg: '路由更新成功' })
    } else {
      result.fail('路由更新失败')
    }
    return result
  }
}
