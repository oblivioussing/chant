import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { ScheduleModule } from '@nestjs/schedule'
import { HeaderResolver, I18nModule } from 'nestjs-i18n'
import * as path from 'path'
import { AuthGuard } from '../components'
import { ScheduleService } from '../schedule'
import { RedisModule } from './redis/module'
import sence from './scene'

@Module({
  imports: [
    I18nModule.forRootAsync({
      useFactory: () => ({
        fallbackLanguage: 'en',
        loaderOptions: {
          path: path.join(__dirname, '../i18n/'),
          watch: true
        }
      }),
      resolvers: [new HeaderResolver(['lang'])],
      inject: [ConfigService]
    }),
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
