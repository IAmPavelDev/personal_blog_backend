import { CanActivate, ExecutionContext, Inject } from '@nestjs/common';

import { v4 as uuidv4 } from 'uuid';

import { UsersService } from '../users/users.service';

export default class SessionGuard implements CanActivate {
    constructor(@Inject(UsersService) private UserService: UsersService) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const oldToken = req.cookies.sessionToken;

        if (
            !oldToken ||
            !(await this.UserService.findOne({
                sessionIds: {
                    $elemMatch: {
                        $eq: oldToken,
                    },
                },
            }))
        ) {
            await this.UserService.createSession(uuidv4());
        }

        return true;
    }
}
