import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Tag, TagDocument } from '../Schemas/Tag.schema';

@Injectable()
export class TagsRepository {
    constructor(@InjectModel(Tag.name) private tagModel: Model<TagDocument>) {}

    async findTagById(postFilterQuery: FilterQuery<Tag>) {
        return await this.tagModel
            .findOne(postFilterQuery)
            .select('id content postsIds')
            .exec();
    }

    async find(options: FilterQuery<Tag>) {
        return await this.tagModel
            .find(options)
            .select('id content postsIds')
            .exec();
    }

    async create(tag: Tag): Promise<Tag> {
        const newTag = new this.tagModel(tag);
        let tagCarr = null;
        newTag.save((err, tag) => {
            if (err) {
                return;
            }
            tagCarr = tag.toObject();
        });
        delete tagCarr['_id'];
        return tagCarr;
    }

    async update(
        tagFilterQuery: FilterQuery<Tag>,
        tag: Partial<Tag>,
    ): Promise<Tag> {
        return this.tagModel.findOneAndUpdate(tagFilterQuery, tag, {
            new: true,
        });
    }

    async delete(tagId: FilterQuery<Tag>): Promise<string> {
        return (await this.tagModel.findOneAndDelete(tagId)).id;
    }
}
