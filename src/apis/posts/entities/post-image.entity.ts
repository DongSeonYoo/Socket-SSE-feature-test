import { IPost } from './post.entity';

export interface IPostImage {
  idx: number;
  postIdx: IPost['idx'];
  path: string;
}
