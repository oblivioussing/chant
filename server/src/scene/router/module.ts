import { Module } from '@nestjs/common'
import { RouterController } from './controller'
import { RouterService } from './service'

@Module({
  controllers: [RouterController],
  exports: [],
  imports: [],
  providers: [RouterService]
})
export class RouterModule {}
