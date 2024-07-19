import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { OnEvent } from '@nestjs/event-emitter';
import { CommentCreateEvent } from './events/comment.event';
import { SseService } from '../sse/sse.service';
import { NotificationName } from '@prisma/client';
import { IUser } from '../users/entities/user.entity';
import { PagenationRequestDto } from 'src/dtos/pagenate.dto';

@Injectable()
export class NotificationsService {
  private readonly logger: Logger = new Logger(NotificationsService.name);
  constructor(
    private readonly prismaService: PrismaService,
    private readonly sseService: SseService,
  ) {}

  async getAllNotification(
    pageNate: PagenationRequestDto,
    userIdx: IUser['idx'],
  ) {
    return this.prismaService.notification.findMany({
      where: {
        receiverIdx: userIdx,
        deletedAt: null,
      },
      skip: pageNate.getOffset(),
      take: 10,
    });
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
        ...eventInfo,
      },
      select: {
        idx: true,
      },
    });

    this.sseService.sendNotification(eventInfo.receiverIdx, {
      entityIdx: eventInfo.entityIdx,
      entityType: NotificationName.COMMENT,
      senderIdx: eventInfo.senderIdx,
      receiverIdx: eventInfo.receiverIdx,
    });
  }
}
