import { type Prisma } from '@prisma/client'
import { BaseService, PageData, Result } from '@/share'
import { Page } from '@/type'
import { core } from '@/utils'
import { SalaryBase, salaryBase, type SalaryVo } from './model'

export class SalaryService extends BaseService {
  private salary: Prisma.SalaryDelegate

  constructor() {
    super()
    this.salary = this.prisma.salary
  }
  // 详情
  async detail(id: string) {
    const result = new Result<SalaryVo>()
    const data = await this.salary.findUnique({
      select: core.entityToSelect(salaryBase),
      where: { id }
    })
    if (data) {
      result.data = core.toEntity(data, salaryBase)
      result.success({ msg: '工资查询成功' })
    } else {
      result.fail('工资查询失败')
    }
    return result
  }
  // 列表
  async list(salary: SalaryBase, page: Page) {
    const pageData = new PageData<SalaryVo>()
    const result = new Result<typeof pageData>()
    const rows = await this.salary.findMany({
      ...core.pageHelper(page),
      select: core.entityToSelect(salaryBase),
      where: salary,
      orderBy: { date: 'desc' }
    })
    const total = await this.salary.count({ where: salary })
    pageData.list = rows
    pageData.total = total
    result.success({ data: pageData, msg: '工资列表查询成功' })
    return result
  }
}
