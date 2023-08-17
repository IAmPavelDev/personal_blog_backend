import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../Schemas/User.schema';
import { FilterQuery, Model } from 'mongoose';

@Injectable()
export class UsersRepository {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {}

    async find(userFilterQuery: FilterQuery<User>): Promise<User[]> {
        return this.userModel.find(userFilterQuery);
    }

    async findOne(userFilterQuery: FilterQuery<User>) {
        return this.userModel.findOne(userFilterQuery);
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

    async updateStatisticArray(
        userFilterQuery: FilterQuery<User>,
        postId: string,
        type: 'pushView' | 'pushLike' | 'removeLike',
    ) {
        const user = await this.userModel.findOne(userFilterQuery);
        switch (type) {
            case 'pushLike':
                user.likes = Array.from(new Set([...user.likes, postId]));
                break;
            case 'pushView':
                user.views = Array.from(new Set([...user.views, postId]));
                break;
            case 'removeLike':
                user.likes = user.likes.filter((id: string) => id !== postId);
                break;
        }
        await user.save();
        return user as User;
    }

    async delete(userFilterQuery: FilterQuery<User>): Promise<string> {
        await this.userModel.findOneAndDelete(userFilterQuery);
        return 'userFilterQuery.userId';
    }
}
