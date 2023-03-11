import { UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

interface UserNameJwtPayload extends jwt.JwtPayload {
    payload: {
        userId: string;
        username: string;
    };
}

export default function CheckToken(token: string) {
    try {
        const { payload } = <UserNameJwtPayload>(
            jwt.verify(token, process.env.JWT_SECRET_KEY)
        );
        return { username: payload.username };
    } catch {
        throw new UnauthorizedException('Invalid token');
    }
}
