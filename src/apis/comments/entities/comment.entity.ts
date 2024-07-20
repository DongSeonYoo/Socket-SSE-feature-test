import { INotification } from 'src/apis/notifications/entities/notification.entity';
import { IPost } from 'src/apis/posts/entities/post.entity';
import { IReply } from 'src/apis/replies/entities/reply.entity';
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

  export interface IReplyListOutPut extends Array<IReply.IDetailReplyOutPut> {}

  export namespace IEvent {
    export interface OnCreate extends INotification.ICreateNotificationInput {
      content: IComment['content'];
      authorName: IUser['name'];
    }

    export interface OnUpdate extends INotification.ICreateNotificationInput {
      content: IComment['content'];
    }
  }
}
