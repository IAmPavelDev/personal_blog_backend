import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsModule } from './posts/Post.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import * as dotenv from 'dotenv';
import { AuthModule } from './auth/Auth.module';

dotenv.config();
@Module({
    imports: [
        MongooseModule.forRoot(process.env.DB_CONNECTION),
        PostsModule,
        UsersModule,
        AuthModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
