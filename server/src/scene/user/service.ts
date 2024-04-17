import { compare, hash } from 'bcrypt'
import type { Prisma, User } from '@prisma/client'
import { Inject } from '@nestjs/common'
import { RedisService } from '@/module/redis/service'
import { BaseService, PageData, Result } from '@/share'
import { Many, Page } from '@/type'
import { base, encrypt } from '@/utils'
import { StatusEnum } from './enum'
import { userEntity, userVo, type UserVo } from './model'

export class UserService extends BaseService {
  @Inject(RedisService)
  private redisService: RedisService
  private user: Prisma.UserDelegate

  constructor() {
    super()
    this.user = this.prisma.user
  }

  // 新增
  async add(user: User) {
    const result = new Result()
    const { loginName, phone } = user
    const userData = await this.user.findFirst({
      where: {
        OR: [{ loginName }, { phone }]
      }
    })
    if (userData) {
      if (userData.loginName === loginName) {
        result.fail('该账号已经存在')
      } else {
        result.fail('该手机号已经存在')
      }
      return result
    }
    const data = base.toEntity(user, userEntity)
    data.id = base.createUid()
    data.createId = this.getUid()
    data.createTime = new Date()
    data.password = await hash(user.password, 10)
    data.status = StatusEnum.Normal
    const row = await this.user.create({ data })
    if (row) {
      result.success({ msg: '用户新增成功' })
    } else {
      result.fail('用户新增失败')
    }
    return result
  }
  // 删除
  async delete(id: string) {
    const result = new Result()
    const row = await this.user.delete({ where: { id } })
    if (row) {
      result.success({ msg: '用户删除成功' })
    } else {
      result.fail('用户删除失败')
    }
    return result
  }
  // 批量删除
  async deletes(params: Many<User>) {
    const result = new Result()
    const where = base.manyWhere(params, userEntity)
    const row = await this.user.deleteMany({ where })
    if (row.count) {
      result.success({ msg: '批量删除成功' })
    } else {
      result.fail('批量删除失败')
    }
    return result
  }
  // 详情
  async detail(id: string) {
    const result = new Result<UserVo>()
    const row = await this.user.findUnique({ where: { id } })
    if (row) {
      result.data = base.toEntity(row, userVo)
      result.success({ msg: '用户信息查询成功' })
    } else {
      result.fail('用户信息查询失败')
    }
    return result
  }
  // 列表
  async list(user: User, page: Page) {
    const pageData = new PageData<UserVo>()
    const result = new Result<typeof pageData>()
    const rows = await this.user.findMany({
      ...base.pageHelper(page, 'desc'),
      select: base.entityToSelect(userEntity),
      where: user
    })
    const total = await this.user.count({ where: user })
    pageData.list = rows
    pageData.total = total
    result.success({ data: pageData, msg: '查询用户列表成功' })
    return result
  }
  // 登陆
  async login(user: User) {
    const result = new Result<string>()
    const row = await this.user.findUnique({
      where: { loginName: user.loginName },
      select: { id: true, password: true }
    })
    if (!row) {
      result.fail('账号错误')
      return result
    }
    // 判断密码是否相同
    const isMatch = await compare(user.password, row.password)
    if (isMatch) {
      const { iv, hash } = encrypt(row.id)
      const token = `${iv}.${hash}`
      const ret = await this.redisService.set('token', row.id, token)
      if (ret) {
        await this.redisService.expire('token', token, 60 * 60 * 24 * 30)
        result.success({ data: token, msg: '登陆成功' })
      } else {
        result.fail('登录失败')
      }
    } else {
      result.fail('密码错误')
    }
    return result
  }
  // 更新
  async update(user: User) {
    const result = new Result<User>()
    const data = base.toEntity(user, user) as User
    data.updateTime = new Date()
    const row = await this.user.update({
      data,
      where: { id: user.id }
    })
    if (row) {
      result.success({ msg: '更新成功' })
    } else {
      result.fail('更新失败')
    }
    return result
  }
}
