import { NotificationName } from '@prisma/client';
import { IComment } from 'src/apis/comments/entities/comment.entity';
import { IUser } from 'src/apis/users/entities/user.entity';

export class CommentCreatedEvent implements IComment.IEvent.OnCreate {
  static readonly eventName = 'comment.created';

  constructor(
    readonly senderIdx: number,
    readonly createdAt: Date,
    readonly entityIdx: number,
    readonly entityType: NotificationName,
    readonly receiverIdx: number,
    readonly content: IComment['content'],
    readonly authorName: IUser['name'],
  ) {}
}
