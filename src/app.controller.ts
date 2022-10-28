import {
    Controller,
    Get,
    Post,
    UseGuards,
    Req,
    Res,
    HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthenticatedGuard } from './auth/Authenticated.guard';
import { LoginGuard } from './auth/login.guard';
import SessionGuard from './auth/sessionGuard';

@Controller()
export class AppController {
    @UseGuards(SessionGuard)
    @Get('sessionEntrance')
    session(@Res() res: Response) {
        res.status(HttpStatus.OK).send();
    }

    @UseGuards(LoginGuard)
    @Post('login')
    login(@Res() res: Response) {
        res.status(HttpStatus.OK).send();
    }

    @UseGuards(AuthenticatedGuard)
    @Get('tockenRefresh')
    tokenRefresh(@Req() req: Request, @Res() res: Response) {
        res.status(HttpStatus.OK).send(req.user);
    }
}
