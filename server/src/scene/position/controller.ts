import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import type { Position } from '@prisma/client'
import { QueryModel } from '@/decorator'
import type { Many } from '@/type'
import { IdVali } from '@/validator'
import { PositionEntity } from './model'
import { PositionService } from './service'
import { AddVali, UpdateVali } from './validator'

@Controller('position')
export class PositionController {
  constructor(private readonly positionService: PositionService) {}

  // 新增
  @Post('add')
  async add(@Body() position: AddVali) {
    const result = await this.positionService.add(position as Position)
    return result
  }
  // 更新
  @Post('update')
  async update(@Body() position: UpdateVali) {
    const result = await this.positionService.update(position as Position)
    return result
  }
  // 删除
  @Post('delete')
  async delete(@Body() position: IdVali) {
    const result = await this.positionService.delete(position.id)
    return result
  }
  // 批量删除
  @Post('deletes')
  async deletes(@Body() params: Many<Position>) {
    const result = await this.positionService.deletes(params)
    return result
  }
  // 详情
  @Get('detail')
  async detail(@Query() position: IdVali) {
    const result = await this.positionService.detail(position.id)
    return result
  }
  // 列表
  @Get('list')
  async list(@QueryModel(PositionEntity) position: Position) {
    const result = await this.positionService.list(position)
    return result
  }
}
