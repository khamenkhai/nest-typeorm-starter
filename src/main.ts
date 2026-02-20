import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import helmet from 'helmet';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // --- Environment & Constants ---
  const port = process.env.PORT ?? 3000;
  const isProduction = process.env.NODE_ENV === 'production';
  const globalPrefix = 'api';

  // --- Middleware & Security ---
  app.use(helmet());
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // --- Global NestJS Config ---
  app.setGlobalPrefix(globalPrefix, { exclude: ['/'] });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // --- Documentation (Development Only) ---
  if (!isProduction) {
    const config = new DocumentBuilder()
      .setTitle('API Documentation')
      .setDescription('The official API documentation for the POS system.')
      .setVersion('1.0')
      .addTag('pos')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);

    // Standard Swagger UI
    SwaggerModule.setup('swagger', app, document, {
      jsonDocumentUrl: 'swagger/json',
    });

    // Modern Scalar UI
    app.use(
      '/reference',
      apiReference({
        content: document
      }),
    );
  }

  // --- Server Startup ---
  await app.listen(port);

  console.log(`
🚀 Application is running on : http://localhost:${port}/${globalPrefix}
📖 Swagger Documentation     : http://localhost:${port}/swagger
📖 Scalar Documentation      : http://localhost:${port}/reference
  `);
}

bootstrap();