export class CreatePostDto {
    title: string;

    content: string;

    preview: string;

    previewImage: string;

    previewImagePlaceholder: string;

    tags?: Array<{ id: string; tagWord: string }>;
}
