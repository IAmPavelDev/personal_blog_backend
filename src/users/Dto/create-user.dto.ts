import { IsEmail, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
    @MaxLength(30)
    name: string;

    @IsEmail()
    email: string;

    @MinLength(8)
    password: string;
}
