import { Module } from '@nestjs/common'
import { PositionController } from './controller'
import { PositionService } from './service'

@Module({
  controllers: [PositionController],
  exports: [],
  imports: [],
  providers: [PositionService]
})
export class PositionModule {}
