import { Module } from '@nestjs/common'
import { RoleController } from './controller'
import { RoleService } from './service'

@Module({
  controllers: [RoleController],
  exports: [],
  imports: [],
  providers: [RoleService]
})
export class RoleModule {}
