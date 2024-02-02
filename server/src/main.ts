import { NestFactory } from '@nestjs/core'
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify'
import { ValidationPipe } from '@nestjs/common'
import { GlobalExceptionFilter, HttpExceptionFilter } from './filter/exception'
import { TransformInterceptor } from './interceptor/transform'
import { AppModule } from './module/app'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  )
  app.enableCors()
  app.setGlobalPrefix('/chant/')
  app.useGlobalFilters(new GlobalExceptionFilter(), new HttpExceptionFilter())
  app.useGlobalInterceptors(new TransformInterceptor())
  app.useGlobalPipes(new ValidationPipe({}))
  await app.listen(7000, '0.0.0.0')
}
bootstrap()
