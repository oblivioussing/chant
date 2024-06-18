import { IsNotEmpty } from 'class-validator'

class Base {
  // name
  @IsNotEmpty({ message: '名称不能为空' })
  name: string
  // 组织
  @IsNotEmpty({ message: '组织不能为空' })
  orgId: string
}
// 新增
export class AddVali extends Base {}
// 更新
export class UpdateVali extends Base {
  // id
  @IsNotEmpty({ message: 'id不能为空' })
  id: string
}
