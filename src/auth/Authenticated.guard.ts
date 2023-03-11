import {
    CanActivate,
    ExecutionContext,
    Inject,
    UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { UsersService } from 'src/users/users.service';
import CheckToken from './CheckTokenIsValid';
import jwtTokenGenerator from './jwtToken.generator';

interface UserNameJwtPayload extends jwt.JwtPayload {
    payload: {
        userId: string;
        username: string;
    };
}

export class AuthenticatedGuard implements CanActivate {
    constructor(@Inject(UsersService) private usersService: UsersService) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        if (!request.cookies.token) {
            throw new UnauthorizedException('Token not found');
        }
        
        const { username } = CheckToken(request.cookies.token);

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
