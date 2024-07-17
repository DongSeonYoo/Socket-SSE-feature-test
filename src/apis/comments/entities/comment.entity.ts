import { IPost } from 'src/apis/posts/entities/post.entity';
import { IUser } from 'src/apis/users/entities/user.entity';
import { BaseTableOption } from 'src/utils/base-table.util';

export interface IComment extends BaseTableOption {
  idx: number;
  postIdx: IPost['idx'];
  authorIdx: IUser['idx'];
  content: string;
}

export namespace IComment {
  export interface ICreateCommentInput
    extends Pick<IComment, 'content' | 'postIdx'> {}
}
