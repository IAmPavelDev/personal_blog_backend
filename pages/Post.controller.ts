import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post as PostDecorator,
} from '@nestjs/common';
import { CreatePostDto } from './Dto/create-post.dto';
import { UpdatePostDto } from './Dto/update-post.dto';
import { PostService } from './Post.service';
import { Post } from './Schemas/Post.schema';

@Controller('posts')
export class PostsController {
    constructor(private readonly postService: PostService) {}

    @Get(':postId')
    async getPost(@Param(':postId') postId: string): Promise<Post> {
        return this.postService.getPostById(postId);
    }

    @Get()
    async getPosts(): Promise<Post[]> {
        return this.postService.getPosts();
    }

    @PostDecorator()
    async createPost(@Body() createPostDto: CreatePostDto): Promise<Post> {
        return this.postService.createPost(
            createPostDto.title,
            createPostDto.content,
            createPostDto.tags,
        );
    }

    @Patch(":postId")
    async updatePost(@Param(":postId") postId: string, @Body() updatePostDto: UpdatePostDto): Promise<Post> {
        return this.postService.updatePost(postId, updatePostDto);
    }
}
