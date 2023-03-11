export class UpdatePostDto {
    title?: string;

    preview?: string;

    previewImage?: string;

    previewImagePlaceholder?: string;

    content?: string;

    tags?: Array<{ id: string; tagWord: string }>;
}
