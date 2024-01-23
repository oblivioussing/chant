import { Module } from '@nestjs/common'
import { TradeController } from './controller'
import { TradeService } from './service'

@Module({
  imports: [],
  exports: [],
  controllers: [TradeController],
  providers: [TradeService]
})
export class TradeModule {}
