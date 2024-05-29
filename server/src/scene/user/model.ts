import type { User as UserOrig } from '@prisma/client'

type Extend = {
  gender: '1' | '2' // 1-女 2-男
  status: '1' | '2' // 1-正常 2-封禁
}

export const userEntity = {
  id: '', // id
  avatar: '', // 头像
  gender: '', // 性别
  loginName: '', // 用户名
  name: '', // 姓名
  phone: '', // 手机号
  photoList: [], // 照片列表
  status: '' // 状态
} as UserOrig & Extend

export const userDto = {
  ...userEntity,
  password: '' // 密码
}

export const userVo = {
  ...userEntity
}

export type User = typeof userEntity

export type UserDto = typeof userDto

export type UserVo = typeof userVo
