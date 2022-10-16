import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { Post } from '../Schemas/Post.schema';
import { PostRepository } from './Post.repository';
import { UpdatePostDto } from './Dto/update-post.dto';
import { CreatePostDto } from './Dto/create-post.dto';

@Injectable()
export class PostService {
    constructor(private readonly PostRepository: PostRepository) {}

    async getContentById(postId: string): Promise<{content: string; postId: string}> {
        return this.PostRepository.findOne({ postId });
    }

    async getPosts(options:any): Promise<Post[]> {
        return this.PostRepository.find(options);
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
