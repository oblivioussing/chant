import { Body, Controller, Headers, Get, Post, Query } from '@nestjs/common'
import { User } from '@prisma/client'
import { Auth, QueryEntity, QueryPage } from '@/decorator'
import { ApiCode } from '@/enum'
import { Result } from '@/share'
import { Page } from '@/type'
import { getUidByToken } from '@/utils/base'
import { UserEntity } from './entity'
import { UserService } from './service'
import { LoginVali, AddVali, UpdateVali } from './validator'

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
  async delete(@Body('id') id: string) {
    const result = await this.userService.delete(id)
    return result
  }
  // 详情
  @Get('detail')
  async detail(@Query('id') id: string) {
    let result = new Result<User>()
    if (id) {
      result = await this.userService.detail(id)
    } else {
      result.code = ApiCode.ParamError
      result.msg = 'id不能为空'
    }
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
  async list(@QueryEntity(UserEntity) user: User, @QueryPage() page: Page) {
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
  async update(@Body() user: UpdateVali) {
    const result = await this.userService.update(user as User)
    return result
  }
}
