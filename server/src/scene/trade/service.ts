import type { Trade } from '@prisma/client'
import { prisma, BaseService, PageData, Result } from '@/share'
import { Many, Page } from '@/type'
import { base } from '@/utils'
import { StatusEnum } from './enum'
import { TradeEntity, TradeVo } from './model'

export class TradeService extends BaseService {
  constructor() {
    super()
  }
  // 新增
  async add(trade: Trade) {
    const result = new Result()
    const tradeEntity = base.toEntity(trade, TradeEntity)
    const data = { ...tradeEntity } as Trade
    data.createId = this.getUid()
    data.createTime = new Date()
    data.id = base.createUid()
    data.status = StatusEnum.Normal
    const row = await prisma.trade.create({ data })
    if (row) {
      result.success({ msg: '交易新增成功' })
    } else {
      result.fail('交易新增失败')
    }
    return result
  }
  // 删除
  async delete(id: string) {
    const result = new Result()
    const row = await prisma.trade.delete({ where: { id } })
    if (row) {
      result.success({ msg: '交易删除成功' })
    } else {
      result.fail('交易删除失败')
    }
    return result
  }
  // 批量删除
  async deletes(params: Many<Trade>) {
    const result = new Result()
    const where = base.manyWhere(params, TradeEntity)
    const row = await prisma.trade.deleteMany({ where })
    if (row.count) {
      result.success({ msg: '批量删除成功' })
    } else {
      result.fail('批量删除失败')
    }
    return result
  }
  // 详情
  async detail(id: string) {
    const result = new Result<typeof TradeVo>()
    const row = await prisma.trade.findUnique({
      select: base.toSelect(TradeEntity),
      where: { id }
    })
    if (row) {
      const data = base.toEntity(row, TradeEntity)
      result.data = await this.userIdToName(data, ['belongId', 'userId'])
      result.success({ msg: '交易信息查询成功' })
    } else {
      result.fail('交易信息查询失败')
    }
    return result
  }
  // 列表
  async list(trade: Trade, page: Page) {
    const pageData = new PageData<typeof TradeVo>()
    const result = new Result<typeof pageData>()
    const rows = await prisma.trade.findMany({
      ...base.pageHelper(page, 'desc'),
      select: base.toSelect(TradeEntity),
      where: trade
    })
    const total = await prisma.trade.count({ where: trade })
    pageData.list = await this.userIdsToName(rows, ['belongId', 'userId'])
    pageData.total = total
    result.success({ data: pageData, msg: '查询交易列表成功' })
    return result
  }
  // 更新
  async update(trade: Trade) {
    const result = new Result()
    const tradeEntity = base.toEntity(trade, TradeEntity)
    const data = { ...tradeEntity } as Trade
    data.updateId = this.getUid()
    data.updateTime = new Date()
    const row = await prisma.trade.update({
      data,
      where: { id: trade.id }
    })
    if (row) {
      result.success({ msg: '交易更新成功' })
    } else {
      result.fail('交易更新失败')
    }
    return result
  }
}
