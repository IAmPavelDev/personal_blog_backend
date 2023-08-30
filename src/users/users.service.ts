import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/Schemas/User.schema';
import { CreateUserDto } from './Dto/create-user.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import jwtTokenGenerator from '../Guards/jwtToken.generator';
import * as jwt from 'jsonwebtoken';
import { FilterQuery } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

interface UserNameJwtPayload extends jwt.JwtPayload {
    payload: {
        userId: string;
        username: string;
    };
}

@Injectable()
export class UsersService {
    constructor(private usersRepository: UsersRepository) {}

    async findOne(filterQuery: FilterQuery<User>) {
        return await this.usersRepository.findOne(filterQuery);
    }

    findOneUserBySessionId(sessionId: string) {
        return this.usersRepository.findOne({
            sessionIds: {
                $elemMatch: {
                    $eq: sessionId,
                },
            },
        });
    }

    async findRegisteredUsers() {
        return this.usersRepository.find({ isRegistered: true });
    }

    async pushPostToViews(sessionId: string, postId: string) {
        const query: FilterQuery<User> = {
            sessionIds: {
                $elemMatch: {
                    $eq: sessionId,
                },
            },
        };

        const user = await this.usersRepository.findOne(query);

        if (!user) {
            throw new Error('User not found');
        }

        user.views = Array.from(new Set([...user.views, postId]));

        user.save();

        return user as User;
    }
    async pushPostToLikes(sessionId: string, postId: string) {
        const user = await this.findOneUserBySessionId(sessionId);

        if (!user) {
            throw new Error('User not found');
        }

        user.likes = Array.from(new Set([...user.likes, postId]));

        user.save();

        return user as User;
    }
    async removePostFromLikes(sessionId: string, postId: string) {
        const user = await this.findOneUserBySessionId(sessionId);

        if (!user) {
            throw new Error('User not found');
        }

        user.likes = user.likes.filter((like: string) => like !== postId);

        user.save();

        return user as User;
    }

    async loginWithToken(
        oldToken: string,
    ): Promise<{ newToken: string; userId: string }> {
        const {
            payload: { userId },
        } = <UserNameJwtPayload>(
            jwt.verify(oldToken, process.env.JWT_SECRET_KEY)
        );

        const user = await this.usersRepository.findOne({ userId });

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        const { ...userData } = user; //get all fields of user from db
        delete userData['_doc']['password']; // remove pwd field, for safety

        if (!userData) {
            throw new UnauthorizedException('Can`t find user');
        }

        return {
            newToken: jwtTokenGenerator({
                username: userData['_doc']['username'],
                userId: userData['_doc']['userId'],
            }),
            userId: userData['_doc']['userId'],
        };
    }

    async loginWithUserData(
        login: string,
        password: string,
    ): Promise<{ newToken: string; userId: string }> {
        const filterQuery = {
            $and: [
                { $or: [{ username: login }, { email: login }] },
                { isRegistered: true },
            ],
        };

        const user = await this.usersRepository.findOne(filterQuery);

        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        if (!(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Password incorrect');
        }

        const payload = { userId: user.userId, username: user.username };

        return { newToken: jwtTokenGenerator(payload), userId: user.userId };
    }

    async createSession(token: string): Promise<Omit<User, 'password'>> {
        const user = await this.usersRepository.create({
            userId: token,
            username: '',
            email: '',
            isAdmin: false,
            isRegistered: false,
            password: '',
            sessionIds: [token],
            views: [],
            likes: [],
        });

        delete user.password;

        return user;
    }

    async register(
        { name, password, email }: CreateUserDto,
        oldToken: string,
        newToken: string,
    ): Promise<Omit<User, 'password'>> {
        const hashedPwd = await bcrypt.hash(password, 5);

        const oldSessionData: User = await this.findOneUserBySessionId(
            oldToken,
        );

        const oldSessionIds = oldSessionData?.sessionIds
            ? oldSessionData.sessionIds.filter((t: string) => t !== oldToken)
            : [];

        const user = !!oldSessionData?.userId
            ? await this.usersRepository.update(
                  { userId: oldSessionData.userId },
                  {
                      username: name,
                      email,
                      isRegistered: true,
                      sessionIds: [...oldSessionIds, newToken],
                      password: hashedPwd,
                  },
              )
            : await this.usersRepository.create({
                  username: name,
                  userId: newToken,
                  email,
                  isRegistered: true,
                  isAdmin: false,
                  sessionIds: [newToken],
                  password: hashedPwd,
                  views: [],
                  likes: [],
              });

        delete user.password;

        return user;
    }

    async delete(userId: string, password: string): Promise<string> {
        const user: User = await this.usersRepository.findOne({ userId });

        if (
            user.isRegistered &&
            !(await bcrypt.compare(user.password, password))
        ) {
            throw new UnauthorizedException();
        }

        return this.usersRepository.delete({ userId });
    }
}
