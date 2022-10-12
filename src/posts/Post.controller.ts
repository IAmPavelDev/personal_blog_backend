import {
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Patch,
    Post as PostDecorator,
    Query,
    UseGuards,
} from '@nestjs/common';
import {
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiQuery,
    ApiTags,
} from '@nestjs/swagger';
import { CreatePostDto } from './Dto/create-post.dto';
import { UpdatePostDto } from './Dto/update-post.dto';
import { PostService } from './Post.service';
import { Post } from '../Schemas/Post.schema';
import { AuthenticatedGuard } from 'src/auth/Authenticated.guard';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
    constructor(private readonly postService: PostService) {}

    @ApiOkResponse({ type: Post, description: 'Post by id' })
    @ApiNotFoundResponse()
    @Get(':postId')
    async getPost(@Param('postId') postId: string): Promise<Post> {
        const posts = await this.postService.getPostById(postId);
        if (!posts) {
            throw new NotFoundException("Post not found, post.controller, str:37");
        }
        return posts;
    }

    @ApiOkResponse({ type: Post, isArray: true, description: 'All posts' })
    @ApiNotFoundResponse()
    @ApiQuery({ name: 'title', required: false })
    @Get()
    async getPosts(@Query('title') title?: string): Promise<Post[]> {
        const posts = await this.postService.getPosts(title);
        if (!posts.length) {
            throw new NotFoundException("Post not found, post.controller, str:49");
        }
        return posts;
    }

    @UseGuards(AuthenticatedGuard)
    @ApiCreatedResponse({ type: Post })
    @PostDecorator()
    async createPost(@Body() createPostDto: CreatePostDto): Promise<Post> {
        return this.postService.createPost(createPostDto);
    }

    @ApiOkResponse({ type: Post, description: 'patched post' })
    @ApiNotFoundResponse()
    @UseGuards(AuthenticatedGuard)
    @Patch(':postId')
    async updatePost(
        @Param('postId') postId: string,
        @Body() updatePostDto: UpdatePostDto,
    ): Promise<Post> {
        const post = await this.postService.updatePost(postId, updatePostDto);
        if (!post) {
            throw new NotFoundException("Post not found, post.controller, str:71");
        }
        return post;
    }

    @UseGuards(AuthenticatedGuard)
    @Delete(':postId')
    async deletePost(@Param('postId') postId: string): Promise<string> {
        const deletedPostId = await this.postService.deletePost(postId);
        if (!deletedPostId) {
            throw new NotFoundException("Post not found, post.controller, str:81");
        }
        return JSON.stringify({ deletedPostId });
    }
}
