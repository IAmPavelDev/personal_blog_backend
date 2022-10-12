import { ApiProperty } from '@nestjs/swagger';
export class CreatePostDto {
    @ApiProperty()
    title: string;

    @ApiProperty()
    content: string;

    @ApiProperty()
    preview: string;

    @ApiProperty({ required: false })
    tags?: Array<{ id: string; tagWord: string }>;
}
