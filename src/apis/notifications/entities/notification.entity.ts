import { IUser } from 'src/apis/users/entities/user.entity';
import { BaseTableOption } from 'src/utils/base-table.util';
import { NotificationName } from '@prisma/client';

export interface INotification extends BaseTableOption {
  idx: number;
  senderIdx: IUser['idx'];
  receiverIdx: IUser['idx'];
  entityType: NotificationName;
  entityIdx: number;
  readedAt: Date | null;
}
