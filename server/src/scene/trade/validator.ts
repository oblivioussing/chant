import { IsNotEmpty } from 'class-validator'
import type { Prisma } from '@prisma/client'
import { IsNotEqualTo } from '@/validator'

class Base {
  // 售价
  @IsNotEmpty({ message: '售价不能为空' })
  amount: Prisma.Decimal
  // 所属人
  @IsNotEqualTo('userId', { message: '所属人不能是销售员' })
  belongId: string
}
// 新增
export class AddVali extends Base {}
// 更新
export class UpdateVali extends Base {}
