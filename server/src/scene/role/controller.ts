import { Body, Controller, Get, Post, Query, UsePipes } from '@nestjs/common'
import { BodyModel, QueryModel, ZodValidation } from '@/components'
import { IdVali } from '@/validator'
import { roleEntity, type RoleEntity, type RouterParams } from './model'
import { RoleService } from './service'
import { AddVali, UpdateVali } from './validator'

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  // 新增
  @Post('add')
  @UsePipes(new ZodValidation(AddVali))
  async add(@BodyModel(roleEntity) role: RoleEntity) {
    const result = await this.roleService.add(role)
    return result
  }
  // 删除
  @Post('delete')
  @UsePipes(new ZodValidation(IdVali))
  async delete(@Body() role: RoleEntity) {
    const result = await this.roleService.delete(role.id)
    return result
  }
  // 详情
  @Get('detail')
  @UsePipes(new ZodValidation(IdVali))
  async detail(@Query() role: RoleEntity) {
    const result = await this.roleService.detail(role.id)
    return result
  }
  // 根节点初始化
  @Post('root')
  async root() {
    const result = await this.roleService.root()
    return result
  }
  // 路由列表
  @Get('router')
  async router(@Query('id') id: string) {
    const result = await this.roleService.router(id)
    return result
  }
  // 树
  @Get('tree')
  async tree(@QueryModel(roleEntity) router: RoleEntity) {
    const result = await this.roleService.tree(router)
    return result
  }
  // 更新
  @Post('update')
  @UsePipes(new ZodValidation(UpdateVali))
  async update(@BodyModel(roleEntity) role: RoleEntity) {
    const result = await this.roleService.update(role)
    return result
  }
  // 更新路由
  @Post('updateRouter')
  @UsePipes(new ZodValidation(IdVali))
  async updateRouter(@Body() params: RouterParams) {
    const result = await this.roleService.updateRouter(params)
    return result
  }
}
