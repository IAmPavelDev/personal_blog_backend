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
  content: string;

  @Prop([String])
  tags: string[];
}

export const PostSchema = SchemaFactory.createForClass(Post);
