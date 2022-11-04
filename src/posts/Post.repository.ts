import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from '../Schemas/Post.schema';
import { FilterQuery, Model, CallbackError } from 'mongoose';

@Injectable()
export class PostRepository {
    constructor(
        @InjectModel(Post.name) private postModel: Model<PostDocument>,
    ) {}

    async count(options: {}) {
        return await this.postModel.count(options).exec();
    }

    findContent(postFilterQuery: FilterQuery<Post>) {
        return this.postModel.findOne(postFilterQuery).select('content postId');
    }

    find(options: {}) {
        return this.postModel
            .find(options)
            .select('postId creationDate title preview tags previewImage');
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
        return (await this.postModel.findOneAndDelete(postId)).postId;
    }
}
