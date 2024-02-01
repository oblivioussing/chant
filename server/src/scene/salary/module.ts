import { Module } from '@nestjs/common'
import { SalaryController } from './controller'
import { SalaryService } from './service'

@Module({
  imports: [],
  exports: [],
  controllers: [SalaryController],
  providers: [SalaryService]
})
export class SalaryModule {}
