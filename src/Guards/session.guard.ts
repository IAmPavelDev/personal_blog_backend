import { CanActivate, ExecutionContext, Inject } from '@nestjs/common';

import { v4 as uuidv4 } from 'uuid';

import { UsersService } from '../users/users.service';

export default class SessionGuard implements CanActivate {
    constructor(@Inject(UsersService) private UserService: UsersService) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const res = context.switchToHttp().getResponse();
        const oldToken = req.cookies.sessionToken;

        const user = await this.UserService.findOne({
            sessionIds: {
                $elemMatch: {
                    $eq: oldToken,
                },
            },
        });

        const newToken = uuidv4();

        if (!oldToken && !user) {
            await this.UserService.createSession(newToken);

            res.cookie('sessionToken', newToken, {
                sameSite: 'none',
                secure: true,
                httpOnly: true,
                expires: new Date(Date.now() + 7884008640), //3 months
            });
            req.cookies.sessionToken = newToken;
        }

        return true;
    }
}
