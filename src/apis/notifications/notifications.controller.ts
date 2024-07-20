import { ApiTags } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { LoginAuth } from 'src/decorators/jwt-auth.decorator';
import { Controller, Get, Query } from '@nestjs/common';
import { PagenationRequestDto } from 'src/dtos/pagenate.dto';
import { LoginUser } from 'src/decorators/login-user.decorator';
import { IAuth } from '../auth/interfaces/auth.interface';
import { ApiSuccess } from 'src/decorators/api-success.decorator';
import { NotificationCountResponseDto } from './dto/notification-count.dto';
import { NotificationResponseDto } from './dto/notification-list.dto';

@ApiTags('Notifications')
@LoginAuth()
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationService: NotificationsService) {}

  /**
   * 로그인 한 사용자의 모든 알림을 가져옴
   */
  @Get('all')
  @ApiSuccess(NotificationResponseDto)
  getAllNotification(
    @Query() pageNate: PagenationRequestDto,
    @LoginUser() user: IAuth.IJwtPayload,
  ) {
    return this.notificationService.getAllNotification(pageNate, user.idx);
  }

  /**
   * 로그인 한 사용자의 알림 개수를 가져옴
   */
  @Get('count')
  @ApiSuccess(NotificationCountResponseDto)
  getNotificationCount(@LoginUser() user: IAuth.IJwtPayload) {
    return this.notificationService.getNotificationCount(user.idx);
  }
}
