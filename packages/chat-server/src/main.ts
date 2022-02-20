import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { logger } from './common/middleware/logger.middleware';
import { PrismaService } from './modules/prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 全局中间件
  app.use(logger);

  // 解决 prisma enableShutdownHooks 问题
  // https://docs.nestjs.com/recipes/prisma#issues-with-enableshutdownhooks
  const prismaService: PrismaService = app.get(PrismaService);
  prismaService.enableShutdownHooks(app);

  await app.listen(3000);
}
bootstrap();
