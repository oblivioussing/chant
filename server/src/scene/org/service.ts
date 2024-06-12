import { type Org } from '@prisma/client'
import { prisma, BaseService, Result } from '@/share'
import { base } from '@/utils'
import { orgEntity, type OrgTree } from './model'
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
    const rows = await queryRaw.getDescendantIds(id)
    const ids = rows.map((item) => item.id)
    const row = await prisma.org.updateMany({
      data: {
        isDelete: 1,
        updateId: this.getUid(),
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
