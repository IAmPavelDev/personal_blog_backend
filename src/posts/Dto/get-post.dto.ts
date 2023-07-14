import { Tag } from 'src/tags/Dto/Tag';

export class GetPostDto {
    title?: string;
    preview?: string;
    content?: string;
    tags?: Array<Tag>;
}
