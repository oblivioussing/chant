import { Module } from '@nestjs/common'
import { RouterController } from './controller'
import { RouterService } from './service'

@Module({
  imports: [],
  exports: [],
  controllers: [RouterController],
  providers: [RouterService]
})
export class RouterModule {}
