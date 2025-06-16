import type { User } from '@prisma/client'

export const UserEntity = {
  id: '', // id
  avatar: '', // 头像
  gender: '', // 性别
  loginName: '', // 用户名
  name: '', // 姓名
  orgId: '', // 部门id
  phone: '', // 手机号
  positionId: '', // 职位id
  roleId: '', // 角色id
  roleIds: [] as string[] // 角色ids
} satisfies Partial<User>

export const UserDto = {
  ...UserEntity,
  password: '' // 密码
}

export const UserVo = {
  ...UserEntity
}
