import { IComment } from 'src/apis/comments/entities/comment.entity';
import { IUser } from 'src/apis/users/entities/user.entity';
import { BaseTableOption } from 'src/utils/base-table.util';

export interface IReply extends BaseTableOption {
  idx: number;
  commentIdx: IComment['idx'];
  authorIdx: IUser['idx'];
  content: string;
}

export namespace IReply {
  export interface ICreateReplyInput
    extends Pick<IReply, 'commentIdx' | 'content'> {}

  export interface IDetailReplyOutPut
    extends Pick<
      IReply,
      'idx' | 'authorIdx' | 'commentIdx' | 'content' | 'createdAt' | 'updatedAt'
    > {}
}
