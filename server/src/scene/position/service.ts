import { type Position } from '@prisma/client'
import { prisma, BaseService, Result } from '@/share'
import { Many } from '@/type'
import { base } from '@/utils'
import { positionEntity, type PositionEntity } from './model'
import queryRaw from './query-raw'

export class PositionService extends BaseService {
  // 新增
  async add(position: PositionEntity) {
    const result = new Result()
    const data = { ...position } as Position
    data.createId = this.getUserId()
    data.createTime = new Date()
    data.id = base.createId()
    data.isDelete = 0
    const row = await prisma.position.create({ data })
    if (row) {
      result.success({ msg: '职位新增成功' })
    } else {
      result.fail('职位新增失败')
    }
    return result
  }
  // 删除
  async delete(id: string) {
    const result = new Result()
    const row = await prisma.position.delete({ where: { id } })
    if (row) {
      result.success({ msg: '职位删除成功' })
    } else {
      result.fail('职位删除失败')
    }
    return result
  }
  // 批量删除
  async deletes(params: Many<PositionEntity>) {
    const result = new Result()
    const where = base.manyWhere(params, positionEntity)
    const row = await prisma.position.deleteMany({ where })
    if (row.count) {
      result.success({ msg: '职位批量删除成功' })
    } else {
      result.fail('职位批量删除失败')
    }
    return result
  }
  // 详情
  async detail(id: string) {
    const result = new Result<PositionEntity>()
    const row = await prisma.position.findUnique({
      select: base.toSelect(positionEntity),
      where: { id }
    })
    if (row) {
      result.success({ data: row, msg: '职位查询成功' })
    } else {
      result.fail('职位查询失败')
    }
    return result
  }
  // 列表
  async list(position: PositionEntity) {
    const result = new Result<PositionEntity[]>()
    const rows = await queryRaw.getList(position)
    result.success({ data: rows, msg: '职位列表查询成功' })
    return result
  }
  // 更新
  async update(position: PositionEntity) {
    const result = new Result<Position>()
    const data = { ...position } as Position
    data.updateId = this.getUserId()
    data.updateTime = new Date()
    const row = await prisma.position.update({
      data,
      where: { id: position.id }
    })
    if (row) {
      result.success({ msg: '职位更新成功' })
    } else {
      result.fail('职位更新失败')
    }
    return result
  }
}
