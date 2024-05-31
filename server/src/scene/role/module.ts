import { Module } from '@nestjs/common'
import { RoleController } from './controller'
import { RoleService } from './service'

@Module({
  imports: [],
  exports: [],
  controllers: [RoleController],
  providers: [RoleService]
})
export class RoleModule {}
