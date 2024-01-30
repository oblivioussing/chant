import { Prisma, type Trade } from '@prisma/client'

export const tradeBase = {
  id: '', // id
  amount: new Prisma.Decimal(0), // 售价
  belongId: '', // 所属人id
  commission: '', // 提成(百分比) 1-10 2-15
  remark: '', // 备注
  status: '1', // 状态 1-正常 2-作废
  userId: '' // 销售员id
}

export const tradeEntity = {
  ...tradeBase,
  createId: '', // 创建人id
  createTime: new Date(), // 创建时间
  updateId: '', // 更新人id
  updateTime: new Date() // 更新时间
} as Trade

export const tradeVo = {
  ...tradeBase,
  belongName: '', // 所属人name
  userName: '' // 销售员name
}

export type TradeVo = typeof tradeVo
