import { ApiProperty } from "@nestjs/swagger";

export class DeleteUserDto {
    @ApiProperty()
    userId: string;

    @ApiProperty()
    password: string;
}