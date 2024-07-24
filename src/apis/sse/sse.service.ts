import { Injectable, Logger } from '@nestjs/common';
import { finalize, Observable, Subject } from 'rxjs';
import { IUser } from '../users/entities/user.entity';
import { CreateNotificationDto } from '../notifications/dto/create-notification.dto';

@Injectable()
export class SseService {
  private readonly logger: Logger = new Logger(SseService.name);
  private readonly clients: Map<number, Subject<MessageEvent>> = new Map();

  /**
   * 1. 클라이언트가 연결되면 클라이언트의 idx를 key로 하여 Subject를 생성
   * 2. 클라이언트가 연결을 끊으면 해당 클라이언트의 Subject를 삭제하는 콜백 등록
   * 3. 이후 Observable로 변환하여 반환 (외부에서 값 넣는 행위를 방지하기 위해)
   * @todo 메모리 누수를 방지하기 위해 클라이언트 연결을 주기적으로 정리하는 로직 추가해야할듯
   */
  subscribe(userIdx: IUser['idx']): Observable<MessageEvent> {
    if (!this.clients.has(userIdx)) {
      const subject = new Subject<MessageEvent>();
      this.clients.set(userIdx, subject);

      subject.asObservable().pipe(
        finalize(() => {
          this.clients.delete(userIdx);
          this.logger.debug(`Client ${userIdx} disconnected`);
        }),
      );
    }

    return this.clients.get(userIdx).asObservable();
  }

  sendNotification(userIdx: IUser['idx'], data: CreateNotificationDto) {
    const client = this.clients.get(userIdx);
    if (client) {
      client.next({
        data,
      } as MessageEvent);
    } else {
      console.log('클라가 없어서 씹혔습니다');
    }
    console.log(data);
  }
}
