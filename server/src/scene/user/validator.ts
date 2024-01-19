import { IsDefined, IsMobilePhone } from 'class-validator'
import { IsNotEmpty } from '@/validator'

class Base {
  // 电话号码
  // @IsMobilePhone('zh-CN', {}, { message: '手机号码格式不正确' })
  // @IsNotEmpty({ message: '电话号码不能为空' })
  // phone: string
}
// 登陆
export class LoginVali {
  // 用户名
  @IsDefined({ message: '登录名不能为空' })
  @IsNotEmpty({ message: '登录名不能为空' })
  loginName: string
  // 密码
  @IsDefined({ message: '密码不能为空' })
  @IsNotEmpty({ message: '密码不能为空' })
  password: string
}
// 新增
export class AddVali extends Base {
  // 用户名
  // @IsDefined({ message: '登录名不能为空' })
  @IsNotEmpty({ message: '登录名不能为空' })
  loginName: string
  // 密码
  // @IsDefined({ message: '密码不能为空' })
  // @IsNotEmpty({ message: '密码不能为空' })
  // password: string
}
// 更新
export class UpdateVali extends AddVali {
  @IsDefined({ message: 'id不能为空' })
  @IsNotEmpty({ message: 'id不能为空' })
  id: string
}
