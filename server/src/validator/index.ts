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
    ids: z.string().nonempty('ids不能为空')
  })
  .passthrough()
