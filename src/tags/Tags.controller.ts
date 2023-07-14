import {
    Body,
    Controller,
    Get,
    Param,
    Post as PostDecorator,
    Req,
} from '@nestjs/common';
import { TagsService } from './Tags.service';
import { Request } from 'express';
import { Tag } from './Dto/Tag';

@Controller('tags')
export class TagsController {
    constructor(private readonly tagsService: TagsService) {}

    @Get(':tagId')
    async getTagById(
        @Req() req: Request,
        @Param() { tagId }: { tagId: string },
    ): Promise<Tag> {
        return await this.tagsService.getTagById(tagId);
    }

    @Get()
    async getTags(@Req() req: Request): Promise<Tag[]> {
        const query = req.query.q ? req.query.q.toString() : '';
        return await this.tagsService.getTags(query);
    }

    @PostDecorator()
    async createTag(@Body() tag: Omit<Tag, 'id'>): Promise<Tag> {
        return await this.tagsService.createTag(tag);
    }
    @PostDecorator()
    async pushPostId(@Body() tagId: string, postId: string): Promise<Tag> {
        return await this.tagsService.pushPostId(tagId, postId);
    }

    // @UseGuards(AuthenticatedGuard)
    // @Delete(':postId')
    // async deletePost(@Param('postId') postId: string): Promise<string> {
    //     const deletedPostId = await this.tagsService.deletePost(postId);
    //     if (!deletedPostId) {
    //         throw new NotFoundException('Post not found');
    //     }
    //     return JSON.stringify({ deletedPostId });
    // }
}
