export type RatePostDto = {
    postId: string;
    userId: string;
    type: 'like' | 'dislike';
};
