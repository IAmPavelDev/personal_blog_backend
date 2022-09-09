import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/Schemas/User.schema';
import { CreateUserDto } from './Dto/create-user.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { UpdateUserDto } from './Dto/update-user.dto';
import { DeleteUserDto } from './Dto/delete-user.dto';

@Injectable()
export class UsersService {
    constructor(private usersRepository: UsersRepository) {}

    async findOne(filterQuery: string): Promise<User | undefined> {
        return this.usersRepository.findOne({ filterQuery });
    }

    async findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    async create({ name, password }: CreateUserDto): Promise<User> {
        const hashedPwd = await bcrypt.hash(password, 5);
        return this.usersRepository.create({
            userId: uuidv4(),
            username: name,
            name,
            password: hashedPwd,
        });
    }

    async update(userId: string, updates: UpdateUserDto): Promise<User> {
        return this.usersRepository.update({ userId }, updates);
    }

    async delete({ userId, password }: DeleteUserDto): Promise<string> {
        if (!bcrypt.compare((await this.findOne(userId)).password, password)) {
            throw new UnauthorizedException();
        }
        return this.usersRepository.delete({ userId });
    }
}
