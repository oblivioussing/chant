import { Body, Controller, Get, Post, Query, UsePipes } from '@nestjs/common'
import { BodyModel, QueryModel, ZodValidation } from '@/components'
import type { Many } from '@/type'
import { IdVali, ManyVali } from '@/validator'
import { orgEntity, type OrgEntity } from './model'
import { OrgService } from './service'
import { AddVali, RootVali, UpdateVali } from './validator'

@Controller('org')
export class OrgController {
  constructor(private readonly orgService: OrgService) {}

  // 新增
  @Post('add')
  @UsePipes(new ZodValidation(AddVali))
  async add(@BodyModel(orgEntity) org: OrgEntity) {
    const result = await this.orgService.add(org)
    return result
  }
  // 删除
  @Post('delete')
  @UsePipes(new ZodValidation(IdVali))
  async delete(@Body() org: OrgEntity) {
    const result = await this.orgService.delete(org.id)
    return result
  }
  // 批量删除
  @Post('deletes')
  @UsePipes(new ZodValidation(ManyVali))
  async deletes(@Body() params: Many<OrgEntity>) {
    const result = await this.orgService.deletes(params)
    return result
  }
  // 详情
  @Get('detail')
  @UsePipes(new ZodValidation(IdVali))
  async detail(@Query() org: OrgEntity) {
    const result = await this.orgService.detail(org.id)
    return result
  }
  // 列表
  @Get('list')
  async list(@QueryModel(orgEntity) org: OrgEntity) {
    const result = await this.orgService.list(org)
    return result
  }
  // 根节点初始化
  @Post('root')
  @UsePipes(new ZodValidation(RootVali))
  async root(@BodyModel(orgEntity) org: OrgEntity) {
    const result = await this.orgService.root(org)
    return result
  }
  // 树
  @Get('tree')
  async tree(@QueryModel(orgEntity) org: OrgEntity) {
    const result = await this.orgService.tree(org)
    return result
  }
  // 更新
  @Post('update')
  @UsePipes(new ZodValidation(UpdateVali))
  async update(@BodyModel(orgEntity) org: OrgEntity) {
    const result = await this.orgService.update(org)
    return result
  }
}
