import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsModule } from 'src/posts/Post.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsController } from 'src/posts/Post.controller';
import { PostService } from 'src/posts/Post.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [
        MongooseModule.forRoot(
            '',
        ),
        PostsModule,
        UsersModule,
        AuthModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
