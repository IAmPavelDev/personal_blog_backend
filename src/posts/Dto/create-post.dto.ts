import { ApiProperty } from '@nestjs/swagger';
export class CreatePostDto {
    @ApiProperty()
    title: string;

    @ApiProperty()
    content: string;

    @ApiProperty({ required: false })
    tags?: string[];
}
