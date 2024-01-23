import { Injectable } from '@nestjs/common'
import { PrismaClient, Trade, type Prisma } from '@prisma/client'
import { PageData, Result } from '@/share'
import { Many, Page } from '@/type'
import { base, core } from '@/utils'
import { TradeEntity } from './model'

@Injectable()
export class TradeService {
  private trade: Prisma.TradeDelegate

  constructor() {
    const prisma = new PrismaClient()
    this.trade = prisma.trade
  }

  // 新增
  async add(trade: Trade) {
    const result = new Result()
    trade.id = base.createUid()
    trade.createTime = new Date()
    const data = core.toModel(trade, TradeEntity)
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
    const where = core.manyWhere(params, TradeEntity)
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
    const result = new Result<Trade>()
    const data = await this.trade.findUnique({ where: { id } })
    if (data) {
      Reflect.deleteProperty(data, 'password')
      result.data = data
      result.success({ msg: '交易信息查询成功' })
    } else {
      result.fail('交易信息查询失败')
    }
    return result
  }
  // 列表
  async list(trade: Trade, page: Page) {
    const pageData = new PageData<Trade>()
    const result = new Result<PageData<Trade>>()
    const data = await this.trade.findMany({
      ...core.pageHelper(page),
      orderBy: { createTime: 'desc' },
      where: trade
    })
    const total = await this.trade.count({ where: trade })
    pageData.list = data?.map((item) => {
      Reflect.deleteProperty(item, 'password')
      return item
    })
    pageData.total = total
    result.success({ data: pageData, msg: '查询交易列表成功' })
    return result
  }
  // 更新
  async update(trade: Trade) {
    const result = new Result<Trade>()
    const data = core.toModel(trade, TradeEntity)
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
