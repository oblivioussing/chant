import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { QueryModel, QueryPage } from '@/decorator'
import type { Many, Page } from '@/type'
import { IdVali } from '@/validator'
import { orgEntity, type Org } from './model'
import { OrgService } from './service'
import { AddVali, UpdateVali } from './validator'

@Controller('org')
export class OrgController {
  constructor(private readonly orgService: OrgService) {}

  // 新增
  @Post('add')
  async add(@Body() org: AddVali) {
    const result = await this.orgService.add(org as Org)
    return result
  }
  // 更新
  @Post('update')
  async update(@Body() org: UpdateVali) {
    const result = await this.orgService.update(org as Org)
    return result
  }
  // 删除
  @Post('delete')
  async delete(@Body() org: IdVali) {
    const result = await this.orgService.delete(org.id)
    return result
  }
  // 批量删除
  @Post('deletes')
  async deletes(@Body() params: Many<Org>) {
    const result = await this.orgService.deletes(params)
    return result
  }
  // 详情
  @Get('detail')
  async detail(@Query() org: IdVali) {
    const result = await this.orgService.detail(org.id)
    return result
  }
  // 列表
  @Get('list')
  async list(@QueryModel(orgEntity) org: Org, @QueryPage() page: Page) {
    const result = await this.orgService.list(org, page)
    return result
  }
}
