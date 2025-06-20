import { type Org } from '@prisma/client'
import { prisma, BaseService, Result } from '@/share'
import type { Many } from '@/type'
import { base } from '@/utils'
import { orgEntity, type OrgEntity, type OrgTree } from './model'
import queryRaw from './query-raw'

export class OrgService extends BaseService {
  // 新增
  async add(org: OrgEntity) {
    const result = new Result()
    const data = { ...org } as Org
    data.createId = this.getUserId()
    data.createTime = new Date()
    data.id = base.createId()
    // 获取序号
    const count = await prisma.org.count({
      where: { level: data.level, parentId: org.id }
    })
    data.sequence = count
    const row = await prisma.org.create({ data })
    if (row) {
      result.success({ msg: '组织架构新增成功' })
    } else {
      result.fail('组织架构新增失败')
    }
    return result
  }
  // 删除
  async delete(id: string) {
    const result = new Result()
    const rows = await queryRaw.getDescendantIds(id)
    const ids = rows.map((item) => item.id)
    const row = await prisma.org.updateMany({
      data: {
        isDelete: 1,
        updateId: this.getUserId(),
        updateTime: new Date()
      },
      where: { id: { in: ids } }
    })
    if (row.count) {
      result.success({ msg: '组织架构删除成功' })
    } else {
      result.fail('组织架构删除失败')
    }
    return result
  }
  // 批量删除
  async deletes(params: Many<OrgEntity>) {
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
    const result = new Result<OrgEntity>()
    const row = await prisma.org.findUnique({
      select: base.toSelect(orgEntity),
      where: { id }
    })
    if (row) {
      result.success({ data: row, msg: '组织架构查询成功' })
    } else {
      result.fail('组织架构查询失败')
    }
    return result
  }
  // 列表
  async list(org: OrgEntity) {
    const result = new Result<OrgEntity[]>()
    const rows = await queryRaw.getList(org)
    result.success({ data: rows, msg: '组织架构列表查询成功' })
    return result
  }
  // 根节点初始化
  async root(org: OrgEntity) {
    const result = new Result()
    const data = { ...org } as Org
    data.level = 0
    data.id = base.createId()
    data.createId = this.getUserId()
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
  // 树
  async tree(org: OrgEntity) {
    const result = new Result<OrgTree>()
    const rows = await queryRaw.getTreeList(org)
    result.success({ data: base.toTree(rows), msg: '组织架构树查询成功' })
    return result
  }
  // 更新
  async update(org: OrgEntity) {
    const result = new Result<Org>()
    const data = { ...org } as Org
    data.updateId = this.getUserId()
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
}
