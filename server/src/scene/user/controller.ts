import { Body, Controller, Get, Post, Query, UsePipes } from '@nestjs/common'
import {
  Auth,
  BodyModel,
  QueryModel,
  QueryPage,
  ZodValidation
} from '@/components'
import type { Many, Page } from '@/type'
import { IdVali, ManyVali } from '@/validator'
import { userDto, userEntity, type UserDto, type UserEntity } from './model'
import { UserService } from './service'
import { LoginVali, AddVali, UpdateVali, RoleIdVali } from './validator'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 新增
  @Post('add')
  @UsePipes(new ZodValidation(AddVali))
  async add(@BodyModel(userDto) user: UserDto) {
    const result = await this.userService.add(user)
    return result
  }
  // 权限
  @Get('auth')
  async auth() {
    const result = await this.userService.auth()
    return result
  }
  // 删除
  @Post('delete')
  @UsePipes(new ZodValidation(IdVali))
  async delete(@Body() user: UserEntity) {
    const result = await this.userService.delete(user.id)
    return result
  }
  // 批量删除
  @Post('deletes')
  @UsePipes(new ZodValidation(ManyVali))
  async deletes(@Body() params: Many<UserEntity>) {
    const result = await this.userService.deletes(params)
    return result
  }
  // 详情
  @Get('detail')
  @UsePipes(new ZodValidation(IdVali))
  async detail(@Query() user: UserEntity) {
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
  async list(
    @QueryModel(userEntity) user: UserEntity,
    @QueryPage() page: Page
  ) {
    const result = await this.userService.list(user, page)
    return result
  }
  // 登陆
  @Auth(false)
  @Post('login')
  @UsePipes(new ZodValidation(LoginVali))
  async login(@BodyModel(userDto) user: UserDto) {
    const result = await this.userService.login(user)
    return result
  }
  // 角色
  @Get('roles')
  async roles() {
    const result = await this.userService.roles()
    return result
  }
  // 更新
  @Post('update')
  @UsePipes(new ZodValidation(UpdateVali))
  async update(@BodyModel(userEntity) user: UserEntity) {
    const result = await this.userService.update(user)
    return result
  }
  // 更新角色
  @Post('updateRole')
  @UsePipes(new ZodValidation(RoleIdVali))
  async updateRole(@Body() user: UserEntity) {
    const result = await this.userService.updateRole(user.roleId)
    return result
  }
}
