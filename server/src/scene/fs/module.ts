import { Module } from '@nestjs/common'
import { FsController } from './controller'
import { FsService } from './service'

@Module({
  controllers: [FsController],
  exports: [],
  imports: [],
  providers: [FsService]
})
export class FsModule {}
