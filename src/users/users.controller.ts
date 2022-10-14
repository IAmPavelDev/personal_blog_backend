import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { User } from 'src/Schemas/User.schema';
import { CreateUserDto } from './Dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
    constructor(private userService: UsersService) {}

    @Get()
    async getAll(): Promise<User[]> {
        return this.userService.findAll();
    }

    @Get(':userId')
    async getOne(@Param('userId') userId: string): Promise<User> {
        return this.userService.findOne(userId);
    }

    @Post()
    async create(@Body() userData: CreateUserDto): Promise<User> {
        return this.userService.create(userData);
    }

    @Delete()
    async delete(userId: string, password: string): Promise<string> {
        return this.userService.delete(userId, password);
    }
}
