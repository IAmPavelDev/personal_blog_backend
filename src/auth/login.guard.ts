import {
    CanActivate,
    ExecutionContext,
    Inject,
    UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import jwtTokenGenerator from './jwtToken.generator';

export class LoginGuard implements CanActivate {
    constructor(@Inject(UsersService) private userService: UsersService) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = await this.userService.findOne(request.body.username);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        if (!(await bcrypt.compare(request.body.password, user.password))) {
            throw new UnauthorizedException('Password incorrect');
        }
        const payload = { userId: user.userId, username: user.username };
        const token = jwtTokenGenerator(payload);
        context.switchToHttp().getResponse().cookie('token', token);
        return true;
    }
}
