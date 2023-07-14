import { Tag } from 'src/tags/Dto/Tag';

export class CreatePostDto {
    title: string;

    content: string;

    preview: string;

    previewImage: string;

    previewImagePlaceholder: string;

    tags?: Array<Tag>;
}
