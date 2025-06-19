import { z, ZodType } from 'zod'
import { UserDto } from './model'

type Keys = keyof UserDto
type ZodObj = Partial<Record<Keys, ZodType>>

const Base = z
  .object({
    loginName: z.string().nonempty('登录名不能为空'),
    name: z.string().nonempty('姓名不能为空'),
    orgId: z.string().nonempty('部门不能为空'),
    phone: z
      .string()
      .nonempty('电话号码不能为空')
      .regex(/^1[3-9]\d{9}$/, '手机号码格式不正确'),
    roleIds: z.array(z.string()).nonempty('角色组不能为空')
  } satisfies ZodObj)
  .passthrough()
// 新增
export const AddVali = Base.extend({
  password: z.string().nonempty('密码不能为空')
} satisfies ZodObj)
// 更新
export const UpdateVali = Base.extend({
  id: z.string().nonempty('id不能为空')
} satisfies ZodObj)
// 登陆
export const LoginVali = z.object({
  loginName: z.string().nonempty('登录名不能为空'),
  password: z.string().nonempty('密码不能为空')
} satisfies ZodObj)
// 更新角色
export const RoleIdVali = z.object({
  roleId: z.string().nonempty('角色id不能为空')
} satisfies ZodObj)
