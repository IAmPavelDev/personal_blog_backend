import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { AuthModule } from 'src/auth/Auth.module';
import { Image, ImageSchema } from 'src/Schemas/Image.schema';
import { UsersModule } from 'src/users/users.module';
import { ImageController } from './Image.controller';
import { ImageRepository } from './Image.repository';
import { ImageService } from './Image.service';

@Module({
    imports: [
        MulterModule.register({
            dest: './uploads',
        }),
        MongooseModule.forFeature([{ name: Image.name, schema: ImageSchema }]),
        AuthModule,
        UsersModule,
    ],
    controllers: [ImageController],
    providers: [ImageService, ImageRepository],
})
export class ImageModule {}
