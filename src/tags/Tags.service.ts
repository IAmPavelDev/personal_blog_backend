import { Injectable } from '@nestjs/common';
import { TagsRepository } from './Tags.repository';
import { v4 as uuidv4 } from 'uuid';

import { Tag } from './Dto/Tag';

@Injectable()
export class TagsService {
    constructor(private readonly TagsRepository: TagsRepository) {}

    async getTagById(tagId: string): Promise<Tag | undefined> {
        const Tag: Tag = await this.TagsRepository.findTagById({ tagId });

        if (!Tag) {
            throw new Error('Tag by id ' + tagId + ' not found');
        }
        return Tag;
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

    async createTag({ content, postsIds }: Omit<Tag, 'id'>): Promise<Tag> {
        return this.TagsRepository.create({
            id: uuidv4(),
            content,
            postsIds,
        });
    }
    async pushPostId(tagId: string, postId: string): Promise<Tag> {
        const { postsIds: oldIds } = await this.TagsRepository.findTagById({
            tagId,
        });
        return await this.TagsRepository.update(
            { tagId },
            { postsIds: [...oldIds, postId] },
        );
    }

    async deletePostId(
        tagId: string,
        postId: string,
    ): Promise<Tag> | undefined {
        const { postsIds: oldIds } = await this.TagsRepository.findTagById({
            tagId,
        });
        const updatedTag = await this.TagsRepository.update(
            { tagId },
            { postsIds: oldIds.filter((id: string) => id !== postId) },
        );
        if (!updatedTag.postsIds) {
            this.TagsRepository.delete({ tagId });
            return;
        }
        return updatedTag;
    }
    // async deletePost(postId: string): Promise<string> {
    //     return this.PostRepository.delete({ postId });
    // }
}
