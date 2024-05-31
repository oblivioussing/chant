import { IsNotEmpty } from 'class-validator'

class Base {
  // 等级
  @IsNotEmpty({ message: '等级不能为空' })
  level: number
  // name
  @IsNotEmpty({ message: '名称不能为空' })
  name: string
  // 父节点id
  @IsNotEmpty({ message: '父节点id不能为空' })
  parentId: string
}
// 新增
export class AddVali extends Base {}
// 更新
export class UpdateVali extends Base {
  // id
  @IsNotEmpty({ message: 'id不能为空' })
  id: string
}
