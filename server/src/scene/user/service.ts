import { compare, hash } from 'bcrypt'
import type { Prisma, File } from '@prisma/client'
import { Inject } from '@nestjs/common'
import { RedisService } from '@/module/redis/service'
import { prisma, BaseService, PageData, Result } from '@/share'
import { Many, Page } from '@/type'
import { base, encrypt } from '@/utils'
import { userEntity, type User } from './model'

export class UserService extends BaseService {
  @Inject(RedisService)
  private redisService: RedisService

  constructor() {
    super()
  }

  // 新增
  async add(user: User) {
    const result = new Result()
    const { loginName, phone } = user
    const userData = await prisma.user.findFirst({
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
    const photoList = data.photoList as unknown as File[]
    data.photoList = photoList.map((item) => item.id)
    data.id = base.createUid()
    data.createId = this.getUid()
    data.createTime = new Date()
    data.password = await hash(user.password, 10)
    data.status = '1'
    const row = await prisma.user.create({ data })
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
    const row = await prisma.user.delete({ where: { id } })
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
    const row = await prisma.user.deleteMany({ where })
    if (row.count) {
      result.success({ msg: '批量删除成功' })
    } else {
      result.fail('批量删除失败')
    }
    return result
  }
  // 详情
  async detail(id: string) {
    const result = new Result<User>()
    const row = await prisma.user.findUnique({ where: { id } })
    if (row) {
      const fileIds = row.photoList as string[]
      row.photoList = await this.getFiles(fileIds)
      result.data = base.toEntity(row, userEntity)
      result.success({ msg: '用户信息查询成功' })
    } else {
      result.fail('用户信息查询失败')
    }
    return result
  }
  // 列表
  async list(user: User, page: Page) {
    const pageData = new PageData<User>()
    const result = new Result<typeof pageData>()
    const where = user as Prisma.UserWhereInput
    // 模糊查询
    base.toContains(where, ['name', 'phone'])
    const rows = await prisma.user.findMany({
      ...base.pageHelper(page, 'desc'),
      select: base.toSelect(userEntity, ['photoList']),
      where
    })
    const total = await prisma.user.count({ where })
    pageData.list = rows as User[]
    pageData.total = total
    result.success({ data: pageData, msg: '查询用户列表成功' })
    return result
  }
  // 登陆
  async login(user: User) {
    const result = new Result<string>()
    const row = await prisma.user.findUnique({
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
    const data = base.toEntity(user, userEntity)
    const photoList = data.photoList as unknown as File[]
    data.photoList = photoList.map((item) => item.id)
    data.updateTime = new Date()
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
