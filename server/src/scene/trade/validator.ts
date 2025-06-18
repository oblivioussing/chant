import { z, ZodType } from 'zod'
import { type TradeEntity } from './model'

type Keys = keyof TradeEntity
type ZodObj = Partial<Record<Keys, ZodType>>

const Base = z
  .object({
    amount: z.number({ required_error: '售价不能为空' }),
    userId: z.string().nonempty('销售员不能为空'),
    commission: z
      .number({ required_error: '提成不能为空' })
      .min(0.1, '不能小于0.1')
      .max(0.15, '不能大于0.15')
  } satisfies ZodObj)
  .passthrough()
// 新增
export const AddVali = Base.extend({} satisfies ZodObj)
// 更新
export const UpdateVali = Base.extend({
  id: z.string().nonempty('id不能为空')
} satisfies ZodObj)
