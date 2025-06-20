import { Module } from '@nestjs/common'
import { OrgController } from './controller'
import { OrgService } from './service'

@Module({
  controllers: [OrgController],
  exports: [],
  imports: [],
  providers: [OrgService]
})
export class OrgModule {}
