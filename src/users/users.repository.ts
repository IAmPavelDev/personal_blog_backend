import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../Schemas/User.schema';
import { FilterQuery, Model } from 'mongoose';

@Injectable()
export class UsersRepository {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {}

    async findOne(postFilterQuery: FilterQuery<User>): Promise<User> {
        return this.userModel.findOne({
            username: postFilterQuery.filterQuery,
        });
    }

    async find(): Promise<User[]> {
        return this.userModel.find();
    }

    async create(user: User): Promise<User> {
        const newUser = new this.userModel(user);
        return newUser.save();
    }

    async update(
        userFilterQuery: FilterQuery<User>,
        user: Partial<User>,
    ): Promise<User> {
        return this.userModel.findOneAndUpdate(userFilterQuery, user, {
            new: true,
        });
    }

    async delete(userId: FilterQuery<User>): Promise<string> {
        return (await this.userModel.findOneAndDelete(userId)).name;
    }
}
