import { Controller, Sse } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginAuth } from 'src/decorators/jwt-auth.decorator';
import { LoginUser } from 'src/decorators/login-user.decorator';
import { IAuth } from '../auth/interfaces/auth.interface';
import { SseService } from './sse.service';

@ApiTags('SSE')
@LoginAuth()
@Controller('sse')
export class SseController {
  constructor(private readonly sseService: SseService) {}

  @Sse('subscribe')
  subscribe(@LoginUser() user: IAuth.IJwtPayload) {
    return this.sseService.subscribe(user.idx);
  }
}
