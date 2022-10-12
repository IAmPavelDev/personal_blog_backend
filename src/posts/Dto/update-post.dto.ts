import { ApiProperty } from '@nestjs/swagger';

export class UpdatePostDto {
    @ApiProperty()
    title?: string;

    @ApiProperty()
    preview: string;

    @ApiProperty()
    content?: string;

    @ApiProperty({ required: false })
    tags?: Array<{ id: string; tagWord: string }>;
}
