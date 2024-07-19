import { Injectable, Logger } from '@nestjs/common';
import { Subject } from 'rxjs';
import { IUser } from '../users/entities/user.entity';
import { INotification } from '../notifications/entities/notification.entity';

@Injectable()
export class SseService {
  private readonly logger: Logger = new Logger(SseService.name);
  private readonly clients: Map<number, Subject<MessageEvent>> = new Map();

  subscribe(userIdx: IUser['idx']): Subject<MessageEvent> {
    if (!this.clients.has(userIdx)) {
      this.clients.set(userIdx, new Subject<MessageEvent>());
    }

    console.log(this.clients.get(userIdx));

    return this.clients.get(userIdx);
  }

  sendNotification(
    userIdx: IUser['idx'],
    data: INotification.ICreateNotificationInput,
  ) {
    const client = this.clients.get(userIdx);

    if (client) {
      console.log(data);
      //   client.next({ data: JSON.stringify(data) } as MessageEvent);
      client.next({
        data,
      } as MessageEvent);
    }
  }
}
