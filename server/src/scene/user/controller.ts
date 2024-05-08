import { Body, Controller, Headers, Get, Post, Query } from '@nestjs/common'
import type { User } from '@prisma/client'
import { Auth, QueryModel, QueryPage } from '@/decorator'
import type { Many, Page } from '@/type'
import { getUidByToken } from '@/utils/base'
import { IdVali } from '@/validator'
import { UserDto, userEntity } from './model'
import { UserService } from './service'
import { LoginVali, AddVali } from './validator'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 新增
  @Post('add')
  async add(@Body() user: AddVali) {
    const result = await this.userService.add(user as User)
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
  async info(@Headers('token') token: string) {
    const uid = getUidByToken(token)
    const result = await this.userService.detail(uid)
    return result
  }
  // 列表
  @Get('list')
  async list(@QueryModel(userEntity) user: User, @QueryPage() page: Page) {
    const result = await this.userService.list(user, page)
    return result
  }
  // 登陆
  @Auth(false)
  @Post('login')
  async login(@Body() user: LoginVali) {
    const result = await this.userService.login(user as User)
    return result
  }
  // 更新
  @Post('update')
  async update(@Body() user: UserDto) {
    const result = await this.userService.update(user as User)
    return result
  }
}
