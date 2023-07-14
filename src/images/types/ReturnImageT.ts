export type ReturnImageT = {
    imageId: string;

    creationDate: Date;

    alt: string;

    imageFile: File;

    tags: Array<{ id: string; tagWord: string }>;
};
