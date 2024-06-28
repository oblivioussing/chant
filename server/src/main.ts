import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import multipart from '@fastify/multipart'
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify'
import {
  GlobalExceptionFilter,
  HttpExceptionFilter,
  TransformInterceptor
} from './components'
import { AppModule } from './module/app'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  )
  app.register(multipart as any)
  app.setGlobalPrefix('/chant/')
  app.useGlobalFilters(new GlobalExceptionFilter(), new HttpExceptionFilter())
  app.useGlobalInterceptors(new TransformInterceptor())
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(7000, '0.0.0.0')
}
bootstrap()
