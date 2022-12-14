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
import { ReturnPostsType } from './Types/ReturnPostsType';
import { ReturnContent } from './Types/ReturnContentPost';
import SessionGuard from 'src/auth/sessionGuard';
import { StorageService } from 'src/storage/Storage.service';
import { SearchFilterType } from './Types/SearchFilterType';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
    constructor(
        private readonly postService: PostService,
        private readonly store: StorageService,
    ) {}

    @ApiOkResponse({ type: Post, description: 'Post by id' })
    @ApiNotFoundResponse()
    @Get(':postId')
    async getContent(@Param('postId') postId: string): Promise<ReturnContent> {
        return await this.postService.getContentById(postId);
    }

    @UseGuards(SessionGuard)
    @ApiOkResponse({ type: Post, isArray: true, description: 'All posts' })
    @ApiNotFoundResponse()
    @Get()
    async getPosts(@Req() req: Request): Promise<ReturnPostsType> {
        const searchOptions = req.query.s ? req.query.s.toString() : '';
        const page = req.query.p ? Number(req.query.p) : null;

        const searchType = String(req.query.t) as SearchFilterType;

        const existedOnFrontIds: string[] = this.store.get(
            req.cookies.sessionToken,
        ).collectedPosts;
        const posts = await this.postService.getPosts(
            searchOptions,
            page,
            searchType,
            existedOnFrontIds,
        );
        return posts;
    }

    @UseGuards(AuthenticatedGuard)
    @ApiCreatedResponse({ type: Post })
    @PostDecorator()
    async createPost(@Body() createPostDto: CreatePostDto): Promise<Post> {
        const res = this.postService.createPost(createPostDto);
        return res;
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
            throw new NotFoundException('Post not found');
        }
        return post;
    }

    @UseGuards(AuthenticatedGuard)
    @Delete(':postId')
    async deletePost(@Param('postId') postId: string): Promise<string> {
        const deletedPostId = await this.postService.deletePost(postId);
        if (!deletedPostId) {
            throw new NotFoundException('Post not found');
        }
        return JSON.stringify({ deletedPostId });
    }
}
