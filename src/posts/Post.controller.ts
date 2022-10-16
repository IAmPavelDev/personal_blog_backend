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
    Req,
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
import { Request } from 'express';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
    constructor(private readonly postService: PostService) {}

    @ApiOkResponse({ type: Post, description: 'Post by id' })
    @ApiNotFoundResponse()
    @Get(':postId')
    async getContent(
        @Param('postId') postId: string,
    ): Promise<{ content: string; postId: string }> {
        const posts = await this.postService.getContentById(postId);
        if (!posts) {
            throw new NotFoundException(
                'Post not found, post.controller, str:37',
            );
        }
        return posts;
    }

    @ApiOkResponse({ type: Post, isArray: true, description: 'All posts' })
    @ApiNotFoundResponse()
    @Get()
    async getPosts(@Req() req: Request): Promise<Post[]> {
        let options = {};

        if (req.query.s) {
            options = {
                $or: [
                    { title: new RegExp(req.query.s.toString(), 'i') },
                    { content: new RegExp(req.query.s.toString(), 'i') },
                    { preview: new RegExp(req.query.s.toString(), 'i') },
                ],
            };
        }
        const posts = await this.postService.getPosts(options);
        if (!posts.length) {
            throw new NotFoundException(
                'Posts not found, post.controller, str:49',
            );
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
            throw new NotFoundException(
                'Post not found, post.controller, str:71',
            );
        }
        return post;
    }

    @UseGuards(AuthenticatedGuard)
    @Delete(':postId')
    async deletePost(@Param('postId') postId: string): Promise<string> {
        const deletedPostId = await this.postService.deletePost(postId);
        if (!deletedPostId) {
            throw new NotFoundException(
                'Post not found, post.controller, str:81',
            );
        }
        return JSON.stringify({ deletedPostId });
    }
}
