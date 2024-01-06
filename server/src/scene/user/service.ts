import * as bcrypt from 'bcrypt'
import { Injectable } from '@nestjs/common'
import { PrismaClient, User } from '@prisma/client'
import { ApiCode } from '@/enum'
import { RedisService } from '@/module/redis/service'
import { PageData, Result } from '@/share'
import { Page } from '@/type'
import { base, core, encrypt } from '@/utils'
import { UserEntity } from './entity'

const prisma = new PrismaClient()

@Injectable()
export class UserService {
  constructor(private redisService: RedisService) {}

  // 新增
  async add(user: User): Promise<Result> {
    const result = await this.register(user)
    if (result.code === ApiCode.Success) {
      result.msg = '用户新增成功'
    } else {
      result.msg = '用户新增失败'
    }
    return result
  }
  // 详情
  async detail(id: string): Promise<Result<User>> {
    const result = new Result<User>()
    const data = await prisma.user.findUnique({ where: { id } })
    if (data) {
      // 删除密码
      Reflect.deleteProperty(data, 'password')
      result.data = data
      result.success({ msg: '用户信息查询成功' })
    } else {
      result.fail('用户信息查询失败')
    }
    return result
  }
  // 列表
  async list(user: User, page: Page): Promise<Result<PageData<User>>> {
    const pageData = new PageData<User>()
    const result = new Result<PageData<User>>()
    const data = await prisma.user.findMany({
      ...core.pageHelper(page),
      orderBy: {
        createTime: 'desc'
      },
      where: user
    })
    const total = await prisma.user.count()
    pageData.list = data?.map((item) => {
      Reflect.deleteProperty(item, 'password')
      return item
    })
    pageData.total = total
    result.data = pageData
    result.success({ msg: '查询用户列表成功' })
    return result
  }
  // 登陆
  async login(user: User): Promise<Result<string>> {
    const result = new Result<string>()
    const data = await prisma.user.findUnique({
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
    const isMatch = await bcrypt.compare(user.password, data.password)
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
  // 注册
  async register(user: User): Promise<Result> {
    const result = new Result()
    const userData = await prisma.user.findUnique({
      where: { loginName: user.loginName }
    })
    if (userData) {
      result.fail('该用户已经存在')
      return result
    }
    user.id = base.createUid()
    user.createTime = new Date()
    user.password = await bcrypt.hash(user.password, 10)
    const data = core.toEntity(user, UserEntity)
    const row = await prisma.user.create({ data })
    if (row) {
      result.success({ msg: '注册成功' })
    } else {
      result.fail('注册失败')
    }
    return result
  }
  // 更新
  async update(user: User): Promise<Result<User>> {
    const result = new Result<User>()
    const data = core.toEntity(user, UserEntity)
    const row = await prisma.user.update({
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
