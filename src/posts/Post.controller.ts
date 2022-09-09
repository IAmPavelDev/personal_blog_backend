import {
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Patch,
    Post as PostDecorator,
    Query,
    UseGuards,
} from '@nestjs/common';
import {
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiQuery,
    ApiTags,
} from '@nestjs/swagger';
import { CreatePostDto } from './Dto/create-post.dto';
import { UpdatePostDto } from './Dto/update-post.dto';
import { PostService } from './Post.service';
import { Post } from '../Schemas/Post.schema';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
    constructor(private readonly postService: PostService) {}

    @ApiOkResponse({ type: Post, description: 'Post by id' })
    @ApiNotFoundResponse()
    @Get(':postId')
    async getPost(@Param('postId') postId: string): Promise<Post> {
        const posts = await this.postService.getPostById(postId);
        if (!posts) {
            throw new NotFoundException();
        }
        return posts;
    }

    @ApiOkResponse({ type: Post, isArray: true, description: 'All posts' })
    @ApiNotFoundResponse()
    @ApiQuery({ name: 'title', required: false })
    @Get()
    async getPosts(@Query('title') title?: string): Promise<Post[]> {
        const posts = await this.postService.getPosts(title);
        if (!posts.length) {
            throw new NotFoundException();
        }
        return posts;
    }

    @UseGuards(AuthenticatedGuard)
    @ApiCreatedResponse({ type: Post })
    @PostDecorator()
    async createPost(@Body() createPostDto: CreatePostDto): Promise<Post> {
        return this.postService.createPost(
            createPostDto.title,
            createPostDto.content,
            createPostDto.tags,
        );
    }

    @UseGuards(AuthenticatedGuard)
    @ApiOkResponse({type: Post, description: 'patched post'})
    @ApiNotFoundResponse()
    @Patch(':postId')
    async updatePost(
        @Param('postId') postId: string,
        @Body() updatePostDto: UpdatePostDto,
    ): Promise<Post> {
        console.log(postId);
        const post = await this.postService.updatePost(postId, updatePostDto);
        if (!post) throw new NotFoundException();
        return post;
    }

    @UseGuards(AuthenticatedGuard)
    @Delete(':postId')
    async deletePost(@Param('postId') postId: string): Promise<string> {
        const postName = await this.postService.deletePost(postId);
        if(!postName) throw new NotFoundException();
        return postName;
    }
}
