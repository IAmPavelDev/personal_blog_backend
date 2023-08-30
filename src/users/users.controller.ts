import {
    Body,
    Controller,
    Delete,
    Get,
    Post,
    Res,
    Req,
    HttpStatus,
    UseGuards,
} from '@nestjs/common';
import { User } from 'src/Schemas/User.schema';
import { CreateUserDto } from './Dto/create-user.dto';
import { UsersService } from './users.service';
import { v4 as uuidv4 } from 'uuid';
import { Request, Response } from 'express';
import { AdminGuard } from '../Guards/admin.guard';

@Controller('user')
export class UsersController {
    constructor(private userService: UsersService) {}

    @UseGuards(AdminGuard)
    @Get('users')
    async getUsers() {
        return this.userService.findRegisteredUsers();
    }

    @Get('sessionEntrance')
    async session(@Req() req: Request, @Res() res: Response) {
        const oldToken = req.cookies.sessionToken;
        const user = await this.userService.findOne({
            sessionIds: {
                $elemMatch: {
                    $eq: oldToken,
                },
            },
        });

        res.send({ status: 'success', user });
    }

    @Post('login')
    async login(
        @Res() res: Response,
        @Req() req: Request,
        @Body() { username, password }: { username: string; password: string },
    ) {
        const { token: loginToken } = req.cookies;

        const userData =
            username && password
                ? await this.userService.loginWithUserData(username, password)
                : loginToken
                ? await this.userService.loginWithToken(loginToken)
                : null;

        if (!userData) {
            throw new Error('no login data provided');
        }

        const { newToken, userId } = userData;

        res.cookie('token', newToken, {
            sameSite: 'none',
            secure: true,
            httpOnly: true,
            expires: new Date(Date.now() + 7884008640), //3 months
        });

        const user: User = await this.userService.findOne({ userId });

        delete user.password;
        delete user.sessionIds;

        if (user.sessionIds && user.password) {
            res.status(HttpStatus.CONFLICT);
        }

        res.status(HttpStatus.OK).send({ user });
    }

    @Post('register')
    async register(
        @Res() response: Response,
        @Req() request: Request,
        @Body() userData: CreateUserDto,
    ) {
        const oldToken = request.cookies.sessionToken;

        const newToken = uuidv4();

        response.cookie('sessionToken', newToken, {
            sameSite: 'none',
            secure: true,
            httpOnly: true,
            expires: new Date(Date.now() + 7884008640), //3 months
        });

        const user = this.userService.register(userData, oldToken, newToken);

        response.send(user);
    }

    @Delete()
    async delete(userId: string, password: string): Promise<string> {
        return this.userService.delete(userId, password);
    }
}
