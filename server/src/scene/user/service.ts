import { compare, hash } from 'bcrypt'
import { Injectable } from '@nestjs/common'
import { PrismaClient, User, type Prisma } from '@prisma/client'
import { RedisService } from '@/module/redis/service'
import { PageData, Result } from '@/share'
import { Many, Page } from '@/type'
import { base, core, encrypt } from '@/utils'
import { UserEntity } from './model'

@Injectable()
export class UserService {
  private user: Prisma.UserDelegate

  constructor(private redisService: RedisService) {
    const prisma = new PrismaClient()
    this.user = prisma.user
  }

  // 新增
  async add(user: User) {
    const result = new Result()
    const userData = await this.user.findUnique({
      where: { loginName: user.loginName }
    })
    if (userData) {
      result.fail('该用户已经存在')
      return result
    }
    user.id = base.createUid()
    user.createTime = new Date()
    user.password = await hash(user.password, 10)
    const data = core.toModel(user, UserEntity)
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
    const data = await this.user.delete({ where: { id } })
    if (data) {
      result.success({ msg: '用户删除成功' })
    } else {
      result.fail('用户删除失败')
    }
    return result
  }
  // 批量删除
  async deletes(params: Many<User>) {
    const result = new Result()
    const where = core.manyWhere(params, UserEntity)
    const data = await this.user.deleteMany({ where })
    if (data.count) {
      result.success({ msg: '批量删除成功' })
    } else {
      result.fail('批量删除失败')
    }
    return result
  }
  // 详情
  async detail(id: string) {
    const result = new Result<User>()
    const data = await this.user.findUnique({ where: { id } })
    if (data) {
      Reflect.deleteProperty(data, 'password')
      result.data = data
      result.success({ msg: '用户信息查询成功' })
    } else {
      result.fail('用户信息查询失败')
    }
    return result
  }
  // 列表
  async list(user: User, page: Page) {
    const pageData = new PageData<User>()
    const result = new Result<PageData<User>>()
    const data = await this.user.findMany({
      ...core.pageHelper(page),
      orderBy: { createTime: 'desc' },
      where: user
    })
    const total = await this.user.count({ where: user })
    pageData.list = data?.map((item) => {
      Reflect.deleteProperty(item, 'password')
      return item
    })
    pageData.total = total
    result.success({ data: pageData, msg: '查询用户列表成功' })
    return result
  }
  // 登陆
  async login(user: User) {
    const result = new Result<string>()
    const data = await this.user.findUnique({
      where: { loginName: user.loginName },
      select: {
        id: true,
        password: true
      }
    })
    if (!data) {
      result.fail('账号错误')
      return result
    }
    // 判断密码是否相同
    const isMatch = await compare(user.password, data.password)
    if (isMatch) {
      const { iv, hash } = encrypt(data.id)
      const token = `${iv}.${hash}`
      this.redisService.set(data.id, token, 60 * 60 * 24 * 30)
      result.success({ data: token, msg: '登陆成功' })
    } else {
      result.fail('密码错误')
    }
    return result
  }
  // 更新
  async update(user: User) {
    const result = new Result<User>()
    const data = core.toModel(user, UserEntity)
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
