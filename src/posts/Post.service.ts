import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { Post } from '../Schemas/Post.schema';
import { PostRepository } from './Post.repository';
import { UpdatePostDto } from './Dto/update-post.dto';
import { CreatePostDto } from './Dto/create-post.dto';
import { ReturnPostsType } from './Types/ReturnPostsType';
import { ReturnContent } from './Types/ReturnContentPost';
import { SearchFilterType } from './Types/SearchFilterType';
import { StorageService } from '../storage/Storage.service';
import { TagsService } from '../tags/Tags.service';
import { Tag } from 'src/Schemas/Tag.schema';

@Injectable()
export class PostService {
    constructor(
        private readonly PostRepository: PostRepository,
        private readonly TagsService: TagsService,
        private readonly store: StorageService,
    ) {}

    async getAllPostDataById(postId: string): Promise<Post | undefined> {
        const Post: Post = await this.PostRepository.findById({ postId });

        if (!Post) {
            throw new Error('Post by id not found');
        }
        return Post;
    }

    async getContentById(postId: string): Promise<ReturnContent> {
        const content = await this.PostRepository.findContentById({ postId });
        if (!content) {
            throw new NotFoundException('Post not found');
        }

        return content;
    }

    async getPosts(
        searchOptions = '',
        page?: number,
        type: SearchFilterType = 'all',
    ): Promise<ReturnPostsType> {
        const limitPerPage = 8;
        const filterReg = new RegExp(searchOptions, 'i');

        const filterTypes = {
            title: [{ title: filterReg }],
            content: [{ content: filterReg }],
            preview: [{ preview: filterReg }],
            tags: [{ tags: { tagWord: filterReg } }],
            all: [
                { title: filterReg },
                { content: filterReg },
                { preview: filterReg },
                { tags: { tagWord: filterReg } },
            ],
        };
        const options = {
            $or: filterTypes[type] ?? filterTypes['all'],
        };

        const total = await this.PostRepository.count(options);

        const data = page
            ? await this.PostRepository.find(options)
                  .skip((page - 1) * limitPerPage)
                  .limit(limitPerPage)
                  .exec()
            : await this.PostRepository.find(options);

        return {
            data,
            total,
            page,
        };
    }

    async createPost({
        title,
        content,
        preview,
        previewImage,
        previewImagePlaceholder,
        tags,
    }: CreatePostDto): Promise<Post> {
        const createdPost = await this.PostRepository.create({
            postId: uuidv4(),
            creationDate: new Date(),
            title,
            content,
            preview,
            previewImage,
            previewImagePlaceholder,
            tags,
        });

        tags.forEach((tag) =>
            this.TagsService.pushPostId(tag.id, createdPost.postId),
        );

        return createdPost;
    }

    async updatePost(
        postId: string,
        postUpdates: UpdatePostDto,
    ): Promise<Post> {
        const oldPost = await this.PostRepository.findById({ postId });
        if (
            postUpdates?.tags &&
            oldPost.tags.toString() !== postUpdates.tags.toString()
        ) {
            const changes = {
                toDelete: [],
                toCreate: [],
            };

            [
                {
                    one: oldPost.tags,
                    two: postUpdates.tags,
                    place: changes.toDelete,
                },
                {
                    one: postUpdates.tags,
                    two: oldPost.tags,
                    place: changes.toCreate,
                },
            ].forEach(({ one, two, place }) => {
                one.forEach((tag: Tag) => {
                    if (two.indexOf(tag) === -1) place = [...place, tag];
                });
            });

            changes.toCreate.forEach((tag: Tag) =>
                this.TagsService.pushPostId(tag.id, oldPost.postId),
            );
            changes.toDelete.forEach((tag: Tag) =>
                this.TagsService.deletePostId(tag.id, oldPost.postId),
            );
        }
        return this.PostRepository.update({ postId }, postUpdates);
    }

    async deletePost(postId: string): Promise<string> {
        const { tags } = await this.PostRepository.findById({ postId });

        tags.forEach((tag: Tag) => {
            this.TagsService.deletePostId(tag.id, postId);
        });

        return this.PostRepository.delete({ postId });
    }
}
