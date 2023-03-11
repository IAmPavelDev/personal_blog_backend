import {
    CanActivate,
    ExecutionContext,
    Inject,
    UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import jwtTokenGenerator from './jwtToken.generator';
import CheckToken from './CheckTokenIsValid';

export class LoginGuard implements CanActivate {
    constructor(@Inject(UsersService) private usersService: UsersService) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const loginToken = request.cookies.token;

        if (!loginToken || !loginToken.length) {
            if (!request.body.username || !request.body.password) {
                return false;
            }
            const user = await this.usersService.findOne(request.body.username);
            if (!user) {
                throw new UnauthorizedException('User not found');
            }
            if (!(await bcrypt.compare(request.body.password, user.password))) {
                throw new UnauthorizedException('Password incorrect');
            }
            const payload = { userId: user.userId, username: user.username };

            const token = jwtTokenGenerator(payload);
            response.cookie('token', token, {
                sameSite: 'none',
                secure: true,
                httpOnly: true,
            });
            return true;
        }

        const { username } = CheckToken(loginToken);

        const user = await this.usersService.findOne(username);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        const { ...userData } = user; //get all fields of user from db
        delete userData['_doc']['password']; // remove pwd field, for safety

        if (!userData) {
            throw new UnauthorizedException('Can`t find user');
        }
        response.cookie(
            'token',
            jwtTokenGenerator({
                username: userData['_doc']['username'],
                userId: userData['_doc']['userId'],
            }),
            {
                sameSite: 'none',
                secure: true,
                httpOnly: true,
            },
        );
        return true;
    }
}
