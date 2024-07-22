import { NotificationName } from '@prisma/client';
import { IPost } from 'src/apis/posts/entities/post.entity';

export class PostUpdatedEvent implements IPost.IEvent.OnUpdatePost {
  static readonly eventName = 'post.updated';

  constructor(
    readonly senderIdx: number,
    readonly createdAt: Date,
    readonly entityIdx: number,
    readonly entityType: NotificationName,
    readonly receiverIdx: number,
    readonly content: IPost['content'],
  ) {}
}
