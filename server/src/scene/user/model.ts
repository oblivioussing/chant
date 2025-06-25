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
  roleIds: [] as string[] // 角色ids
} satisfies Partial<User>

export const userDto = {
  ...userEntity,
  password: '' // 密码
}

export const userVo = {
  ...userEntity
}

export type UserEntity = typeof userEntity

export type UserDto = typeof userDto

export type UserVo = typeof userVo

export type MenuItem = {
  id: string
  level: number
  icon?: string
  meta: { title: string; funs?: string[] }
  path?: string
  threeMenu?: number
  children?: MenuItem[]
}

export type Auth = {
  menu: MenuItem[]
}
