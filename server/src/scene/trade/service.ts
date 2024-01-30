import { Trade, type Prisma } from '@prisma/client'
import { BaseService, PageData, Result } from '@/share'
import { Many, Page } from '@/type'
import { base, core } from '@/utils'
import { StatusEnum } from './enum'
import { tradeBase, tradeEntity, type TradeVo } from './model'

export class TradeService extends BaseService {
  private trade: Prisma.TradeDelegate

  constructor() {
    super()
    this.trade = this.prisma.trade
  }
  // 新增
  async add(trade: Trade) {
    const result = new Result()
    const data = core.toEntity(trade, tradeBase) as Trade
    data.createId = this.getUid()
    data.createTime = new Date()
    data.id = base.createUid()
    data.status = StatusEnum.Normal
    const row = await this.trade.create({ data })
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
    const data = await this.trade.delete({ where: { id } })
    if (data) {
      result.success({ msg: '交易删除成功' })
    } else {
      result.fail('交易删除失败')
    }
    return result
  }
  // 批量删除
  async deletes(params: Many<Trade>) {
    const result = new Result()
    const where = core.manyWhere(params, tradeEntity)
    const data = await this.trade.deleteMany({ where })
    if (data.count) {
      result.success({ msg: '批量删除成功' })
    } else {
      result.fail('批量删除失败')
    }
    return result
  }
  // 详情
  async detail(id: string) {
    const result = new Result<TradeVo>()
    let data = await this.trade.findUnique({
      select: core.entityToSelect(tradeBase),
      where: { id }
    })
    if (data) {
      data = core.toEntity(data, tradeBase)
      result.data = await this.userIdToName(data, ['belongId', 'userId'])
      result.success({ msg: '交易信息查询成功' })
    } else {
      result.fail('交易信息查询失败')
    }
    return result
  }
  // 列表
  async list(trade: Trade, page: Page) {
    const pageData = new PageData<Trade>()
    const result = new Result<typeof pageData>()
    const rows = await this.trade.findMany({
      ...core.pageHelper(page, 'desc'),
      select: core.entityToSelect(tradeBase),
      where: trade
    })
    const total = await this.trade.count({ where: trade })
    pageData.list = await this.userIdsToName(rows, ['belongId', 'userId'])
    pageData.total = total
    result.success({ data: pageData, msg: '查询交易列表成功' })
    return result
  }
  // 更新
  async update(trade: Trade) {
    const result = new Result<Trade>()
    const data = core.toEntity(trade, tradeBase) as Trade
    data.updateId = this.getUid()
    data.updateTime = new Date()
    const row = await this.trade.update({
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
