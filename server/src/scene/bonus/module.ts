import { Module } from '@nestjs/common'
import { BonusController } from './controller'
import { BonusService } from './service'

@Module({
  imports: [],
  exports: [],
  controllers: [BonusController],
  providers: [BonusService]
})
export class BonusModule {}
