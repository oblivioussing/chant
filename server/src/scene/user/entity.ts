import { User } from 'prisma/prisma-client'

export const UserEntity = {
  id: '', // id
  avator: '', // 头像
  birthday: new Date(), // 出生日期
  createTime: new Date(), // 创建时间
  email: '', // 邮箱
  gender: '', // 性别(0-女 1-男)
  loginName: '', // 用户名
  name: '', // 姓名
  nickname: '', // 昵称
  password: '', // 密码
  phone: '', // 手机号
  status: '', // 状态
  updateTime: new Date() // 更新时间
} as User
