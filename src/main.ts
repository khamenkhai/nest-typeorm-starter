import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // --- 1. CORS Configuration ---
  // This must be enabled before routes and middleware
  app.enableCors({
    origin: true, // For development: allows all origins. Replace with ['your domain] for production.
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // --- 2. Global Configurations ---
  app.setGlobalPrefix('api', {
    exclude: ['/'],
  });

  // app.enableVersioning({
  //   type: VersioningType.URI,
  //   defaultVersion: '1',
  //   prefix: 'v',
  // });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // --- 3. Swagger Configuration ---
  const config = new DocumentBuilder()
    .setTitle('Api Docs')
    .setDescription('This are api documentations')
    .setVersion('1.0')
    .addTag('pos')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('swagger', app, document, {
    jsonDocumentUrl: 'swagger/json',
  });

  // --- 4. Scalar Configuration ---
  app.use(
    '/reference',
    apiReference({
      content: document,
    }),
  );

  // --- 5. Start the Server ---
  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}/api`);
  console.log(`📖 Swagger Docs: http://localhost:${port}/swagger`);
  console.log(`📖 Scalar Docs: http://localhost:${port}/reference`);
}
bootstrap();