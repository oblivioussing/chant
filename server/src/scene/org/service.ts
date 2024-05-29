import { prisma, BaseService, Result } from '@/share'
import { Many } from '@/type'
import { base } from '@/utils'
import { orgEntity, type Org, type OrgTree } from './model'
import queryRaw from './query-raw'

export class OrgService extends BaseService {
  constructor() {
    super()
  }

  // 根节点初始化
  async root(org: Org) {
    const result = new Result()
    const data = base.toEntity(org, orgEntity, true)
    data.level = 0
    data.id = base.createId()
    data.createId = this.getUid()
    data.createTime = new Date()
    // create
    const row = await prisma.org.create({ data })
    if (row) {
      result.success({ msg: '组织架构新增成功' })
    } else {
      result.fail('组织架构新增失败')
    }
    return result
  }
  // 新增
  async add(org: Org) {
    const result = new Result()
    const data = base.toEntity(org, orgEntity, true)
    data.createId = this.getUid()
    data.createTime = new Date()
    data.id = base.createUid()
    const row = await prisma.org.create({ data })
    if (row) {
      result.success({ msg: '组织架构新增成功' })
    } else {
      result.fail('组织架构新增失败')
    }
    return result
  }
  // 更新
  async update(org: Org) {
    const result = new Result<Org>()
    const data = base.toEntity(org, orgEntity) as Org
    data.updateId = this.getUid()
    data.updateTime = new Date()
    const row = await prisma.org.update({
      data,
      where: { id: org.id }
    })
    if (row) {
      result.success({ msg: '组织架构更新成功' })
    } else {
      result.fail('组织架构更新失败')
    }
    return result
  }
  // 删除
  async delete(id: string) {
    const result = new Result()
    const row = await prisma.org.delete({ where: { id } })
    if (row) {
      result.success({ msg: '组织架构删除成功' })
    } else {
      result.fail('组织架构删除失败')
    }
    return result
  }
  // 批量删除
  async deletes(params: Many<Org>) {
    const result = new Result()
    const where = base.manyWhere(params, orgEntity)
    const row = await prisma.org.deleteMany({ where })
    if (row.count) {
      result.success({ msg: '组织架构批量删除成功' })
    } else {
      result.fail('组织架构批量删除失败')
    }
    return result
  }
  // 详情
  async detail(id: string) {
    const result = new Result<Org>()
    const row = await prisma.org.findUnique({
      select: base.toSelect(orgEntity),
      where: { id }
    })
    if (row) {
      result.data = row as Org
      result.success({ msg: '组织架构查询成功' })
    } else {
      result.fail('组织架构查询失败')
    }
    return result
  }
  // 列表
  async list(org: Org) {
    const result = new Result<Org[]>()
    const rows = await queryRaw.getList(org)
    result.success({ data: rows, msg: '组织架构列表查询成功' })
    return result
  }
  // 树
  async tree(org: Org) {
    const result = new Result<OrgTree>()
    const rows = await queryRaw.getTreeList(org)
    result.success({ data: base.toTree(rows), msg: '组织架构树查询成功' })
    return result
  }
}
