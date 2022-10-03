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
import { AppService } from './app.service';
import { AuthenticatedGuard } from './auth/Authenticated.guard';
import { LoginGuard } from './auth/login.guard';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @UseGuards(LoginGuard)
    @Post('login')
    login(@Req() req: Request, @Res() res: Response) {
        res.status(HttpStatus.OK).send();
    }

    @UseGuards(AuthenticatedGuard)
    @Get('protected')
    getHello(@Req() req: Request, @Res() res: Response) {
        res.status(HttpStatus.OK).send(req.user);
    }
}
