import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { Post } from '../Schemas/Post.schema';
import { PostRepository } from './Post.repository';
import { UpdatePostDto } from './Dto/update-post.dto';
import { CreatePostDto } from './Dto/create-post.dto';
import { ReturnPostsType } from './Types/ReturnPostsType';
import { ReturnContent } from './Types/ReturnContentPost';
import { StorageService } from 'src/storage/Storage.service';

@Injectable()
export class PostService {
    constructor(
        private readonly PostRepository: PostRepository,
        private readonly store: StorageService,
    ) {}

    async getContentById(postId: string): Promise<ReturnContent> {
        const content = await this.PostRepository.findContent({ postId });
        if (!content) {
            throw new NotFoundException('Post not found');
        }
        return content;
    }

    async getPosts(
        searchOptions: string,
        page?: number,
        existedOnFrontIds?: string[],
    ): Promise<ReturnPostsType> {
        const limitPerPage = 9;
        const options = {
            $or: [
                { title: new RegExp(searchOptions, 'i') },
                { content: new RegExp(searchOptions, 'i') },
                { preview: new RegExp(searchOptions, 'i') },
            ],
            postId: { $nin: existedOnFrontIds },
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
        tags,
    }: CreatePostDto): Promise<Post> {
        return this.PostRepository.create({
            postId: uuidv4(),
            creationDate: new Date(),
            title,
            content,
            preview,
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
