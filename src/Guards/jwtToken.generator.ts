import * as jwt from 'jsonwebtoken';
export default function jwtTokenGenerator(payload: object): string {
    return jwt.sign({ payload }, process.env.JWT_SECRET_KEY, {
        expiresIn: '90d',
    });
}
