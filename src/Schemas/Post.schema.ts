import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type PostDocument = Post & Document;

@Schema()
export class Post {
    @ApiProperty()
    @Prop()
    postId: string;

    @ApiProperty()
    @Prop()
    creationDate: Date;

    @ApiProperty()
    @Prop()
    title: string;

    @ApiProperty()
    @Prop()
    preview: string;

    @ApiProperty()
    @Prop()
    content: string;

    @ApiProperty({ required: false })
    @Prop(Array<{ id: string; tagWord: string }>)
    tags: Array<{ id: string; tagWord: string }>;
}

export const PostSchema = SchemaFactory.createForClass(Post);
