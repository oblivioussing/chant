import { compare, hash } from 'bcrypt'
import type { User } from '@prisma/client'
import { Inject } from '@nestjs/common'
import { RedisService } from '@/module/redis/service'
import { prisma, BaseService, PageData, Result } from '@/share'
import { Many, Page } from '@/type'
import { base, encrypt } from '@/utils'
import { UserEntity } from './model'
import queryRaw from './query-raw'

export class UserService extends BaseService {
  @Inject(RedisService)
  private redisService: RedisService

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
    const userEntity = base.toEntity(user, UserEntity)
    const data = { ...userEntity } as User
    data.id = base.createUid()
    data.createId = this.getUid()
    data.createTime = new Date()
    data.password = await hash(user.password, 10)
    data.roleId = data.roleIds[0]
    const row = await prisma.user.create({ data })
    if (row) {
      result.success({ msg: '用户新增成功' })
    } else {
      result.fail('用户新增失败')
    }
    return result
  }
  // 更新
  async update(user: User) {
    const result = new Result()
    const userEntity = base.toEntity(user, UserEntity)
    const data = { ...userEntity } as User
    data.updateTime = new Date()
    data.updateId = this.getUid()
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
  // 更新角色
  async updateRole(user: User) {
    const result = new Result<User>()
    const row = await prisma.user.update({
      data: {
        roleId: user.roleId,
        updateId: this.getUid(),
        updateTime: new Date()
      },
      where: { id: this.getUid() }
    })
    if (row) {
      result.success({ msg: '角色更新成功' })
    } else {
      result.fail('角色更新失败')
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
    const where = base.manyWhere(params, UserEntity)
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
    const result = new Result<typeof UserEntity>()
    const row = await prisma.user.findUnique({ where: { id } })
    if (row) {
      result.data = base.toEntity(row, UserEntity)
      result.success({ msg: '用户信息查询成功' })
    } else {
      result.fail('用户信息查询失败')
    }
    return result
  }
  // 用户信息
  async info() {
    const result = new Result<any>()
    const row = await prisma.user.findUnique({
      select: {
        id: true,
        loginName: true,
        name: true,
        roleId: true,
        Role: { select: { name: true } }
      },
      where: { id: this.getUid() }
    })
    if (row) {
      const { Role, ...other } = row
      const data = {
        ...other,
        roleName: Role.name
      }
      result.success({ data, msg: '用户信息查询成功' })
    } else {
      result.fail('用户信息查询失败')
    }
    return result
  }
  // 列表
  async list(user: User, page: Page) {
    const pageData = new PageData<typeof UserEntity>()
    const result = new Result<typeof pageData>()
    const { rows, total } = await queryRaw.getList(user, page)
    pageData.list = rows
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
  // 权限
  async auth() {
    const result = new Result<any>()
    const user = await prisma.user.findUnique({
      select: {
        loginName: true,
        Role: {
          select: { routerIds: true }
        }
      },
      where: { id: this.getUid() }
    })
    const routerIds = user.Role.routerIds as string[]
    const rows = await prisma.router.findMany({
      select: {
        code: true,
        id: true,
        icon: true,
        level: true,
        name: true,
        path: true,
        parentId: true,
        threeMenu: true
      },
      where: {
        level: { gt: 0 },
        isDelete: 0,
        id: user.loginName === 'admin' ? undefined : { in: routerIds }
      },
      orderBy: { sequence: 'asc' }
    })
    const funsMap = rows.reduce((acc, cur) => {
      if (cur.code) {
        if (acc[cur.parentId]) {
          acc[cur.parentId].push(cur.code)
        } else {
          acc[cur.parentId] = [cur.code]
        }
      }
      return acc
    }, {})
    const list = rows.map((item) => {
      const row = {} as any
      row.id = item.id
      row.meta = { title: item.name }
      row.level = item.level
      row.parentId = item.parentId
      if (funsMap[item.id]) {
        row.meta.funs = funsMap[item.id]
      }
      if (item.icon) {
        row.icon = item.icon
      }
      if (item.path) {
        row.path = item.path
      }
      if (item.threeMenu) {
        row.threeMenu = item.threeMenu
      }
      return row
    })
    if (rows) {
      const menu = base.toTree(list, { exclude: ['parentId'] })
      result.data = { menu }
      result.success({ msg: '权限信息查询成功' })
    } else {
      result.fail('权限信息查询失败')
    }
    return result
  }
  // 角色
  async roles() {
    const result = new Result<any[]>()
    const rows = await queryRaw.getRoles(this.getUid())
    if (rows) {
      result.data = rows
      result.success({ msg: '用户角色查询成功' })
    } else {
      result.fail('用户角色查询失败')
    }
    return result
  }
}
