import { Controller, Get, Query } from '@nestjs/common'
import { QueryModel, QueryPage } from '@/decorator'
import type { Page } from '@/type'
import { IdVali } from '@/validator'
import { salaryBase, type SalaryBase } from './model'
import { SalaryService } from './service'

@Controller('salary')
export class SalaryController {
  constructor(private readonly salaryService: SalaryService) {}

  // 详情
  @Get('detail')
  async detail(@Query() salary: IdVali) {
    const result = await this.salaryService.detail(salary.id)
    return result
  }
  // 列表
  @Get('list')
  async list(
    @QueryModel(salaryBase) salary: SalaryBase,
    @QueryPage() page: Page
  ) {
    const result = await this.salaryService.list(salary, page)
    return result
  }
}
