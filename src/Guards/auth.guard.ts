import {
    CanActivate,
    ExecutionContext,
    Inject,
    UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import CheckToken from './CheckTokenIsValid';
import { User } from '../Schemas/User.schema';

export class AuthGuard implements CanActivate {
    constructor(@Inject(UsersService) private usersService: UsersService) {}

    async getUser(token?: string): Promise<User> {
        if (!token) {
            throw new UnauthorizedException('Token not found');
        }
        const userId = CheckToken(token);

        const user = await this.usersService.findOne({
            userId: { $eq: userId },
        });

        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        return user;
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        return (
            await this.getUser(
                context.switchToHttp().getRequest().cookies.token,
            )
        ).isRegistered;
    }
}
