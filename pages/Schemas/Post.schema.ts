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
    content: string;

    @ApiProperty({ required: false })
    @Prop([String])
    tags: string[];
}

export const PostSchema = SchemaFactory.createForClass(Post);
