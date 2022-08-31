import {
    Body,
    Controller,
    Get,
    NotFoundException,
    Param,
    Patch,
    Post as PostDecorator,
    Query,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './Dto/create-post.dto';
import { UpdatePostDto } from './Dto/update-post.dto';
import { PostService } from './Post.service';
import { Post } from './Schemas/Post.schema';

@ApiTags("Posts")
@Controller('posts')
export class PostsController {
    constructor(private readonly postService: PostService) {}

    @ApiOkResponse({type: Post, description: "Post by id"})
    @ApiNotFoundResponse()
    @Get(':postId')
    async getPost(@Param('postId') postId: string): Promise<Post> {
        const posts = await this.postService.getPostById(postId);
        if(!posts) {
            throw new NotFoundException();
        }
        return posts;
    }


    @ApiOkResponse({type: Post, isArray: true, description: "All posts"})
    @ApiNotFoundResponse()
    @ApiQuery({name: "title", required: false})
    @Get()
    async getPosts(@Query("title") title?: string): Promise<Post[]> {
        const posts = await this.postService.getPosts(title);
        if(!posts.length) {
            throw new NotFoundException();
        }
        return posts;
    }

    @ApiCreatedResponse({type: Post})
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
