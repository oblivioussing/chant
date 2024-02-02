import { IsIn, IsNumber, IsNotEmpty } from 'class-validator'
import type { Prisma } from '@prisma/client'
import { IsNotEqualTo } from '@/validator'

class Base {
  // 售价
  @IsNotEmpty({ message: '售价不能为空' })
  amount: Prisma.Decimal
  // 销售员
  @IsNotEmpty({ message: '销售员不能为空' })
  userId: string
  // 提成
  @IsNumber(undefined, { message: '提成必须为数值' })
  @IsIn([0.1, 0.15], { message: '提成数值错误' })
  commission: number
  // 所属人
  @IsNotEqualTo('userId', { message: '所属人不能是销售员' })
  belongId: string
}
// 新增
export class AddVali extends Base {}
// 更新
export class UpdateVali extends Base {
  // id
  @IsNotEmpty({ message: 'id不能为空' })
  id: string
}
