import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import type { User } from '@prisma/client'
import { Auth, QueryModel, QueryPage } from '@/decorator'
import type { Many, Page } from '@/type'
import { IdVali } from '@/validator'
import { userEntity } from './model'
import { UserService } from './service'
import { LoginVali, AddVali, UpdateVali, RoleIdVali } from './validator'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 新增
  @Post('add')
  async add(@Body() user: AddVali) {
    const result = await this.userService.add(user as User)
    return result
  }
  // 更新
  @Post('update')
  async update(@Body() user: UpdateVali) {
    const result = await this.userService.update(user as User)
    return result
  }
  // 更新角色
  @Post('updateRole')
  async updateRole(@Body() user: RoleIdVali) {
    const result = await this.userService.updateRole(user as User)
    return result
  }
  // 删除
  @Post('delete')
  async delete(@Body() user: IdVali) {
    const result = await this.userService.delete(user.id)
    return result
  }
  // 批量删除
  @Post('deletes')
  async deletes(@Body() params: Many<User>) {
    const result = await this.userService.deletes(params)
    return result
  }
  // 详情
  @Get('detail')
  async detail(@Query() user: IdVali) {
    const result = await this.userService.detail(user.id)
    return result
  }
  // 用户信息
  @Get('info')
  async info() {
    const result = await this.userService.info()
    return result
  }
  // 列表
  @Get('list')
  async list(@QueryModel(userEntity) user: User, @QueryPage() page: Page) {
    const result = await this.userService.list(user, page)
    return result
  }
  // 权限
  @Get('auth')
  async auth() {
    const result = await this.userService.auth()
    return result
  }
  // 登陆
  @Auth(false)
  @Post('login')
  async login(@Body() user: LoginVali) {
    const result = await this.userService.login(user as User)
    return result
  }
  // 角色
  @Get('roles')
  async roles() {
    const result = await this.userService.roles()
    return result
  }
}
