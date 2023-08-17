import {
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Post as PostDecorator,
    Req,
    UseGuards,
} from '@nestjs/common';
import { TagsService } from './Tags.service';
import { Request } from 'express';
import { Tag } from './Dto/Tag';
import { AuthGuard } from '../Guards/auth.guard';
import { AdminGuard } from '../Guards/admin.guard';

@Controller('tags')
export class TagsController {
    constructor(private readonly tagsService: TagsService) {}

    @Get(':tagId')
    async getTagById(
        @Req() req: Request,
        @Param() { tagId }: { tagId: string },
    ): Promise<Tag | Tag[]> {
        const tagsIds = tagId.split(',').filter((t) => t.length);
        return tagsIds.length === 1
            ? await this.tagsService.getTagById(tagsIds[0])
            : await this.tagsService.getTagsByIds(tagsIds);
    }

    @Get()
    async getTags(@Req() req: Request): Promise<Tag[]> {
        const query = req.query.q ? req.query.q.toString() : '';
        return await this.tagsService.getTags(query);
    }

    @PostDecorator()
    async createTag(@Body() tag: Omit<Tag, 'id' | 'postsIds'>): Promise<Tag> {
        return await this.tagsService.createTag(tag);
    }
    @PostDecorator()
    async pushPostId(@Body() tagId: string, postId: string): Promise<Tag> {
        return await this.tagsService.pushPostId(tagId, postId);
    }

    @UseGuards(AdminGuard)
    @Delete(':tagId')
    async deletePost(@Param('tagId') tagId: string): Promise<string> {
        const deletedTagId = await this.tagsService.deleteTag(tagId);
        if (!deletedTagId) {
            throw new NotFoundException('Post not found');
        }
        return JSON.stringify({ deletedTagId });
    }
}
