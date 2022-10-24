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

@Controller()
export class AppController {

    @Get('sessionEntrance')
    session(@Req() req: Request, @Res() res: Response) {
        
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
