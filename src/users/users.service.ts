import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/Schemas/User.schema';
import { CreateUserDto } from './Dto/create-user.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import jwtTokenGenerator from '../Guards/jwtToken.generator';
import * as jwt from 'jsonwebtoken';
import { FilterQuery } from 'mongoose';

interface UserNameJwtPayload extends jwt.JwtPayload {
    payload: {
        userId: string;
        username: string;
    };
}

@Injectable()
export class UsersService {
    constructor(private usersRepository: UsersRepository) {}

    async findOne(filterQuery: FilterQuery<User>): Promise<User | undefined> {
        return await this.usersRepository.findOne(filterQuery);
    }

    findOneUserBySessionId(
        sessionId: string,
        isRegistered?: boolean,
    ): Promise<User | undefined> {
        return this.usersRepository.findOne({
            sessionIds: {
                $elemMatch: {
                    $eq: sessionId,
                },
            },
            isRegistered,
        });
    }

    async findRegisteredUsers() {
        return this.usersRepository.find({ isRegistered: true });
    }

    async updateSessionToken(
        oldToken: string,
        newToken: string,
    ): Promise<Omit<User, 'password'>> {
        const query: FilterQuery<User> = {
            sessionIds: {
                $elemMatch: {
                    $eq: oldToken,
                },
            },
        };

        const user = await this.usersRepository.findOne(query);

        user.sessionIds = [
            ...user.sessionIds.filter((id: string) => id !== oldToken),
            newToken,
        ];

        await user.save();

        delete user.password;

        return user as Omit<User, 'password'>;
    }

    pushPostToViews(sessionId: string, postId: string) {
        return this.usersRepository.updateStatisticArray(
            { currentSessionId: sessionId },
            postId,
            'pushView',
        );
    }
    pushPostToLikes(sessionId: string, postId: string) {
        return this.usersRepository.updateStatisticArray(
            { currentSessionId: sessionId },
            postId,
            'pushLike',
        );
    }
    removePostFromLikes(sessionId: string, postId: string) {
        return this.usersRepository.updateStatisticArray(
            { currentSessionId: sessionId },
            postId,
            'removeLike',
        );
    }

    async loginWithToken(
        oldToken: string,
        sessionData: User | null,
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

        if (!!sessionData) {
            const { views, likes } = sessionData;

            [views, likes].forEach((field: string[], idx: number) => {
                field.forEach((postId: string) => {
                    this.usersRepository.updateStatisticArray(
                        { userId },
                        postId,
                        !!idx ? 'pushLike' : 'pushView',
                    );
                });
            });
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
        sessionData: User | null,
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

        if (!!sessionData) {
            const { views, likes } = sessionData;

            [views, likes].forEach((field: string[], idx: number) => {
                field.forEach((postId: string) => {
                    this.usersRepository.updateStatisticArray(
                        filterQuery,
                        postId,
                        !!idx ? 'pushLike' : 'pushView',
                    );
                });
            });
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
            false,
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
