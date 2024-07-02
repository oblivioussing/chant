import { ArrayNotEmpty, IsMobilePhone, IsNotEmpty } from 'class-validator'

class Base {
  // 用户名
  @IsNotEmpty({ message: '登录名不能为空' })
  loginName: string
  // 姓名
  @IsNotEmpty({ message: '姓名不能为空' })
  name: string
  // 部门
  @IsNotEmpty({ message: '部门不能为空' })
  orgId: string
  // 电话号码
  @IsMobilePhone('zh-CN', {}, { message: '手机号码格式不正确' })
  @IsNotEmpty({ message: '电话号码不能为空' })
  phone: string
  // 角色组
  @ArrayNotEmpty({ message: '角色组不能为空' })
  roleIds: string[]
}
// 登陆
export class LoginVali {
  // 用户名
  @IsNotEmpty({ message: '登录名不能为空' })
  loginName: string
  // 密码
  @IsNotEmpty({ message: '密码不能为空' })
  password: string
}
// 新增
export class AddVali extends Base {
  // 密码
  @IsNotEmpty({ message: '密码不能为空' })
  password: string
}
// 更新
export class UpdateVali extends Base {
  // id
  @IsNotEmpty({ message: 'id不能为空' })
  id: string
}
// 更新角色
export class RoleIdVali {
  // id
  @IsNotEmpty({ message: '角色id不能为空' })
  roleId: string
}
