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

@Injectable()
export class PostService {
    constructor(
        private readonly PostRepository: PostRepository,
        private readonly store: StorageService,
    ) {}

    async getAllPostDataById(
        postId: string
    ): Promise<Post | undefined> {

        const Post: Post = await this.PostRepository.findById({ postId });

        if (!Post) {
            throw new Error('Post by id not found');
        }
        return Post;
    }

    async getContentById(
        postId: string
    ): Promise<ReturnContent> {
        const content = await this.PostRepository.findContentById({ postId });
        if (!content) {
            throw new NotFoundException('Post not found');
        }

        return content;
    }

    async getPosts(
        searchOptions = '',
        page?: number,
        type: SearchFilterType = 'all'
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
            $or: filterTypes[type] ?? filterTypes['all']
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
        tags,
    }: CreatePostDto): Promise<Post> {
        return this.PostRepository.create({
            postId: uuidv4(),
            creationDate: new Date(),
            title,
            content,
            preview,
            previewImage,
            tags,
        });
    }

    async updatePost(
        postId: string,
        postUpdates: UpdatePostDto,
    ): Promise<Post> {
        return this.PostRepository.update({ postId }, postUpdates);
    }

    async deletePost(postId: string): Promise<string> {
        return this.PostRepository.delete({ postId });
    }
}
