import { ApiTags } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { LoginAuth } from 'src/decorators/jwt-auth.decorator';
import { Controller, Get, Query } from '@nestjs/common';
import { PagenationRequestDto } from 'src/dtos/pagenate.dto';
import { LoginUser } from 'src/decorators/login-user.decorator';
import { IAuth } from '../auth/interfaces/auth.interface';

@ApiTags('Notifications')
@LoginAuth()
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationService: NotificationsService) {}

  /**
   * 로그인 한 사용자의 모든 알림을 가져옴
   */
  @Get('all')
  getAllNotification(
    @Query() pageNate: PagenationRequestDto,
    @LoginUser() user: IAuth.IJwtPayload,
  ) {
    return this.notificationService.getAllNotification(pageNate, user.idx);
  }
}
