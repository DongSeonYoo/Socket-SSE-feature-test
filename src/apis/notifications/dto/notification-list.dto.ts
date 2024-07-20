import { NotificationName } from '@prisma/client';
import { INotification } from '../entities/notification.entity';

export class NotificationResponseDto
  implements INotification.IGetNotificationListOutPut
{
  /**
   * 알림 idx
   */
  idx: number;

  /**
   * 알림 엔티티 타입
   * @example 'COMMENT' | 'LIKE' | 'FOLLOW'
   */
  entityType: NotificationName;

  /**
   * 알림 엔티티 idx
   */
  entityIdx: number;

  /**
   * 알림 읽은 시간 | null
   */
  readedAt?: Date;

  /**
   * 알림 발신자 idx
   */
  receiverIdx: number;

  /**
   * 알림 수신자 idx
   */
  senderIdx: number;

  /**
   * 알림 생성일
   */
  createdAt: Date;

  /**
   * 알림 수정일
   */
  updatedAt: Date;
}
