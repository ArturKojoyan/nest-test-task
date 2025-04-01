import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SeederService } from './seeder/seeder.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  // Run the seeder
  const seeder = app.get(SeederService);
  await seeder.seed();

  await app.listen(process.env.PORT ?? 3000);
  console.log('running on port', process.env.PORT ?? 3000);
}
bootstrap();
