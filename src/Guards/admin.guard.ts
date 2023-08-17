import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

export class AdminGuard extends AuthGuard {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const { token } = context.switchToHttp().getRequest().cookies;

        const user = await this.getUser(token);


        return user.isRegistered && user.isAdmin;
    }
}
