import {
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Patch,
    Post as PostDecorator,
    Req,
    UseGuards,
} from '@nestjs/common';
import { CreatePostDto } from './Dto/create-post.dto';
import { UpdatePostDto } from './Dto/update-post.dto';
import { PostService } from './Post.service';
import { Post } from '../Schemas/Post.schema';
import { AuthenticatedGuard } from 'src/auth/Authenticated.guard';
import { Request } from 'express';
import { ReturnPostsType } from './Types/ReturnPostsType';
import { ReturnContent } from './Types/ReturnContentPost';
import { SearchFilterType } from './Types/SearchFilterType';

@Controller('posts')
export class PostsController {
    constructor(private readonly postService: PostService) {}

    @Get(':postId')
    async getPostContentById(
        @Req() req: Request,
        @Param() { postId }: { postId: string },
    ): Promise<ReturnContent> {
        const isOnlyContent = Boolean(req.query.mode);

        if (isOnlyContent) {
            return await this.postService.getContentById(postId);
        }
        return await this.postService.getAllPostDataById(postId);
    }

    @Get()
    async getPosts(@Req() req: Request): Promise<ReturnPostsType> {
        const searchOptions = req.query.s ? req.query.s.toString() : '';
        const page = req.query.p ? Number(req.query.p) : null;

        const searchType = String(req.query.t) as SearchFilterType;

        return await this.postService.getPosts(searchOptions, page, searchType);
    }

    @PostDecorator()
    async createPost(@Body() post: CreatePostDto): Promise<Post> {
        return await this.postService.createPost(post);
    }

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
        return deletedPostId;
    }
}
