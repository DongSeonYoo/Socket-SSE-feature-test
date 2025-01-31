import { IComment } from 'src/apis/comments/entities/comment.entity';
import { INotification } from 'src/apis/notifications/entities/notification.entity';
import { IUser } from 'src/apis/users/entities/user.entity';
import { BaseTableOption } from 'src/utils/base-table.util';

export interface IPost extends BaseTableOption {
  idx: number;
  authorIdx: IUser['idx'];
  title: string;
  content: string;
}

export namespace IPost {
  export interface ICreatePostInput extends Pick<IPost, 'title' | 'content'> {}

  export interface IDetialPostOutput
    extends Pick<
      IPost,
      'idx' | 'authorIdx' | 'title' | 'content' | 'createdAt'
    > {}

  export interface IPostListOutput extends Omit<IDetialPostOutput, 'content'> {
    authorName: IUser['name'];
  }

  export interface ICommentListOutput
    extends Pick<
      IComment,
      'idx' | 'content' | 'createdAt' | 'updatedAt' | 'authorIdx'
    > {
    authorName: IUser['name'];
  }

  export namespace IEvent {
    export interface OnUpdatePost
      extends INotification.ICreateNotificationInput {
      content: IPost['content'];
    }
  }
}
