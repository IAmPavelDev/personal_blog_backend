import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsController } from './Post.controller';
import { PostRepository } from './Post.repository';
import { PostService } from './Post.service';
import { Post, PostSchema } from '../Schemas/Post.schema';
import { AuthModule } from 'src/auth/Auth.module';
import { UsersModule } from 'src/users/users.module';
import { StorageModule } from 'src/storage/storage.module';
import { TagsModule } from '../tags/Tags.module';
import { TagsService } from '../tags/Tags.service';
import { TagsRepository } from '../tags/Tags.repository';
import { Tag, TagSchema } from '../Schemas/Tag.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Post.name, schema: PostSchema },
            { name: Tag.name, schema: TagSchema },
        ]),
        AuthModule,
        UsersModule,
        StorageModule,
        TagsModule,
    ],
    controllers: [PostsController],
    providers: [PostService, PostRepository, TagsService, TagsRepository],
})
export class PostsModule {}
