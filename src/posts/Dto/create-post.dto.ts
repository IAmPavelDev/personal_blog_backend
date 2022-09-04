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
    tags?: string[];
}
