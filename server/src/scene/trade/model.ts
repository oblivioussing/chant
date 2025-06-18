import { Prisma, type Trade } from '@prisma/client'

export const tradeEntity = {
  id: '', // id
  amount: new Prisma.Decimal(0), // 售价
  belongId: '', // 所属人id
  commission: 0, // 提成(百分比)
  remark: '', // 备注
  status: '', // 状态 1-正常 2-作废
  userId: '' // 销售员id
} satisfies Partial<Trade>

export const tradeDto = {
  ...tradeEntity
}

export const tradeVo = {
  ...tradeEntity,
  belongName: '', // 所属人name
  userName: '' // 销售员name
}

export type TradeEntity = typeof tradeEntity

export type TradeDto = typeof tradeDto

export type TradeVo = typeof tradeVo
