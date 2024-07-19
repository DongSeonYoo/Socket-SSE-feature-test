import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { SseModule } from '../sse/sse.module';

@Module({
  imports: [SseModule],
  controllers: [NotificationsController],
  exports: [NotificationsService],
  providers: [NotificationsService],
})
export class NotificationsModule {}
