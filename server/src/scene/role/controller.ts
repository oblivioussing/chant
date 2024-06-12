import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import type { Role } from '@prisma/client'
import { QueryModel } from '@/decorator'
import { IdVali } from '@/validator'
import { roleEntity } from './model'
import { RoleService } from './service'
import { AddVali, UpdateVali } from './validator'

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  // 根节点初始化
  @Post('root')
  async root() {
    const result = await this.roleService.root()
    return result
  }
  // 新增
  @Post('add')
  async add(@Body() role: AddVali) {
    const result = await this.roleService.add(role as Role)
    return result
  }
  // 更新
  @Post('update')
  async update(@Body() role: UpdateVali) {
    const result = await this.roleService.update(role as Role)
    return result
  }
  // 更新路由
  @Post('updateRouter')
  async updateRouter(@Body() role: IdVali) {
    const result = await this.roleService.updateRouter(role as Role)
    return result
  }
  // 删除
  @Post('delete')
  async delete(@Body() role: IdVali) {
    const result = await this.roleService.delete(role.id)
    return result
  }
  // 详情
  @Get('detail')
  async detail(@Query() role: IdVali) {
    const result = await this.roleService.detail(role.id)
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
  async tree(@QueryModel(roleEntity) router: Role) {
    const result = await this.roleService.tree(router)
    return result
  }
}
