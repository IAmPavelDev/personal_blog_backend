import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    
    app.use(cookieParser());
    app.enableCors({
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });
    app.useGlobalPipes(new ValidationPipe());

    await app.listen(3000);
}
bootstrap();
