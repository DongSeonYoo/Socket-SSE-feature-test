import { Injectable, Logger } from '@nestjs/common';
import { Subject } from 'rxjs';
import { IUser } from '../users/entities/user.entity';
import { CreateNotificationDto } from '../notifications/dto/create-notification.dto';

@Injectable()
export class SseService {
  private readonly logger: Logger = new Logger(SseService.name);
  private readonly clients: Map<number, Subject<MessageEvent>> = new Map();

  subscribe(userIdx: IUser['idx']): Subject<MessageEvent> {
    if (!this.clients.has(userIdx)) {
      this.clients.set(userIdx, new Subject<MessageEvent>());
    }

    return this.clients.get(userIdx);
  }

  sendNotification(userIdx: IUser['idx'], data: CreateNotificationDto) {
    const client = this.clients.get(userIdx);
    if (client) {
      client.next({
        data,
      } as MessageEvent);
    }
  }
}
