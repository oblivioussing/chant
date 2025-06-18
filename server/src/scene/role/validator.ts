import { z, ZodType } from 'zod'
import { RoleEntity } from './model'

type Keys = keyof typeof RoleEntity
type ZodObj = Partial<Record<Keys, ZodType>>

const Base = z
  .object({
    level: z.number({ required_error: '等级不能为空' }),
    name: z.string().nonempty('名称不能为空'),
    parentId: z.string().nonempty('父节点id不能为空')
  } satisfies ZodObj)
  .passthrough()
// 新增
export const AddVali = Base.extend({} satisfies ZodObj)
// 更新
export const UpdateVali = Base.extend({
  id: z.string().nonempty('id不能为空')
} satisfies ZodObj)
