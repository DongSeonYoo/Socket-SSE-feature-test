import { NotificationName } from '@prisma/client';
import { CreateNotificationDto } from '../dto/create-notification.dto';

export class CommentCreatedEvent implements CreateNotificationDto {
  static readonly eventName = 'comment.created';

  constructor(
    readonly senderIdx: number,
    readonly createdAt: Date,
    readonly entityIdx: number,
    readonly entityType: NotificationName,
    readonly receiverIdx: number,
  ) {}
}

// export class CommentUpdateEvent {}
