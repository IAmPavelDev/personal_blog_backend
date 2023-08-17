import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    NotFoundException,
    Param,
    Patch,
    Post as PostDecorator,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import { CreatePostDto } from './Dto/create-post.dto';
import { UpdatePostDto } from './Dto/update-post.dto';
import { PostService } from './Post.service';
import { Post } from '../Schemas/Post.schema';
import { ReturnPostsType } from './Types/ReturnPostsType';
import { ReturnContent } from './Types/ReturnContentPost';
import { SearchFilterType } from './Types/SearchFilterType';

import { Request, Response } from 'express';
import { RatePostDto } from './Dto/rate-post-dto';
import { AdminGuard } from '../Guards/admin.guard';
import SessionGuard from '../Guards/session.guard';

@UseGuards(SessionGuard)
@Controller('posts')
export class PostsController {
    constructor(private readonly postService: PostService) {}

    @Get(':postId')
    async getPostById(
        @Req() req: Request,
        @Param() { postId }: { postId: string },
    ): Promise<ReturnContent> {
        const sessionId = req.cookies.sessionToken;

        const isOnlyContent = Boolean(req.query.mode);

        if (isOnlyContent) {
            await this.postService.pushView(postId, sessionId);
            return await this.postService.getContentById(postId);
        } else {
            await this.postService.pushView(postId, sessionId);
            return await this.postService.getPostById(postId);
        }
    }

    @Get()
    async getPosts(@Req() req: Request): Promise<ReturnPostsType> {
        const query = req.query.s ? req.query.s.toString() : '';
        const page = req.query.p ? Number(req.query.p) : null;

        const tagsString = String(req.query.t) as SearchFilterType;

        const tagIds = tagsString
            .split(',')
            .filter((id: string) => !!id.length);
        return await this.postService.getPosts(query, page, tagIds);
    }

    @UseGuards(AdminGuard)
    @PostDecorator()
    async createPost(@Body() post: CreatePostDto): Promise<Post> {
        return await this.postService.createPost(post);
    }

    @UseGuards(AdminGuard)
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

    @PostDecorator('rate')
    async likePost(
        @Body()
        { postId, userId, type }: RatePostDto,
        @Res() res: Response,
    ) {
        if (type !== 'like' && type !== 'dislike') {
            res.status(HttpStatus.BAD_REQUEST).send();
            throw new Error('Invalid post rate type operation');
        }

        if (
            type === 'like' &&
            (await this.postService.pushLike(postId, userId)) !== 'success'
        ) {
            res.status(HttpStatus.BAD_REQUEST).send();
            throw new Error('error while liking post: ' + postId);
        }

        if (
            type === 'dislike' &&
            (await this.postService.removeLike(postId, userId)) !== 'success'
        ) {
            res.status(HttpStatus.BAD_REQUEST).send();
            throw new Error('error while disliking post: ' + postId);
        }

        res.status(HttpStatus.OK).send();
    }

    @UseGuards(AdminGuard)
    @Delete(':postId')
    async deletePost(@Param('postId') postId: string, @Res() res: Response) {
        const deletedPostId = await this.postService.deletePost(postId);
        if (!deletedPostId) {
            throw new NotFoundException('Post not found');
        }
        res.status(HttpStatus.OK).send({ postId: deletedPostId });
    }
}
