import type { Router } from 'prisma/prisma-client'
import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { QueryModel, QueryPage } from '@/decorator'
import type { Many, Page } from '@/type'
import { IdVali } from '@/validator'
import { routerEntity } from './model'
import { RouterService } from './service'
import { AddVali, UpdateVali } from './validator'

@Controller('router')
export class RouterController {
  constructor(private readonly routerService: RouterService) {}

  // 新增
  @Post('add')
  async add(@Body() router: AddVali) {
    const result = await this.routerService.add(router as Router)
    return result
  }
  // 删除
  @Post('delete')
  async delete(@Body() router: IdVali) {
    const result = await this.routerService.delete(router.id)
    return result
  }
  // 批量删除
  @Post('deletes')
  async deletes(@Body() params: Many<Router>) {
    const result = await this.routerService.deletes(params)
    return result
  }
  // 详情
  @Get('detail')
  async detail(@Query() router: IdVali) {
    const result = await this.routerService.detail(router.id)
    return result
  }
  // 列表
  @Get('list')
  async list(
    @QueryModel(routerEntity) router: Router,
    @QueryPage() page: Page
  ) {
    const result = await this.routerService.list(router, page)
    return result
  }
  // 更新
  @Post('update')
  async update(@Body() router: UpdateVali) {
    const result = await this.routerService.update(router as Router)
    return result
  }
}
