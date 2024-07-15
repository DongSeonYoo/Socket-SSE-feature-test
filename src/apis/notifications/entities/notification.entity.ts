import { IUser } from 'src/apis/users/entities/user.entity';
import { INotificationType } from './notification-type.entity';
import { BaseTableOption } from 'src/utils/base-table.util';

export interface Notification extends BaseTableOption {
  idx: number;
  issuerIdx: IUser['idx'];
  subscriberIdx: IUser['idx'];
  entityTypeIdx: INotificationType['idx'];
  entityIdx: number;
  readAt: Date;
}
