import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Tag } from 'src/tags/Dto/Tag';

export type PostDocument = Post & Document;

@Schema()
export class Post {
    @Prop()
    postId: string;

    @Prop()
    creationDate: Date;

    @Prop()
    title: string;

    @Prop()
    preview: string;

    @Prop()
    previewImage: string;

    @Prop()
    previewImagePlaceholder: string;

    @Prop()
    content: string;

    @Prop(Array<Tag>)
    tags: Array<Tag>;

    @Prop()
    likes: Array<string>;

    @Prop()
    views: Array<string>;
}

export const PostSchema = SchemaFactory.createForClass(Post);
