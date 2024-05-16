import type { Prisma, Router } from '@prisma/client'
import { BaseService, PageData, Result } from '@/share'
import { Many, Page } from '@/type'
import { base } from '@/utils'
import { routerEntity, type RouterVo } from './model'

export class RouterService extends BaseService {
  private router: Prisma.RouterDelegate

  constructor() {
    super()
    this.router = this.prisma.router
  }
  // 新增
  async add(router: Router) {
    const result = new Result()
    const data = base.toEntity(router, routerEntity)
    data.id = base.createUid()
    const row = await this.router.create({ data })
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
    const data = await this.router.delete({ where: { id } })
    if (data) {
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
    const data = await this.router.deleteMany({ where })
    if (data.count) {
      result.success({ msg: '路由批量删除成功' })
    } else {
      result.fail('路由批量删除失败')
    }
    return result
  }
  // 详情
  async detail(id: string) {
    const result = new Result<RouterVo>()
    const data = await this.router.findUnique({
      select: base.toSelect(routerEntity),
      where: { id }
    })
    if (data) {
      result.data = data
      result.success({ msg: '路由查询成功' })
    } else {
      result.fail('路由查询失败')
    }
    return result
  }
  // 列表
  async list(router: Router, page: Page) {
    const pageData = new PageData<RouterVo>()
    const result = new Result<typeof pageData>()
    const rows = await this.router.findMany({
      ...base.pageHelper(page),
      select: base.toSelect(routerEntity),
      where: router
    })
    const total = await this.router.count({ where: router })
    pageData.list = rows
    pageData.total = total
    result.success({ data: pageData, msg: '路由列表查询成功' })
    return result
  }
  // 更新
  async update(router: Router) {
    const result = new Result<Router>()
    const data = base.toEntity(router, routerEntity) as Router
    const row = await this.router.update({
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
