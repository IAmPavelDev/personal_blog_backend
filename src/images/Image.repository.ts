import { ReturnImageT } from './types/ReturnImageT';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Image, ImageDocument } from 'src/Schemas/Image.schema';

@Injectable()
export class ImageRepository {
    constructor(
        @InjectModel(Image.name) private imageModel: Model<ImageDocument>,
    ) {}

    // async postImageFiles

    async findImageFileById(imageId: string) {
        return await this.imageModel
            .findOne({ imageId })
            .select('imageFile')
            .exec();
    }

    async findImageMetadataById(imageId: string): Promise<ReturnImageT> {
        return await this.imageModel.findOne({ imageId });
    }
}
