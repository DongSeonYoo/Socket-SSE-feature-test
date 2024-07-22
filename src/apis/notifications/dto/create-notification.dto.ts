import { $Enums } from '@prisma/client';
import { INotification } from '../entities/notification.entity';

export class CreateNotificationDto
  implements INotification.ICreateNotificationInput
{
  senderIdx: number;
  createdAt: Date;
  entityIdx: number;
  entityType: $Enums.NotificationName;
  receiverIdx: number;
}
