import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ImageDocument = Image & Document;

@Schema()
export class Image {
    @Prop()
    imageId: string;

    @Prop()
    creationDate: Date;

    @Prop()
    alt: string;

    @Prop()
    imageFile: File;

    @Prop(Array<{ id: string; tagWord: string }>)
    tags: Array<{ id: string; tagWord: string }>;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
