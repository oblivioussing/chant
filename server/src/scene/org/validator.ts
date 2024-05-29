import { IsNotEmpty } from 'class-validator'

class Base {}
// 新增
export class AddVali extends Base {}
// 更新
export class UpdateVali extends Base {
  // id
  @IsNotEmpty({ message: 'id不能为空' })
  id: string
}
