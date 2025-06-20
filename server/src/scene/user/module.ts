import { Module } from '@nestjs/common'
import { UserController } from './controller'
import { UserService } from './service'

@Module({
  controllers: [UserController],
  exports: [],
  imports: [],
  providers: [UserService]
})
export class UserModule {}
