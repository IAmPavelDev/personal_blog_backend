import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsController } from './Post.controller';
import { PostRepository } from './Post.repository';
import { PostService } from './Post.service';
import { Post, PostSchema } from '../Schemas/Post.schema';
import { AuthModule } from 'src/auth/Auth.module';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
        AuthModule,
        UsersModule
    ],
    controllers: [PostsController],
    providers: [PostService, PostRepository],
})
export class PostsModule {}
