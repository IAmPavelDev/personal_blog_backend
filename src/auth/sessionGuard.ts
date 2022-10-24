import { CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { StorageService } from 'src/storage/Storage.service';

import { v4 as uuidv4 } from 'uuid';

export default class SessionGuard implements CanActivate {
    constructor(@Inject(StorageService) private store: StorageService) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const res = context.switchToHttp().getResponse();
        const oldToken = req.cookies.sessionToken;
        const newToken = uuidv4();
        res.cookie('sessionToken', newToken);
        if (oldToken) {
            if (this.store.updateUserId(oldToken, newToken)) return true;
        } else {
            if (this.store.create(newToken)) return true;
        }
    }
}
