import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { OnEvent } from '@nestjs/event-emitter';
import { CommentCreateEvent } from './events/comment.event';
import { SseService } from '../sse/sse.service';
import { IUser } from '../users/entities/user.entity';
import { PagenationRequestDto } from 'src/dtos/pagenate.dto';
import { NotificationCountResponseDto } from './dto/notification-count.dto';
import { NotificationResponseDto } from './dto/notification-list.dto';

@Injectable()
export class NotificationsService {
  private readonly logger: Logger = new Logger(NotificationsService.name);
  constructor(
    private readonly prismaService: PrismaService,
    private readonly sseService: SseService,
  ) {}

  /**
   * 알림 개수 조회
   *
   * @param userIdx: IUser['idx'] - 알림을 받을 유저의 idx
   *
   * @returns 알림 개수
   */
  async getNotificationCount(
    userIdx: IUser['idx'],
  ): Promise<NotificationCountResponseDto> {
    return this.prismaService.notification
      .count({
        where: {
          receiverIdx: userIdx,
          deletedAt: null,
        },
      })
      .then((res) => {
        return {
          count: res,
        };
      });
  }

  async getAllNotification(
    pageNate: PagenationRequestDto,
    userIdx: IUser['idx'],
  ): Promise<NotificationResponseDto[]> {
    const notificationListResult =
      await this.prismaService.notification.findMany({
        where: {
          receiverIdx: userIdx,
          deletedAt: null,
        },
        skip: pageNate.getOffset(),
        take: 10,
        orderBy: {
          createdAt: 'desc',
        },
      });

    return notificationListResult.map((notification) => ({
      idx: notification.idx,
      entityType: notification.entityType,
      entityIdx: notification.idx,
      readedAt: notification.readedAt,
      senderIdx: notification.senderIdx,
      receiverIdx: notification.receiverIdx,
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt,
    }));
  }

  /**
   * 알림 생성
   *
   * @param event: CommentCreateEvent - 알림 생성에 필요한 정보
   *
   * issuerIdx: 알림을 발생시킨 유저의 idx
   * subscriberIdx: 알림을 받을 유저의 idx
   * entityTypeIdx: 알림을 발생시킨 엔티티의 idx
   * entityIdx: 알림을 받을 엔티티의 idx
   *
   * @returns 생성된 알림의 idx
   */
  @OnEvent('comment.created')
  async handleCreateCommented(event: CommentCreateEvent) {
    this.logger.debug('comment.created 이벤트 catch');
    const { eventInfo } = event;

    await this.prismaService.notification.create({
      data: {
        senderIdx: eventInfo.senderIdx,
        receiverIdx: eventInfo.receiverIdx,
        entityType: eventInfo.entityType,
        entityIdx: eventInfo.entityIdx,
        createdAt: eventInfo.createdAt,
      },
      select: {
        idx: true,
      },
    });

    this.sseService.sendNotification(eventInfo.receiverIdx, eventInfo);
  }
}
