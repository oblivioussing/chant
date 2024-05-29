import { Module } from '@nestjs/common'
import { OrgController } from './controller'
import { OrgService } from './service'

@Module({
  imports: [],
  exports: [],
  controllers: [OrgController],
  providers: [OrgService]
})
export class OrgModule {}
