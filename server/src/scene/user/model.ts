import type { User } from '@prisma/client'

export const userEntity = {
  id: '', // id
  avatar: '', // 头像
  gender: '', // 性别
  loginName: '', // 用户名
  name: '', // 姓名
  phone: '', // 手机号
  status: '' // 状态
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
