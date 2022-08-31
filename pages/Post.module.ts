import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PostsController } from "./Post.controller";
import { PostRepository } from "./Post.repository";
import { PostService } from "./Post.service";
import { Post, PostSchema } from "./Schemas/Post.schema";

@Module({
    imports: [MongooseModule.forFeature([{name: Post.name, schema: PostSchema}])],
    controllers: [PostsController],
    providers: [PostService, PostRepository]
})

export class PostsModule {};