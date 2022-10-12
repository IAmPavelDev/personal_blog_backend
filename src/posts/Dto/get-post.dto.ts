export class GetPostDto {
    title?: string;
    preview?: string;
    content?: string;
    tags?: Array<{ id: string; tagWord: string }>;
}
