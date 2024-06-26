import { Module } from '@nestjs/common'
import { FsController } from './controller'
import { FsService } from './service'

@Module({
  imports: [],
  exports: [],
  controllers: [FsController],
  providers: [FsService]
})
export class FsModule {}
