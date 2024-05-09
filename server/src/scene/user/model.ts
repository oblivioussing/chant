import type { User } from '@prisma/client'

export const userEntity = {
  id: '', // id
  avatar: '', // 头像
  gender: '', // 性别 0-女 1-男
  loginName: '', // 用户名
  name: '', // 姓名
  phone: '', // 手机号
  photoList: [], // 照片列表
  status: '' // 状态 1-正常 2-封禁
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
