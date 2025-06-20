import { Module } from '@nestjs/common'
import { TradeController } from './controller'
import { TradeService } from './service'

@Module({
  controllers: [TradeController],
  exports: [],
  imports: [],
  providers: [TradeService]
})
export class TradeModule {}
