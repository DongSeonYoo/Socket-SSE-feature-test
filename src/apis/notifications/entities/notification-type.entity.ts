import { NotificationName } from '@prisma/client';

export interface INotificationType {
  idx: number;
  name: NotificationName;
}
