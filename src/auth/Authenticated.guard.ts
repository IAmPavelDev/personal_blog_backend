import {
    CanActivate,
    ExecutionContext,
    Inject,
    UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { UsersService } from 'src/users/users.service';
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
        const isValid = jwt.verify(
            request.cookies.token,
            process.env.JWT_SECRET_KEY,
        );
        if (!isValid) {
            throw new UnauthorizedException('Invalid token');
        }
        const { payload } = <UserNameJwtPayload>(
            jwt.decode(request.cookies.token)
        );
        const user = await this.usersService.findOne(payload.username);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        const { ...userData } = user; //get all fields of user from db
        delete userData['_doc']['password']; // remove pwd field, for safety
        request.user = userData['_doc'];
        response.cookie(
            'token',
            jwtTokenGenerator({
                userId: request.user.userId,
                username: request.user.username,
            }),
        );
        return true;
    }
}
