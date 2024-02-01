import { Injectable } from '@nestjs/common'
import { Interval } from '@nestjs/schedule'
import { SalaryService } from './salary'

@Injectable()
export class ScheduleService {
  private salaryService = new SalaryService()

  // 工资流水
  @Interval(5000)
  salary() {
    const a = undefined
  }
}
