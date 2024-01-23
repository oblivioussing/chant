import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import type { Trade } from '@prisma/client'
import { QueryModel, QueryPage } from '@/decorator'
import type { Many, Page } from '@/type'
import { IdVali } from '@/validator'
import { TradeEntity } from './model'
import { TradeService } from './service'
import { AddVali, UpdateVali } from './validator'

@Controller('trade')
export class TradeController {
  constructor(private readonly tradeService: TradeService) {}

  // 新增
  @Post('add')
  async add(@Body() trade: AddVali) {
    const result = await this.tradeService.add(trade as Trade)
    return result
  }
  // 删除
  @Post('delete')
  async delete(@Body() trade: IdVali) {
    const result = await this.tradeService.delete(trade.id)
    return result
  }
  // 批量删除
  @Post('deletes')
  async deletes(@Body() params: Many<Trade>) {
    const result = await this.tradeService.deletes(params)
    return result
  }
  // 详情
  @Get('detail')
  async detail(@Query() trade: IdVali) {
    const result = await this.tradeService.detail(trade.id)
    return result
  }
  // 列表
  @Get('list')
  async list(@QueryModel(TradeEntity) trade: Trade, @QueryPage() page: Page) {
    const result = await this.tradeService.list(trade, page)
    return result
  }
  // 更新
  @Post('update')
  async update(@Body() trade: UpdateVali) {
    const result = await this.tradeService.update(trade as Trade)
    return result
  }
}
