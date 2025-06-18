import { Body, Controller, Get, Post, Query, UsePipes } from '@nestjs/common'
import { BodyModel, QueryModel, QueryPage, ZodValidation } from '@/components'
import type { Many, Page } from '@/type'
import { IdVali } from '@/validator'
import { tradeEntity, type TradeEntity } from './model'
import { TradeService } from './service'
import { AddVali, UpdateVali } from './validator'

@Controller('trade')
export class TradeController {
  constructor(private readonly tradeService: TradeService) {}

  // 新增
  @Post('add')
  @UsePipes(new ZodValidation(AddVali))
  async add(@Body() trade: TradeEntity) {
    const result = await this.tradeService.add(trade)
    return result
  }
  // 删除
  @Post('delete')
  @UsePipes(new ZodValidation(IdVali))
  async delete(@Body() trade: TradeEntity) {
    const result = await this.tradeService.delete(trade.id)
    return result
  }
  // 批量删除
  @Post('deletes')
  async deletes(@Body() params: Many<TradeEntity>) {
    const result = await this.tradeService.deletes(params)
    return result
  }
  // 详情
  @Get('detail')
  @UsePipes(new ZodValidation(IdVali))
  async detail(@Query() trade: TradeEntity) {
    const result = await this.tradeService.detail(trade.id)
    return result
  }
  // 列表
  @Get('list')
  async list(
    @QueryModel(tradeEntity) trade: TradeEntity,
    @QueryPage() page: Page
  ) {
    const result = await this.tradeService.list(trade, page)
    return result
  }
  // 更新
  @Post('update')
  @UsePipes(new ZodValidation(UpdateVali))
  async update(@BodyModel(tradeEntity) trade: TradeEntity) {
    const result = await this.tradeService.update(trade)
    return result
  }
}
