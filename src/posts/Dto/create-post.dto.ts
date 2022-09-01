import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, MaxLength } from 'class-validator';
export class CreatePostDto {
    @ApiProperty()
    @IsAlphanumeric()
    @MaxLength(30)
    title: string;

    @ApiProperty()
    content: string;
    @ApiProperty({ required: false })
    @MaxLength(10)
    tags?: string[];
}
