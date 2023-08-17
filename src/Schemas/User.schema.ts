import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop()
    userId: string;

    @Prop()
    username: string;

    @Prop()
    email: string;

    @Prop()
    isAdmin: boolean;

    @Prop()
    isRegistered: boolean;

    @Prop()
    sessionIds: Array<string>;

    @Prop()
    views: Array<string>;

    @Prop()
    likes: Array<string>;

    @Prop()
    password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
