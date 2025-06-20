import { Module } from '@nestjs/common'
import { BonusController } from './controller'
import { BonusService } from './service'

@Module({
  controllers: [BonusController],
  exports: [],
  imports: [],
  providers: [BonusService]
})
export class BonusModule {}
