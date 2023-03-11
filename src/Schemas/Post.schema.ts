import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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

    @Prop(Array<{ id: string; tagWord: string }>)
    tags: Array<{ id: string; tagWord: string }>;
}

export const PostSchema = SchemaFactory.createForClass(Post);
