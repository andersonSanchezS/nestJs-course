import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { TransformInterceptor } from './transform.interceptor'
import { Logger } from '@nestjs/common'

async function bootstrap() {
    const logger = new Logger()
    const app = await NestFactory.create(AppModule)
    app.useGlobalPipes(new ValidationPipe())
    app.useGlobalInterceptors(new TransformInterceptor())
    await app.listen(5000)
    logger.log(`Application is running on port ${5000}`)
}
bootstrap()
