import { Tag } from 'src/tags/Dto/Tag';

export class UpdatePostDto {
    title?: string;

    preview?: string;

    previewImage?: string;

    previewImagePlaceholder?: string;

    content?: string;

    tags?: Array<Tag>;
}
