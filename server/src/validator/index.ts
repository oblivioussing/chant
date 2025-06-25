import { z } from 'zod'

// id
export const IdVali = z
  .object({
    id: z.string().nonempty('id不能为空')
  })
  .passthrough()
// ids
export const IdsVali = z
  .object({
    ids: z.array(z.string()).nonempty('ids不能为空')
  })
  .passthrough()
// many
export const ManyVali = z
  .object({
    all: z.number().optional(),
    ids: z.array(z.string()).optional()
  })
  .passthrough()
  .refine((data) => {
    const hasIds = Array.isArray(data.ids) && data.ids.length > 0
    if (data.all !== undefined || hasIds) {
      return {
        message: 'all和ids不能都为空',
        path: ['all', 'ids']
      }
    }
  })
