import { Module } from '@nestjs/common'
import { PositionController } from './controller'
import { PositionService } from './service'

@Module({
  imports: [],
  exports: [],
  controllers: [PositionController],
  providers: [PositionService]
})
export class PositionModule {}
