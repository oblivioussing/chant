import type { User } from 'prisma/prisma-client'

export const UserEntity = {
  id: '', // id
  createdId: '', // 创建人
  createTime: new Date(), // 创建时间
  gender: '', // 性别(0-女 1-男)
  loginName: '', // 用户名
  name: '', // 姓名
  password: '', // 密码
  phone: '', // 手机号
  status: '', // 状态
  updateId: '', // 更新人
  updateTime: new Date() // 更新时间
} as User
