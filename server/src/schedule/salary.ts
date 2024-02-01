import { PrismaClient, type Salary } from '@prisma/client'
import { base } from '@/utils'

export class SalaryService {
  private prisma = new PrismaClient()

  add() {
    const data = {
      id: base.createId(),
      date: new Date()
    } as Salary
    this.prisma.salary.create({ data })
  }
}
