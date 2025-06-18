import multipart from '@fastify/multipart'
import { NestFactory } from '@nestjs/core'
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify'
import { GlobalExceptionFilter, TransformInterceptor } from './components'
import { AppModule } from './module/app'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  )
  app.register(multipart as any)
  app.setGlobalPrefix('/chant/')
  app.useGlobalFilters(new GlobalExceptionFilter())
  app.useGlobalInterceptors(new TransformInterceptor())
  await app.listen(7000, '0.0.0.0')
}
bootstrap()
