import { NotificationName } from '@prisma/client';
import { CreateNotificationDto } from '../dto/create-notification.dto';

export class CommentCreatedEvent2 extends CreateNotificationDto {
  static readonly eventName = 'comment.created';

  constructor(
    readonly authorName: string,
    readonly content: string,
    readonly createdAt: Date,
    readonly entityIdx: number,
    readonly entityType: NotificationName,
    readonly receiverIdx: number,
    readonly senderIdx: number,
  ) {
    super();
    console.log(this);
  }
}

// export class CommentUpdateEvent {}
