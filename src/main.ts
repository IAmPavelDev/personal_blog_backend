import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
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

    const config = new DocumentBuilder()
        .setTitle('Blog API')
        .setDescription(
            'IAmPavel personal blog API <hr> <a target="_blank" href="https://github.com/IAmPavelDev/personal_blog_backend">GitHub</a> <hr> <a target="_blank" href="https://t.me/g3t_P4v3l">Telegram</a>',
        )
        .setVersion('1.0')
        .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('/api', app, document);
    await app.listen(process.env.PORT);
}
bootstrap();
