import {
    Controller,
    Get,
    Post,
    UseGuards,
    Req,
    Res,
    HttpStatus,
    Inject,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { AuthenticatedGuard } from './auth/Authenticated.guard';
import { LoginGuard } from './auth/login.guard';

import { StorageService } from 'src/storage/Storage.service';

import { v4 as uuidv4 } from 'uuid';

@Controller()
export class AppController {
    constructor(@Inject(StorageService) private store: StorageService) {}

    @Get('sessionEntrance')
    session(@Req() req: Request, @Res() res: Response) {
        const oldToken = req.cookies.sessionToken;

        const newToken = uuidv4();

        res.cookie('sessionToken', newToken, {
            sameSite: 'none',
            secure: true,
            httpOnly: true,
        });

        if (oldToken) {
            this.store.updateUserSession(oldToken, newToken);
        } else {
            this.store.create(newToken);
        }

        res.send({ status: 'success' });
    }

    @UseGuards(LoginGuard)
    @Post('login')
    login(@Res() res: Response) {
        res.status(HttpStatus.OK).send();
    }

    @UseGuards(AuthenticatedGuard)
    @Get('tokenRefresh')
    tokenRefresh(@Req() req: Request, @Res() res: Response) {
        res.status(HttpStatus.OK).send(req.user);
    }
}
