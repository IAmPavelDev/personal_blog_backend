import { Post } from 'src/Schemas/Post.schema';

export type ReturnPostsType = { data: Post[]; total: number; page: number };
