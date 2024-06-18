import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { type Org } from '@prisma/client'
import { QueryModel } from '@/decorator'
import type { Many } from '@/type'
import { IdVali } from '@/validator'
import { orgEntity } from './model'
import { OrgService } from './service'
import { AddVali, RootVali, UpdateVali } from './validator'

@Controller('org')
export class OrgController {
  constructor(private readonly orgService: OrgService) {}

  // 根节点初始化
  @Post('root')
  async root(@Body() org: RootVali) {
    const result = await this.orgService.root(org as Org)
    return result
  }
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
  async list(@QueryModel(orgEntity) org: Org) {
    const result = await this.orgService.list(org)
    return result
  }
  // 树
  @Get('tree')
  async tree(@QueryModel(orgEntity) org: Org) {
    const result = await this.orgService.tree(org)
    return result
  }
}
