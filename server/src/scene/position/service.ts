import { type Position } from '@prisma/client'
import { prisma, BaseService, Result } from '@/share'
import { Many } from '@/type'
import { base } from '@/utils'
import { positionEntity } from './model'
import queryRaw from './query-raw'

export class PositionService extends BaseService {
  // 新增
  async add(position: Position) {
    const result = new Result()
    const data = base.toEntity(position, positionEntity, true)
    data.createId = this.getUid()
    data.createTime = new Date()
    data.id = base.createId()
    const row = await prisma.position.create({ data })
    if (row) {
      result.success({ msg: '职位新增成功' })
    } else {
      result.fail('职位新增失败')
    }
    return result
  }
  // 更新
  async update(position: Position) {
    const result = new Result<Position>()
    const data = base.toEntity(position, positionEntity) as Position
    data.updateId = this.getUid()
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
  async deletes(params: Many<Position>) {
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
    const result = new Result<Position>()
    const row = await prisma.position.findUnique({
      select: base.toSelect(positionEntity),
      where: { id }
    })
    if (row) {
      result.data = row as Position
      result.success({ msg: '职位查询成功' })
    } else {
      result.fail('职位查询失败')
    }
    return result
  }
  // 列表
  async list(position: Position) {
    const result = new Result<Position[]>()
    const rows = await queryRaw.getList(position)
    result.success({ data: rows, msg: '职位列表查询成功' })
    return result
  }
}
