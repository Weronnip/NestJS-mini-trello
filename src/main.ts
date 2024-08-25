import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('BackEnd mini-trello')
    .setDescription('Backend with token authorization, mini trello')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  app.setGlobalPrefix('api');
  await app.listen(3000);
  app.useLogger(['log', 'error', 'warn', 'debug', 'verbose']);
  console.log('\n Server starting by address: http://localhost:3000\n');
}
bootstrap();
