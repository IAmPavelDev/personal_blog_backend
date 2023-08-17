import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TagsController } from './Tags.controller';
import { TagsRepository } from './Tags.repository';
import { TagsService } from './Tags.service';
import { UsersModule } from 'src/users/users.module';
import { Tag, TagSchema } from '../Schemas/Tag.schema';
import { PostRepository } from '../posts/Post.repository';
import { PostService } from '../posts/Post.service';
import { PostsModule } from '../posts/Post.module';
import { Post, PostSchema } from '../Schemas/Post.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Post.name, schema: PostSchema },
            { name: Tag.name, schema: TagSchema },
        ]),
        UsersModule,
        forwardRef(() => PostsModule),
    ],
    controllers: [TagsController],
    providers: [TagsService, TagsRepository, PostService, PostRepository],
})
export class TagsModule {}
