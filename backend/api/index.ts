import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

let app: NestExpressApplication;

export default async function handler(req: any, res: any) {
  if (!app) {
    app = await NestFactory.create<NestExpressApplication>(AppModule);
    
    // Serve static files
    app.useStaticAssets(join(__dirname, '..', 'uploads'), {
      prefix: '/uploads/',
    });
    
    // Enable CORS
    app.enableCors({
      origin: '*',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });

    // Global validation pipe
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));

    // Swagger documentation
    const config = new DocumentBuilder()
      .setTitle('E-Commerce API')
      .setDescription('Modern e-commerce API documentation')
      .setVersion('1.0')
      .addTag('products')
      .addTag('orders')
      .addTag('auth')
      .build();
    
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    console.log('DATABASE_URL:', process.env.DATABASE_URL);
    console.log('JWT_SECRET:', process.env.JWT_SECRET);
    console.log('NODE_ENV:', process.env.NODE_ENV);

    await app.init();
  }

  return app.getHttpServer().emit('request', req, res);
}
