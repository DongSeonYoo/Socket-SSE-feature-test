import { NotificationName } from '@prisma/client';
import { INotification } from '../entities/notification.entity';

export class NotificationResponseDto
  implements INotification.IGetNotificationListOutPut
{
  /**
   *
   */
  idx: number;
  entityType: NotificationName;
  entityIdx: number;
  readedAt?: Date;
  senderIdx: number;
  createdAt: Date;
  updatedAt: Date;
}
