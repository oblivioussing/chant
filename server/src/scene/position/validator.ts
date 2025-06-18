import { z, ZodType } from 'zod'
import { type PositionEntity } from './model'

type Keys = keyof PositionEntity
type ZodObj = Partial<Record<Keys, ZodType>>

const Base = z
  .object({
    name: z.string().nonempty('名称不能为空'),
    orgId: z.string().nonempty('组织不能为空')
  } satisfies ZodObj)
  .passthrough()
// 新增
export const AddVali = Base.extend({} satisfies ZodObj)
// 更新
export const UpdateVali = Base.extend({
  id: z.string().nonempty('id不能为空')
} satisfies ZodObj)
