import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { Post } from './Schemas/Post.schema';
import { PostRepository } from './Post.repository';
import { UpdatePostDto } from './Dto/update-post.dto';

@Injectable()
export class PostService {
    constructor(private readonly PostRepository: PostRepository) {}

    async getPostById(postId: string): Promise<Post> {
        return this.PostRepository.findOne({ postId });
    }

    async getPosts(title?: string): Promise<Post[]> {
        const postFilterQuery = title ? { title } : null;
        return this.PostRepository.find(postFilterQuery);
    }

    async createPost(
        title: string,
        content: string,
        tags: string[],
    ): Promise<Post> {
        return this.PostRepository.create({
            postId: uuidv4(),
            creationDate: new Date(),
            title,
            content,
            tags,
        });
    }

    async updatePost(
        postId: string,
        postUpdates: UpdatePostDto,
    ): Promise<Post> {
        return this.PostRepository.update( {postId} , postUpdates);
    }

    async deletePost(postId: string) {
        return this.PostRepository.delete({postId});
    }
}
