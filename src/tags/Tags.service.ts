import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { TagsRepository } from './Tags.repository';
import { v4 as uuidv4 } from 'uuid';

import { Tag } from './Dto/Tag';
import { PostService } from '../posts/Post.service';

@Injectable()
export class TagsService {
    constructor(
        private readonly TagsRepository: TagsRepository,
        @Inject(forwardRef(() => PostService))
        private readonly PostsService: PostService,
    ) {}

    async getTagById(tagId: string): Promise<Tag | undefined> {
        const Tag: Tag = await this.TagsRepository.findTagById(tagId);

        if (!Tag) {
            throw new Error('Tag by id ' + tagId + ' not found');
        }
        return Tag;
    }

    async getTagsByIds(tagIds: string[]) {
        return await this.TagsRepository.find({
            id: {
                $elemMatch: {
                    $in: tagIds,
                },
            },
        });
    }

    async getTags(searchOptions: string): Promise<Tag[]> {
        const filterReg = new RegExp(searchOptions, 'i');

        const data = await this.TagsRepository.find({ content: filterReg });

        if (!data) {
            throw new Error('Tags by query ' + searchOptions + ' not found');
        }

        return data.map(({ id, content, postsIds }) => ({
            id,
            content,
            postsIds,
        }));
    }

    async createTag({ content }: Omit<Tag, 'id' | 'postsIds'>): Promise<Tag> {
        return this.TagsRepository.create({
            id: uuidv4(),
            content,
            postsIds: [],
        });
    }
    async pushPostId(tagId: string, postId: string): Promise<Tag> {
        const { postsIds: oldIds } = await this.TagsRepository.findTagById(
            tagId,
        );
        return await this.TagsRepository.update(
            { tagId },
            { postsIds: [...oldIds, postId] },
        );
    }

    async deletePostId(
        tagId: string,
        postId: string,
    ): Promise<Tag> | undefined {
        const tag = await this.TagsRepository.findTagById(tagId);

        if (!!tag) {
            tag.postsIds = tag.postsIds.filter((id: string) => id !== postId);
            if (!tag.postsIds) {
                await this.TagsRepository.delete({ tagId });
                return;
            }
            tag.save();
            return tag;
        }
    }
    async deleteTag(tagId: string): Promise<string> {
        const postsIds = (await this.getTagById(tagId))[0].postsIds;

        let rest = [];

        for (const postId of postsIds) {
            const deletedPostId = (
                await this.PostsService.deleteTag(tagId, postId)
            ).postId;
            rest = postsIds.filter((id: string) => id !== deletedPostId);
        }
        if (!!rest.length)
            throw new Error(
                'Can`t delete tag from every post in postsIds array',
            );
        return this.TagsRepository.delete({ tagId });
    }
}
