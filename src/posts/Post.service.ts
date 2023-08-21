import {
    forwardRef,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { Post } from '../Schemas/Post.schema';
import { PostRepository } from './Post.repository';
import { UpdatePostDto } from './Dto/update-post.dto';
import { CreatePostDto } from './Dto/create-post.dto';
import { ReturnPostsType } from './Types/ReturnPostsType';
import { ReturnContent } from './Types/ReturnContentPost';
import { TagsService } from '../tags/Tags.service';
import { Tag } from 'src/Schemas/Tag.schema';
import { UsersService } from '../users/users.service';

@Injectable()
export class PostService {
    constructor(
        private readonly PostRepository: PostRepository,
        @Inject(forwardRef(() => TagsService))
        private readonly TagsService: TagsService,
        @Inject(forwardRef(() => UsersService))
        private readonly UsersService: UsersService,
    ) {}

    async getPostById(postId: string): Promise<Post | undefined> {
        const Post = await this.PostRepository.findById({ postId });

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
        query = '',
        page?: number,
        tagIds: string[] = [],
    ): Promise<ReturnPostsType> {
        const limitPerPage = 8;
        const filterReg = new RegExp(query, 'i');
        const q =
            tagIds.length > 0
                ? {
                      tags: {
                          $elemMatch: {
                              id: {
                                  $in: tagIds,
                              },
                          },
                      },
                  }
                : {};

        const options = {
            $and: [
                {
                    $or: [
                        { title: filterReg },
                        { content: filterReg },
                        { preview: filterReg },
                        { tags: { tagWord: filterReg } },
                    ],
                },
                q,
            ],
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
            likes: [],
            views: [],
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

    async pushView(postId: string, sessionId: string) {
        const post = await this.PostRepository.findById({ postId });

        const userId = (
            await this.UsersService.pushPostToViews(sessionId, postId)
        ).userId;

        post.views = Array.from(new Set([...post.views, userId]));
        post.save();
    }

    async pushLike(postId: string, sessionId: string) {
        const post = await this.PostRepository.findById({ postId });

        const user = await this.UsersService.pushPostToLikes(sessionId, postId);

        const userId = user.userId;

        console.log(user, sessionId, post);

        post.likes = Array.from(new Set([...post.likes, userId]));
        post.save();

        return 'success';
    }

    async removeLike(postId: string, sessionId: string) {
        const post = await this.PostRepository.findById({ postId });

        const userId = (
            await this.UsersService.removePostFromLikes(sessionId, postId)
        ).userId;

        post.likes = post.likes.filter((id: string) => id !== userId);
        post.save();

        return 'success';
    }

    async deleteTag(tagId: string, postId: string): Promise<Post> {
        const post = await this.PostRepository.findById({ postId });

        post.tags = post.tags.filter((t) => t.id !== tagId);
        await post.save();

        return post;
    }

    async deletePost(postId: string): Promise<string> {
        const post = await this.PostRepository.findById({ postId });

        if (!!post) {
            post.tags.forEach((tag: Tag) => {
                this.TagsService.deletePostId(tag.id, postId);
            });
        }

        return this.PostRepository.delete({ postId });
    }
}
