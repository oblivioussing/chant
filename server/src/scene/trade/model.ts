import { Prisma, type Trade } from '@prisma/client'

export const TradeEntity = {
  id: '', // id
  amount: new Prisma.Decimal(0), // 售价
  belongId: '', // 所属人id
  commission: '', // 提成(百分比) 1-10 2-15
  remark: '', // 备注
  status: '1', // 状态 1-正常 2-作废
  userId: '' // 销售员id
} as Trade

export const TradeDto = {
  ...TradeEntity,
  belongName: '',
  userName: ''
}
