import { Body, Controller, Get, Post, Query, UsePipes } from '@nestjs/common'
import { BodyModel, QueryModel, ZodValidation } from '@/components'
import type { Many } from '@/type'
import { IdVali, ManyVali } from '@/validator'
import { positionEntity, type PositionEntity } from './model'
import { PositionService } from './service'
import { AddVali, UpdateVali } from './validator'

@Controller('position')
export class PositionController {
  constructor(private readonly positionService: PositionService) {}

  // 新增
  @Post('add')
  @UsePipes(new ZodValidation(AddVali))
  async add(@BodyModel(positionEntity) position: PositionEntity) {
    const result = await this.positionService.add(position)
    return result
  }
  // 删除
  @Post('delete')
  @UsePipes(new ZodValidation(IdVali))
  async delete(@Body() position: PositionEntity) {
    const result = await this.positionService.delete(position.id)
    return result
  }
  // 批量删除
  @Post('deletes')
  @UsePipes(new ZodValidation(ManyVali))
  async deletes(@Body() params: Many<PositionEntity>) {
    const result = await this.positionService.deletes(params)
    return result
  }
  // 详情
  @Get('detail')
  @UsePipes(new ZodValidation(IdVali))
  async detail(@Query() position: PositionEntity) {
    const result = await this.positionService.detail(position.id)
    return result
  }
  // 列表
  @Get('list')
  async list(@QueryModel(positionEntity) position: PositionEntity) {
    const result = await this.positionService.list(position)
    return result
  }
  // 更新
  @Post('update')
  @UsePipes(new ZodValidation(UpdateVali))
  async update(@BodyModel(positionEntity) position: PositionEntity) {
    const result = await this.positionService.update(position)
    return result
  }
}
