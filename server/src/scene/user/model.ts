import { type User } from '@prisma/client'

export const userBase = {
  id: '', // id
  gender: '', // 性别 0-女 1-男
  loginName: '', // 用户名
  name: '', // 姓名
  phone: '', // 手机号
  status: '' // 状态 1-正常 2-封禁
}

export const userEntity = {
  ...userBase,
  createId: '', // 创建人
  createTime: new Date(), // 创建时间
  password: '', // 密码
  updateId: '', // 更新人
  updateTime: new Date() // 更新时间
} as User

export const userVo = {
  ...userBase
}

export type UserVo = typeof userVo
