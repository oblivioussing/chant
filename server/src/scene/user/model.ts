import type { User } from '@prisma/client'

export const userEntity = {
  id: '', // id
  avatar: '', // 头像
  gender: '', // 性别
  loginName: '', // 用户名
  name: '', // 姓名
  orgId: '', // 部门id
  phone: '', // 手机号
  positionId: '', // 职位id
  roleId: '', // 角色id
  roleIds: [] // 角色ids
} as User

export const userDto = {
  ...userEntity,
  password: '' // 密码
}

export const userVo = {
  ...userEntity
}

export type UserDto = typeof userDto

export type UserVo = typeof userVo
