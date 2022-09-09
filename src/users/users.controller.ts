import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { User } from 'src/Schemas/User.schema';
import { CreateUserDto } from './Dto/create-user.dto';
import { DeleteUserDto } from './Dto/delete-user.dto';
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

    @ApiCreatedResponse({ type: User })
    @Post()
    async create(@Body() userData: CreateUserDto): Promise<User> {
        return this.userService.create(userData);
    }

    @UseGuards(AuthenticatedGuard)
    @ApiCreatedResponse({ type: DeleteUserDto })
    @Delete()
    async delete(@Body() userData: DeleteUserDto): Promise<string> {
        return this.userService.delete(userData);
    }
}
