import { Prisma, type Salary } from '@prisma/client'

export const salaryBase = {
  id: '', // id
  bonus: new Prisma.Decimal(0), // 奖金(元)
  date: new Date(), // 日期
  userId: '' // 用户id
}

export const salaryEntity = {
  ...salaryBase
} as Salary

export const salaryVo = {
  ...salaryBase
}

export type SalaryBase = typeof salaryBase
export type SalaryVo = typeof salaryVo
