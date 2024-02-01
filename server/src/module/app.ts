import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { ScheduleModule } from '@nestjs/schedule'
import { AuthGuard } from '../guard/auth'
import { RedisModule } from './redis/module'
import sence from './scene'
import { ScheduleService } from '../schedule'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    RedisModule,
    ...sence
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    },
    ScheduleService
  ]
})
export class AppModule {}
