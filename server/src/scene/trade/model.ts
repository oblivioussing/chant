import type { Trade } from 'prisma/prisma-client'

export const TradeEntity = {
  id: '', // id
  commission: '', // 提成(百分比) 1-10 2-15
  createId: '', // 创建人
  createTime: new Date(), // 创建时间
  remark: '', // 备注
  status: '', // 状态 1-正常 2-作废
  uid: '', // 所属人
  updateId: '', // 更新人
  updateTime: new Date() // 更新时间
} as Trade
