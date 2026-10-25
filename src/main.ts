import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.ts';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.getOrThrow('port');
  await app.listen(port);
}
await bootstrap();
