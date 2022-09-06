import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from '../Schemas/Post.schema';
import { FilterQuery, Model } from 'mongoose';
import { GetPostDto } from './Dto/get-post.dto';

@Injectable()
export class PostRepository {
    constructor(
        @InjectModel(Post.name) private postModel: Model<PostDocument>,
    ) {}

    async findOne(postFilterQuery: FilterQuery<Post>): Promise<Post> {
        return this.postModel.findOne(postFilterQuery);
    }

    async find(postFilterQuery?: FilterQuery<GetPostDto>): Promise<Post[]> {
        return this.postModel.find(postFilterQuery);
    }

    async create(post: Post): Promise<Post> {
        const newPost = new this.postModel(post);
        return newPost.save();
    }

    async update(
        postFilterQuery: FilterQuery<Post>,
        post: Partial<Post>,
    ): Promise<Post> {
        return this.postModel.findOneAndUpdate(postFilterQuery, post, {
            new: true,
        });
    }

    async delete(postId: FilterQuery<Post>): Promise<string> {
        return (await this.postModel.findOneAndDelete(postId)).title;
    }
}
